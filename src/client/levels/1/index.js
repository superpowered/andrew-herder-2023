// Entities
import { Enemy } from '../../entities';

// Data
import levelData from './data';

// -----------------------------------------------------------------------------

class Level {
  constructor(game) {
    this.game = game;

    this.levelData = levelData;
    this.events = [];
    this.lastSpawned = 0;
    this.spawnRate = 2000;
  }

  init = () => {
    // register our events
    this.events = this.levelData.events(this).map((event) => event);
    this.initialized = true;
    this.game.scoreElement.forEach((el) => {
      el.classList.add('active');
    });
  };

  update(deltaTime) {
    // Loop through our level events and do things as needed
    this.events.forEach((event) => {
      if (!event.triggered && event.trigger(this)) {
        event.triggered = true;
        event.action(this);
      }
    });

    if (this.game.gameOver) {
      return;
    }

    if (this.game.enemies.length < 100 && this.lastSpawned > this.spawnRate) {
      this.lastSpawned = 0;
      const enemy = new Enemy(this.game);
      this.game.enemies.unshift(enemy);
    } else {
      this.lastSpawned += deltaTime;
    }
  }

  // We'll fire this to make sure we've cleaned up anything we may have left behind accidentally
  unload() {
    delete this;
  }
}

// -----------------------------------------------------------------------------

export default Level;
