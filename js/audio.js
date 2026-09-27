/**
 * Auspicious Indian Wedding Audio Experience
 * Plays authentic local Royal Shehnai / Mangal Dhun with a built-in Web Audio API
 * Indian Classical Raag / Bansuri Flute & Tanpura synthesizer fallback.
 */

class WeddingAudioPlayer {
  constructor() {
    this.audioElement = new Audio();
    this.audioElement.loop = true;
    this.audioElement.preload = "none";
    
    // Auspicious wedding music in assets/audio/ (Local high-fidelity audio on continuous loop)
    this.defaultAudioUrl = "assets/audio/leberch-wedding-584482.mp3";
    this.customAudioUrl = "";
    this.audioElement.src = this.defaultAudioUrl;
    this.audioElement.volume = 0.75;

    this.isPlaying = false;
    this.synthActive = false;
    this.audioCtx = null;
    this.synthNodes = [];

    // Sync state with audio element events
    this.audioElement.addEventListener('play', () => {
      this.isPlaying = true;
      this.updateUI();
    });

    this.audioElement.addEventListener('pause', () => {
      if (!this.synthActive) {
        this.isPlaying = false;
        this.updateUI();
      }
    });

    this.audioElement.addEventListener('ended', () => {
      if (this.audioElement.loop) {
        this.audioElement.currentTime = 0;
        this.audioElement.play().catch(() => {});
      }
    });

    // Auto-unlock audio on first user interaction if blocked
    const unlockAudio = () => {
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('touchstart', unlockAudio);
    };
    document.addEventListener('click', unlockAudio, { once: true });
    document.addEventListener('touchstart', unlockAudio, { once: true });
  }

  initSynth() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
  }

  // Pure Web Audio Indian Tanpura & Sitar drone harmonic chord fallback
  startIndianSynth() {
    try {
      this.initSynth();
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      this.stopIndianSynth();

      // Sa - Pa - Sa (C# root: 138.59Hz, G# fifth: 207.65Hz, high Sa: 277.18Hz)
      const baseFreqs = [138.59, 207.65, 277.18, 415.30];
      const masterGain = this.audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
      masterGain.connect(this.audioCtx.destination);

      baseFreqs.forEach((freq, index) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        
        // Gentle warm triangle wave for flute/tanpura resonance
        osc.type = index % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

        // Slow meditative pulsing lfo
        const lfo = this.audioCtx.createOscillator();
        const lfoGain = this.audioCtx.createGain();
        lfo.frequency.value = 0.2 + (index * 0.1);
        lfoGain.gain.value = 0.03;
        lfo.connect(gain.gain);
        lfo.start();

        gain.gain.setValueAtTime(0.25, this.audioCtx.currentTime);

        osc.connect(gain);
        gain.connect(masterGain);
        osc.start();

        this.synthNodes.push(osc, lfo, gain);
      });

      this.synthNodes.push(masterGain);
      this.synthActive = true;
    } catch (e) {
      console.warn("Synth audio note:", e);
    }
  }

  stopIndianSynth() {
    this.synthNodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (err) {}
    });
    this.synthNodes = [];
    this.synthActive = false;
  }

  async play() {
    const url = this.customAudioUrl || this.defaultAudioUrl;
    if (!this.audioElement.src || (!this.audioElement.src.endsWith(url) && this.audioElement.src !== url)) {
      this.audioElement.src = url;
    }

    try {
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        await this.audioCtx.resume();
      }
      this.audioElement.volume = 0.75;
      await this.audioElement.play();
      this.isPlaying = true;
      if (this.synthActive) {
        this.stopIndianSynth();
      }
    } catch (err) {
      console.warn("Audio file playback fallback to Web Audio Synth", err);
      this.startIndianSynth();
      this.isPlaying = true;
    }
    this.updateUI();
  }

  pause() {
    try {
      if (!this.audioElement.paused) {
        this.audioElement.pause();
      }
    } catch (err) {}
    if (this.synthActive) {
      this.stopIndianSynth();
    }
    this.isPlaying = false;
    this.updateUI();
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
    return this.isPlaying;
  }

  setCustomAudio(url) {
    if (!url || !url.trim()) {
      this.customAudioUrl = "";
      this.audioElement.src = this.defaultAudioUrl;
      this.audioElement.load();
      return;
    }
    this.customAudioUrl = url.trim();
    this.audioElement.src = this.customAudioUrl;
    this.audioElement.load();
    if (this.isPlaying) {
      this.audioElement.play().catch(e => console.warn(e));
    }
  }

  updateUI() {
    const btn = document.getElementById('musicToggleBtn');
    if (btn) {
      if (this.isPlaying) {
        btn.classList.add('playing');
        btn.innerHTML = '🎵';
        btn.title = "Pause Auspicious Wedding Music";
      } else {
        btn.classList.remove('playing');
        btn.innerHTML = '🔇';
        btn.title = "Play Auspicious Wedding Music";
      }
    }
  }
}

window.WeddingAudioPlayer = WeddingAudioPlayer;
