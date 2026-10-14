// ============================================================
// UI - INTERFAZ DE USUARIO
// Diseñador: Integrante 3
// Descripción: HUD, menú principal, pantalla de victoria,
// Game Over, menú de pausa, modal de controles y toasts.
// ============================================================

// ----------------------------------------------------------
// HUD (Heads-Up Display)
// ----------------------------------------------------------
function updateHUD(lives, levelNum, score = 0, timeLeft = null) {
  const livesEl = document.getElementById('hud-lives');
  const levelEl = document.getElementById('hud-level');
  const timeEl = document.getElementById('hud-time');
  const scoreEl = document.getElementById('hud-score');

  if (livesEl) {
    const safeLives = Math.max(0, lives);
    livesEl.innerText = '❤️'.repeat(safeLives) || '💀 Sin vidas';
  }

  if (levelEl) {
    levelEl.innerText = 'Nivel ' + levelNum;
  }

  if (scoreEl) {
    scoreEl.innerText = '🪙 ' + score;
  }

  if (timeEl && timeLeft !== null) {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = Math.floor(timeLeft % 60);
    const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    timeEl.innerText = '⏳ ' + formatted;

    if (timeLeft <= 20) {
      timeEl.classList.add('time-urgent');
    } else {
      timeEl.classList.remove('time-urgent');
    }
  }
}

// ----------------------------------------------------------
// MENÚ PRINCIPAL
// ----------------------------------------------------------
function showMainMenu() {
  hideAllScreens();
  const menu = document.getElementById('main-menu');
  if (menu) menu.style.display = 'flex';
}

function hideMainMenu() {
  const menu = document.getElementById('main-menu');
  if (menu) menu.style.display = 'none';
}

// ----------------------------------------------------------
// PANTALLA DE VICTORIA
// ----------------------------------------------------------
function showVictoryScreen(finalScore = 0, livesRemaining = 3) {
  hideAllScreens();
  const victory = document.getElementById('victory-screen');
  const scoreEl = document.getElementById('victory-score');
  const livesEl = document.getElementById('victory-lives');
  const rankEl = document.getElementById('victory-rank');

  if (victory) victory.style.display = 'flex';
  if (scoreEl) scoreEl.innerText = finalScore + ' pts';
  if (livesEl) livesEl.innerText = '❤️'.repeat(Math.max(1, livesRemaining));

  if (rankEl) {
    if (finalScore >= 1800 && livesRemaining === 3) {
      rankEl.innerText = 'S - Maestro del Tiempo';
      rankEl.style.color = '#ffd700';
    } else if (finalScore >= 1200) {
      rankEl.innerText = 'A - Príncipe Valeroso';
      rankEl.style.color = '#00e676';
    } else {
      rankEl.innerText = 'B - Superviviente';
      rankEl.style.color = '#00e5ff';
    }
  }

  if (window.soundManager) window.soundManager.play('victory');
}

// ----------------------------------------------------------
// PANTALLA DE GAME OVER
// ----------------------------------------------------------
function showGameOverScreen(tip = null) {
  hideAllScreens();
  const gameover = document.getElementById('gameover-screen');
  const tipEl = document.getElementById('gameover-tip');

  if (gameover) gameover.style.display = 'flex';
  if (tipEl && tip) tipEl.innerText = `"${tip}"`;

  if (window.soundManager) window.soundManager.play('gameover');
}

// ----------------------------------------------------------
// PANTALLA DE PAUSA
// ----------------------------------------------------------
function showPauseScreen() {
  const pause = document.getElementById('pause-screen');
  if (pause) pause.style.display = 'flex';
}

function hidePauseScreen() {
  const pause = document.getElementById('pause-screen');
  if (pause) pause.style.display = 'none';
}

// ----------------------------------------------------------
// BANNER DE TRANSICIÓN DE NIVEL
// ----------------------------------------------------------
function showLevelTransition(levelTitle, callback) {
  const banner = document.getElementById('level-transition-banner');
  if (!banner) {
    if (callback) callback();
    return;
  }

  banner.innerText = levelTitle.toUpperCase();
  banner.style.display = 'block';
  setTimeout(() => {
    banner.style.opacity = '1';
  }, 20);

  setTimeout(() => {
    banner.style.opacity = '0';
    setTimeout(() => {
      banner.style.display = 'none';
      if (callback) callback();
    }, 400);
  }, 1200);
}

// ----------------------------------------------------------
// OCULTAR TODAS LAS PANTALLAS (para empezar a jugar)
// ----------------------------------------------------------
function hideAllScreens() {
  ['main-menu', 'victory-screen', 'gameover-screen', 'pause-screen', 'controls-modal'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
}

// ----------------------------------------------------------
// MODAL DE CONTROLES
// ----------------------------------------------------------
function showControlsModal() {
  const modal = document.getElementById('controls-modal');
  if (modal) modal.style.display = 'flex';
}

function hideControlsModal() {
  const modal = document.getElementById('controls-modal');
  if (modal) modal.style.display = 'none';
}

// ----------------------------------------------------------
// AUDIO TOGGLE UI
// ----------------------------------------------------------
function updateAudioButtonUI(muted) {
  const btn = document.getElementById('btn-audio');
  if (btn) {
    btn.innerText = muted ? '🔇' : '🔊';
  }
}

// ----------------------------------------------------------
// NOTIFICACIÓN TEMPORAL (Toast)
// ----------------------------------------------------------
function showToast(message, duration = 1400) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.innerText = message;
  toast.style.display = 'block';
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.style.display = 'none';
  }, duration);
}