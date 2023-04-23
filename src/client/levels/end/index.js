import axios from 'axios';

// Constants
import { DISALLOWED_NAMES } from '../../constants';

// Utils
import { shakeScreen } from '../../utils';

// -----------------------------------------------------------------------------

class Level {
  constructor(game) {
    this.game = game;

    this.initials = [];

    // Relevant HTML bits
    this.enter = document.getElementById('initials-submit');
    this.endScreen = document.getElementById('end-screen');
    this.scoreboard = document.getElementById('scoreboard');
    this.scoreboardList = document.getElementById('scoreboard-list');
  }

  init = async () => {
    this.initialized = true;

    // Toggle off other ui elements
    this.game.scoreElement.forEach((el) => {
      el.classList.remove('active');
    });
    document.documentElement.classList.remove('game-loaded');

    // Show our screen
    this.endScreen.classList.add('active');

    // If we're on mobile, we'll just skip to the score screen for now.
    // TODO: eventually could probably find a way to get mobile input in a good way
    if (this.game.isTouch) {
      const respData = await axios.get('/api/score');
      this.updateScoreBoard(respData);
    }

    // Attach our listener to handle input as it comes in.
    window.addEventListener('keydown', this.handleInitialInput);
  };

  // eslint-disable-next-line class-methods-use-this
  update() {}

  // We'll fire this to make sure we've cleaned up anything we may have left behind accidentally
  unload() {
    delete this;
  }

  updateScoreBoard = (data) => {
    if (!data?.data?.scores?.length || data?.data?.error) {
      // TODO: some type of error handling here, probably just don't show scores, and only the restart button
      return;
    }

    data.data.scores.forEach((resp) => {
      const { score, name } = resp;
      if (
        typeof name === 'string' &&
        name.length === 3 &&
        !DISALLOWED_NAMES.includes(name.toLowerCase()) &&
        Number.isInteger(score)
      ) {
        const listItem = document.createElement('li');
        const nameSpan = document.createElement('span');
        const scoreSpan = document.createElement('span');
        nameSpan.innerText = name;
        scoreSpan.innerText = score;
        listItem.appendChild(nameSpan);
        listItem.appendChild(scoreSpan);
        this.scoreboardList.appendChild(listItem);
      }
    });

    // Show scoreboard screen
    this.endScreen.classList.remove('active');
    this.scoreboard.classList.add('active');
  };

  submitScore = async () => {
    // Only move forward with the right amount of keys
    if (this.initials.length !== 3) {
      return;
    }

    // Don't allow swears
    const enteredName = this.initials.join('');
    if (DISALLOWED_NAMES.includes(enteredName.toLowerCase())) {
      shakeScreen();
      return;
    }

    // Post data to server
    const respData = await axios.post(
      '/api/score',
      {
        score: this.game.score,
        name: enteredName,
        date: new Date().toString(),
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    this.updateScoreBoard(respData);
  };

  handleInitialInput = (e) => {
    const lastInitial = document.getElementById(
      `initials-${this.initials.length}`,
    );
    const nextInitial = document.getElementById(
      `initials-${this.initials.length + 1}`,
    );

    const key = e.key.toUpperCase();

    // Handle removal of keys
    if (
      (key === 'DELETE' || key === 'BACKSPACE' || key === 'ESCAPE') &&
      this.initials.length
    ) {
      this.initials.pop();
      lastInitial.innerText = '';

      // Toggle classes
      lastInitial?.classList.add('active');
      nextInitial?.classList.remove('active');
      this.enter.classList.remove('active');
      return;
    }

    // If we have 3 keys, and we're pressing enter, we can try to submit
    if (this.initials.length === 3 && key === 'ENTER') {
      this.submitScore();
      return;
    }

    // If we have 3 keys, we don't need to run the rest of this.
    if (this.initials.length >= 3) {
      return;
    }

    // Bail with bad key
    if (!key.match(/^[a-z0-9]{1}$/i)) {
      return;
    }

    // Add to list of initials
    this.initials.push(key);
    this.initials.forEach((init, i) => {
      const initial = document.getElementById(`initials-${i + 1}`);
      if (!initial) {
        return;
      }
      initial.innerText = init;
    });

    // Mark classes on input items
    lastInitial?.classList.remove('active');
    nextInitial?.classList.add('active');
    // If we're at the cap, show the prompt to submit
    if (this.initials.length === 3) {
      this.enter.classList.add('active');
      nextInitial?.classList.remove('active');
    }
  };
}

// -----------------------------------------------------------------------------

export default Level;
