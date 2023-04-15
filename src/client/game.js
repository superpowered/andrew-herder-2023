// Levels
import { Level0, Level1 } from './levels';

// Entities
import { Player } from './entities';

// Systems
import { InputSystem, TextSystem } from './systems';

// -----------------------------------------------------------------------------

class Game {
  constructor(sprites, canvas, context, width, height, dpr) {
    // Constraints
    this.width = width;
    this.height = height;
    this.bounds = {
      height,
      width,
    };

    // Load items
    this.dpr = dpr;
    this.sprites = sprites;
    this.canvas = canvas;

    // Score
    this.score = 0;
    this.lastScore = null;
    this.scoreElement = Array.from(
      document.getElementsByClassName('score-counter'),
    );
    this.gameOver = false;

    // Changeable Game Data
    this.mousePos = { x: 0, y: 0 };
    this.isTouch = false;

    // Entities
    this.player = null;
    this.enemies = [];
    this.projectiles = [];
    this.textPixels = [];

    // Systems
    this.inputSystem = new InputSystem(this);
    this.textSystem = new TextSystem(this);

    // Levels
    this.lastLevel = null;
    this.level = 0;
    this.levels = [new Level0(this, context), new Level1(this, context)];

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
      if (!this.isTouch) {
        this.mousePos = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };
      }
    });

    // Delay our player for loading effect
    setTimeout(() => {
      this.player = new Player(this);
    }, 1000);
  }

  update(context, deltaTime) {
    // Player
    if (this.player) {
      this.player.update(this.inputSystem.keys, deltaTime);
    }

    // Mobile fix
    if (this.isTouch) {
      this.mousePos = {
        x: this.player.x,
        y: this.player.y - this.player.height,
      };
    }

    // Level
    if (this.lastLevel !== this.level) {
      this.lastLevel = this.level;
      this.levels[this.level].init(this, context);
    }
    if (this.levels[this.level] && this.levels[this.level].initialized) {
      this.levels[this.level].update(deltaTime);
    }

    // Enemies
    this.enemies = this.enemies.filter((enemy) => {
      enemy.update(deltaTime);
      return !enemy.markedForDeletion;
    });

    // Text Pixels (TODO: should these just be lumped in with enemies?)
    this.textPixels = this.textPixels.filter((pixel) => {
      pixel.update(deltaTime);
      return !pixel.markedForDeletion;
    });

    // Projectiles
    this.projectiles = this.projectiles.filter((projectile) => {
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

    // Score Updater
    if (this.score !== this.lastScore) {
      this.lastScore = this.score;
      this.scoreElement.forEach((el) => {
        el.innerText = this.score;
      });
    }
  }

  draw(context, deltaTime) {
    if (this.player) {
      this.player.draw(context, deltaTime, false, this.dpr);
    }
    this.enemies.forEach((enemy) =>
      enemy.draw(context, deltaTime, false, this.dpr),
    );
    this.projectiles.forEach((projectile) => projectile.draw(context));
    this.textPixels.forEach((pixel) => pixel.draw(context));
  }
}

// -----------------------------------------------------------------------------

export default Game;
