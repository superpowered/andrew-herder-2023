const textBubbles = [
  {
    clearOthers: true,
    ttl: 8000,
    removeOnNew: true,
    text: [
      {
        string: 'OH!',
        speed: 10,
        classes: ['bold'],
      },
      {
        string: 'Well',
        speed: 40,
        delayAfter: 500,
        noEndSpace: true,
      },
      {
        string: '...',
        speed: 150,
        delayAfter: 500,
      },
      {
        string: 'I was hoping the first 10 would just sort of,',
        speed: 60,
      },
      {
        string: "Y'know,",
        speed: 10,
      },
      {
        string: 'killed you.',
        speed: 60,
      },
    ],
  },
  {
    clearOthers: true,
    ttl: 6000,
    removeOnNew: true,
    text: [
      {
        string: 'Quickly Minons!',
        speed: 40,
        classes: ['bold'],
        delayAfter: 500,
      },
      {
        string: 'Minionize them!',
        speed: 60,
        classes: ['bold', 'large'],
      },
    ],
  },
  {
    clearOthers: true,
    ttl: 8000,
    removeOnNew: true,
    text: [
      {
        string: 'UUUUUUUUGHH!',
        speed: 70,
        classes: ['large'],
        delayAfter: 500,
      },
      {
        string: ' ',
      },
      {
        string: "Your'e supposed to run INTO the pixels!",
        speed: 70,
      },
    ],
  },
  {
    clearOthers: true,
    ttl: 12000,
    removeOnNew: true,
    text: [
      {
        string: 'Well congrats.',
        speed: 70,
        delayAfter: 500,
      },
      {
        string:
          "You've managed to expend the amount of minions I can spawn per second.",
        speed: 70,
        delayAfter: 500,
      },
      {
        string: "(No really, I didn't code much past this. So uhh....",
        speed: 50,
        classes: ['small'],
      },
      {
        string: 'K. Thnx. Baiii)',
        speed: 50,
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
      // DEBUG: Fast Forward to game over
      // {
      //   id: 'game_over',
      //   triggered: false,
      //   trigger: (data) => {
      //     return true;
      //   }  ,
      //   action: (data) => {
      //     setTimeout(() => {
      //       data.game.player.markedForDeletion = true;
      //       data.game.player.render = false;
      //       data.game.gameOver = true;
      //       data.unload();
      //     }, 1000);
      //   }
      // },
      {
        id: 'level_1_text_1',
        triggered: false,
        trigger: (data) => {
          return data.game.score >= 10;
        },
        action: (data) => {
          data.level_1_text_1 = true;
          data.game.textSystem.makeText(textBubbles[0]);
          data.spawnRate -= 500;
        },
      },
      {
        id: 'level_1_text_2',
        triggered: false,
        trigger: (data) => {
          return data.game.score >= 30;
        },
        action: (data) => {
          data.level_1_text_2 = true;
          data.game.textSystem.makeText(textBubbles[1]);
          data.spawnRate -= 500;
        },
      },
      {
        id: 'level_1_text_3',
        triggered: false,
        trigger: (data) => {
          return data.game.score >= 50;
        },
        action: (data) => {
          data.level_1_text_3 = true;
          data.game.textSystem.makeText(textBubbles[2]);
          data.spawnRate -= 200;
        },
      },
      {
        id: 'level_1_text_4',
        triggered: false,
        trigger: (data) => {
          return data.game.score >= 100;
        },
        action: (data) => {
          data.level_1_text_4 = true;
          data.game.textSystem.makeText(textBubbles[3]);
          data.spawnRate -= 200;
        },
      },
      {
        id: 'game_over',
        triggered: false,
        trigger: (data) => data.game.gameOver,
        action: (data) => {
          data.game_over = true;
          setTimeout(() => {
            data.unload();
          }, 500);
        },
      },
    ];
  },
};

// -----------------------------------------------------------------------------

export default levelData;
