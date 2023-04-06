import { TextPixel, BigTextPixel } from './textPixel.js';
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
  }

  init = (game, context) => {
    // Create our destructible pixel header
    const pixels = this.createIntroTextPixels(context);
    const normPixels = pixels.pix.map(pixel => new TextPixel(pixel));
    const bigPixels = pixels.bigPixels.map(pixel => new BigTextPixel(pixel));
    // const bigBigPixels = pixels.bigBigPixels.map(pixel => new BigBigTextPixel(pixel));
    this.game.textPixels = [ ...normPixels, ...bigPixels ];

    // Set our counts, which we reference for firing events
    this.initialCount = this.game.textPixels.length;
    this.count = this.initialCount;

    // register our events
    this.events = this.levelData.events(this).map(event => event);
    this.initialized = true;
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
    // so we store the pixel data for access, but use the Uint32Array to navigate it
    const pixels = context.getImageData(0, 0, this.game.width, this.game.height).data;
    const data32 = Array.from(new Uint32Array(pixels.buffer));
    let pix = [];
    let bigPixels = [];
    let bigBigPixels = [];
    console.log(pixels.length);
    // i = data.length; i >= 0; i -= 4
    // for(let i = pixels.length; i >= 0; i -= 4) {
    for(let i = 0; i < pixels.length; i += 4) {

      if (pixels[i + 3] <= 0) {
        continue;
      }

      // 0 denotes an empty pixel
      if (pixels[i] === 0) { 
        continue;
      }

      if (pixels[i] === 'beans') { 
        // console.log('?');
        continue;
      }

      // TDOO: we can get pretty good performance gains by reducing the pixel count
      // reduce by 1.5x 
      // if (((i / this.game.width)|0) % 8 === 0 ) { 
      //   continue;
      // }
      // if (i % 8 === 0) { 
      //   continue;
      // }

      // reduce by 2x 
      // if (((i / this.game.width)|0) % 4 === 0 ) { 
      //   continue;
      // }
      // if (i % 4 === 0) { 
      //   continue;
      // }

      // Reduce by 4x
      // if (((i / this.game.width)|0) % 2 === 0 ) { 
      //   continue;
      // }
      // if (i % 2 === 0) { 
      //   continue;
      // }

      // const neighborPos9 = [
      //   i, // Middle
      //   i - this.game.width * 4 - 4, // Upper left
      //   i - this.game.width * 4, // Upper middle
      //   i - this.game.width * 4 + 4, // Upper right
      //   i - 4, // Left
      //   i + 4, // Right
      //   i + this.game.width * 4 - 4, // Lower left
      //   i + this.game.width * 4, // Lower middle
      //   i + this.game.width * 4 + 4, // Lower right
      // ];

      // const neighbors9 =  neighborPos9.map((pos) => {
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

      // const pixelcount9 = neighbors9.reduce((prev, n) => {
      //   const v = (
      //     n.pixelData.r === neighbors9[0].pixelData.r && 
      //     n.pixelData.g === neighbors9[0].pixelData.g && 
      //     n.pixelData.b === neighbors9[0].pixelData.b && 
      //     n.pixelData.a === neighbors9[0].pixelData.a
      //   ) ? 1 : 0;
      //   return prev + v;
      // }, 0);

      // if(pixelcount9 === 9) {
      //   neighbors9.forEach(neighbor => {
      //     pixels[neighbor.pos] = 'beans';
      //   });
      //   bigBigPixels.push(neighbors9);
      //   continue;
      //  }


      const neighborPos = [
        i, // TOP LEFT
        i + 4, // TOP RIGHT
        i + this.game.width * 4, // BOT LEFT
        i + this.game.width * 4 + 4, // BOT RIGHT
      ];

      // const neighborPos2 = [
      //   i - this.game.width - 4, // Upper left
      //   i - this.game.width - 3, // Upper middle
      //   i - this.game.width - 2, // Upper right
      //   i - this.game.width - 1, // Left
      //   i, // Middle
      //   i + this.game.width + 1, // Right
      //   i + this.game.width + 2, // Lower left
      //   i + this.game.width + 3, // Lower middle
      //   i + this.game.width + 4, // Lower right
      // ];

      const neighbors =  neighborPos.map((pos) => {
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

        //var x = (i / 4) % this.el.width;
        //var y = Math.floor((i / 4) / this.el.width);
      // const filtered = neighbors.filter(neighbor => {
      //   return (
      //     data32[neighbor.data] !== 0 &&
      //     neighbor.pixelData.r === neighbors.pixelData && 
      //     neighbor.pixelData.g === pixels[i*4 + 1] &&
      //     neighbor.pixelData.b === pixels[i*4 + 2] && 
      //     neighbor.pixelData.a === pixels[i*4 + 3] / 255
      //   );
      // });

      const pixelcount = neighbors.reduce((prev, n) => {
        const v = (
          n.pixelData.r === neighbors[0].pixelData.r && 
          n.pixelData.g === neighbors[0].pixelData.g && 
          n.pixelData.b === neighbors[0].pixelData.b && 
          n.pixelData.a === neighbors[0].pixelData.a
        ) ? 1 : 0;
        return prev + v;
      }, 0);

      if(pixelcount === 4) {
        neighbors.forEach(neighbor => {
          pixels[neighbor.pos] = 'beans';
        });
        bigPixels.push(neighbors);
        continue;
       }

      // if(filtered.length === 8) {
      //   neighbors.forEach(neighbor => {
      //     data32[neighbor.pos] = 0;
      //   });
      //   continue;
      // }

      // TODO: find neighbors and try to combine into 4x4 rects?

      // For every "real" pixel, we'll find the data we need from it and store it here so we can make interactable pixels with them later

      // console.log({ x: neighbors[4].pixelData.x, y: neighbors[4].pixelData.y });

      pix.push(neighbors[0].pixelData);
    }

    // We should be safe to hide the loading text at this point
    this.textElement.classList.add('hidden');
    context.restore();

    console.log(pix.length);
    console.log(bigPixels.length);
    console.log(bigBigPixels.length);
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