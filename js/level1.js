const level1 = {
    platforms: [
        { x: 0, y: 360, w: 800, h: 40 },
        { x: 200, y: 280, w: 120, h: 20 },
        { x: 400, y: 200, w: 120, h: 20 }
    ],
    draw(ctx) {
        ctx.fillStyle = '#8b5a2b';
        this.platforms.forEach(p => ctx.fillRect(p.x, p.y, p.w, p.h));
    }
};