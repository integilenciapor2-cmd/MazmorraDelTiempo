function updateHUD(lives, levelNum) {
    document.getElementById('score').innerText = 'Vidas: ' + '❤️'.repeat(lives);
    document.getElementById('level-title').innerText = 'Nivel: ' + levelNum;
}