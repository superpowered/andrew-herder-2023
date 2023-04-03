import { keepInBounds } from './utils.js';
import { CONTROLS } from './input.js';
import { Projectile } from "./projectile.js";

// -----------------------------------------------------------------------------
export class Player {
  constructor(game) {
    this.game = game;
    this.width = 60;
    this.height = 60;
    this.swidth = 24;
    this.sheight = 24;
    this.image = document.getElementById('player');
    this.type = 'player';

    this.maxSpeed = 3;
    this.speedX = 0;
    this.speedY = 0;

    this.x = (this.game.bounds.width / 2) - (this.width / 2);
    this.y = (this.game.bounds.height / 2) - (this.height / 2);
    // TODO: convert positions on all things to use a position compoosed class
    this.hasPosition = {
      x: 'TODO',
      y: 'TODO',
    };
    this.hasSize = {
      height: 'TODO',
      width: 'TODO',
    };

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
    this.controllable = false;

    this.init();
  }

  init() {
    this.y = this.spawnY - 30;
  }

  update(inputKeys, deltaTime) {
    if(!this.controllable) {
      if(this.y !== this.spawnY) {
        this.y += 5;
      } else {
        this.controllable = true;
      }
      return;
    }

    // Handle L R Movement
    this.x += this.speedX;
    if(inputKeys.includes(CONTROLS.RIGHT)) {
      this.speedX = this.maxSpeed;
      this.facing = 'r';
    } else if(inputKeys.includes(CONTROLS.LEFT)) {
      this.speedX = -this.maxSpeed;
      this.facing = 'l';
    } else {
      this.speedX = 0;
    } 

    // Handle U D Movement
    this.y += this.speedY;
    if(inputKeys.includes(CONTROLS.UP)) {
      this.speedY = -this.maxSpeed;
      this.facing = 'u';
    } else if(inputKeys.includes(CONTROLS.DOWN)) {
      this.speedY = this.maxSpeed;
      this.facing = 'd';
    } else {
      this.speedY = 0;
    } 

    if(inputKeys.includes(CONTROLS.SHOOT) && this.lastFired > this.fireRate ) {
      this.lastFired = 0;
      this.fireProjectile();
    } else {
      this.lastFired += deltaTime;
    }

    keepInBounds(this, this.game.bounds);
    
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
      direction.y * - this.projectileSpeed,
      ['textPixel', 'enemy'],
      'playerProjectile',
    );
    this.game.projectiles.unshift(projectile);
  }

  checkCollisions() {
    // TODO
  }
}