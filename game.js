import { InputHandler } from './input.js';
import { Level0 } from './level0.js';
import { Player } from './player.js';
import { TextSystem } from './textSystem.js';

// -----------------------------------------------------------------------------

export class Game {
  constructor(canvas, context, width, height, dpr) {
    // Initial Game data
    this.width = width;
    this.height = height;
    this.dpr = dpr;

    this.bounds = {
      height,
      width,
    }

    // Changeable Game Data
    this.mousePos = { x: 0, y: 0 };

    // Entities
    this.player = null;
    this.enemies = [];
    this.projectiles = [];
    this.textPixels = [];

    // Systems
    this.input = new InputHandler();
    this.textSystem = new TextSystem(this);

    // Levels
    this.level0 = new Level0(this, context);

    // Initialize our collision items
    this.collisionItems = [
      ...[this.player],
      ...this.enemies,
      ...this.projectiles,
      ...this.textPixels,
    ];

    // Init
    this.init(canvas, context);
  }

  init(canvas) {
    // Add listener to keep mouse position updated
    const rect = canvas.getBoundingClientRect();
    document.addEventListener('mousemove', (e) => {
      this.mousePos = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    });

    // Delay our player for loading effect
    setTimeout(() => {
      this.player = new Player(this);
    }, 1000);
  }

  update(deltaTime) {
    // game, deltaTime, bounds, collisionItems,
    this.player && this.player.update(this.input.keys, deltaTime);
    this.level0.update(deltaTime);

    this.enemies = this.enemies.filter( (enemy) => {
      enemy.update(this, this.bounds);
      return !enemy.markedForDeletion;
    });

    this.textPixels = this.textPixels.filter( pixel => { 
      pixel.update(deltaTime);
      return !pixel.markedForDeletion;
    });

    this.projectiles = this.projectiles.filter( (projectile) => {
      console.log();
      projectile.update(this.bounds, this.collisionItems);
      return !projectile.markedForDeletion;
    });

    // Reupdate the collision items (since we will filter out some)
    this.collisionItems = [
      ...[this.player],
      ...this.enemies,
      ...this.projectiles,
      ...this.textPixels,
    ];
  }

  draw(context, deltaTime) {
    this.player && this.player.draw(context, deltaTime, false, this.dpr);
    this.projectiles.forEach( projectile => projectile.draw(context));
    this.textPixels.forEach( pixel => pixel.draw(context));
  }
}