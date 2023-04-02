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
  }

  update(index) {
    this.x += this.vx;
    this.y += this.vy;
    this.checkCollision(index);
    this.checkEdges(index);
  }

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
    this.game.headerText.textPixels.forEach((enemy, i) => {
      if(
        enemy.x < this.x + this.width &&
        enemy.x + enemy.width > this.x &&
        enemy.y < this.y + this.height &&
        enemy.y + enemy.height > this.y && 
        enemy.render === true
      ) {
        enemy.destroy();
        if(enemy.r === 255) {
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
    if(this.x > this.game.width || this.x + this.width < 0 || this.y > this.game.height || this.y + this.height < 0) {
      this.destroy(index);
    }
  }

  destroy(index) {
    this.destroyed = true;
    this.game.projectiles.splice(index, 1);
  }
}