import { InputHandler } from './input.js';
import { Level0 } from './level0.js';
import { Level1 } from './level1.js';
import { Player } from './player.js';
import { TextSystem } from './textSystem.js';

// -----------------------------------------------------------------------------

export class Game {
  constructor(canvas, context, width, height, dpr) {
    // Initial Game data
    this.width = width;
    this.height = height;
    this.dpr = dpr;

    this.context = context;
    this.canvas = canvas;

    this.bounds = {
      height,
      width,
    }

    this.score = 0;
    this.lastScore = null;
    this.scoreElement = Array.from(document.getElementsByClassName('score-counter'));
    this.gameOver = false;

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
    this.lastLevel = null;
    this.level = 0;
    this.levels = [
      new Level0(this, context),
      new Level1(this, context),
    ];

    // Initialize our collision items
    this.collisionItems = [
      ...[this.player],
      ...this.enemies,
      ...this.projectiles,
      ...this.textPixels,
    ];

    // Init
    this.init(canvas);
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
    // Player
    this.player && this.player.update(this.input.keys, deltaTime);

    // Level
    if(this.lastLevel !== this.level) {
      this.lastLevel = this.level;
      this.levels[this.level].init(this, this.context);
    }
    if(this.levels[this.level] && this.levels[this.level].initialized) {
      this.levels[this.level].update(deltaTime);
    }

    this.enemies = this.enemies.filter( (enemy) => {
      enemy.update(deltaTime);
      return !enemy.markedForDeletion;
    });

    this.textPixels = this.textPixels.filter( pixel => { 
      pixel.update(deltaTime);
      return !pixel.markedForDeletion;
    });

    this.projectiles = this.projectiles.filter( (projectile) => {
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


    if(this.score !== this.lastScore) {
      this.lastScore = this.score;
      this.scoreElement.forEach(el => {
        el.innerText = this.score;
      });
    }
  }

  draw(context, deltaTime) {
    this.player && this.player.draw(context, deltaTime, false, this.dpr);
    this.enemies.forEach( enemy => enemy.draw(context, deltaTime, false, this.dpr));
    this.projectiles.forEach( projectile => projectile.draw(context));
    this.textPixels.forEach( pixel => pixel.draw(context));
  }
}