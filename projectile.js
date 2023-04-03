import { isOutOfGameBounds, isRectangularCollision } from "./utils.js";

// -----------------------------------------------------------------------------

const POSSIBLE_FILLS = [
  '#FF5E46',
  '#FFFFFF',
  '#D18CFF',
  '#00FF0F',
  '#F7FF80',
];

// -----------------------------------------------------------------------------

export class Projectile {
  constructor(game, size, x, y, vx, vy, collidesWith, type) {
    this.size = size;
    this.width = size;
    this.height = size;
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.destroyed = false;
    this.textHit = 0;
    this.health = this.size *  (this.size / 2);
    this.color = POSSIBLE_FILLS[Math.floor(Math.random() * POSSIBLE_FILLS.length)];
    this.type = type;

    this.render = true;
    this.markedForDeletion = false;

    // TODO: projectiles will need a list of things they can interact with (and maybe how they ineract with them)
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
    if(this.render) {
      context.fillStyle = this.color;
      context.fillRect(this.x, this.y, this.width, this.height);
    }
    if(debug) {
      context.strokeStyle = "red";
      context.rect(this.x, this.y, this.width, this.height);
      context.stroke();
    }
  }

  checkCollision(collisionItems){
    collisionItems.filter((item) => {
      if(!this.collidesWith.includes(item.type)) {
        return false;
      }
      if(
        isRectangularCollision(item, this) && 
        item.render === true
      ) {
        item.destroy();
        if(item.r === 255) {
          this.health--;
          if(this.health < 0) {
            this.destroy();
          }
        }
      }
    });
  }

  checkEdges(bounds) {
    if(isOutOfGameBounds(this, bounds)) {
      this.destroy();
    }
  }

  destroy() {
    this.markedForDeletion = true;
  }
}