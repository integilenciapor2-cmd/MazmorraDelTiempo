const level3 = {
    platforms: [
        { x: 0, y: 360, w: 200, h: 40 },
        { x: 250, y: 280, w: 80, h: 20 },
        { x: 380, y: 200, w: 80, h: 20 },
        { x: 520, y: 120, w: 180, h: 20 }
    ],
    draw(ctx) {
        ctx.fillStyle = '#4a154b';
        this.platforms.forEach(p => ctx.fillRect(p.x, p.y, p.w, p.h));
    }
};