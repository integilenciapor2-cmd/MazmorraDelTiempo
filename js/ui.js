// ============================================================
// UI - Interfaz de Usuario
// Diseñador: Integrante 3
// Descripción: HUD, menú principal, pantalla de victoria y Game Over.
// ============================================================

// ----------------------------------------------------------
// HUD (Heads-Up Display)
// ----------------------------------------------------------
function updateHUD(lives, levelNum, score = 0, time = null) {
  const livesEl = document.getElementById('score');
  const levelEl = document.getElementById('level-title');
  const timeEl = document.getElementById('time');

  if (livesEl) livesEl.innerText = 'Vidas: ' + '❤️'.repeat(Math.max(0, lives));
  if (levelEl) levelEl.innerText = 'Nivel: ' + levelNum;
  if (timeEl && time !== null) timeEl.innerText = 'Tiempo: ' + time + 's';
}

// ----------------------------------------------------------
// MENÚ PRINCIPAL
// ----------------------------------------------------------
function showMainMenu() {
  const menu = document.getElementById('main-menu');
  const canvas = document.getElementById('game-canvas');
  const victory = document.getElementById('victory-screen');
  const gameover = document.getElementById('gameover-screen');

  if (menu) menu.style.display = 'flex';
  if (canvas) canvas.style.display = 'none';
  if (victory) victory.style.display = 'none';
  if (gameover) gameover.style.display = 'none';
}

function hideMainMenu() {
  const menu = document.getElementById('main-menu');
  if (menu) menu.style.display = 'none';
}

// ----------------------------------------------------------
// PANTALLA DE VICTORIA
// ----------------------------------------------------------
function showVictoryScreen(finalScore = 0) {
  const victory = document.getElementById('victory-screen');
  const canvas = document.getElementById('game-canvas');
  const scoreEl = document.getElementById('final-score');

  if (victory) victory.style.display = 'flex';
  if (canvas) canvas.style.display = 'none';
  if (scoreEl) scoreEl.innerText = 'Puntuación final: ' + finalScore;
}

// ----------------------------------------------------------
// PANTALLA DE GAME OVER
// ----------------------------------------------------------
function showGameOverScreen() {
  const gameover = document.getElementById('gameover-screen');
  const canvas = document.getElementById('game-canvas');

  if (gameover) gameover.style.display = 'flex';
  if (canvas) canvas.style.display = 'none';
}

// ----------------------------------------------------------
// OCULTAR TODAS LAS PANTALLAS (para empezar a jugar)
// ----------------------------------------------------------
function hideAllScreens() {
  ['main-menu', 'victory-screen', 'gameover-screen'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  const canvas = document.getElementById('game-canvas');
  if (canvas) canvas.style.display = 'block';
}

// ----------------------------------------------------------
// NOTIFICACIÓN TEMPORAL (para recoger monedas, etc.)
// ----------------------------------------------------------
function showToast(message, duration = 1500) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.style.position = 'absolute';
    toast.style.top = '20px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.background = 'rgba(0,0,0,0.8)';
    toast.style.color = '#fff';
    toast.style.padding = '10px 20px';
    toast.style.borderRadius = '8px';
    toast.style.fontFamily = 'Arial, sans-serif';
    toast.style.zIndex = '1000';
    document.body.appendChild(toast);
  }
  toast.innerText = message;
  toast.style.display = 'block';
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.style.display = 'none';
  }, duration);
}