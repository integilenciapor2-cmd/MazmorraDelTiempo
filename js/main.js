const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = new Player(50, 200);
const keys = {};

window.addEventListener('keydown', e => keys[e.key] = true);
window.addEventListener('keyup', e => keys[e.key] = false);

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    level1.draw(ctx);
    player.update(keys, level1.platforms);
    player.draw(ctx);

    requestAnimationFrame(gameLoop);
}

gameLoop();