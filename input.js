const KEY_MAP = {
  arrowdown: 'DOWN',
  arrowup: 'UP',
  arrowleft: 'LEFT',
  arrowright: 'RIGHT',
  w: 'UP',
  a: 'LEFT',
  s: 'DOWN',
  d: 'RIGHT',
  ' ': 'SPACE',
  mouseclick: 'SPACE',
}

export class InputHandler {
  constructor() {
    this.keys = [];
    this.init();
  }

  init() {
    // Keyboard Input
    window.addEventListener('keydown', e => {
      const key = e.key.toLowerCase();
      if(KEY_MAP[key] && this.keys.indexOf(KEY_MAP[key]) === -1) {
        e.preventDefault();
        this.keys.push(KEY_MAP[key]);
      }
    });
    window.addEventListener('keyup', e => {
      const key = e.key.toLowerCase();
      if(KEY_MAP[key]) {
        e.preventDefault();
        this.keys.splice(this.keys.indexOf(KEY_MAP[key]), 1);
      }
    });

    // Mouse Clicks
    window.addEventListener('mousedown', e => {
      if(e.button === 0 && this.keys.indexOf(KEY_MAP.mouseclick) === -1) {
        this.keys.push(KEY_MAP.mouseclick);
      }
    });
    window.addEventListener('mouseup', e => {
      this.keys.splice(this.keys.indexOf(KEY_MAP.mouseclick), 1);
    });

    // Handle losing focus of screen
    window.addEventListener("visibilitychange", () => {
      this.keys = [];
    });
    window.addEventListener("blur", () => {
      this.keys = [];
    });
  }
}
