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
    this.projectileAbsorption = .125;
    // this.projectileAbsorption = 1;
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
      //context.beginPath();
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

export class BigTextPixel {
  constructor(pixels) {
    // const { x, y, r, g, b, a } = pixel;
    this.pixels = pixels;
    this.x = pixels[0].pixelData.x;
    this.y = pixels[0].pixelData.y;
    // this.r = r;
    // this.g = g;
    // this.b = b;
    // this.a = a;
    // this.height = 3;
    // this.width = 3;
    this.height = 2;
    this.width = 2;
    this.render = true;
    this.particles = [];
    this.destroyedTime = 0;
    this.markedForDeletion = false;
    this.type = 'textPixel';
    this.projectileAbsorption = .5;
    // this.myPixels = pixels.filter(pixel => pixel.hasData && pixel.pixelData.a).map(pixel => new TextPixel(pixel.pixelData));
    // this.myPixels = pixels.filter(pixel => pixel.hasData && pixel.pixelData.a);
    // this.myPixels = pixels.filter(pixel => pixel.hasData);
    this.myPixels = pixels
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
      // for(let i = 0; i < this.myPixels.length; i++) {
      //   context.beginPath();
      //   // this.myPixels[i].draw(context)
      //   context.fillStyle = `rgba(${this.myPixels[i].pixelData.r}, ${this.myPixels[i].pixelData.g}, ${this.myPixels[i].pixelData.b}, ${this.myPixels[i].pixelData.a})`;
      //   context.fillRect(this.myPixels[i].pixelData.x, this.myPixels[i].pixelData.y, 1, 1);
      //   // context.rect(this.myPixels[i].pixelData.x, this.myPixels[i].pixelData.y, 1, 1);
      //   // context.strokeStyle = `rgba(${this.myPixels[i].pixelData.r}, ${this.myPixels[i].pixelData.g}, ${this.myPixels[i].pixelData.b}, ${this.myPixels[i].pixelData.a})`;
      //   // context.stroke();
      // }
      // context.beginPath();
      context.fillStyle = `rgba(${this.myPixels[0].pixelData.r}, ${this.myPixels[0].pixelData.g}, ${this.myPixels[0].pixelData.b}, ${this.myPixels[0].pixelData.a})`;
      // context.fillStyle = `red`;
      context.fillRect(this.x, this.y, this.width, this.height);
      // context.rect(this.x + 1, this.y + 1, this.width - 2, this.height - 2);
      // context.strokeStyle = 'white';
      // context.stroke();

      // this.myPixels.map(pixel  => pixel.draw(context));
      // context.beginPath();
      // context.fillStyle = `rgba(255, 255, 255, 1)`;
      // context.fillRect(this.x, this.y, this.width, this.height);
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
      this.particles.push(new TextPixelParticle(this.myPixels[0].pixelData));
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