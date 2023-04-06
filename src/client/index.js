import { Game } from "./game.js";

import './style.css';

import mort from './assets/dino-sprites-mort.png';
import vita from './assets/dino-sprites-vita.png';

// -----------------------------------------------------------------------------

const init = (sprites) => {
  const canvas = document.getElementById('main-canvas');
  const fps = document.getElementById('fps');
  const ctx = canvas.getContext('2d');

  // Fix pixel scaling for retina screens
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';
  ctx.imageSmoothingEnabled= false;
  ctx.scale(dpr, dpr);

  // Initialize the game
  const game = new Game(sprites, canvas, ctx, rect.width, rect.height, dpr);
  document.documentElement.classList.add('game-loaded');

  let fpsAvs = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let fpsAv = 0;

  // Start the render loop
  let lastTime = 0;
  const animate = (timeStamp) => {
    const deltaTime = timeStamp - lastTime;
    ctx.clearRect(0,0, canvas.width, canvas.height);
    game.update(deltaTime);
    game.draw(ctx, deltaTime);
    fpsAvs.unshift(1 / ((performance.now() - lastTime) / 1000)|0);
    fpsAvs.pop();
    fps.innerText = 'FPS: ' + (fpsAvs.reduce((l, t) => l+t, 0) / fpsAvs.length|0);
    lastTime = timeStamp;
    requestAnimationFrame(animate);
  }
  animate(0);
};

// -----------------------------------------------------------------------------

let fonts = false;
let playerSpriteLoaded = false;
let enemySpriteLoaded = false;
document.fonts.ready.then(function () {
  if(document.fonts.check('1em "Press Start 2P"') && document.fonts.check('1em "Black Han Sans"')) {
    fonts = true;
  }
});

const playerSprite = new Image(); // Create new img element
playerSprite.src = vita;
playerSprite.addEventListener(
  "load",
  () => {
    playerSpriteLoaded = true;
  },
  false
);

const enemySprite = new Image(); // Create new img element
enemySprite.src = mort;
enemySprite.addEventListener(
  "load",
  () => {
    enemySpriteLoaded = true;
  },
  false
);

const loader = () => {
  // Reload loop until fonts are ready
  if(!fonts || !playerSpriteLoaded || !enemySpriteLoaded) {
    setTimeout(loader, 500);
    return;
  }

  // Once we're sure everythings loaded, we can start the init loops
  init({
    playerSprite,
    enemySprite, 
  });
}

window.addEventListener('load', loader);