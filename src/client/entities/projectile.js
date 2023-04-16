// Utils
import { isOutOfGameBounds, isRectangularCollision } from '../utils';

// -----------------------------------------------------------------------------

class Projectile {
  constructor(game, size, x, y, vx, vy, collidesWith, type, fills) {
    this.size = size;
    this.width = size;
    this.height = size;
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.destroyed = false;
    this.textHit = 0;
    this.health = 1;
    this.color = fills[Math.floor(Math.random() * fills.length)];
    this.type = type;

    this.render = true;
    this.markedForDeletion = false;
    this.collidesWith = collidesWith;
  }

  update(bounds, collisionItems) {
    this.x += this.vx;
    this.y += this.vy;
    this.checkCollision(collisionItems);
    this.checkEdges(bounds);
  }

  // TODO: i need to actually, uh, implement debug mode
  draw(context, debug = false) {
    if (this.render) {
      context.fillStyle = this.color;
      context.fillRect(this.x, this.y, this.width, this.height);
    }
    if (debug) {
      context.strokeStyle = 'red';
      context.rect(this.x, this.y, this.width, this.height);
      context.stroke();
    }
  }

  checkCollision(collisionItems) {
    collisionItems.forEach((item) => {
      if (!this.collidesWith.includes(item.type)) {
        return;
      }
      if (isRectangularCollision(item, this) && item.render === true) {
        item.hit();
        this.health -= item.projectileAbsorption;
        if (this.health < 0) {
          this.destroy();
        }
      }
    });
  }

  checkEdges(bounds) {
    if (isOutOfGameBounds(this, bounds)) {
      this.destroy();
    }
  }

  destroy() {
    this.markedForDeletion = true;
  }
}

// -----------------------------------------------------------------------------

export default Projectile;
