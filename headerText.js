import { TextPixel } from './textPixel.js';
import { level0 } from './levelData.js';

// -----------------------------------------------------------------------------

export class HeaderText {
  constructor(game, context) {
    this.textElement = document.getElementById('intro-text');

    this.game = game; 
    this.textPixels = [];
    this.initialCount = null;
    this.count = null;

    this.levelData = level0;
    this.events = [];

    this.init(context);
  }

  init = (context) => {
    // Clear everything so we only save the pixels we output in this function
    context.save();
    context.clearRect(0,0, this.game.width, this.game.height);

    // Draw out the text
    const introText = this.textElement.textContent;
    const size = 5 / this.game.dpr;
    context.font = size + "vw 'Press Start 2P'";
    context.fillStyle="white";
    context.shadowColor="rgb(165,165,165,1)";
    context.shadowOffsetX=3;
    context.shadowOffsetY=3;
    context.shadowBlur=0;
    context.textAlign='center';
    context.textBaseline="middle";
    context.fillText(introText, this.game.width / 2 / this.game.dpr, this.game.height / 2 / this.game.dpr);

    context.font = "1vw 'Courier', sans-serif";
    context.shadowColor="none";
    context.shadowOffsetX=0;
    context.shadowOffsetY=0;
    context.fillText('Senior Software Engineer | Milwaukee, WI', this.game.width / 2 / this.game.dpr, this.game.height / 2 / this.game.dpr + this.game.height * .05);

    // This gives us a big crazy array of EVERY pixel on the screen PLUS various data about those pixels 
    // so we store the pixel data for access, but use the Uint32Array to navigate it
    const pixels = context.getImageData(0, 0, this.game.width, this.game.height).data;
    const data32 = new Uint32Array(pixels.buffer);
    let pix = [];
    for(let i = 0; i < data32.length; i++) {
      // 0 denotes an empty pixel
      if (data32[i] === 0) { 
        continue;
      }

      // For every "real" pixel, we'll find the data we need from it and store it here so we can make interactable pixels with them later
      pix.push({
        x: (i % this.game.width),
        // bitwise here is just converting to an int. 32 offset is because of the Uint32Array
        y: ((i / this.game.width)|0),
        r: pixels[i*4], 
        g: pixels[i*4 + 1], 
        b: pixels[i*4 + 2],
        a: pixels[i*4 + 3] / 255
      });
    }

    // We should be safe to hide the loading text at this point
    this.textElement.classList.add('hidden');
    context.restore();

    this.textPixels = pix.map(pixel => new TextPixel(this.game, pixel));
    this.initialCount = this.textPixels.length;
    this.count = this.initialCount;


    // register our events
    this.events = this.levelData.events(this).map(event => event);
  }

  update(deltaTime){
    // TODO: use this markedForDeletion pattern on the other "destroy()" items to simplify logic
    this.textPixels = this.textPixels.filter( pixel => { 
      pixel.update(deltaTime);
      return !pixel.markedForDeletion;
    });


    // Loop through our level events and do things as needed
    this.events.filter((event) => {
      if(!event.triggered && event.trigger(this)) { 
          event.triggered = true;
          event.action(this);
        }
    });
  }

  draw(context) {
    this.textPixels.forEach( pixel => pixel.draw(context));
  }
}