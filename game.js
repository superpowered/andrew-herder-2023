import { InputHandler } from './input.js';
import { HeaderText } from './headerText.js';
import { Player } from './player.js';
import { TextSystem } from './textSystem.js';

// -----------------------------------------------------------------------------

export class Game {
  constructor(canvas, context, width, height, dpr) {
    this.level = 0;
    this.width = width;
    this.height = height;
    this.player = null;
    this.input = new InputHandler();
    this.headerText = new HeaderText(this);
    this.textSystem = new TextSystem(this);
    this.events = [];
    this.textPixels = [];
    this.projectiles = [];
    this.mousePos = { x: 0, y: 0 };
    this.dpr = dpr;

    this.init(canvas, context);
  }

  init(canvas, context) {
    this.headerText.init(context);
    const rect = canvas.getBoundingClientRect();
    document.addEventListener('mousemove', (e) => {
      this.mousePos = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    });

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

    // TODO: projectiles in own system
    this.projectiles.forEach( projectile => projectile.draw(context));
    this.headerText.draw(context);
  }
}