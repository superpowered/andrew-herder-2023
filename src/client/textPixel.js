export class TextPixel {
  constructor(pixel) {
    const { x, y, r, g, b, a } = pixel;
    this.x = x;
    this.y = y;
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
    this.height = 1;
    this.width = 1;
    this.render = true;
    this.particles = [];
    this.destroyedTime = 0;
    this.markedForDeletion = false;
    this.type = 'textPixel';
    this.projectileAbsorption = .02;
  }

  update(deltaTime) {
    if(this.particles && this.particles.length) {
      this.particles.forEach(particle => particle.update());

      // Delay destruction
      this.destroyedTime += deltaTime;
      if(this.destroyedTime > 500) {
        this.particles = null;
        this.markedForDeletion = true;
      }
    }
  }

  draw(context){
    if(this.render) {
      context.beginPath();
      context.fillStyle = `rgba(${this.r}, ${this.b}, ${this.g}, ${this.a})`;
      context.fillRect(this.x, this.y, this.width, this.height);
    }
    if(this.particles) {
      this.particles.forEach(particle => particle.draw(context));
    }
  }

  hit() {
    this.destroy();
  }

  destroy(massDestroy = false) {
    if(!this.render) {
      return;
    }
    this.render = false;

    for(let x = 0; x < (massDestroy ? 1 : 5); x++) {
      this.particles.push(new TextPixelParticle(this));
    }
  }
}

// -----------------------------------------------------------------------------

class TextPixelParticle {
  constructor(pixel) {
    const { x, y, r, g, b, a, height, width} = pixel;
    this.x = x;
    this.y = y;
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
    this.initialA = a;
    this.height = height;
    this.width = width;
    var plusOrMinusX = Math.random() < 0.5 ? -1 : 1;
    this.vx = Math.random() * 1.5 * plusOrMinusX;
    this.vy = Math.random() * 2;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.a -= this.initialA * .04;
  }

  draw(context) {
    context.beginPath();
    context.fillStyle = `rgba(${this.r}, ${this.b}, ${this.g}, ${this.a})`;
    context.fillRect(this.x, this.y, this.width, this.height);
  }
}