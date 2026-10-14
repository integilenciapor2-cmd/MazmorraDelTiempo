// ============================================================
// NIVEL 1 - LAS CRIPTAS DEL SULTÁN (TUTORIAL / INTRODUCCIÓN)
// Diseñador: Integrante 2
// Descripción: Nivel tutorial con ambientación de Prince of Persia,
// carteles instructivos en la pared, antorchas parpadeantes,
// salto básico, gemas de tiempo y puerta de escape.
// ============================================================

const level1 = {
  name: "Las Criptas del Sultán",
  subtitle: "Nivel 1 - Tutorial",
  width: 1200,
  height: 400,
  spawn: { x: 50, y: 300 },
  goal: { x: 1120, y: 290, w: 50, h: 70 },
  timeLimit: 90, // 90 segundos para escapar

  // ----------------------------------------------------------
  // PLATAFORMAS ESTÁTICAS
  // ----------------------------------------------------------
  platforms: [
    // Suelo inicial
    { x: 0, y: 360, w: 340, h: 40 },
    // Escalones de aprendizaje de salto
    { x: 260, y: 310, w: 80, h: 50 },
    { x: 380, y: 260, w: 100, h: 20 },
    // Plataforma intermedia superior con coleccionable
    { x: 520, y: 200, w: 120, h: 20 },
    // Salto sobre foso
    { x: 480, y: 360, w: 180, h: 40 },
    // Foso de pinchos entre 660 y 760 (aquí no hay suelo, sólo foso abajo)
    { x: 760, y: 360, w: 440, h: 40 },
    // Plataforma flotante sobre el foso de pinchos
    { x: 670, y: 270, w: 80, h: 20 },
    // Escalón previo a la puerta de escape
    { x: 980, y: 300, w: 80, h: 60 }
  ],

  // ----------------------------------------------------------
  // TRAMPAS (Pinchos en el fondo del foso)
  // ----------------------------------------------------------
  traps: [
    { x: 660, y: 375, w: 100, h: 25, type: 'spikes' }
  ],

  // ----------------------------------------------------------
  // ENEMIGOS (En el tutorial no hay o está dormido)
  // ----------------------------------------------------------
  enemies: [],

  // ----------------------------------------------------------
  // COLECCIONABLES (Arenas del Tiempo / Reliquias)
  // ----------------------------------------------------------
  collectibles: [
    { x: 290, y: 260, w: 20, h: 20, type: 'sand', collected: false, value: 100 },
    { x: 570, y: 155, w: 20, h: 20, type: 'sand', collected: false, value: 150 },
    { x: 700, y: 225, w: 20, h: 20, type: 'gem',  collected: false, value: 200 },
    { x: 920, y: 315, w: 20, h: 20, type: 'sand', collected: false, value: 100 }
  ],

  // ----------------------------------------------------------
  // ANTORCHAS Y DECORACIONES AMBIENTALES
  // ----------------------------------------------------------
  torches: [
    { x: 80, y: 260 },
    { x: 350, y: 180 },
    { x: 620, y: 180 },
    { x: 850, y: 260 },
    { x: 1080, y: 250 }
  ],

  // Carteles instructivos estilo pergamino en la pared
  hints: [
    { x: 70, y: 210, text: "Usa [A / D] o [← / →] para moverte" },
    { x: 270, y: 160, text: "Presiona [W / ESPACIO] para saltar" },
    { x: 630, y: 130, text: "¡Cuidado con el foso de pinchos!" },
    { x: 980, y: 200, text: "Atraviesa la Puerta de Salida" }
  ],

  particles: [],
  animFrame: 0,

  // ----------------------------------------------------------
  // CICLO DE ACTUALIZACIÓN
  // ----------------------------------------------------------
  update() {
    this.animFrame++;

    // Generar partículas sutiles de fuego/chispas en las antorchas
    if (this.animFrame % 4 === 0) {
      this.torches.forEach(t => {
        this.particles.push({
          x: t.x + (Math.random() - 0.5) * 6,
          y: t.y - 8,
          vx: (Math.random() - 0.5) * 0.8,
          vy: -Math.random() * 1.5 - 0.5,
          alpha: 1,
          size: Math.random() * 3 + 1,
          color: Math.random() > 0.4 ? '#ff9800' : '#ffeb3b'
        });
      });
    }

    // Actualizar partículas
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.04;
      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }
  },

  // ----------------------------------------------------------
  // DIBUJO DEL NIVEL
  // ----------------------------------------------------------
  draw(ctx, camera = { x: 0, y: 0 }) {
    // Fondo de pared de mazmorra antigua
    const bgGrad = ctx.createLinearGradient(0, 0, 0, this.height);
    bgGrad.addColorStop(0, '#1c1510');
    bgGrad.addColorStop(0.6, '#2a1e16');
    bgGrad.addColorStop(1, '#18100a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.save();
    ctx.translate(-camera.x, -camera.y);

    // Ladrillos decorativos de fondo en parallax / fondo estático
    ctx.strokeStyle = 'rgba(70, 50, 35, 0.4)';
    ctx.lineWidth = 1;
    for (let y = 40; y < 360; y += 40) {
      const offset = (y % 80 === 0) ? 0 : 35;
      for (let x = offset; x < this.width; x += 70) {
        ctx.strokeRect(x, y, 68, 38);
      }
    }

    // Pilares y arcos decorativos
    for (let px = 200; px < this.width; px += 350) {
      ctx.fillStyle = 'rgba(40, 28, 20, 0.6)';
      ctx.fillRect(px, 60, 25, 300);
      ctx.fillStyle = 'rgba(55, 38, 26, 0.8)';
      ctx.fillRect(px - 5, 50, 35, 15);
      ctx.fillRect(px - 5, 350, 35, 15);
    }

    // Dibujar carteles instructivos / pergaminos de pared
    this.hints.forEach(h => {
      ctx.fillStyle = 'rgba(20, 14, 10, 0.75)';
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 1.5;
      const pad = 10;
      ctx.font = '13px "Cinzel", "MedievalSharp", Georgia, serif';
      const textMetrics = ctx.measureText(h.text);
      const boxW = textMetrics.width + pad * 2;
      const boxH = 26;

      ctx.beginPath();
      ctx.roundRect(h.x, h.y, boxW, boxH, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffecb3';
      ctx.fillText(h.text, h.x + pad, h.y + 17);
    });

    // Dibujar antorchas en la pared
    this.torches.forEach(t => {
      // Soporte de hierro de la antorcha
      ctx.fillStyle = '#3e2723';
      ctx.fillRect(t.x - 3, t.y, 6, 18);
      ctx.fillStyle = '#5d4037';
      ctx.fillRect(t.x - 6, t.y - 4, 12, 6);

      // Resplandor cálido
      const glow = ctx.createRadialGradient(t.x, t.y - 6, 2, t.x, t.y - 6, 45);
      glow.addColorStop(0, 'rgba(255, 179, 0, 0.45)');
      glow.addColorStop(0.5, 'rgba(255, 87, 34, 0.15)');
      glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(t.x, t.y - 6, 45, 0, Math.PI * 2);
      ctx.fill();

      // Fuego animado
      const flicker = Math.sin(this.animFrame * 0.2 + t.x) * 2;
      ctx.fillStyle = '#ff5722';
      ctx.beginPath();
      ctx.arc(t.x, t.y - 6, 7 + flicker, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffeb3b';
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

    // --- Plataformas de piedra (Prince of Persia style) ---
    this.platforms.forEach(p => {
      // Bloque base
      const grad = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.h);
      grad.addColorStop(0, '#8c6d48');
      grad.addColorStop(0.3, '#6e5032');
      grad.addColorStop(1, '#47311d');
      ctx.fillStyle = grad;
      ctx.fillRect(p.x, p.y, p.w, p.h);

      // Borde superior iluminado (borde de repisa)
      ctx.fillStyle = '#c49a6c';
      ctx.fillRect(p.x, p.y, p.w, 4);

      // Líneas de bloques de piedra
      ctx.strokeStyle = '#322112';
      ctx.lineWidth = 2;
      ctx.strokeRect(p.x, p.y, p.w, p.h);

      // Grietas y detalles de cantería
      for (let bx = p.x + 30; bx < p.x + p.w; bx += 40) {
        ctx.beginPath();
        ctx.moveTo(bx, p.y + 4);
        ctx.lineTo(bx, p.y + p.h);
        ctx.stroke();
      }
    });

    // --- Trampas (Pinchos) ---
    this.traps.forEach(t => {
      if (t.type === 'spikes') {
        const spikeW = 12;
        const count = Math.floor(t.w / spikeW);
        for (let i = 0; i < count; i++) {
          const sx = t.x + i * spikeW;
          const sy = t.y;

          // Sombra del pincho
          ctx.fillStyle = '#212121';
          ctx.beginPath();
          ctx.moveTo(sx, sy + t.h);
          ctx.lineTo(sx + spikeW / 2, sy);
          ctx.lineTo(sx + spikeW, sy + t.h);
          ctx.closePath();
          ctx.fill();

          // Brillo de metal afilado
          ctx.fillStyle = '#b0bec5';
          ctx.beginPath();
          ctx.moveTo(sx + 2, sy + t.h);
          ctx.lineTo(sx + spikeW / 2, sy);
          ctx.lineTo(sx + spikeW / 2 + 1, sy + t.h);
          ctx.closePath();
          ctx.fill();

          // Punta de sangre seca (detalle PoP)
          ctx.fillStyle = '#b71c1c';
          ctx.beginPath();
          ctx.arc(sx + spikeW / 2, sy + 3, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    });

    // --- Coleccionables: Reliquias / Arenas del Tiempo ---
    this.collectibles.forEach(c => {
      if (!c.collected) {
        const bounce = Math.sin(this.animFrame * 0.1 + c.x) * 4;
        const cy = c.y + bounce;

        if (c.type === 'sand') {
          // Reloj de arena dorado
          ctx.fillStyle = '#ffd700';
          ctx.strokeStyle = '#b8860b';
          ctx.lineWidth = 1.5;

          // Triángulo superior
          ctx.beginPath();
          ctx.moveTo(c.x, cy);
          ctx.lineTo(c.x + c.w, cy);
          ctx.lineTo(c.x + c.w / 2, cy + c.h / 2);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Triángulo inferior
          ctx.beginPath();
          ctx.moveTo(c.x, cy + c.h);
          ctx.lineTo(c.x + c.w, cy + c.h);
          ctx.lineTo(c.x + c.w / 2, cy + c.h / 2);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Arena mágica brillante
          ctx.fillStyle = '#fff9c4';
          ctx.fillRect(c.x + c.w / 2 - 2, cy + c.h / 2 - 2, 4, 4);
        } else {
          // Gema de zafiro/esmeralda
          ctx.fillStyle = '#00e676';
          ctx.beginPath();
          ctx.moveTo(c.x + c.w / 2, cy);
          ctx.lineTo(c.x + c.w, cy + c.h / 2);
          ctx.lineTo(c.x + c.w / 2, cy + c.h);
          ctx.lineTo(c.x, cy + c.h / 2);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = '#b9f6ca';
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Halo brillante
        ctx.fillStyle = 'rgba(255, 215, 0, 0.25)';
        ctx.beginPath();
        ctx.arc(c.x + c.w / 2, cy + c.h / 2, 16, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // --- Puerta de Salida de la Mazmorra ---
    const g = this.goal;
    // Marco de piedra de la puerta
    ctx.fillStyle = '#3e2723';
    ctx.fillRect(g.x - 6, g.y - 10, g.w + 12, g.h + 10);
    ctx.fillStyle = '#d4af37';
    ctx.fillRect(g.x - 8, g.y - 12, g.w + 16, 6);

    // Interior de la puerta (abovedada)
    ctx.fillStyle = '#0a0503';
    ctx.fillRect(g.x, g.y, g.w, g.h);

    // Resplandor místico de salida
    const portalGlow = ctx.createRadialGradient(g.x + g.w / 2, g.y + g.h / 2, 5, g.x + g.w / 2, g.y + g.h / 2, 35);
    portalGlow.addColorStop(0, 'rgba(0, 230, 118, 0.7)');
    portalGlow.addColorStop(0.7, 'rgba(0, 150, 136, 0.3)');
    portalGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = portalGlow;
    ctx.beginPath();
    ctx.arc(g.x + g.w / 2, g.y + g.h / 2, 35, 0, Math.PI * 2);
    ctx.fill();

    // Runa de salida
    ctx.fillStyle = '#b9f6ca';
    ctx.font = '22px Arial';
    ctx.fillText('🚪', g.x + 12, g.y + 44);

    ctx.restore();
  },

  // ----------------------------------------------------------
  // INTERFAZ DE COLISIONES
  // ----------------------------------------------------------
  getSolidPlatforms() {
    return this.platforms;
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
    return false; // Sin enemigos en el nivel 1
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