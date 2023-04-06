import { TextPixel2 } from './textPixel.js';
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
    const pixels = this.createIntroTextPixels(context);
    const normPixels = pixels.pix.map(pixel => new TextPixel2(pixel, 1, .125));
    const bigPixels = pixels.bigPixels.map(pixel => new TextPixel2(pixel, 2, .5));
    const bigBigPixels = pixels.bigBigPixels.map(pixel => new TextPixel2(pixel, 3, 1));
    this.game.textPixels = [ ...normPixels, ...bigPixels, ...bigBigPixels ];

    // Set our counts, which we reference for firing events
    this.initialCount = this.game.textPixels.length;
    this.count = this.initialCount;

    // register our events
    this.events = this.levelData.events(this).map(event => event);
    this.initialized = true;
  }

  getNeigborPositions = (i, gw, size) => {
    const arr = [];
    const sqr = Math.sqrt(size);

    for(let x = 0; x < sqr; x++) {
      for(let y = 0; y < sqr; y++) {
        arr[x * sqr + y] = i + (gw * 4 * x) + (y * 4);
      } 
    }

    // 0 - 8

    // if(this.loggedCount < 100 ){
    //   console.log(i, gw, size, sqr, arr);
    //   this.loggedCount++;
    // }

    return arr;
  }

  getNeigborPositionsMan = (i, gw) => {
    return [
      i, // TOP LEFT
      i + 4, // TOP MID
      i + 8, // TOP RIGHT
      i + gw * 4, // MID LEFT
      i + gw * 4 + 4, // MID MID
      i + gw * 4 + 8, // MID RIGHT
      i + gw * 4 * 2, // BOT LEFT
      i + gw * 4 * 2 + 4, // BOT MID
      i + gw * 4 * 2 + 8, // BOT RIGHT
    ];
  }

  findMyNeigbors = (i, size, pixels) => {
    const neighborPos9TL = this.getNeigborPositions(i, this.game.width, size);
    if(this.loggedCount < 1) {
      console.log(i);
      console.log(neighborPos9TL);
      this.loggedCount++;
    }
    return neighborPos9TL.map((pos) => {
      const hasData = pixels[pos];
      return {
        pos, 
        hasData,
        pixelData: {
          x: ((pos / 4) % this.game.width),
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
    const size = 4 / this.game.dpr;
    context.font = size + "vw 'Press Start 2P'";
    // context.font = (50  / this.game.dpr) + "px 'Press Start 2P'";
    context.fillStyle="white";
    context.shadowColor="rgb(165,165,165,1)";
    context.shadowOffsetX=3;
    context.shadowOffsetY=3;
    context.shadowBlur=0;
    context.textAlign='center';
    context.textBaseline="middle";
    context.fillText(introText, this.game.width / 2 / this.game.dpr, this.game.height / 2 / this.game.dpr);

    context.font = ".75vw 'Courier', sans-serif";
    context.shadowColor="none";
    context.shadowOffsetX=0;
    context.shadowOffsetY=0;
    context.fillText('Senior Software Engineer | Milwaukee, WI', this.game.width / 2 / this.game.dpr, this.game.height / 2 / this.game.dpr + this.game.height * .05);

    // This gives us a big crazy array of EVERY pixel on the screen PLUS various data about those pixels 
    // so we store the pixel data for access, & then convert to array so we can actually modify it reasonably.
    const pixels = Array.from(context.getImageData(0, 0, this.game.width, this.game.height).data);
    let pix = [];
    let bigPixels = [];
    let bigBigPixels = [];

    console.log(this.getNeigborPositions(0, this.game.width, 9));
    console.log(this.getNeigborPositionsMan(0, this.game.width));

    // This loop will start at 0,0 (left edge) and to the right edge, then down one and repeat
    for(let i = 0; i < pixels.length; i += 4) {
      // We can ignore fully transparent pixels
      if (pixels[i + 3] <= 0) {
        continue;
      }

       // Mark our removed pixels, so we don't double render them
       if (pixels[i] === 'removed') { 
        continue;
      }


      // const neighborPos9TL = [
      //   i, // TOP LEFT
      //   i + 4, // TOP MID
      //   i + 8, // TOP RIGHT
      //   i + this.game.width * 4, // MID LEFT
      //   i + this.game.width * 4 + 4, // MID MID
      //   i + this.game.width * 4 + 8, // MID RIGHT
      //   i + this.game.width * 4 * 2, // BOT LEFT
      //   i + this.game.width * 4 * 2 + 4, // BOT MID
      //   i + this.game.width * 4 * 2 + 8, // BOT RIGHT
      // ];

      const neighbors9 = this.findMyNeigbors(i, 9, pixels);
 
      // const neighbors9 =  neighborPos9TL.map((pos) => {
      //   const hasData = pixels[pos];
      //   return {
      //     pos, 
      //     hasData,
      //     pixelData: {
      //       x: ((pos / 4) % this.game.width),
      //       y: (((pos / 4)  / this.game.width)|0),
      //       r: pixels[pos], 
      //       g: pixels[pos + 1], 
      //       b: pixels[pos + 2],
      //       a: pixels[pos + 3] / 255
      //     },
      // }});

      const pixelcount9 = neighbors9.reduce((prev, n) => {
        const v = (
          n.pixelData.r === neighbors9[0].pixelData.r && 
          n.pixelData.g === neighbors9[0].pixelData.g && 
          n.pixelData.b === neighbors9[0].pixelData.b && 
          n.pixelData.a === neighbors9[0].pixelData.a
        ) ? 1 : 0;
        return prev + v;
      }, 0);

      if(pixelcount9 === 9) {
        neighbors9.forEach(neighbor => {
          pixels[neighbor.pos] = 'removed';
        });
        bigBigPixels.push(neighbors9);
        continue;
       }


      const neighborPos4 = [
        i, // TOP LEFT
        i + 4, // TOP RIGHT
        i + this.game.width * 4, // BOT LEFT
        i + this.game.width * 4 + 4, // BOT RIGHT
      ];

      const neighbors4 =  neighborPos4.map((pos) => {
        const hasData = pixels[pos];
        return {
          pos, 
          hasData,
          pixelData: {
            x: ((pos / 4) % this.game.width),
            y: (((pos / 4)  / this.game.width)|0),
            r: pixels[pos], 
            g: pixels[pos + 1], 
            b: pixels[pos + 2],
            a: pixels[pos + 3] / 255
          },
      }});

      const pixelcount = neighbors4.reduce((prev, n) => {
        const v = (
          n.pixelData.r === neighbors4[0].pixelData.r && 
          n.pixelData.g === neighbors4[0].pixelData.g && 
          n.pixelData.b === neighbors4[0].pixelData.b && 
          n.pixelData.a === neighbors4[0].pixelData.a
        ) ? 1 : 0;
        return prev + v;
      }, 0);

      if(pixelcount === 4) {
        neighbors4.forEach(neighbor => {
          pixels[neighbor.pos] = 'removed';
        });
        bigPixels.push(neighbors4);
        continue;
       }

      pix.push([neighbors4[0]]);
    }

    // We should be safe to hide the loading text at this point
    this.textElement.classList.add('hidden');
    context.restore();

    console.log('pixels', pix.length);
    console.log('4x4 pixels', bigPixels.length);
    console.log('9x9 pixels', bigBigPixels.length);
    return { pix, bigPixels, bigBigPixels };
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