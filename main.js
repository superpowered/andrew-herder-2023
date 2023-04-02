import { Game } from "./game.js";

// -----------------------------------------------------------------------------

const init = () => {
  const canvas = document.getElementById('main-canvas');
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
  const game = new Game(canvas, ctx, rect.width, rect.height, dpr);
  document.documentElement.classList.add('game-loaded');

  // Start the render loop
  let lastTime = 0;
  const animate = (timeStamp) => {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    ctx.clearRect(0,0, canvas.width, canvas.height);
    game.update(deltaTime);
    game.draw(ctx, deltaTime);
    requestAnimationFrame(animate);
  }
  animate(0);
};

// -----------------------------------------------------------------------------

let fonts = false;
document.fonts.ready.then(function () {
  if(document.fonts.check('1em "Press Start 2P"') && document.fonts.check('1em "Black Han Sans"')) {
    fonts = true;
  }
});

const loader = () => {
  // Reload loop until fonts are ready
  if(!fonts) {
    setTimeout(loader, 500);
    return;
  }

  // Once we're sure everythings loaded, we can start the init loops
  init();
}

window.addEventListener('load', loader);