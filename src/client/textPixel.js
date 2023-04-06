export class TextPixel {
  constructor(pixels, size, projectileAbsorption) {
    this.pixels = pixels;
    this.x = pixels[0].pixelData.x;
    this.y = pixels[0].pixelData.y;
    this.r = pixels[0].pixelData.r;
    this.g = pixels[0].pixelData.g;
    this.b = pixels[0].pixelData.b;
    this.a = pixels[0].pixelData.a;
    this.height = size;
    this.width = size;
    this.render = true;
    this.particles = [];
    this.destroyedTime = 0;
    this.markedForDeletion = false;
    this.type = 'textPixel';
    this.projectileAbsorption = projectileAbsorption;
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

  draw(context, debug = false){
    if(this.render) {
      context.beginPath();
      context.rect(this.x, this.y, this.width, this.height);
      if(debug) {
        context.strokeStyle = this.height === 1 ? 'red' : this.height === 2 ? 'green' : 'blue';
        context.stroke();
      } else {
        context.fillStyle = `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
        context.fill();
      }
    }

    this.particles.map(particle => particle.draw(context));
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
      this.particles.push(new TextPixelParticle({ 
        ...this.pixels[0].pixelData,
        height: this.height,
        width: this.width,
      }));
    }
  }
}


// -----------------------------------------------------------------------------

class TextPixelParticle {
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