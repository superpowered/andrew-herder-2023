import { shakeScreen } from './utils.js';

// TODO: split this file up

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
      }
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
        string: 'This is like my life\'s work.',
        speed: 40,
      },
      {
        string: 'I\'m nothing without this website.',
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
  }
]

export const level0 = {
  init: (data) => {

  },
  events: (data) => {
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
          return data.count < data.initialCount - data.initialCount * .01;
        }  ,
        action: (data) => {
          data['intro_text_1'] = true;
          data.game.textSystem.makeText(textBubbles[0]);
        }
      },
      {
        id: 'intro_text_2',
        triggered: false,
        trigger: (data) => { 
          return data.count < data.initialCount - data.initialCount * .05;
        }  ,
        action: (data) => {
          data['intro_text_2'] = true;
          data.game.textSystem.makeText(textBubbles[1]);
        }
      },
      {
        id: 'intro_text_3',
        triggered: false,
        trigger: (data) => { 
          return data.count < data.initialCount - data.initialCount * .1;
        }  ,
        action: (data) => {
          data['intro_text_3'] = true;
          data.game.textSystem.makeText(textBubbles[2]);
        }
      },
      {
        id: 'intro_text_4',
        triggered: false,
        trigger: (data) => { 
          return data.count < data.initialCount - data.initialCount * .15;
        }  ,
        action: (data) => {
          data['intro_text_4'] = true;
          data.game.textSystem.makeText(textBubbles[3]);
          shakeScreen();
          data.game.textPixels.forEach( pixel => pixel.destroy(true));
          data.textElement.remove();
        }
      },
      {
        id: 'intro_text_5',
        triggered: false,
        trigger: (data) => { 
          return data['intro_text_4'];
        }  ,
        action: (data) => {
          data['intro_text_5'] = true;
          setTimeout(() => data.game.textSystem.makeText(textBubbles[4]), 2000);
        }
      },
      {
        id: 'end_level',
        triggered: false,
        trigger: (data) => { 
          return data['intro_text_5'];
        }  ,
        action: (data) => {
          data['end_level'] = true;
          setTimeout(() => {
            data.game.level = 1;
            data.unload();
          }, 4000);
        }
      },
    ];
  }
}

export const level1 = {
  init: (data) => {

  },
  events: (data) => {
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
        }  ,
        action: (data) => {
          data['level_1_text_1'] = true;
          data.game.textSystem.makeText(textBubbles[0]);
          data.spawnRate -= 500;
        }
      },
      {
        id: 'level_1_text_2',
        triggered: false,
        trigger: (data) => { 
          return data.game.score >= 30;
        }  ,
        action: (data) => {
          data['level_1_text_2'] = true;
          data.game.textSystem.makeText(textBubbles[1]);
          data.spawnRate -= 500;
        }
      },
      {
        id: 'level_1_text_3',
        triggered: false,
        trigger: (data) => { 
          return data.game.score >= 50;
        }  ,
        action: (data) => {
          data['level_1_text_3'] = true;
          data.game.textSystem.makeText(textBubbles[2]);
          data.spawnRate -= 200;
        }
      },
      {
        id: 'level_1_text_4',
        triggered: false,
        trigger: (data) => { 
          return data.game.score >= 100;
        }  ,
        action: (data) => {
          data['level_1_text_4'] = true;
          data.game.textSystem.makeText(textBubbles[3]);
          data.spawnRate -= 200;
        }
      },
      {
        id: 'game_over',
        triggered: false,
        trigger: (data) => data.game.gameOver,
        action: (data) => {
          data['game_over'] = true;
          data.game.scoreElement.forEach(el => {
            el.classList.remove('active');
          });
          document.documentElement.classList.remove('game-loaded');
          const enter = document.getElementById('initials-submit');
          const endScreen = document.getElementById('end-screen')
          endScreen.classList.add('active');

          let initials = [];
          window.addEventListener('keydown', e => {
            console.log(e.key, initials.length);
            const lastInitial = document.getElementById('initials-' + initials.length);
            const nextInitial = document.getElementById('initials-' + (initials.length + 1));
            if((e.key === 'Delete' || e.key === 'Backspace' || e.key === 'Escape') && initials.length) {
              initials.pop();
              lastInitial.innerText = '';
              lastInitial?.classList.add('active');
              nextInitial?.classList.remove('active');
              enter.classList.remove('active');
              return;
            }

            if(initials.length >= 3) {
              if(e.key === 'Enter') {
                const disallowed = [
                  'ass', 'cum', 'fag', 'gay', 'god', 'jew', 'tit'
                ];
                const name = initials.join('');
                if(disallowed.includes(name.toLowerCase())) {
                  shakeScreen();
                  return;
                }

                // TODO: 
                // - submit to server
                // Wait for response
                // populate scoreboard

                endScreen.classList.remove('active');
                const scoreboard = document.getElementById('scoreboard');
                scoreboard.classList.add('active');
              }
              return;
            }

            const key = e.key.toUpperCase();
            if(!key.match(/^[a-z0-9]{1}$/i)) {
              return;
            }
            lastInitial?.classList.remove('active');
            nextInitial?.classList.add('active');

            initials.push(key);
            initials.forEach((init, i) => {
              const initial = document.getElementById('initials-' + (i + 1));
              if(!initial) {
                return;
              }
              initial.innerText = init;
            });

            if(initials.length === 3) {
              enter.classList.add('active');
              nextInitial?.classList.remove('active');
            }
          });
        }
      },
    ];
  }
}