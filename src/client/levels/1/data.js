import axios from 'axios';
import { shakeScreen } from '../../utils';

// -----------------------------------------------------------------------------

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
        string: 'Y\'know,',
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
        string: 'Your\'e supposed to run INTO the pixels!',
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
        string: 'You\'ve managed to expend the amount of minions I can spawn per second.',
        speed: 70,
        delayAfter: 500,
      },
      {
        string: '(No really, I didn\'t code much past this. So uhh....',
        speed: 50,
        classes: ['small'],
      },
      {
        string: 'K. Thnx. Baiii)',
        speed: 50,
        classes: ['small'],
      },
    ],
  }
]

// -----------------------------------------------------------------------------

const levelData = {
  init: (initData) => {

  },
  events: (initData) => {
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
          data.game.textSystem.makeText(textBubbles[5]);
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
          data.game.textSystem.makeText(textBubbles[6]);
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
          data.game.textSystem.makeText(textBubbles[7]);
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
          data.game.textSystem.makeText(textBubbles[8]);
          data.spawnRate -= 200;
        }
      },
      {
        id: 'game_over',
        triggered: false,
        trigger: (data) => data.game.gameOver,
        action: (data) => {
          // TODO: I should move all of this to like a  "level end" file
          data['game_over'] = true;
          data.game.scoreElement.forEach(el => {
            el.classList.remove('active');
          });

          document.documentElement.classList.remove('game-loaded');
          const enter = document.getElementById('initials-submit');
          const endScreen = document.getElementById('end-screen');
          const scoreboard = document.getElementById('scoreboard');
          const scoreboardList = document.getElementById('scoreboard-list');
          endScreen.classList.add('active');

          // TODO: eventually could probably find a way to get mobile input
          if(data.game.isTouch) {
            endScreen.classList.remove('active');
            scoreboard.classList.add('active');
            return;
          }

          let initials = [];
          window.addEventListener('keydown', async e => {
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
                const respData = await axios.post('/api/score', {
                  score: data.game.score + 1,
                  name,
                  date: new Date().toString(),
                }, {
                  headers: {
                    'Content-Type': 'application/json'
                  }
                });
                console.log(respData);

                if(respData?.data?.scores?.length && !respData?.data?.error) {
                  respData.data.scores.forEach((resp) => {
                    const name = resp.name;
                    const score = resp.score;

                    if(typeof name === 'string' && name.length === 3 && !disallowed.includes(name.toLowerCase()) && Number.isInteger(score)) {
                      const listItem = document.createElement('li');
                      const nameSpan = document.createElement('span');
                      nameSpan.innerText = name;
                      const scoreSpan = document.createElement('span');
                      scoreSpan.innerText = score;
                      listItem.appendChild(nameSpan, scoreSpan);
                      listItem.appendChild(scoreSpan);
                      scoreboardList.appendChild(listItem);
                    } else {
                      console.log(name, score, typeof name === 'string', Number.isInteger(score), name.length);
                    }
                  });
                }

                endScreen.classList.remove('active');
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

// -----------------------------------------------------------------------------

export default levelData;