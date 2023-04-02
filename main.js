import { Game } from "./game.js";

class HeaderText {
  constructor(game) {
    this.textElement = document.getElementById('intro-text');
    this.game = game; 
    this.textPixels = [];
  }

  init(context) {
    const introText = this.textElement.textContent;
    context.save();

    // Clear everything so we only save the pixels we output in this function
    context.clearRect(0,0, this.game.width, this.game.height);

    // Draw out the text
    context.font = "5vw 'Press Start 2P'";
    context.fillStyle="white";
    context.shadowColor="rgb(165,165,165,1)";
    context.shadowOffsetX=3;
    context.shadowOffsetY=3;
    context.shadowBlur=0;
    context.textAlign='center';
    context.textBaseline="middle";
    context.fillText(introText, this.game.width/2, this.game.height/2);

    // This gives us a big crazy array so we store the pixel data for access, but use the Uint32Array to navigate it
    const pixels = context.getImageData(0, 0, this.game.width, this.game.height).data;
    const data32 = new Uint32Array(pixels.buffer);
    for(let i = 0; i < data32.length; i++) {
      // 0 denotes an empty pixel
      if (data32[i] === 0) { 
        continue;
      }
      this.textPixels.push({
        x: (i % this.game.width),
        // bitwise here is just converting to an int. 32 offset is because of the Uint32Array
        y: ((i / this.game.width)|0) - 32,
        r: pixels[i*4], 
        g: pixels[i*4 + 1], 
        b: pixels[i*4 + 2],
        a: pixels[i*4 + 3] / 255
      });
    }

    // Reset the shadow stuff so it doesn't render on other things, then clear this text out 
    // (since we're going to render it with interactible pixels)
    context.shadowOffsetX=0;
    context.shadowOffsetY=0;
    context.clearRect(0,0, this.game.width, this.game.height);

    // We should be safe to hide the loading text at this point
    this.textElement.classList.add('hidden');

    context.restore();
  }
}

// -----------------------------------------------------------------------------

const init = () => {
  var dpr = window.devicePixelRatio || 1;
  const canvas = document.getElementById('main-canvas');
  var rect = canvas.getBoundingClientRect();
  const ctx = canvas.getContext('2d');

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';
  ctx.imageSmoothingEnabled= false;
  ctx.scale(dpr, dpr);

  const game = new Game(canvas, ctx, rect.width, rect.height, dpr);
  document.documentElement.classList.add('game-loaded');

  let lastTime = 0;
  const animate = (timeStamp) => {
    ctx.imageSmoothingEnabled= false;
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