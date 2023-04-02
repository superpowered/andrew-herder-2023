import { isInGameBounds, isRectangularCollision } from "./utils.js";

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
  constructor(game, size, x, y, vx, vy) {
    this.game = game;
    this.size = size;
    this.width = size;
    this.height = size;
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.destroyed = false;
    this.textHit = 0;
    this.color = POSSIBLE_FILLS[Math.floor(Math.random() * POSSIBLE_FILLS.length)];

    // TODO: projectiles will need a list of things they can interact with (and maybe how they ineract with them)
    this.collidesWith = [];
  }

  update(index) {
    this.x += this.vx;
    this.y += this.vy;
    this.checkCollision(index);
    this.checkEdges(index);
  }

  // TODO: i need to actually, uh, implement debug mode
  draw(context, debug = false) {
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.width, this.height);
    if(debug) {
      context.strokeStyle = "red";
      context.rect(this.x, this.y, this.width, this.height);
      context.stroke();
    }
  }

  checkCollision(index){
    // TODO: can we pass it like a list of things it can hit?
    this.game.headerText.textPixels.forEach((pixel, i) => {
      if(
        isRectangularCollision(pixel, this) && 
        pixel.render === true
      ) {
        pixel.destroy();
        if(pixel.r === 255) {
          this.textHit++;
          if(this.textHit > this.size * (this.size / 2)) {
            this.textHit = 0;
            this.destroy(index);
          }
        }
      }
    });
  }

  checkEdges(index) {
    if(isInGameBounds(this, this.game)) {
      this.destroy(index);
    }
  }

  destroy(index) {
    this.destroyed = true;
    // TODO: projectile hsouldn't know about the game
    this.game.projectiles.splice(index, 1);
  }
}