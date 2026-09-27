/**
 * Rose & Marigold Petal Shower Canvas Particle Engine
 * Delivers gentle fluttering petals with 3D rotation and wind physics
 */

class PetalShower {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.petals = [];
    this.maxPetals = window.matchMedia('(max-width: 600px)').matches ? 16 : 24;
    this.isActive = true;
    this.isPageVisible = !document.hidden;
    this.isInViewport = true;
    this.gradientCache = new Map();
    this.wind = 0;
    this.windTarget = 0.5;

    this.resize();
    window.addEventListener('resize', () => this.resize(), { passive: true });
    document.addEventListener('visibilitychange', () => {
      this.isPageVisible = !document.hidden;
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => {
        this.isInViewport = entry.isIntersecting;
      }).observe(this.canvas);
    }
    this.init();
    this.animate();
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
    const isMarigold = Math.random() > 0.65; // mix of soft pink rose and golden marigold
    return {
      x: isBurst ? (originX || this.width / 2) : Math.random() * this.width,
      y: isBurst ? (originY || this.height / 2) : (Math.random() * -this.height * 0.5),
      size: Math.random() * 12 + 10,
      speedY: isBurst ? (Math.random() * 8 - 4) : (Math.random() * 1.5 + 1.2),
      speedX: isBurst ? (Math.random() * 8 - 4) : (Math.random() * 1 - 0.5),
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 2,
      tilt: Math.random() * 90,
      tiltSpeed: Math.random() * 0.05 + 0.02,
      opacity: Math.random() * 0.35 + 0.65,
      isMarigold: isMarigold,
      life: isBurst ? 100 : Infinity,
      maxLife: 100
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

  burst(count = 35, x = null, y = null) {
    for (let i = 0; i < count; i++) {
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
    this.ctx.save();
    this.ctx.translate(p.x, p.y);
    this.ctx.rotate((p.rotation * Math.PI) / 180);
    this.ctx.scale(Math.cos(p.tilt), 1);
    this.ctx.globalAlpha = p.life < p.maxLife ? (p.life / p.maxLife) * p.opacity : p.opacity;

    // Petal Shape
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.bezierCurveTo(-p.size / 2, -p.size / 2, -p.size, p.size / 3, 0, p.size);
    this.ctx.bezierCurveTo(p.size, p.size / 3, p.size / 2, -p.size / 2, 0, 0);

    // Gradient Fill
    const cacheKey = `${p.isMarigold ? 'marigold' : 'rose'}-${Math.round(p.size)}`;
    let grad = this.gradientCache.get(cacheKey);
    if (!grad) {
      grad = this.ctx.createRadialGradient(0, p.size / 2, 0, 0, p.size / 2, p.size);
      if (p.isMarigold) {
        grad.addColorStop(0, '#FFE066');
        grad.addColorStop(0.5, '#F9A825');
        grad.addColorStop(1, '#E65100');
      } else {
        grad.addColorStop(0, '#FFF0F5');
        grad.addColorStop(0.4, '#F8BBD0');
        grad.addColorStop(1, '#D81B60');
      }
      this.gradientCache.set(cacheKey, grad);
    }

    this.ctx.fillStyle = grad;
    this.ctx.fill();

    // Subtle edge highlight
    this.ctx.lineWidth = 0.5;
    this.ctx.strokeStyle = p.isMarigold ? 'rgba(255, 235, 59, 0.4)' : 'rgba(255, 255, 255, 0.5)';
    this.ctx.stroke();

    this.ctx.restore();
  }

  animate() {
    if (this.isActive && this.isPageVisible && this.isInViewport) {
      this.ctx.clearRect(0, 0, this.width, this.height);

      // Smooth wind variation
      this.wind += (this.windTarget - this.wind) * 0.01;
      if (Math.random() < 0.02) {
        this.windTarget = (Math.random() - 0.5) * 1.5;
      }

      for (let i = this.petals.length - 1; i >= 0; i--) {
        const p = this.petals[i];
        
        // Physics update
        p.y += p.speedY;
        p.x += p.speedX + this.wind;
        p.rotation += p.rotationSpeed;
        p.tilt += p.tiltSpeed;

        if (p.life !== Infinity) {
          p.life--;
          p.speedY += 0.08; // gravity for burst
          if (p.life <= 0) {
            this.petals.splice(i, 1);
            continue;
          }
        }

        // Recycle continuous falling petals
        if (p.y > this.height + 30) {
          p.y = -20;
          p.x = Math.random() * this.width;
        }
        if (p.x > this.width + 30) p.x = -20;
        if (p.x < -30) p.x = this.width + 20;

        this.drawPetal(p);
      }
    }

    requestAnimationFrame(() => this.animate());
  }
}

window.PetalShower = PetalShower;
