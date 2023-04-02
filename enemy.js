import { keepInBounds } from './utils.js';
import { Projectile } from "./projectile.js";

// -----------------------------------------------------------------------------
export class Enemy {
  constructor(game) {
    this.game = game;
    this.width = 60;
    this.height = 60;
    this.swidth = 24;
    this.sheight = 24;
    this.image = document.getElementById('enemy');

    this.maxSpeed = 3;
    this.speedX = 0;
    this.speedY = 0;

    this.x = (this.game.width / 2) - (this.width / 2);
    this.y = (this.game.height / 2) - (this.height / 2);
    this.spawnY = this.y;
    this.weight = 1;

    // TODO:
    this.idleFrame = 0;
    setInterval(() => {
      this.idleFrame++;
      if(this.idleFrame > 3) {
        this.idleFrame = 0;
      }
    }, 200);

    this.facing = 'r';

    this.fireRate = 120;
    this.lastFired = 0;
    this.projectileSpeed = 5;
    this.projectileSize = 10;

    this.init();
  }

  init() {
    
  }

  update(deltaTime) {

    // Handle L R Movement
    // this.x += this.speedX;
    // if(inputKeys.includes(CONTROLS.RIGHT)) {
    //   this.speedX = this.maxSpeed;
    //   this.facing = 'r';
    // } else if(inputKeys.includes(CONTROLS.LEFT)) {
    //   this.speedX = -this.maxSpeed;
    //   this.facing = 'l';
    // } else {
    //   this.speedX = 0;
    // } 

    // // Handle U D Movement
    // this.y += this.speedY;
    // if(inputKeys.includes(CONTROLS.UP)) {
    //   this.speedY = -this.maxSpeed;
    //   this.facing = 'u';
    // } else if(inputKeys.includes(CONTROLS.DOWN)) {
    //   this.speedY = this.maxSpeed;
    //   this.facing = 'd';
    // } else {
    //   this.speedY = 0;
    // } 

    // if(inputKeys.includes(CONTROLS.SHOOT) && this.lastFired > this.fireRate ) {
    //   this.lastFired = 0;
    //   this.fireProjectile();
    // } else {
    //   this.lastFired += deltaTime;
    // }
  
    keepInBounds(this, this.game);
    
    this.checkCollisions();
  }

  draw(context, deltaTime, debug = true) {
    if(debug) {
      context.fillStyle = 'red';
      context.fillRect(this.x, this.y, this.width, this.height);
    }
    context.drawImage(this.image, this.idleFrame * this.swidth, 0, this.sheight, this.swidth, this.x, this.y, this.width, this.height);
  }

  fireProjectile() {
    const dirX = this.x - this.game.mousePos.x;
    const dirY = this.y - this.game.mousePos.y;

    const direction = new Victor(dirX,dirY).normalize();
    const projectile = new Projectile(
      this.game, 
      this.projectileSize,
      this.x + this.width / 2 - this.projectileSize / 2 - direction.x * this.width / 2, 
      this.y + this.height / 2 - this.projectileSize / 2 - direction.y * this.height / 2,
      direction.x * - this.projectileSpeed, 
      direction.y * - this.projectileSpeed
    );
    this.game.enemyProjectiles.unshift(projectile);
  }

  checkCollisions() {
    // TODO
  }
}