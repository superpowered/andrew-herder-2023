import { Game } from "./game";

// Styles
import './styles/index.scss';

// Sprites
import mort from './assets/dino-sprites-mort.png';
import vita from './assets/dino-sprites-vita.png';

// -----------------------------------------------------------------------------

const init = (sprites) => {
  const canvas = document.getElementById('main-canvas');
  const fps = document.getElementById('fps');
  const ctx = canvas.getContext('2d');

  if(!canvas || !fps) {
    console.error('Missing some important stuff, that\'s for sure');
    return;
  }

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

  // Storing an array of fps counts to get a less jittery number by getting the average
  let fpsAvs = Array(100).fill(0);
  let lastTime = 0;
  const requiredElapsed = 1000 / 120; // desired interval is 60fps

  // Start the main loop
  const animate = (timeStamp) => {
    // FPS &  Delta Time
    const deltaTime = timeStamp - lastTime;
    // lastTime = timeStamp;

    if (!lastTime) { lastTime = timeStamp; }
    if (deltaTime > requiredElapsed) {
      fpsAvs.unshift(1 / (deltaTime / 1000)|0);
      fpsAvs.pop();
      fps.innerText = 'FPS: ' + (fpsAvs.reduce((l, t) => l+t, 0) / fpsAvs.length|0);

      // Clear Whole Screen and run game loop
      ctx.clearRect(0,0, canvas.width, canvas.height);
      game.draw(ctx, deltaTime);
      game.update(ctx, deltaTime);
      lastTime = timeStamp;
    }
    requestAnimationFrame(animate);
  }
  animate(0);
};

// -----------------------------------------------------------------------------

const loadSite = () => {
  console.log('Hello, my treacherous friends');
  console.log('Repo for this can be found here: https://github.com/superpowered/andrew-herder-2023');

  // Make sure fonts are loaded
  let fonts = false;
  document.fonts.ready.then(function () {
    if(document.fonts.check('1em "Press Start 2P"') && document.fonts.check('1em "Black Han Sans"')) {
      fonts = true;
    }
  });

  // Load up our player sprite
  let playerSpriteLoaded = false;
  const playerSprite = new Image();
  playerSprite.src = vita;
  playerSprite.addEventListener(
    "load",
    () => {
      playerSpriteLoaded = true;
    },
    false
  );

  // Load up our enemy sprite
  let enemySpriteLoaded = false;
  const enemySprite = new Image();
  enemySprite.src = mort;
  enemySprite.addEventListener(
    "load",
    () => {
      enemySpriteLoaded = true;
    },
    false
  );

  // Runs a reload loop until all the assets are loaded
  const loader = () => {
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
};
loadSite();