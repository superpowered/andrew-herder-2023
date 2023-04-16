// Utils
import { shakeScreen } from '../../utils';

// -----------------------------------------------------------------------------

const textBubbles = [
  {
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
      },
    ],
  },
  {
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
  },
  {
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
        string: "This is like my life's work.",
        speed: 40,
      },
      {
        string: "I'm nothing without this website.",
        speed: 30,
        classes: ['small'],
      },
    ],
  },
  {
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
  },
  {
    clearOthers: true,
    ttl: 3000,
    removeOnNew: true,
    text: [
      {
        string: 'Your',
        speed: 40,
      },
      {
        string: 'hubris',
        speed: 50,
        classes: ['bold'],
      },
      {
        string: 'will be your downfall!',
        speed: 40,
        delayAfter: 100,
      },
      {
        string: '(probably)',
        speed: 10,
        classes: ['small'],
      },
    ],
  },
];

// -----------------------------------------------------------------------------

const levelData = {
  init: () => {},
  events: () => {
    return [
      // DEBUG: Fast Forward to level 1
      // {
      //   id: 'intro_text_4',
      //   triggered: false,
      //   trigger: (data) => {
      //     return true;
      //   }  ,
      //   action: (data) => {
      //     setTimeout(() => {
      //       data.game.level = 1;
      //       data.unload();
      //     }, 1000);
      //   }
      // },
      {
        id: 'intro_text_1',
        triggered: false,
        trigger: (data) => {
          return data.count < data.initialCount - data.initialCount * 0.01;
        },
        action: (data) => {
          data.intro_text_1 = true;
          data.game.textSystem.makeText(textBubbles[0]);
        },
      },
      {
        id: 'intro_text_2',
        triggered: false,
        trigger: (data) => {
          return data.count < data.initialCount - data.initialCount * 0.05;
        },
        action: (data) => {
          data.intro_text_2 = true;
          data.game.textSystem.makeText(textBubbles[1]);
        },
      },
      {
        id: 'intro_text_3',
        triggered: false,
        trigger: (data) => {
          return data.count < data.initialCount - data.initialCount * 0.1;
        },
        action: (data) => {
          data.intro_text_3 = true;
          data.game.textSystem.makeText(textBubbles[2]);
        },
      },
      {
        id: 'intro_text_4',
        triggered: false,
        trigger: (data) => {
          return data.count < data.initialCount - data.initialCount * 0.15;
        },
        action: (data) => {
          data.intro_text_4 = true;
          data.game.textSystem.makeText(textBubbles[3]);
          shakeScreen();
          data.game.textPixels.forEach((pixel) => pixel.destroy(true));
          data.textElement.remove();
        },
      },
      {
        id: 'intro_text_5',
        triggered: false,
        trigger: (data) => {
          return data.intro_text_4;
        },
        action: (data) => {
          data.intro_text_5 = true;
          setTimeout(() => data.game.textSystem.makeText(textBubbles[4]), 2000);
        },
      },
      {
        id: 'end_level',
        triggered: false,
        trigger: (data) => {
          return data.intro_text_5;
        },
        action: (data) => {
          data.end_level = true;
          setTimeout(() => {
            data.game.level = 1;
            data.unload();
          }, 4000);
        },
      },
    ];
  },
};

// -----------------------------------------------------------------------------

export default levelData;
