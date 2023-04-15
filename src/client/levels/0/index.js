// Entities
import { TextPixel } from '../../entities';

// Data
import levelData from './data';

// -----------------------------------------------------------------------------

class Level {
  constructor(game) {
    this.textElement = document.getElementById('intro-text');

    this.game = game; 
    this.initialCount = null;
    this.count = null;

    this.initialized = false;

    this.levelData = levelData;
    this.events = [];

    this.loggedCount = 0;
    this.game.textPixels = [];
  }

  init = (game, context) => {
    // Create our destructible pixel header
    const pixelSizes = this.createIntroTextPixels(context);
    pixelSizes.forEach(pixelSize => {
      this.game.textPixels = [
        ...this.game.textPixels,
        ...pixelSize.pixels
          // .filter((pixel, i) => pixelSize.size !== 1 || i % 2 === 0)
          .map(pixel => new TextPixel(pixel, pixelSize.size, pixelSize.absorption))
          .sort((pixel, lastPixel) => pixel.r > lastPixel.r)
          .sort((pixel, lastPixel) => pixel.g > lastPixel.g)
          .sort((pixel, lastPixel) => pixel.b > lastPixel.b)
          .sort((pixel, lastPixel) => pixel.a > lastPixel.a)
      ];
    });

    console.log('draw Count:', this.game.textPixels.length);

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
    // TODO: is it possible to not have to pass context here and instead draw out the pixels on a blank newly made canvas?
    // Clear everything so we only save the pixels we output in this function
    context.save();
    context.clearRect(0,0, this.game.width, this.game.height);

    // Draw out the text
    const introText = this.textElement.textContent;
    const size = 50 / this.game.dpr;
    context.font = size + "px 'Press Start 2P'";
    context.fillStyle="white";
    context.shadowColor="rgb(165,165,165,1)";
    context.shadowOffsetX=3;
    context.shadowOffsetY=3;
    context.shadowBlur=0;
    context.textAlign='center';
    context.textBaseline="middle";
    context.fillText(introText, this.game.width / 2 / this.game.dpr, this.game.height / 2 / this.game.dpr);

    // Draw out the sub text
    const sizeSmall = 20 / this.game.dpr;
    context.font = sizeSmall + "px 'Courier', sans-serif";
    context.shadowColor="none";
    context.shadowOffsetX=0;
    context.shadowOffsetY=0;
    context.fillText('Senior Software Engineer | Milwaukee, WI', this.game.width / 2 / this.game.dpr, this.game.height / 2 / this.game.dpr + 30);

    // This gives us a big crazy array of EVERY pixel on the screen PLUS various data about those pixels 
    // so we store the pixel data for access, & then convert to array so we can actually modify it reasonably.
    const pixels = Array.from(context.getImageData(0, 0, this.game.width, this.game.height).data);

    // These are the pixel sizes we'll try to make, in order.
    // TODO: part of my load process should be re rendering with different pixelSizes to find the lowest draw count
    // Since the size that gives us the lowest count will be screen dependent
    const pixelSizes = [
      {
        size: 13, // 8755 draws
        pixels: [],
        absorption: 1,
      },
      {
        size: 12, // 8974 draws
        pixels: [],
        absorption: 1,
      },
      {
        size: 11, // 9054 draws
        pixels: [],
        absorption: 1,
      },
      {
        size: 10, // 8942 draws
        pixels: [],
        absorption: 1,
      },
      {
        size: 9, // 8938 draws
        pixels: [],
        absorption: 1,
      },
      {
        size: 8, // 8949 draws
        pixels: [],
        absorption: 1,
      },
      {
        size: 7, // 9019 draws
        pixels: [],
        absorption: 1,
      },
      {
        size: 6, // 9310 draws
        pixels: [],
        absorption: 1,
      },
      { 
        size: 5, // 9835 draws
        pixels: [],
        absorption: 1,
      },
      {
        size: 4, // 9808 draws
        pixels: [],
        absorption: .8,
      },
      {
        size: 3, // 10414 draws
        pixels: [],
        absorption: .6,
      },
      {
        size: 2, // 12478 draws
        pixels: [],
        absorption: .4,
      },
      {
        size: 1, // 24862 draws
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
    context.clearRect(0,0, this.game.width, this.game.height);
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
    delete this;
  }
}

// -----------------------------------------------------------------------------

export default Level;