// main.js
let currentLevel = 1;
let lives = 3;
let score = 0;
let game;

function startGame() {
  hideAllScreens();
  lives = 3;
  score = 0;
  currentLevel = 1;
  loadLevel(currentLevel);
}

function restartGame() {
  startGame();
}

function loadLevel(num) {
  if (num === 1) game = level1;
  else if (num === 2) game = level2;
  else if (num === 3) game = level3;
  else {
    // ¡Victoria!
    showVictoryScreen(score);
    return;
  }

  // Resetear jugador
  player.x = game.spawn.x;
  player.y = game.spawn.y;
  player.vx = 0;
  player.vy = 0;

  updateHUD(lives, num, score);
}

function gameLoop() {
  // Actualizar nivel (plataformas móviles, trampas, enemigos)
  if (game.update) game.update();

  // Actualizar jugador
  updatePlayer(game);

  // Verificar colisiones
  if (game.checkTrapCollision && game.checkTrapCollision(player)) {
    lives--;
    if (lives <= 0) {
      showGameOverScreen();
      return;
    } else {
      // Reaparecer
      player.x = game.spawn.x;
      player.y = game.spawn.y;
      updateHUD(lives, currentLevel, score);
    }
  }

  if (game.checkEnemyCollision && game.checkEnemyCollision(player)) {
    lives--;
    if (lives <= 0) {
      showGameOverScreen();
      return;
    } else {
      player.x = game.spawn.x;
      player.y = game.spawn.y;
      updateHUD(lives, currentLevel, score);
    }
  }

  // Recoger monedas
  if (game.checkCollectibles) {
    const collected = game.checkCollectibles(player);
    if (collected > 0) {
      score += collected * 100;
      showToast('+' + (collected * 100) + ' puntos');
      updateHUD(lives, currentLevel, score);
    }
  }

  // Verificar meta
  if (game.checkGoalCollision && game.checkGoalCollision(player)) {
    currentLevel++;
    loadLevel(currentLevel);
  }

  // Dibujar
  const ctx = document.getElementById('game-canvas').getContext('2d');
  game.draw(ctx);

  requestAnimationFrame(gameLoop);
}

// Iniciar en el menú
showMainMenu();