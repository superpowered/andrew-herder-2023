import { TextPixel } from './textPixel.js';

// -----------------------------------------------------------------------------

export const textBubbleTest = {
  clearOthers: true,
  ttl: 6000,
  removeOnNew: true,
  removeAllOthers: false,
  text: [
    {
      string: 'Hey!',
      speed: 10,
      delayAfter: 500,
    },
    {
      string: 'Woah!',
      speed: 20,
      delayAfter: 600,
    },
    {
      string: 'Calm down there bud.',
      speed: 30,
    }
  ],
};

export const textBubbleTest2 = {
  clearOthers: true,
  ttl: 7000,
  removeOnNew: true,
  text: [
    {
      string: 'No seriously!',
      speed: 30,
      delayAfter: 100,
    },
    {
      string: 'I worked hard to place all those pixels',
      speed: 40,
      noEndSpace: true,
      delayAfter: 200,
    },
    {
      string: '...',
      speed: 400,
    },
  ],
};

export const textBubbleTest3 = {
  clearOthers: true,
  ttl: 9000,
  removeOnNew: true,
  text: [
    {
      string: 'Please stop!',
      speed: 30,
      delayAfter: 100,
    },
    {
      string: 'Pretty please?',
      speed: 40,
    },
    {
      string: 'This is like my life\'s work.',
      speed: 40,
    },
    {
      string: 'I\'m nothing without this website.',
      speed: 30,
      classes: ['small'],
    },
  ],
};

export const textBubbleTest4 = {
  clearOthers: true,
  ttl: 2000,
  removeOnNew: true,
  classes: ['slam'],
  text: [
    {
      string: 'ENOUGH!',
      speed: 0,
      classes: ['bold', 'large'],
    },
  ],
};

// -----------------------------------------------------------------------------

export class HeaderText {
  constructor(game, context) {
    this.textElement = document.getElementById('intro-text');

    this.game = game; 
    this.textPixels = [];
    this.initialCount = null;
    this.count = null;
    this.textDisplayed = false;

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
  }

  update(deltaTime){
    // TODO: use this markedForDeletion pattern on the other "destroy()" items to simplify logic
    this.textPixels = this.textPixels.filter( pixel => { 
      pixel.update(deltaTime);
      return !pixel.markedForDeletion;
    });

    // TODO: clean this up. (dispatcher?)
    if(this.count <  this.initialCount - (this.initialCount * .01) && !this.textDisplayed) {
        this.textDisplayed = true;
        this.game.textSystem.makeText(textBubbleTest);
    }

    if(this.count <  this.initialCount - (this.initialCount * .05) && !this.textDisplayed2) {
      this.textDisplayed2 = true;
      this.game.textSystem.makeText(textBubbleTest2);
    }

    if(this.count <  this.initialCount - (this.initialCount * .1) && !this.textDisplayed3) {
      this.textDisplayed3 = true;
      this.game.textSystem.makeText(textBubbleTest3);
    }

    if(this.count <  this.initialCount - (this.initialCount * .15) && !this.textDisplayed4) {
      document.body.classList.add('shake');
      this.textDisplayed4 = true;
      this.game.textSystem.makeText(textBubbleTest4);
      this.textPixels.forEach( pixel => pixel.destroy(true));
      this.textElement.remove();
    }
  }

  draw(context) {
    this.textPixels.forEach( pixel => pixel.draw(context));
  }
}