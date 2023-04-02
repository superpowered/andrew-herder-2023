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

export const level0 = {
  events: (levelData) => {
    return [
      {
        id: 'intro_text_1',
        triggered: false,
        trigger: (levelData) => { 
          return levelData.count < levelData.initialCount - levelData.initialCount * .01;
        }  ,
        action: (levelData) => {
          levelData.game.textSystem.makeText(textBubbleTest);
        }
      },
      {
        id: 'intro_text_2',
        triggered: false,
        trigger: (levelData) => { 
          return levelData.count < levelData.initialCount - levelData.initialCount * .05;
        }  ,
        action: (levelData) => {
          levelData.game.textSystem.makeText(textBubbleTest2);
        }
      },
      {
        id: 'intro_text_3',
        triggered: false,
        trigger: (levelData) => { 
          return levelData.count < levelData.initialCount - levelData.initialCount * .1;
        }  ,
        action: (levelData) => {
          levelData.game.textSystem.makeText(textBubbleTest3);
        }
      },
      {
        id: 'intro_text_4',
        triggered: false,
        trigger: (levelData) => { 
          return levelData.count < levelData.initialCount - levelData.initialCount * .15;
        }  ,
        action: (levelData) => {
          levelData.game.textSystem.makeText(textBubbleTest4);
          levelData.textPixels.forEach( pixel => pixel.destroy(true));
          levelData.textElement.remove();
        }
      }
    ];
  }
}