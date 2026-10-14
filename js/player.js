class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 48;
        this.vx = 0;
        this.vy = 0;
        this.speed = 4;
        this.gravity = 0.5;
        this.jumpPower = -11;
        this.isGrounded = false;
        this.lives = 3;
        this.facingRight = true;
    }

    update(keys, platforms) {
        if (keys['ArrowRight'] || keys['d']) { this.vx = this.speed; this.facingRight = true; }
        else if (keys['ArrowLeft'] || keys['a']) { this.vx = -this.speed; this.facingRight = false; }
        else { this.vx = 0; }

        if ((keys['ArrowUp'] || keys['w'] || keys[' ']) && this.isGrounded) {
            this.vy = this.jumpPower;
            this.isGrounded = false;
        }

        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;

        this.isGrounded = false;
        platforms.forEach(p => {
            if (this.x < p.x + p.w && this.x + this.width > p.x &&
                this.y + this.height > p.y && this.y + this.height < p.y + p.h + this.vy) {
                this.y = p.y - this.height;
                this.vy = 0;
                this.isGrounded = true;
            }
        });
    }

    draw(ctx) {
        // Sprite 2D estilizado del Príncipe
        ctx.fillStyle = '#4a2e18'; ctx.fillRect(this.x + 6, this.y, 18, 12); // Pelo
        ctx.fillStyle = '#ffdbac'; ctx.fillRect(this.x + 8, this.y + 4, 14, 10); // Cara
        ctx.fillStyle = '#f0f0f0'; ctx.fillRect(this.x + 6, this.y + 14, 18, 18); // Camisa
        ctx.fillStyle = '#1e3d59'; ctx.fillRect(this.x + 4, this.y + 14, 6, 18); // Chaleco
        ctx.fillStyle = '#e74c3c'; ctx.fillRect(this.x + 4, this.y + 32, 22, 5); // Faja roja
        ctx.fillStyle = '#f5f5dc'; ctx.fillRect(this.x + 6, this.y + 37, 18, 11); // Pantalón
    }
}