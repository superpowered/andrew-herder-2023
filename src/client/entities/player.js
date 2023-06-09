import Victor from 'victor';

// Constants
import { CONTROLS, POSSIBLE_FILLS_PLAYER } from '../constants';

// Utils
import { keepInBounds, shakeScreen } from '../utils';

// Other Entities
import Projectile from './projectile';
import Particle from './particle';

// -----------------------------------------------------------------------------
class Player {
  constructor(game) {
    this.game = game;
    this.width = 60;
    this.height = 60;
    this.swidth = 24;
    this.sheight = 24;
    this.image = game.sprites.playerSprite;
    this.type = 'player';

    this.maxSpeed = 3;
    this.speedX = 0;
    this.speedY = 0;

    this.x = this.game.bounds.width / 2 - this.width / 2;
    this.y = this.game.bounds.height / 2 - this.height / 2;
    this.spawnY = this.y;
    this.weight = 1;

    // TODO: need an animation class / state machine
    this.idleFrame = 0;
    setInterval(() => {
      this.idleFrame += 1;
      if (this.idleFrame > 3) {
        this.idleFrame = 0;
      }
    }, 200);

    this.facing = 'r';

    this.fireRate = 120;
    this.lastFired = 0;
    this.projectileSpeed = 5;
    this.projectileSize = 10;
    this.controllable = false;

    this.health = 4;
    this.invulnerable = false;
    this.invulnerableDuration = 100;
    this.invulnerableTime = 0;
    this.render = true;

    this.markedForDeletion = false;
    this.particles = [];
    this.destroyedTime = 0;
    this.projectileAbsorption = 1;

    this.init();
  }

  init() {
    this.y = this.spawnY - 30;
  }

  update(inputKeys, deltaTime) {
    if (this.markedForDeletion) {
      return;
    }

    if (this.game.gameOver) {
      return;
    }

    if (!this.controllable) {
      if (this.y !== this.spawnY) {
        this.y += 5;
      } else {
        this.controllable = true;
      }
      return;
    }

    // Handle L R Movement
    this.x += this.speedX;
    if (inputKeys.includes(CONTROLS.RIGHT)) {
      this.speedX = this.maxSpeed;
      this.facing = 'r';
    } else if (inputKeys.includes(CONTROLS.LEFT)) {
      this.speedX = -this.maxSpeed;
      this.facing = 'l';
    } else {
      this.speedX = 0;
    }

    // Handle U D Movement
    this.y += this.speedY;
    if (inputKeys.includes(CONTROLS.UP)) {
      this.speedY = -this.maxSpeed;
      this.facing = 'u';
    } else if (inputKeys.includes(CONTROLS.DOWN)) {
      this.speedY = this.maxSpeed;
      this.facing = 'd';
    } else {
      this.speedY = 0;
    }

    if (
      this.invulnerable &&
      this.invulnerableTime > this.invulnerableDuration
    ) {
      this.invulnerable = false;
      this.invulnerableTime = 0;
    } else {
      this.invulnerableTime += deltaTime;
    }

    if (
      inputKeys.includes(CONTROLS.SHOOT) &&
      this.lastFired > this.fireRate &&
      this.render
    ) {
      this.lastFired = 0;
      this.fireProjectile();
    } else {
      this.lastFired += deltaTime;
    }

    keepInBounds(this, this.game.bounds);

    // this.checkCollisions();

    if (this.particles && this.particles.length) {
      this.particles.forEach((particle) => particle.update());

      // Delay destruction
      this.destroyedTime += deltaTime;
      if (this.destroyedTime > 1000) {
        this.particles = null;
        this.destroy();
      }
    }
  }

  draw(context, deltaTime, debug = false) {
    if (debug) {
      context.fillStyle = 'red';
      context.fillRect(this.x, this.y, this.width, this.height);
    }
    if (this.render) {
      context.drawImage(
        this.image,
        this.idleFrame * this.swidth,
        0,
        this.sheight,
        this.swidth,
        this.x,
        this.y,
        this.width,
        this.height,
      );
    }

    if (this.particles) {
      this.particles.forEach((particle) => particle.draw(context));
    }
  }

  fireProjectile() {
    const dirX = this.x - this.game.mousePos.x;
    const dirY = this.y - this.game.mousePos.y;
    const distanceFromCenter = 0.25;

    const direction = new Victor(dirX, dirY).normalize();
    const projectile = new Projectile(
      this.game,
      this.projectileSize,
      this.x +
        this.width / 2 -
        this.projectileSize / 2 -
        direction.x * this.width * distanceFromCenter,
      this.y +
        this.height / 2 -
        this.projectileSize / 2 -
        direction.y * this.height * distanceFromCenter,
      direction.x * -this.projectileSpeed,
      direction.y * -this.projectileSpeed,
      ['textPixel', 'enemy'],
      'playerProjectile',
      POSSIBLE_FILLS_PLAYER,
    );
    this.game.projectiles.unshift(projectile);
  }

  hit() {
    if (this.invulnerable) {
      return;
    }

    this.health -= 1;
    this.invulnerable = true;
    shakeScreen();

    if (this.health < 0) {
      this.render = false;
      for (let x = 0; x < 500; x++) {
        this.particles.push(
          new Particle({
            x: this.x,
            y: this.y,
            r: 255,
            g: 255,
            b: 255,
            a: 1,
            height: 4,
            width: 4,
          }),
        );
      }
    }
  }

  destroy() {
    this.markedForDeletion = true;
    this.game.gameOver = true;
  }

  // checkCollisions() {}
}

// -----------------------------------------------------------------------------

export default Player;
