class Particle {
  constructor(pixel) {
    const { x, y, r, g, b, a, height, width } = pixel;
    this.x = x;
    this.y = y;
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
    this.initialA = a;
    this.height = height;
    this.width = width;
    const plusOrMinusX = Math.random() < 0.5 ? -1 : 1;
    const plusOrMinusY = Math.random() < 0.5 ? -1 : 1;
    this.vx = Math.random() * 2 * plusOrMinusX;
    this.vy = Math.random() * 2 * plusOrMinusY;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.a -= this.initialA * 0.02;
  }

  draw(context) {
    context.beginPath();
    context.fillStyle = `rgba(${this.r}, ${this.b}, ${this.g}, ${this.a})`;
    context.fillRect(this.x, this.y, this.width, this.height);
  }
}

// -----------------------------------------------------------------------------

export default Particle;
