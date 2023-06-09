import Victor from 'victor';

// Constants
import { POSSIBLE_FILLS_ENEMY } from '../constants';

// Utils
import { getDistance, keepInBounds } from '../utils';

// Other Entities
import Projectile from './projectile';
import Particle from './particle';

// -----------------------------------------------------------------------------

class Enemy {
  constructor(game) {
    this.game = game;
    this.width = 60;
    this.height = 60;
    this.swidth = 24;
    this.sheight = 24;
    this.image = game.sprites.enemySprite;

    this.maxSpeed = 1;
    this.speedX = 0;
    this.speedY = 0;

    this.x = Math.random() * this.game.width;
    this.y = 0;
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
    this.type = 'enemy';

    this.fireRate = 2000;
    this.lastFired = Math.random() * 1500;
    this.projectileSpeed = 5;
    this.projectileSize = 10;
    this.accuracy = 1;

    this.health = 4;
    this.invulnerable = false;
    this.invulnerableDuration = 100;
    this.invulnerableTime = 0;
    this.render = true;

    this.markedForDeletion = false;
    this.particles = [];
    this.destroyedTime = 0;
    this.projectileAbsorption = 1;

    // this.init();
  }

  // init() {}

  update(deltaTime) {
    if (this.game.gameOver) {
      return;
    }

    if (this.render) {
      const playerX = this.game.player.x;
      const playerY = this.game.player.y;
      const distance = getDistance(playerX, playerY, this.x, this.y);
      this.x += this.speedX;
      this.y += this.speedY;
      if (distance > this.height * 2) {
        const dirX = this.x - playerX;
        const dirY = this.y - playerY;
        const direction = new Victor(dirX, dirY).normalize();
        this.speedX = -this.maxSpeed * direction.x;
        this.speedY = -this.maxSpeed * direction.y;
      } else {
        this.speedX = 0;
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

      if (this.lastFired > this.fireRate) {
        this.lastFired = 0;
        this.fireProjectile();
      } else {
        this.lastFired += deltaTime;
      }

      keepInBounds(this, this.game);
    }

    if (this.particles && this.particles.length) {
      this.particles.forEach((particle) => particle.update());

      // Delay destruction
      this.destroyedTime += deltaTime;
      if (this.destroyedTime > 2000) {
        this.particles = null;
        this.markedForDeletion = true;
      }
    }
  }

  draw(context, deltaTime, debug = false) {
    if (debug) {
      context.fillStyle = 'red';
      context.fillRect(this.x, this.y, this.width, this.height);
    }

    if (this.invulnerable) {
      // context.fillStyle = 'white';
      // context.fillRect(this.x, this.y, this.width, this.height);
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
    const dirX = this.x - this.game.player.x + Math.random() * this.accuracy;
    const dirY = this.y - this.game.player.y + Math.random() * this.accuracy;

    const direction = new Victor(dirX, dirY).normalize();
    const projectile = new Projectile(
      this.game,
      this.projectileSize,
      this.x +
        this.width / 2 -
        this.projectileSize / 2 -
        (direction.x * this.width) / 2,
      this.y +
        this.height / 2 -
        this.projectileSize / 2 -
        (direction.y * this.height) / 2,
      direction.x * -this.projectileSpeed,
      direction.y * -this.projectileSpeed,
      ['player'],
      'enemyProjectile',
      POSSIBLE_FILLS_ENEMY,
    );
    this.game.projectiles.unshift(projectile);
  }

  hit() {
    if (this.invulnerable) {
      return;
    }

    this.health -= 1;
    this.invulnerable = true;

    if (this.health < 0) {
      this.render = false;
      this.game.score += 1;

      for (let x = 0; x < 500; x++) {
        this.particles.push(
          new Particle({
            x: this.x,
            y: this.y,
            r: 255,
            g: 255,
            b: 255,
            a: 1,
            height: 2,
            width: 2,
          }),
        );
      }
    }
  }

  destroy() {
    this.markedForDeletion = true;
  }
}

// -----------------------------------------------------------------------------

export default Enemy;
