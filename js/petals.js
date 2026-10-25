/**
 * Rose & Marigold Petal Shower Canvas Particle Engine (High-Performance Sprite Optimized)
 * Delivers gentle fluttering petals with 3D rotation, wind physics, and 60fps smooth scrolling
 */

class PetalShower {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d', { alpha: true });
    this.petals = [];
    const isMobile = window.matchMedia('(max-width: 600px)').matches;
    this.maxPetals = isMobile ? 12 : 20;
    this.isActive = true;
    this.isPageVisible = !document.hidden;
    this.isInViewport = true;
    this.wind = 0;
    this.windTarget = 0.5;

    // Pre-render high-definition offscreen petal sprites (zero per-frame path/gradient computation)
    this.spriteSize = 48;
    this.roseSprite = this.buildPetalSprite(false);
    this.marigoldSprite = this.buildPetalSprite(true);

    this.resize();
    let resizeTimer = null;
    window.addEventListener('resize', () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => this.resize(), 150);
    }, { passive: true });

    document.addEventListener('visibilitychange', () => {
      this.isPageVisible = !document.hidden;
    }, { passive: true });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => {
        this.isInViewport = entry.isIntersecting;
      }).observe(this.canvas);
    }
    this.init();
    this.animate();
  }

  buildPetalSprite(isMarigold) {
    const s = this.spriteSize;
    const offCanvas = document.createElement('canvas');
    offCanvas.width = s;
    offCanvas.height = s;
    const octx = offCanvas.getContext('2d');
    if (!octx) return offCanvas;

    octx.translate(s / 2, 4);
    octx.beginPath();
    octx.moveTo(0, 0);
    octx.bezierCurveTo(-s * 0.45, s * 0.1, -s * 0.45, s * 0.65, 0, s * 0.88);
    octx.bezierCurveTo(s * 0.45, s * 0.65, s * 0.45, s * 0.1, 0, 0);

    const grad = octx.createRadialGradient(0, s * 0.45, 0, 0, s * 0.45, s * 0.55);
    if (isMarigold) {
      grad.addColorStop(0, '#FFE066');
      grad.addColorStop(0.5, '#F9A825');
      grad.addColorStop(1, '#E65100');
    } else {
      grad.addColorStop(0, '#FFF0F5');
      grad.addColorStop(0.4, '#F8BBD0');
      grad.addColorStop(1, '#D81B60');
    }

    octx.fillStyle = grad;
    octx.fill();

    octx.lineWidth = 0.8;
    octx.strokeStyle = isMarigold ? 'rgba(255, 235, 59, 0.45)' : 'rgba(255, 255, 255, 0.6)';
    octx.stroke();

    return offCanvas;
  }

  resize() {
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = Math.floor(this.width * pixelRatio);
    this.canvas.height = Math.floor(this.height * pixelRatio);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  }

  createPetal(isBurst = false, originX = null, originY = null) {
    const isMarigold = Math.random() > 0.65;
    return {
      x: isBurst ? (originX || this.width / 2) : Math.random() * this.width,
      y: isBurst ? (originY || this.height / 2) : (Math.random() * -this.height * 0.5),
      size: Math.random() * 11 + 10,
      speedY: isBurst ? (Math.random() * 7 - 3.5) : (Math.random() * 1.3 + 1.1),
      speedX: isBurst ? (Math.random() * 7 - 3.5) : (Math.random() * 0.8 - 0.4),
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 1.8,
      tilt: Math.random() * Math.PI,
      tiltSpeed: Math.random() * 0.04 + 0.02,
      opacity: Math.random() * 0.35 + 0.65,
      isMarigold: isMarigold,
      life: isBurst ? 90 : Infinity,
      maxLife: 90
    };
  }

  init() {
    this.petals = [];
    for (let i = 0; i < this.maxPetals; i++) {
      const petal = this.createPetal();
      petal.y = Math.random() * this.height;
      this.petals.push(petal);
    }
  }

  burst(count = 25, x = null, y = null) {
    const maxBurst = Math.min(count, 30);
    for (let i = 0; i < maxBurst; i++) {
      this.petals.push(this.createPetal(true, x, y));
    }
  }

  toggle() {
    this.isActive = !this.isActive;
    if (!this.isActive) {
      this.ctx.clearRect(0, 0, this.width, this.height);
    }
    return this.isActive;
  }

  drawPetal(p) {
    const cosTilt = Math.cos(p.tilt);
    if (Math.abs(cosTilt) < 0.05) return; // edge-on perspective skip

    this.ctx.save();
    this.ctx.translate(p.x, p.y);
    this.ctx.rotate((p.rotation * Math.PI) / 180);
    this.ctx.scale(cosTilt, 1);
    this.ctx.globalAlpha = p.life < p.maxLife ? (p.life / p.maxLife) * p.opacity : p.opacity;

    const sprite = p.isMarigold ? this.marigoldSprite : this.roseSprite;
    const s = p.size;
    this.ctx.drawImage(sprite, -s / 2, -s / 2, s, s);

    this.ctx.restore();
  }

  animate() {
    if (this.isActive && this.isPageVisible && this.isInViewport) {
      this.ctx.clearRect(0, 0, this.width, this.height);

      this.wind += (this.windTarget - this.wind) * 0.01;
      if (Math.random() < 0.02) {
        this.windTarget = (Math.random() - 0.5) * 1.2;
      }

      for (let i = this.petals.length - 1; i >= 0; i--) {
        const p = this.petals[i];

        p.y += p.speedY;
        p.x += p.speedX + this.wind;
        p.rotation += p.rotationSpeed;
        p.tilt += p.tiltSpeed;

        if (p.life !== Infinity) {
          p.life--;
          p.speedY += 0.07;
          if (p.life <= 0) {
            this.petals.splice(i, 1);
            continue;
          }
        }

        if (p.y > this.height + 25) {
          p.y = -20;
          p.x = Math.random() * this.width;
        }
        if (p.x > this.width + 25) p.x = -20;
        if (p.x < -25) p.x = this.width + 20;

        this.drawPetal(p);
      }
    }

    requestAnimationFrame(() => this.animate());
  }
}

window.PetalShower = PetalShower;

