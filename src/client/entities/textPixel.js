// Other Entities
import Particle from './particle';

// -----------------------------------------------------------------------------

class TextPixel {
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
    if (this.particles && this.particles.length) {
      this.particles.forEach((particle) => particle.update());

      // Delay destruction
      this.destroyedTime += deltaTime;
      if (this.destroyedTime > 500) {
        this.particles = null;
        this.markedForDeletion = true;
      }
    }
  }

  draw(context, deltaTime, debug = false) {
    if (this.render) {
      context.beginPath();
      context.rect(this.x, this.y, this.width, this.height);
      if (debug) {
        if (this.height > 2) {
          context.strokeStyle = 'green';
        } else if (this.height > 1) {
          context.strokeStyle = 'blue';
        } else {
          context.strokeStyle = 'red';
        }
        context.stroke();
      } else {
        context.fillStyle = `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
        context.fill();
      }
    }

    this.particles.map((particle) => particle.draw(context));
  }

  hit() {
    this.destroy();
  }

  destroy(massDestroy = false) {
    if (!this.render) {
      return;
    }
    this.render = false;

    for (let x = 0; x < (massDestroy ? 1 : 5); x++) {
      this.particles.push(
        new Particle({
          ...this.pixels[0].pixelData,
          height: this.height,
          width: this.width,
        }),
      );
    }
  }
}

// -----------------------------------------------------------------------------

export default TextPixel;
