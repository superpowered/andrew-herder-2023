import { TextPixel } from './textPixel.js';
import { level0 } from './levelData.js';

// -----------------------------------------------------------------------------

export class Level0 {
  constructor(game) {
    this.textElement = document.getElementById('intro-text');

    this.game = game; 
    this.initialCount = null;
    this.count = null;

    this.initialized = false;

    this.levelData = level0;
    this.events = [];

    this.loggedCount = 0;
  }

  init = (game, context) => {
    // Create our destructible pixel header
    this.game.textPixels = [];
    const pixelSizes = this.createIntroTextPixels(context);
    pixelSizes.forEach(pixelSize => {
      this.game.textPixels = [
        ...this.game.textPixels,
        ...pixelSize.pixels.map(pixel => new TextPixel(pixel, pixelSize.size, pixelSize.absorption)),
      ];
    });

    // Set our counts, which we reference for firing events
    this.initialCount = this.game.textPixels.length;
    this.count = this.initialCount;

    // register our events
    this.events = this.levelData.events(this).map(event => event);
    this.initialized = true;
  }

  getNeigborPositions = (i, gameWidth, size) => {
    const positions = [];
    const sqr = Math.sqrt(size);
    for(let x = 0; x < sqr; x++) {
      for(let y = 0; y < sqr; y++) {
        positions[x * sqr + y] = i + (gameWidth * 4 * x) + (y * 4);
      } 
    }
    return positions;
  }

  findMyNeigbors = (i, size, pixels) => {
    const neighborPositions = this.getNeigborPositions(i, this.game.width, size);
    return neighborPositions.map((pos) => {
      return {
        pos, 
        pixelData: {
          x: ((pos / 4) % this.game.width),
          // This bitwise is just a Math.Floor
          y: (((pos / 4)  / this.game.width)|0),
          r: pixels[pos], 
          g: pixels[pos + 1], 
          b: pixels[pos + 2],
          a: pixels[pos + 3] / 255
        },
    }});
  }

  createIntroTextPixels(context) {
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
    context.fillText('Senior Software Engineer | Milwaukee, WI', this.game.width / 2 / this.game.dpr, this.game.height / 2 / this.game.dpr + this.game.height * .05 + 10);

    // This gives us a big crazy array of EVERY pixel on the screen PLUS various data about those pixels 
    // so we store the pixel data for access, & then convert to array so we can actually modify it reasonably.
    const pixels = Array.from(context.getImageData(0, 0, this.game.width, this.game.height).data);

    // These are the pixel sizes we'll try to make, in order.
    const pixelSizes = [
      {
        size: 5,
        pixels: [],
        absorption: 1,
      },
      {
        size: 4,
        pixels: [],
        absorption: .8,
      },
      {
        size: 3,
        pixels: [],
        absorption: .6,
      },
      {
        size: 2,
        pixels: [],
        absorption: .4,
      },
      {
        size: 1,
        pixels: [],
        absorption: .2,
      },
    ];

    // This loop will start at 0,0 (left edge) and to the right edge, then down one and repeat
    for(let i = 0; i < pixels.length; i += 4) {
      // We can ignore fully transparent pixels
      if (pixels[i + 3] <= 0) {
        continue;
      }

      pixelSizes.find((pixelSize, index) => {
        // Find all neighboring pixels within the size & their data
        const neighbors = this.findMyNeigbors(i, pixelSize.size * pixelSize.size, pixels);

        // Check if all pixels in this section match exactly
        const pixelcount = neighbors.reduce((prev, n) => {
          const v = (
            n.pixelData.r === neighbors[0].pixelData.r && 
            n.pixelData.g === neighbors[0].pixelData.g && 
            n.pixelData.b === neighbors[0].pixelData.b && 
            n.pixelData.a === neighbors[0].pixelData.a
          ) ? 1 : 0;
          return prev + v;
        }, 0);

        // Only move on if all pixels can be batched together
        if(pixelcount !== pixelSize.size * pixelSize.size) {
          return false;
        }

        // Remove from pixel array so we don't double paint them
        neighbors.forEach(neighbor => {
          pixels[neighbor.pos + 3] = 0;
        });
        pixelSizes[index].pixels.push(neighbors);
        return true;
      });
    }

    // We should be safe to hide the loading text at this point
    this.textElement.classList.add('hidden');
    context.restore();
    return pixelSizes;
  }

  update(deltaTime){
    this.count = this.game.textPixels.length;

    // Loop through our level events and do things as needed
    this.events.filter((event) => {
      if(!event.triggered && event.trigger(this)) { 
          event.triggered = true;
          event.action(this);
        }
    });
  }

  // We'll fire this to make sure we've cleaned up anything we may have left behind accidentally
  unload() {
    this.game.textPixels = [];
    // this.textElement.remove();
    delete this;
  }
}