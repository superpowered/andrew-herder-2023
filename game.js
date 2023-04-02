import { InputHandler } from './input.js';
import { HeaderText } from './headerText.js';
import { Player } from './player.js';
import { TextSystem } from './textSystem.js';

// -----------------------------------------------------------------------------

export class Game {
  constructor(canvas, context, width, height, dpr) {
    // Initial Game data
    this.width = width;
    this.height = height;
    this.dpr = dpr;

    // Changeable Game Data
    this.mousePos = { x: 0, y: 0 };

    // Entities
    this.player = null;
    this.projectiles = [];

    // Systems
    this.input = new InputHandler();
    this.textSystem = new TextSystem(this);

    // Levels
    this.headerText = new HeaderText(this, context);

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
    this.player && this.player.update(this.input.keys, deltaTime);
    this.headerText.update(deltaTime);

    // TODO: projectiles in own system
    this.projectiles.forEach( (projectile, i) => projectile.update(i));
  }

  draw(context, deltaTime) {
    this.player && this.player.draw(context, deltaTime, false, this.dpr);
    this.headerText.draw(context);

    // TODO: projectiles in own system
    this.projectiles.forEach( projectile => projectile.draw(context));
  }
}