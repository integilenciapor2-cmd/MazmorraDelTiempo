// ============================================================
// NIVEL 3 - EL LABERINTO DEL TIEMPO
// Diseñador: Integrante 3
// Descripción: Nivel final con laberinto vertical, trampas,
// plataformas móviles, enemigos y meta final.
// ============================================================

const level3 = {
  // ----------------------------------------------------------
  // CONFIGURACIÓN GENERAL DEL NIVEL
  // ----------------------------------------------------------
  name: "El Laberinto del Tiempo",
  width: 2400,   // Ancho total del nivel (para scroll de cámara)
  height: 600,   // Alto total del nivel
  spawn: { x: 50, y: 300 }, // Punto de aparición del jugador
  goal: { x: 2300, y: 200, w: 40, h: 40 }, // Meta final

  // ----------------------------------------------------------
  // PLATAFORMAS ESTÁTICAS
  // ----------------------------------------------------------
  platforms: [
    // --- Zona 1: Entrada al laberinto ---
    { x: 0,    y: 360, w: 200, h: 40 },
    { x: 250,  y: 280, w: 80,  h: 20 },
    { x: 380,  y: 200, w: 80,  h: 20 },
    { x: 520,  y: 120, w: 120, h: 20 },

    // --- Zona 2: Laberinto vertical ---
    { x: 700,  y: 200, w: 60,  h: 20 },
    { x: 800,  y: 280, w: 60,  h: 20 },
    { x: 900,  y: 360, w: 100, h: 40 },
    { x: 1050, y: 280, w: 60,  h: 20 },
    { x: 1150, y: 200, w: 60,  h: 20 },
    { x: 1250, y: 120, w: 100, h: 20 },

    // --- Zona 3: Pasillo de trampas ---
    { x: 1400, y: 200, w: 80,  h: 20 },
    { x: 1530, y: 200, w: 80,  h: 20 },
    { x: 1660, y: 200, w: 80,  h: 20 },
    { x: 1790, y: 200, w: 80,  h: 20 },

    // --- Zona 4: Ascenso final ---
    { x: 1950, y: 280, w: 80,  h: 20 },
    { x: 2080, y: 200, w: 80,  h: 20 },
    { x: 2200, y: 240, w: 200, h: 40 }, // Plataforma de la meta
  ],

  // ----------------------------------------------------------
  // PLATAFORMAS MÓVILES (se mueven horizontal o verticalmente)
  // ----------------------------------------------------------
  movingPlatforms: [
    {
      x: 600, y: 300, w: 80, h: 20,
      axis: 'x',        // 'x' o 'y'
      range: 100,       // Distancia de movimiento
      speed: 1.5,       // Velocidad
      dir: 1,           // Dirección actual (1 o -1)
      originX: 600,
      originY: 300
    },
    {
      x: 1350, y: 300, w: 60, h: 20,
      axis: 'y',
      range: 80,
      speed: 1.2,
      dir: 1,
      originX: 1350,
      originY: 300
    },
    {
      x: 1900, y: 300, w: 70, h: 20,
      axis: 'x',
      range: 120,
      speed: 2,
      dir: 1,
      originX: 1900,
      originY: 300
    }
  ],

  // ----------------------------------------------------------
  // TRAMPAS (pinchos, sierras, fuego)
  // ----------------------------------------------------------
  traps: [
    // Pinchos en el suelo
    { x: 300,  y: 340, w: 40, h: 20, type: 'spikes' },
    { x: 450,  y: 340, w: 40, h: 20, type: 'spikes' },
    { x: 950,  y: 340, w: 60, h: 20, type: 'spikes' },
    { x: 1450, y: 180, w: 30, h: 20, type: 'spikes' },
    { x: 1580, y: 180, w: 30, h: 20, type: 'spikes' },
    { x: 1710, y: 180, w: 30, h: 20, type: 'spikes' },
    { x: 1840, y: 180, w: 30, h: 20, type: 'spikes' },

    // Sierras (trampas móviles)
    {
      x: 1100, y: 260, w: 30, h: 30, type: 'saw',
      axis: 'x', range: 100, speed: 2, dir: 1,
      originX: 1100, originY: 260
    },
    {
      x: 1600, y: 260, w: 30, h: 30, type: 'saw',
      axis: 'y', range: 60, speed: 1.8, dir: 1,
      originX: 1600, originY: 260
    }
  ],

  // ----------------------------------------------------------
  // ENEMIGOS (patrullan horizontalmente)
  // ----------------------------------------------------------
  enemies: [
    {
      x: 800, y: 340, w: 30, h: 30,
      axis: 'x', range: 80, speed: 1, dir: 1,
      originX: 800, originY: 340
    },
    {
      x: 1700, y: 340, w: 30, h: 30,
      axis: 'x', range: 120, speed: 1.5, dir: 1,
      originX: 1700, originY: 340
    }
  ],

  // ----------------------------------------------------------
  // COLECCIONABLES (opcional: monedas, llaves)
  // ----------------------------------------------------------
  collectibles: [
    { x: 400,  y: 160, w: 15, h: 15, type: 'coin', collected: false },
    { x: 900,  y: 320, w: 15, h: 15, type: 'coin', collected: false },
    { x: 1300, y: 80,  w: 15, h: 15, type: 'coin', collected: false },
    { x: 2100, y: 160, w: 15, h: 15, type: 'coin', collected: false }
  ],

  // ----------------------------------------------------------
  // MÉTODO DE ACTUALIZACIÓN (movimiento de plataformas, trampas, enemigos)
  // ----------------------------------------------------------
  update() {
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
      if (e.axis === 'x') {
        e.x += e.speed * e.dir;
        if (e.x > e.originX + e.range || e.x < e.originX - e.range) e.dir *= -1;
      } else {
        e.y += e.speed * e.dir;
        if (e.y > e.originY + e.range || e.y < e.originY - e.range) e.dir *= -1;
      }
    });
  },

  // ----------------------------------------------------------
  // MÉTODO DE DIBUJO
  // ----------------------------------------------------------
  draw(ctx, camera = { x: 0, y: 0 }) {
    // Fondo degradado (opcional)
    const gradient = ctx.createLinearGradient(0, 0, 0, this.height);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(1, '#16213e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.width, this.height);

    // --- Plataformas estáticas ---
    ctx.fillStyle = '#4a154b';
    this.platforms.forEach(p => {
      ctx.fillRect(p.x - camera.x, p.y - camera.y, p.w, p.h);
      // Borde decorativo
      ctx.strokeStyle = '#7b2d8e';
      ctx.lineWidth = 2;
      ctx.strokeRect(p.x - camera.x, p.y - camera.y, p.w, p.h);
    });

    // --- Plataformas móviles ---
    ctx.fillStyle = '#6a1b9a';
    this.movingPlatforms.forEach(p => {
      ctx.fillRect(p.x - camera.x, p.y - camera.y, p.w, p.h);
      ctx.strokeStyle = '#ab47bc';
      ctx.strokeRect(p.x - camera.x, p.y - camera.y, p.w, p.h);
    });

    // --- Trampas ---
    this.traps.forEach(t => {
      if (t.type === 'spikes') {
        ctx.fillStyle = '#e53935';
        // Dibujar triángulos de pinchos
        const spikeCount = Math.floor(t.w / 10);
        for (let i = 0; i < spikeCount; i++) {
          const sx = t.x + i * 10 - camera.x;
          const sy = t.y - camera.y;
          ctx.beginPath();
          ctx.moveTo(sx, sy + t.h);
          ctx.lineTo(sx + 5, sy);
          ctx.lineTo(sx + 10, sy + t.h);
          ctx.closePath();
          ctx.fill();
        }
      } else if (t.type === 'saw') {
        ctx.fillStyle = '#ff6f00';
        ctx.beginPath();
        ctx.arc(t.x + t.w / 2 - camera.x, t.y + t.h / 2 - camera.y, t.w / 2, 0, Math.PI * 2);
        ctx.fill();
        // Dientes de la sierra
        ctx.strokeStyle = '#ffab00';
        ctx.lineWidth = 3;
        ctx.stroke();
      }
    });

    // --- Enemigos ---
    this.enemies.forEach(e => {
      ctx.fillStyle = '#d32f2f';
      ctx.fillRect(e.x - camera.x, e.y - camera.y, e.w, e.h);
      // Ojos
      ctx.fillStyle = '#fff';
      ctx.fillRect(e.x + 5 - camera.x, e.y + 8 - camera.y, 6, 6);
      ctx.fillRect(e.x + 18 - camera.x, e.y + 8 - camera.y, 6, 6);
      ctx.fillStyle = '#000';
      ctx.fillRect(e.x + 7 - camera.x, e.y + 10 - camera.y, 3, 3);
      ctx.fillRect(e.x + 20 - camera.x, e.y + 10 - camera.y, 3, 3);
    });

    // --- Coleccionables ---
    this.collectibles.forEach(c => {
      if (!c.collected) {
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(c.x + c.w / 2 - camera.x, c.y + c.h / 2 - camera.y, c.w / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ff8f00';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });

    // --- Meta final ---
    ctx.fillStyle = '#00e676';
    ctx.fillRect(this.goal.x - camera.x, this.goal.y - camera.y, this.goal.w, this.goal.h);
    // Bandera o brillo
    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    ctx.fillText('🏁', this.goal.x - camera.x + 5, this.goal.y - camera.y + 28);
  },

  // ----------------------------------------------------------
  // DETECCIÓN DE COLISIONES (para que player.js las use)
  // ----------------------------------------------------------
  getSolidPlatforms() {
    // Devuelve todas las plataformas (estáticas + móviles) para colisión
    return [...this.platforms, ...this.movingPlatforms];
  },

  checkTrapCollision(player) {
    // Verifica si el jugador toca una trampa
    return this.traps.some(t => 
      player.x < t.x + t.w &&
      player.x + player.w > t.x &&
      player.y < t.y + t.h &&
      player.y + player.h > t.y
    );
  },

  checkEnemyCollision(player) {
    return this.enemies.some(e =>
      player.x < e.x + e.w &&
      player.x + player.w > e.x &&
      player.y < e.y + e.h &&
      player.y + player.h > e.y
    );
  },

  checkGoalCollision(player) {
    return (
      player.x < this.goal.x + this.goal.w &&
      player.x + player.w > this.goal.x &&
      player.y < this.goal.y + this.goal.h &&
      player.y + player.h > this.goal.y
    );
  },

  checkCollectibles(player) {
    let collected = 0;
    this.collectibles.forEach(c => {
      if (!c.collected &&
          player.x < c.x + c.w &&
          player.x + player.w > c.x &&
          player.y < c.y + c.h &&
          player.y + player.h > c.y) {
        c.collected = true;
        collected++;
      }
    });
    return collected;
  }
};

// Exportar para uso en main.js (si usas módulos ES6)
// export default level3;