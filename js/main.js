// ============================================================
// MAIN.JS - CONTROLADOR PRINCIPAL Y BUCLE DEL JUEGO
// Coordina el bucle de animación, estados de juego, cámara,
// entrada de teclado y transición entre niveles.
// ============================================================

let currentLevel = 1;
let lives = 3;
let score = 0;
let game = null;
let isPaused = false;
let isGameOver = false;
let isVictory = false;
let animationId = null;

// Cámara 2D suave
const camera = { x: 0, y: 0 };

// Temporizador del nivel
let levelTimeLeft = 90;
let lastTimestamp = 0;

// Sistema de invulnerabilidad temporal al recibir daño (1.2 segundos)
let isInvincible = false;
let invincibilityTimer = 0;

// Estado de teclas presionadas
const keys = {};

// Instancia global del jugador
let player = null;

// Control de sonido de salto
let wasGrounded = true;

// ----------------------------------------------------------
// EVENT LISTENERS DE TECLADO
// ----------------------------------------------------------
window.addEventListener('keydown', (e) => {
  keys[e.key] = true;
  keys[e.code] = true;

  // Pausa con tecla P o Escape
  if ((e.key === 'p' || e.key === 'P' || e.key === 'Escape') && game && !isGameOver && !isVictory) {
    togglePauseGame();
  }
});

window.addEventListener('keyup', (e) => {
  keys[e.key] = false;
  keys[e.code] = false;
});

// ----------------------------------------------------------
// CONTROL DE AUDIO
// ----------------------------------------------------------
function toggleAudio() {
  if (window.soundManager) {
    const isMuted = window.soundManager.toggleMute();
    updateAudioButtonUI(isMuted);
  }
}

// ----------------------------------------------------------
// INICIO Y CONTROL DE NIVELES
// ----------------------------------------------------------
function startGame() {
  hideAllScreens();
  lives = 3;
  score = 0;
  currentLevel = 1;
  isGameOver = false;
  isVictory = false;
  isPaused = false;

  if (window.soundManager) {
    window.soundManager.startMusic();
  }

  loadLevel(currentLevel);
}

function restartGame() {
  startGame();
}

function restartCurrentLevel() {
  hideAllScreens();
  isPaused = false;
  isGameOver = false;
  loadLevel(currentLevel);
}

function returnToMainMenu() {
  if (animationId) cancelAnimationFrame(animationId);
  if (window.soundManager) window.soundManager.stopMusic();
  showMainMenu();
}

function togglePauseGame() {
  isPaused = !isPaused;
  if (isPaused) {
    showPauseScreen();
  } else {
    hidePauseScreen();
    lastTimestamp = performance.now();
    requestAnimationFrame(gameLoop);
  }
}

// ----------------------------------------------------------
// CARGA DE NIVEL
// ----------------------------------------------------------
function loadLevel(num) {
  if (num === 1) game = level1;
  else if (num === 2) game = level2;
  else if (num === 3) game = level3;
  else {
    // ¡Victoria total!
    isVictory = true;
    showVictoryScreen(score, lives);
    return;
  }

  // Reiniciar temporizador del nivel
  levelTimeLeft = game.timeLimit || 90;

  // Instanciar o reiniciar jugador en el punto de aparición
  const spawnX = (game.spawn && game.spawn.x) ? game.spawn.x : 50;
  const spawnY = (game.spawn && game.spawn.y) ? game.spawn.y : 300;

  if (!player && typeof Player !== 'undefined') {
    player = new Player(spawnX, spawnY);
  } else if (player) {
    player.x = spawnX;
    player.y = spawnY;
    player.vx = 0;
    player.vy = 0;
    player.isGrounded = false;
  }
  window.player = player;

  // Reiniciar coleccionables en el nivel si existieran
  if (game.collectibles) {
    game.collectibles.forEach(c => c.collected = false);
  }

  // Reiniciar plataformas quebradizas en nivel 2 si existieran
  if (game.crumblingPlatforms) {
    game.crumblingPlatforms.forEach(cp => {
      cp.stepped = false;
      cp.collapsed = false;
      cp.timer = 0;
      cp.vy = 0;
      cp.x = cp.origX;
      cp.y = cp.origY;
    });
  }

  // Mostrar banner de transición
  showLevelTransition(`${game.name || 'Nivel ' + num}`);

  updateHUD(lives, num, score, levelTimeLeft);

  lastTimestamp = performance.now();
  if (animationId) cancelAnimationFrame(animationId);
  animationId = requestAnimationFrame(gameLoop);
}

// ----------------------------------------------------------
// ACTUALIZAR JUGADOR (Enlace seguro con player.js sin modificarlo)
// ----------------------------------------------------------
function updatePlayer(currentLevelObj) {
  if (!player) return;

  const platforms = currentLevelObj.getSolidPlatforms 
    ? currentLevelObj.getSolidPlatforms() 
    : (currentLevelObj.platforms || []);

  const preGrounded = player.isGrounded;

  // Llamada al método original de player.js de la compañera
  player.update(keys, platforms);

  // Sonido de salto al despegar
  if (preGrounded && !player.isGrounded && player.vy < 0) {
    if (window.soundManager) window.soundManager.play('jump');
  }

  // Comprobar caída a abismos fuera de la pantalla
  const levelH = currentLevelObj.height || 400;
  if (player.y > levelH + 50) {
    handlePlayerDamage(currentLevelObj, "Has caído en el abismo de la mazmorra");
  }

  // Temporizador de invulnerabilidad (parpadeo visual)
  if (isInvincible) {
    invincibilityTimer--;
    if (invincibilityTimer <= 0) {
      isInvincible = false;
    }
  }
}

// ----------------------------------------------------------
// DAÑO Y REAPARICIÓN DEL JUGADOR
// ----------------------------------------------------------
function handlePlayerDamage(currentLevelObj, tip = "Cuidado con las trampas y fosos") {
  if (isInvincible) return;

  lives--;
  isInvincible = true;
  invincibilityTimer = 60; // ~1 segundo de invulnerabilidad

  if (window.soundManager) window.soundManager.play('hurt');

  if (lives <= 0) {
    isGameOver = true;
    showGameOverScreen(tip);
  } else {
    // Reaparecer al inicio del nivel
    player.x = currentLevelObj.spawn.x;
    player.y = currentLevelObj.spawn.y;
    player.vx = 0;
    player.vy = 0;
    showToast(`¡Cuidado! Te quedan ${lives} vidas`);
    updateHUD(lives, currentLevel, score, levelTimeLeft);
  }
}

// ----------------------------------------------------------
// BUCLE PRINCIPAL DEL JUEGO (Game Loop)
// ----------------------------------------------------------
function gameLoop(timestamp) {
  if (isPaused || isGameOver || isVictory) return;

  const dt = (timestamp - lastTimestamp) / 1000;
  lastTimestamp = timestamp;

  // Actualizar cuenta regresiva de tiempo
  if (dt > 0 && dt < 0.2) {
    levelTimeLeft -= dt;
    if (levelTimeLeft <= 0) {
      levelTimeLeft = 0;
      handlePlayerDamage(game, "Se te ha agotado el tiempo en la mazmorra");
    }
  }

  // 1. Actualizar lógica propia del nivel (plataformas móviles, trampas, enemigos)
  if (game && game.update) {
    game.update();
  }

  // 2. Actualizar movimiento y físicas del jugador
  if (game) {
    updatePlayer(game);
  }

  // 3. Verificar colisiones con trampas (pinchos, sierras)
  if (game && game.checkTrapCollision && game.checkTrapCollision(player)) {
    handlePlayerDamage(game, "Las cuchillas y pinchos son letales. Observa su patrón.");
  }

  // 4. Verificar colisiones con enemigos (centinelas)
  if (game && game.checkEnemyCollision && game.checkEnemyCollision(player)) {
    handlePlayerDamage(game, "Evita el contacto directo con los centinelas.");
  }

  // 5. Recoger Arenas del Tiempo y Reliquias
  if (game && game.checkCollectibles) {
    const collectedCount = game.checkCollectibles(player);
    if (collectedCount > 0) {
      const addedPoints = collectedCount * 150;
      score += addedPoints;
      levelTimeLeft = Math.min((game.timeLimit || 90), levelTimeLeft + collectedCount * 5); // +5s por cada reliquia
      if (window.soundManager) window.soundManager.play('coin');
      showToast(`+${addedPoints} pts ⌛ +${collectedCount * 5}s`);
      updateHUD(lives, currentLevel, score, levelTimeLeft);
    }
  }

  // 6. Verificar meta / salida del nivel
  if (game && game.checkGoalCollision && game.checkGoalCollision(player)) {
    if (window.soundManager) window.soundManager.play('level_complete');
    currentLevel++;
    loadLevel(currentLevel);
    return;
  }

  // 7. Actualizar posición suave de la cámara
  const canvas = document.getElementById('game-canvas');
  if (canvas && player && game) {
    const targetCamX = player.x + (player.width || 30) / 2 - canvas.width / 2;
    const maxCamX = Math.max(0, (game.width || canvas.width) - canvas.width);
    camera.x = Math.max(0, Math.min(targetCamX, maxCamX));
    camera.y = 0; // En plataformas 2D estilo PoP la cámara horizontal mantiene el suelo nivelado
  }

  // 8. Dibujar escena
  if (canvas && game) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar nivel con desplazamiento de cámara
    game.draw(ctx, camera);

    // Dibujar jugador en el espacio del mundo con la cámara
    if (player && typeof player.draw === 'function') {
      ctx.save();
      ctx.translate(-camera.x, -camera.y);

      // Efecto de parpadeo si es invulnerable tras recibir daño
      if (!isInvincible || Math.floor(invincibilityTimer / 4) % 2 === 0) {
        player.draw(ctx);
      }

      ctx.restore();
    }
  }

  // Actualizar HUD
  updateHUD(lives, currentLevel, score, levelTimeLeft);

  // Solicitar siguiente cuadro
  animationId = requestAnimationFrame(gameLoop);
}

// Iniciar en el menú principal al cargar la página
window.addEventListener('DOMContentLoaded', () => {
  showMainMenu();
});