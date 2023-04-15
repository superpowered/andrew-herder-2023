// Constants
import { CONTROLS } from '../constants';

// -----------------------------------------------------------------------------

const KEY_MAP = {
  arrowdown: CONTROLS.DOWN,
  arrowup: CONTROLS.UP,
  arrowleft: CONTROLS.LEFT,
  arrowright: CONTROLS.RIGHT,
  w: CONTROLS.UP,
  a: CONTROLS.LEFT,
  s: CONTROLS.DOWN,
  d: CONTROLS.RIGHT,
  ' ': CONTROLS.SHOOT,
  mouseclick: CONTROLS.SHOOT,
};

// -----------------------------------------------------------------------------

class InputSystem {
  constructor(game) {
    this.keys = [];
    this.game = game;

    this.init();
  }

  init() {
    // Keyboard Input
    window.addEventListener('keydown', (e) => {
      this.game.isTouch = false;
      const key = e.key.toLowerCase();
      if (KEY_MAP[key] && this.keys.indexOf(KEY_MAP[key]) === -1) {
        e.preventDefault();
        this.keys.push(KEY_MAP[key]);
      }
    });
    window.addEventListener('keyup', (e) => {
      this.game.isTouch = false;
      const key = e.key.toLowerCase();
      if (KEY_MAP[key]) {
        e.preventDefault();
        this.keys.splice(this.keys.indexOf(KEY_MAP[key]), 1);
      }
    });

    // Mouse Clicks
    window.addEventListener('mousedown', (e) => {
      this.game.isTouch = false;
      if (e.button === 0 && this.keys.indexOf(KEY_MAP.mouseclick) === -1) {
        this.keys.push(KEY_MAP.mouseclick);
      }
    });
    window.addEventListener('mouseup', (e) => {
      if (e.button === 0) {
        this.keys.splice(this.keys.indexOf(KEY_MAP.mouseclick), 1);
      }
    });

    // Handle losing focus of screen
    window.addEventListener('visibilitychange', () => {
      this.keys = [];
    });
    window.addEventListener('blur', () => {
      this.keys = [];
    });

    // Attempt to handle mobile
    const w = document.querySelector('.control-key--w');
    w.addEventListener('touchstart', () => {
      w.classList.add('active');
      this.game.isTouch = true;
      this.keys.push(KEY_MAP.w);
    });
    w.addEventListener('touchend', () => {
      w.classList.remove('active');
      this.game.isTouch = true;
      this.keys.splice(this.keys.indexOf(KEY_MAP.w), 1);
    });

    const a = document.querySelector('.control-key--a');
    a.addEventListener('touchstart', () => {
      a.classList.add('active');
      this.game.isTouch = true;
      this.keys.push(KEY_MAP.a);
    });
    a.addEventListener('touchend', () => {
      a.classList.remove('active');
      this.game.isTouch = true;
      this.keys.splice(this.keys.indexOf(KEY_MAP.a), 1);
    });

    const s = document.querySelector('.control-key--s');
    s.addEventListener('touchstart', () => {
      s.classList.add('active');
      this.game.isTouch = true;
      this.keys.push(KEY_MAP.s);
    });
    s.addEventListener('touchend', () => {
      s.classList.remove('active');
      this.game.isTouch = true;
      this.keys.splice(this.keys.indexOf(KEY_MAP.s), 1);
    });

    const d = document.querySelector('.control-key--d');
    d.addEventListener('touchstart', () => {
      d.classList.add('active');
      this.game.isTouch = true;
      this.keys.push(KEY_MAP.d);
    });
    d.addEventListener('touchend', () => {
      d.classList.remove('active');
      this.game.isTouch = true;
      this.keys.splice(this.keys.indexOf(KEY_MAP.d), 1);
    });

    const space = document.querySelector('.control-key--space');
    space.addEventListener('touchstart', () => {
      space.classList.add('active');
      this.game.isTouch = true;
      this.keys.push(KEY_MAP.mouseclick);
    });
    space.addEventListener('touchend', () => {
      space.classList.remove('active');
      this.game.isTouch = true;
      this.keys.splice(this.keys.indexOf(KEY_MAP.mouseclick), 1);
    });
  }
}

// -----------------------------------------------------------------------------

export default InputSystem;
