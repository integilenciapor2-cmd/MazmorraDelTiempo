// ============================================================
// NIVEL 3 - EL LABERINTO DEL TIEMPO (NIVEL FINAL)
// Diseñador: Integrante 3
// Descripción: Nivel final con laberinto vertical, plataformas móviles,
// trampas giratorias de tiempo, centinelas y el Portal Eterno de escape.
// ============================================================

const level3 = {
  name: "El Laberinto del Tiempo",
  subtitle: "Nivel 3 - La Prueba Final",
  width: 2400,
  height: 600,
  spawn: { x: 50, y: 300 },
  goal: { x: 2300, y: 175, w: 55, h: 75 },
  timeLimit: 120, // 120 segundos

  // ----------------------------------------------------------
  // PLATAFORMAS ESTÁTICAS
  // ----------------------------------------------------------
  platforms: [
    // --- Zona 1: Entrada al laberinto ---
    { x: 0,    y: 360, w: 200, h: 40 },
    { x: 240,  y: 280, w: 90,  h: 20 },
    { x: 370,  y: 200, w: 90,  h: 20 },
    { x: 510,  y: 130, w: 120, h: 20 },

    // --- Zona 2: Laberinto vertical ---
    { x: 690,  y: 200, w: 70,  h: 20 },
    { x: 790,  y: 280, w: 70,  h: 20 },
    { x: 890,  y: 360, w: 110, h: 40 },
    { x: 1040, y: 280, w: 70,  h: 20 },
    { x: 1140, y: 200, w: 70,  h: 20 },
    { x: 1240, y: 130, w: 110, h: 20 },

    // --- Zona 3: Pasillo de trampas ---
    { x: 1390, y: 200, w: 85,  h: 20 },
    { x: 1520, y: 200, w: 85,  h: 20 },
    { x: 1650, y: 200, w: 85,  h: 20 },
    { x: 1780, y: 200, w: 85,  h: 20 },

    // --- Zona 4: Ascenso final ---
    { x: 1940, y: 290, w: 85,  h: 20 },
    { x: 2070, y: 210, w: 85,  h: 20 },
    { x: 2200, y: 250, w: 200, h: 40 } // Plataforma de la meta
  ],

  // ----------------------------------------------------------
  // PLATAFORMAS MÓVILES
  // ----------------------------------------------------------
  movingPlatforms: [
    {
      x: 600, y: 300, w: 80, h: 20,
      axis: 'x',
      range: 90,
      speed: 1.5,
      dir: 1,
      originX: 600, originY: 300
    },
    {
      x: 1340, y: 300, w: 65, h: 20,
      axis: 'y',
      range: 80,
      speed: 1.3,
      dir: 1,
      originX: 1340, originY: 300
    },
    {
      x: 1890, y: 300, w: 75, h: 20,
      axis: 'x',
      range: 110,
      speed: 2,
      dir: 1,
      originX: 1890, originY: 300
    }
  ],

  // ----------------------------------------------------------
  // TRAMPAS (Pinchos & Sierras)
  // ----------------------------------------------------------
  traps: [
    // Pinchos en el suelo
    { x: 300,  y: 375, w: 50, h: 25, type: 'spikes' },
    { x: 450,  y: 375, w: 50, h: 25, type: 'spikes' },
    { x: 950,  y: 375, w: 70, h: 25, type: 'spikes' },
    { x: 1445, y: 180, w: 35, h: 20, type: 'spikes' },
    { x: 1575, y: 180, w: 35, h: 20, type: 'spikes' },
    { x: 1705, y: 180, w: 35, h: 20, type: 'spikes' },
    { x: 1835, y: 180, w: 35, h: 20, type: 'spikes' },

    // Sierras giratorias mortales
    {
      x: 1090, y: 250, w: 34, h: 34, type: 'saw',
      axis: 'x', range: 90, speed: 2.0, dir: 1,
      originX: 1090, originY: 250, angle: 0
    },
    {
      x: 1590, y: 250, w: 34, h: 34, type: 'saw',
      axis: 'y', range: 60, speed: 1.8, dir: 1,
      originX: 1590, originY: 250, angle: 0
    }
  ],

  // ----------------------------------------------------------
  // ENEMIGOS: Centinelas del Tiempo
  // ----------------------------------------------------------
  enemies: [
    {
      x: 820, y: 312, w: 30, h: 48,
      minX: 790, maxX: 980,
      vx: 1.3,
      facingRight: true
    },
    {
      x: 1710, y: 312, w: 30, h: 48,
      minX: 1680, maxX: 1840,
      vx: 1.6,
      facingRight: true
    }
  ],

  // ----------------------------------------------------------
  // COLECCIONABLES (Arenas del Tiempo y Gemas Raras)
  // ----------------------------------------------------------
  collectibles: [
    { x: 395,  y: 160, w: 20, h: 20, type: 'sand', collected: false, value: 150 },
    { x: 895,  y: 320, w: 20, h: 20, type: 'gem',  collected: false, value: 250 },
    { x: 1290, y: 90,  w: 20, h: 20, type: 'sand', collected: false, value: 200 },
    { x: 1660, y: 160, w: 20, h: 20, type: 'gem',  collected: false, value: 300 },
    { x: 2100, y: 170, w: 20, h: 20, type: 'sand', collected: false, value: 250 }
  ],

  torches: [
    { x: 120, y: 260 },
    { x: 530, y: 90 },
    { x: 920, y: 280 },
    { x: 1400, y: 150 },
    { x: 1980, y: 230 },
    { x: 2260, y: 190 }
  ],

  animFrame: 0,
  particles: [],

  // ----------------------------------------------------------
  // ACTUALIZACIÓN
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
        t.angle = (t.angle || 0) + 0.18;
        if (t.axis === 'x') {
          t.x += t.speed * t.dir;
          if (t.x > t.originX + t.range || t.x < t.originX - t.range) t.dir *= -1;
        } else {
          t.y += t.speed * t.dir;
          if (t.y > t.originY + t.range || t.y < t.originY - t.range) t.dir *= -1;
        }
      }
    });

    // Mover enemigos
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

    // Partículas místicas de antorchas
    if (this.animFrame % 4 === 0) {
      this.torches.forEach(t => {
        this.particles.push({
          x: t.x + (Math.random() - 0.5) * 6,
          y: t.y - 8,
          vx: (Math.random() - 0.5) * 0.8,
          vy: -Math.random() * 1.5 - 0.5,
          alpha: 1,
          size: Math.random() * 3 + 1,
          color: Math.random() > 0.3 ? '#ba68c8' : '#e1bee7' // Fuego púrpura místico del tiempo
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
    // Fondo de templo místico del tiempo (degradado azul medianoche a púrpura profundo)
    const bgGrad = ctx.createLinearGradient(0, 0, 0, this.height);
    bgGrad.addColorStop(0, '#0d0d1e');
    bgGrad.addColorStop(0.5, '#19112d');
    bgGrad.addColorStop(1, '#090514');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.save();
    ctx.translate(-camera.x, -camera.y);

    // Muros arcanos de piedra con glifos
    ctx.strokeStyle = 'rgba(123, 45, 142, 0.3)';
    ctx.lineWidth = 1;
    for (let y = 30; y < 580; y += 45) {
      const offset = (y % 90 === 0) ? 0 : 40;
      for (let x = offset; x < this.width; x += 80) {
        ctx.strokeRect(x, y, 78, 43);
      }
    }

    // Pilares arcanos decorativos
    for (let px = 200; px < this.width; px += 380) {
      ctx.fillStyle = 'rgba(74, 21, 75, 0.4)';
      ctx.fillRect(px, 40, 30, 480);
      ctx.fillStyle = 'rgba(171, 71, 188, 0.6)';
      ctx.fillRect(px - 5, 30, 40, 15);
      ctx.fillRect(px - 5, 510, 40, 15);
    }

    // Antorchas con llamas púrpuras del tiempo
    this.torches.forEach(t => {
      ctx.fillStyle = '#212121';
      ctx.fillRect(t.x - 3, t.y, 6, 18);

      const glow = ctx.createRadialGradient(t.x, t.y - 6, 2, t.x, t.y - 6, 45);
      glow.addColorStop(0, 'rgba(186, 104, 200, 0.5)');
      glow.addColorStop(0.5, 'rgba(123, 31, 162, 0.2)');
      glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(t.x, t.y - 6, 45, 0, Math.PI * 2);
      ctx.fill();

      const flicker = Math.sin(this.animFrame * 0.2 + t.x) * 2;
      ctx.fillStyle = '#ab47bc';
      ctx.beginPath();
      ctx.arc(t.x, t.y - 6, 7 + flicker, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f3e5f5';
      ctx.beginPath();
      ctx.arc(t.x, t.y - 7, 4 + flicker * 0.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Partículas místicas
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
      grad.addColorStop(0, '#4a154b');
      grad.addColorStop(0.3, '#380e39');
      grad.addColorStop(1, '#240825');
      ctx.fillStyle = grad;
      ctx.fillRect(p.x, p.y, p.w, p.h);

      ctx.fillStyle = '#ba68c8';
      ctx.fillRect(p.x, p.y, p.w, 4);

      ctx.strokeStyle = '#7b1fa2';
      ctx.lineWidth = 2;
      ctx.strokeRect(p.x, p.y, p.w, p.h);
    });

    // --- Plataformas móviles ---
    this.movingPlatforms.forEach(p => {
      ctx.fillStyle = '#6a1b9a';
      ctx.fillRect(p.x, p.y, p.w, p.h);
      ctx.fillStyle = '#e1bee7';
      ctx.fillRect(p.x, p.y, p.w, 4);
      ctx.strokeStyle = '#ab47bc';
      ctx.lineWidth = 2;
      ctx.strokeRect(p.x, p.y, p.w, p.h);

      // Símbolo rúnico de tiempo
      ctx.fillStyle = '#ffd54f';
      ctx.fillRect(p.x + p.w / 2 - 3, p.y + 7, 6, 6);
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

          ctx.fillStyle = '#e57373';
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

        ctx.fillStyle = '#ff6f00';
        ctx.beginPath();
        ctx.arc(0, 0, t.w / 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#ffe082';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = '#d50000';
        for (let i = 0; i < 8; i++) {
          const a = (i * Math.PI * 2) / 8;
          const tx = Math.cos(a) * (t.w / 2 + 4);
          const ty = Math.sin(a) * (t.h / 2 + 4);
          ctx.beginPath();
          ctx.arc(tx, ty, 3, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = '#212121';
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    });

    // --- Enemigos (Centinelas Arcanos) ---
    this.enemies.forEach(e => {
      ctx.fillStyle = '#4a148c'; // Túnica arcana
      ctx.fillRect(e.x + 4, e.y + 12, 22, 24);

      ctx.fillStyle = '#7b1fa2';
      ctx.fillRect(e.x + 6, e.y + 14, 18, 16);

      ctx.fillStyle = '#ffd700'; // Máscara dorada
      ctx.fillRect(e.x + 7, e.y, 16, 14);

      ctx.fillStyle = '#00e5ff'; // Ojos celestes brillantes
      const eyeX = e.facingRight ? e.x + 16 : e.x + 9;
      ctx.fillRect(eyeX, e.y + 5, 4, 3);

      // Bastón del tiempo
      ctx.fillStyle = '#ffd54f';
      const staffX = e.facingRight ? e.x + 24 : e.x - 2;
      ctx.fillRect(staffX, e.y + 4, 4, 36);
      ctx.fillStyle = '#ab47bc';
      ctx.beginPath();
      ctx.arc(staffX + 2, e.y + 4, 5, 0, Math.PI * 2);
      ctx.fill();

      // Piernas
      ctx.fillStyle = '#12002b';
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
          ctx.strokeStyle = '#b8860b';
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
          ctx.fillStyle = '#e040fb';
          ctx.beginPath();
          ctx.moveTo(c.x + c.w / 2, cy);
          ctx.lineTo(c.x + c.w, cy + c.h / 2);
          ctx.lineTo(c.x + c.w / 2, cy + c.h);
          ctx.lineTo(c.x, cy + c.h / 2);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = '#ea80fc';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }
    });

    // --- Meta Final: El Portal de la Eternidad ---
    const g = this.goal;
    ctx.fillStyle = '#311b92';
    ctx.fillRect(g.x - 8, g.y - 12, g.w + 16, g.h + 12);

    ctx.fillStyle = '#ffd700';
    ctx.fillRect(g.x - 10, g.y - 14, g.w + 20, 6);

    ctx.fillStyle = '#050014';
    ctx.fillRect(g.x, g.y, g.w, g.h);

    // Vórtice dorado cósmico de escape
    const portalGlow = ctx.createRadialGradient(g.x + g.w / 2, g.y + g.h / 2, 6, g.x + g.w / 2, g.y + g.h / 2, 45);
    portalGlow.addColorStop(0, 'rgba(255, 215, 0, 0.9)');
    portalGlow.addColorStop(0.5, 'rgba(230, 81, 0, 0.5)');
    portalGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = portalGlow;
    ctx.beginPath();
    ctx.arc(g.x + g.w / 2, g.y + g.h / 2, 45, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.font = '24px Arial';
    ctx.fillText('⏳', g.x + 14, g.y + 46);

    ctx.restore();
  },

  // ----------------------------------------------------------
  // INTERFAZ DE COLISIONES ROBUSTA (soporta width y w)
  // ----------------------------------------------------------
  getSolidPlatforms() {
    return [...this.platforms, ...this.movingPlatforms];
  },

  checkTrapCollision(player) {
    const pw = player.width || player.w || 30;
    const ph = player.height || player.h || 48;
    return this.traps.some(t =>
      player.x < t.x + t.w &&
      player.x + pw > t.x &&
      player.y < t.y + t.h &&
      player.y + ph > t.y
    );
  },

  checkEnemyCollision(player) {
    const pw = player.width || player.w || 30;
    const ph = player.height || player.h || 48;
    return this.enemies.some(e =>
      player.x < e.x + e.w &&
      player.x + pw > e.x &&
      player.y < e.y + e.h &&
      player.y + ph > e.y
    );
  },

  checkGoalCollision(player) {
    const pw = player.width || player.w || 30;
    const ph = player.height || player.h || 48;
    return (
      player.x < this.goal.x + this.goal.w &&
      player.x + pw > this.goal.x &&
      player.y < this.goal.y + this.goal.h &&
      player.y + ph > this.goal.y
    );
  },

  checkCollectibles(player) {
    const pw = player.width || player.w || 30;
    const ph = player.height || player.h || 48;
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