// ============================================================
// NIVEL 2 - EL FOSO DE LAS CUCHILLAS (DIFICULTAD MEDIA)
// Diseñador: Integrante 2
// Descripción: Mazmorra con trampas de pinchos, plataformas
// quebradizas que colapsan al pisarlas, plataformas móviles,
// cuchillas oscilantes y centinela de la guardia real.
// ============================================================

const level2 = {
  name: "El Foso de las Cuchillas",
  subtitle: "Nivel 2 - Trampas Mortales",
  width: 1600,
  height: 400,
  spawn: { x: 50, y: 300 },
  goal: { x: 1510, y: 280, w: 50, h: 70 },
  timeLimit: 75, // 75 segundos

  // ----------------------------------------------------------
  // PLATAFORMAS ESTÁTICAS
  // ----------------------------------------------------------
  platforms: [
    // Zona inicial de despegue
    { x: 0, y: 360, w: 220, h: 40 },

    // Plataforma intermedia superior
    { x: 260, y: 280, w: 90, h: 20 },

    // Descanso central entre fosos
    { x: 580, y: 360, w: 160, h: 40 },
    { x: 620, y: 230, w: 90, h: 20 },

    // Torre intermedia
    { x: 920, y: 320, w: 100, h: 80 },
    { x: 1060, y: 240, w: 80, h: 20 },

    // Suelo final previo a la meta
    { x: 1380, y: 360, w: 220, h: 40 }
  ],

  // ----------------------------------------------------------
  // PLATAFORMAS QUEBRADIZAS (Crumbling Platforms)
  // Tiemblan y caen tras pisarlas
  // ----------------------------------------------------------
  crumblingPlatforms: [
    {
      x: 390, y: 240, w: 75, h: 18,
      stepped: false,
      timer: 0,
      collapsed: false,
      vy: 0,
      origX: 390, origY: 240,
      shake: 0
    },
    {
      x: 800, y: 280, w: 75, h: 18,
      stepped: false,
      timer: 0,
      collapsed: false,
      vy: 0,
      origX: 800, origY: 280,
      shake: 0
    },
    {
      x: 1200, y: 220, w: 75, h: 18,
      stepped: false,
      timer: 0,
      collapsed: false,
      vy: 0,
      origX: 1200, origY: 220,
      shake: 0
    }
  ],

  // ----------------------------------------------------------
  // PLATAFORMAS MÓVILES
  // ----------------------------------------------------------
  movingPlatforms: [
    {
      x: 480, y: 300, w: 75, h: 20,
      axis: 'y',
      range: 65,
      speed: 1.4,
      dir: 1,
      originX: 480,
      originY: 300
    },
    {
      x: 1280, y: 300, w: 80, h: 20,
      axis: 'x',
      range: 80,
      speed: 1.8,
      dir: 1,
      originX: 1280,
      originY: 300
    }
  ],

  // ----------------------------------------------------------
  // TRAMPAS (Pinchos en fosos y sierras circulares)
  // ----------------------------------------------------------
  traps: [
    // Foso de pinchos 1
    { x: 220, y: 375, w: 360, h: 25, type: 'spikes' },
    // Foso de pinchos 2
    { x: 740, y: 375, w: 180, h: 25, type: 'spikes' },
    // Foso de pinchos 3
    { x: 1020, y: 375, w: 360, h: 25, type: 'spikes' },

    // Sierra oscilante sobre el segundo foso
    {
      x: 700, y: 150, w: 32, h: 32, type: 'saw',
      axis: 'x', range: 70, speed: 2.2, dir: 1,
      originX: 700, originY: 150, angle: 0
    },
    // Sierra vertical custodiando la torre
    {
      x: 1150, y: 220, w: 30, h: 30, type: 'saw',
      axis: 'y', range: 60, speed: 1.6, dir: 1,
      originX: 1150, originY: 220, angle: 0
    }
  ],

  // ----------------------------------------------------------
  // ENEMIGOS: Centinela de la Mazmorra
  // ----------------------------------------------------------
  enemies: [
    {
      x: 600, y: 312, w: 30, h: 48,
      vx: 1.2,
      minX: 580, maxX: 710,
      facingRight: true
    }
  ],

  // ----------------------------------------------------------
  // COLECCIONABLES
  // ----------------------------------------------------------
  collectibles: [
    { x: 295, y: 230, w: 20, h: 20, type: 'sand', collected: false, value: 150 },
    { x: 420, y: 190, w: 20, h: 20, type: 'gem',  collected: false, value: 250 },
    { x: 650, y: 180, w: 20, h: 20, type: 'sand', collected: false, value: 150 },
    { x: 1090, y: 190, w: 20, h: 20, type: 'gem',  collected: false, value: 300 },
    { x: 1320, y: 240, w: 20, h: 20, type: 'sand', collected: false, value: 150 }
  ],

  // Decoraciones
  torches: [
    { x: 100, y: 260 },
    { x: 600, y: 260 },
    { x: 950, y: 230 },
    { x: 1450, y: 250 }
  ],

  animFrame: 0,
  particles: [],

  // ----------------------------------------------------------
  // ACTUALIZACIÓN DE LÓGICA
  // ----------------------------------------------------------
  update() {
    this.animFrame++;

    // Mover plataformas móviles
    this.movingPlatforms.forEach(p => {
      if (p.axis === 'x') {
        p.x += p.speed * p.dir;
        if (p.x > p.originX + p.range || p.x < p.originX - p.range) p.dir *= -1;
      } else {
        p.y += p.speed * p.dir;
        if (p.y > p.originY + p.range || p.y < p.originY - p.range) p.dir *= -1;
      }
    });

    // Mover trampas tipo sierra
    this.traps.forEach(t => {
      if (t.type === 'saw') {
        t.angle = (t.angle || 0) + 0.15;
        if (t.axis === 'x') {
          t.x += t.speed * t.dir;
          if (t.x > t.originX + t.range || t.x < t.originX - t.range) t.dir *= -1;
        } else if (t.axis === 'y') {
          t.y += t.speed * t.dir;
          if (t.y > t.originY + t.range || t.y < t.originY - t.range) t.dir *= -1;
        }
      }
    });

    // Mover enemigos (patrulla de centinela)
    this.enemies.forEach(e => {
      e.x += e.vx;
      if (e.x > e.maxX) {
        e.vx = -Math.abs(e.vx);
        e.facingRight = false;
      } else if (e.x < e.minX) {
        e.vx = Math.abs(e.vx);
        e.facingRight = true;
      }
    });

    // Actualizar plataformas quebradizas
    this.crumblingPlatforms.forEach(cp => {
      if (cp.stepped && !cp.collapsed) {
        cp.timer++;
        cp.shake = (Math.random() - 0.5) * 4;
        if (cp.timer > 40) { // ~0.65 segundos antes de caer
          cp.collapsed = true;
          if (window.soundManager) window.soundManager.play('crumble');
        }
      }
      if (cp.collapsed) {
        cp.vy += 0.5;
        cp.y += cp.vy;
      }
    });

    // Partículas de antorchas
    if (this.animFrame % 4 === 0) {
      this.torches.forEach(t => {
        this.particles.push({
          x: t.x + (Math.random() - 0.5) * 6,
          y: t.y - 8,
          vx: (Math.random() - 0.5) * 0.8,
          vy: -Math.random() * 1.5 - 0.5,
          alpha: 1,
          size: Math.random() * 3 + 1,
          color: Math.random() > 0.4 ? '#ff7043' : '#ffd54f'
        });
      });
    }
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.04;
      if (p.alpha <= 0) this.particles.splice(i, 1);
    }
  },

  // ----------------------------------------------------------
  // DIBUJO DEL NIVEL
  // ----------------------------------------------------------
  draw(ctx, camera = { x: 0, y: 0 }) {
    // Fondo de mazmorra tenebrosa (azulado-rojizo oscuro)
    const bgGrad = ctx.createLinearGradient(0, 0, 0, this.height);
    bgGrad.addColorStop(0, '#151324');
    bgGrad.addColorStop(0.6, '#1d172e');
    bgGrad.addColorStop(1, '#0e0b17');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.save();
    ctx.translate(-camera.x, -camera.y);

    // Muros de piedra con rejas de hierro
    ctx.strokeStyle = 'rgba(60, 50, 85, 0.35)';
    ctx.lineWidth = 1;
    for (let y = 40; y < 360; y += 40) {
      const offset = (y % 80 === 0) ? 0 : 35;
      for (let x = offset; x < this.width; x += 70) {
        ctx.strokeRect(x, y, 68, 38);
      }
    }

    // Cadenas colgando del techo
    for (let cx = 350; cx < this.width; cx += 280) {
      ctx.strokeStyle = '#424242';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx, 110);
      ctx.stroke();
      // Argolla final
      ctx.fillStyle = '#616161';
      ctx.beginPath();
      ctx.arc(cx, 115, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    // Antorchas
    this.torches.forEach(t => {
      ctx.fillStyle = '#212121';
      ctx.fillRect(t.x - 3, t.y, 6, 18);
      const glow = ctx.createRadialGradient(t.x, t.y - 6, 2, t.x, t.y - 6, 45);
      glow.addColorStop(0, 'rgba(255, 112, 67, 0.45)');
      glow.addColorStop(0.5, 'rgba(255, 87, 34, 0.15)');
      glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(t.x, t.y - 6, 45, 0, Math.PI * 2);
      ctx.fill();

      const flicker = Math.sin(this.animFrame * 0.2 + t.x) * 2;
      ctx.fillStyle = '#ff7043';
      ctx.beginPath();
      ctx.arc(t.x, t.y - 6, 7 + flicker, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffe082';
      ctx.beginPath();
      ctx.arc(t.x, t.y - 7, 4 + flicker * 0.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Partículas de antorcha
    this.particles.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1.0;

    // --- Plataformas estáticas ---
    this.platforms.forEach(p => {
      const grad = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.h);
      grad.addColorStop(0, '#546e7a');
      grad.addColorStop(0.3, '#37474f');
      grad.addColorStop(1, '#263238');
      ctx.fillStyle = grad;
      ctx.fillRect(p.x, p.y, p.w, p.h);

      ctx.fillStyle = '#90a4ae';
      ctx.fillRect(p.x, p.y, p.w, 4);

      ctx.strokeStyle = '#1a2327';
      ctx.lineWidth = 2;
      ctx.strokeRect(p.x, p.y, p.w, p.h);
    });

    // --- Plataformas móviles ---
    this.movingPlatforms.forEach(p => {
      ctx.fillStyle = '#00838f';
      ctx.fillRect(p.x, p.y, p.w, p.h);
      ctx.fillStyle = '#4dd0e1';
      ctx.fillRect(p.x, p.y, p.w, 4);
      ctx.strokeStyle = '#004d40';
      ctx.lineWidth = 2;
      ctx.strokeRect(p.x, p.y, p.w, p.h);
      // Mecanismo de polea
      ctx.fillStyle = '#ffd54f';
      ctx.fillRect(p.x + p.w / 2 - 4, p.y + 6, 8, 8);
    });

    // --- Plataformas quebradizas (Crumbling) ---
    this.crumblingPlatforms.forEach(cp => {
      if (cp.y < this.height + 50) {
        ctx.save();
        ctx.translate(cp.shake, 0);

        ctx.fillStyle = cp.stepped ? '#d84315' : '#8d6e63';
        ctx.fillRect(cp.x, cp.y, cp.w, cp.h);

        // Grietas en la piedra
        ctx.strokeStyle = '#3e2723';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cp.x + 15, cp.y);
        ctx.lineTo(cp.x + 30, cp.y + cp.h);
        ctx.moveTo(cp.x + 45, cp.y);
        ctx.lineTo(cp.x + 55, cp.y + cp.h);
        ctx.stroke();

        ctx.strokeStyle = '#271915';
        ctx.strokeRect(cp.x, cp.y, cp.w, cp.h);
        ctx.restore();
      }
    });

    // --- Trampas (Pinchos & Sierras) ---
    this.traps.forEach(t => {
      if (t.type === 'spikes') {
        const spikeW = 12;
        const count = Math.floor(t.w / spikeW);
        for (let i = 0; i < count; i++) {
          const sx = t.x + i * spikeW;
          const sy = t.y;
          ctx.fillStyle = '#212121';
          ctx.beginPath();
          ctx.moveTo(sx, sy + t.h);
          ctx.lineTo(sx + spikeW / 2, sy);
          ctx.lineTo(sx + spikeW, sy + t.h);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = '#cfd8dc';
          ctx.beginPath();
          ctx.moveTo(sx + 2, sy + t.h);
          ctx.lineTo(sx + spikeW / 2, sy);
          ctx.lineTo(sx + spikeW / 2 + 1, sy + t.h);
          ctx.closePath();
          ctx.fill();
        }
      } else if (t.type === 'saw') {
        ctx.save();
        ctx.translate(t.x + t.w / 2, t.y + t.h / 2);
        ctx.rotate(t.angle);

        // Cuerpo de sierra
        ctx.fillStyle = '#9e9e9e';
        ctx.beginPath();
        ctx.arc(0, 0, t.w / 2, 0, Math.PI * 2);
        ctx.fill();

        // Dientes de sierra giratorios
        ctx.fillStyle = '#b71c1c';
        const teeth = 8;
        for (let i = 0; i < teeth; i++) {
          const a = (i * Math.PI * 2) / teeth;
          const tx = Math.cos(a) * (t.w / 2 + 4);
          const ty = Math.sin(a) * (t.h / 2 + 4);
          ctx.beginPath();
          ctx.arc(tx, ty, 3, 0, Math.PI * 2);
          ctx.fill();
        }

        // Centro metálico
        ctx.fillStyle = '#212121';
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    });

    // --- Enemigos (Guardia Real de la Mazmorra) ---
    this.enemies.forEach(e => {
      // Cuerpo del guardia (armadura turquesa/dorada estilo PoP)
      ctx.fillStyle = '#bf360c'; // Manto
      ctx.fillRect(e.x + 4, e.y + 12, 22, 24);

      ctx.fillStyle = '#37474f'; // Cota de malla
      ctx.fillRect(e.x + 6, e.y + 14, 18, 16);

      ctx.fillStyle = '#ffd54f'; // Yelmo dorado
      ctx.fillRect(e.x + 7, e.y, 16, 14);

      // Ojos intimidantes
      ctx.fillStyle = '#d50000';
      const eyeX = e.facingRight ? e.x + 16 : e.x + 9;
      ctx.fillRect(eyeX, e.y + 5, 4, 3);

      // Cimitarra / Espada
      ctx.fillStyle = '#eceff1';
      const swordX = e.facingRight ? e.x + 24 : e.x - 2;
      ctx.fillRect(swordX, e.y + 8, 4, 28);
      ctx.fillStyle = '#ffd54f';
      ctx.fillRect(swordX - 2, e.y + 22, 8, 4);

      // Piernas
      ctx.fillStyle = '#212121';
      ctx.fillRect(e.x + 6, e.y + 36, 7, 12);
      ctx.fillRect(e.x + 17, e.y + 36, 7, 12);
    });

    // --- Coleccionables ---
    this.collectibles.forEach(c => {
      if (!c.collected) {
        const bounce = Math.sin(this.animFrame * 0.12 + c.x) * 4;
        const cy = c.y + bounce;
        if (c.type === 'sand') {
          ctx.fillStyle = '#ffd700';
          ctx.strokeStyle = '#ff8f00';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(c.x, cy);
          ctx.lineTo(c.x + c.w, cy);
          ctx.lineTo(c.x + c.w / 2, cy + c.h / 2);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(c.x, cy + c.h);
          ctx.lineTo(c.x + c.w, cy + c.h);
          ctx.lineTo(c.x + c.w / 2, cy + c.h / 2);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        } else {
          ctx.fillStyle = '#00e5ff';
          ctx.beginPath();
          ctx.moveTo(c.x + c.w / 2, cy);
          ctx.lineTo(c.x + c.w, cy + c.h / 2);
          ctx.lineTo(c.x + c.w / 2, cy + c.h);
          ctx.lineTo(c.x, cy + c.h / 2);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = '#84ffff';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }
    });

    // --- Puerta de Salida ---
    const g = this.goal;
    ctx.fillStyle = '#263238';
    ctx.fillRect(g.x - 6, g.y - 10, g.w + 12, g.h + 10);
    ctx.fillStyle = '#00e5ff';
    ctx.fillRect(g.x - 8, g.y - 12, g.w + 16, 6);

    ctx.fillStyle = '#000';
    ctx.fillRect(g.x, g.y, g.w, g.h);

    const portalGlow = ctx.createRadialGradient(g.x + g.w / 2, g.y + g.h / 2, 5, g.x + g.w / 2, g.y + g.h / 2, 35);
    portalGlow.addColorStop(0, 'rgba(0, 229, 255, 0.7)');
    portalGlow.addColorStop(0.7, 'rgba(0, 131, 143, 0.3)');
    portalGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = portalGlow;
    ctx.beginPath();
    ctx.arc(g.x + g.w / 2, g.y + g.h / 2, 35, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.font = '22px Arial';
    ctx.fillText('🚪', g.x + 12, g.y + 44);

    ctx.restore();
  },

  // ----------------------------------------------------------
  // INTERFAZ DE COLISIONES
  // ----------------------------------------------------------
  getSolidPlatforms() {
    // Detectar si el jugador está sobre alguna plataforma quebradiza
    if (window.player) {
      const p = window.player;
      const pw = p.width || 30;
      const ph = p.height || 48;
      this.crumblingPlatforms.forEach(cp => {
        if (!cp.collapsed) {
          if (p.x + pw > cp.x && p.x < cp.x + cp.w &&
              Math.abs((p.y + ph) - cp.y) < 6) {
            cp.stepped = true;
          }
        }
      });
    }

    const activeCrumbling = this.crumblingPlatforms.filter(cp => !cp.collapsed);
    return [...this.platforms, ...this.movingPlatforms, ...activeCrumbling];
  },

  checkTrapCollision(player) {
    const pw = player.width || 30;
    const ph = player.height || 48;
    return this.traps.some(t =>
      player.x < t.x + t.w &&
      player.x + pw > t.x &&
      player.y < t.y + t.h &&
      player.y + ph > t.y
    );
  },

  checkEnemyCollision(player) {
    const pw = player.width || 30;
    const ph = player.height || 48;
    return this.enemies.some(e =>
      player.x < e.x + e.w &&
      player.x + pw > e.x &&
      player.y < e.y + e.h &&
      player.y + ph > e.y
    );
  },

  checkGoalCollision(player) {
    const pw = player.width || 30;
    const ph = player.height || 48;
    return (
      player.x < this.goal.x + this.goal.w &&
      player.x + pw > this.goal.x &&
      player.y < this.goal.y + this.goal.h &&
      player.y + ph > this.goal.y
    );
  },

  checkCollectibles(player) {
    const pw = player.width || 30;
    const ph = player.height || 48;
    let collectedCount = 0;
    this.collectibles.forEach(c => {
      if (!c.collected &&
          player.x < c.x + c.w &&
          player.x + pw > c.x &&
          player.y < c.y + c.h &&
          player.y + ph > c.y) {
        c.collected = true;
        collectedCount++;
      }
    });
    return collectedCount;
  }
};