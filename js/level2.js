const level2 = {
    platforms: [
        { x: 0, y: 360, w: 300, h: 40 },
        { x: 400, y: 360, w: 400, h: 40 },
        { x: 250, y: 250, w: 100, h: 20 }
    ],
    draw(ctx) {
        ctx.fillStyle = '#555555';
        this.platforms.forEach(p => ctx.fillRect(p.x, p.y, p.w, p.h));
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(300, 380, 100, 20); // Trampa de pinchos
    }
};