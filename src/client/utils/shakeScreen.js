/**
 * shakeScreen
 * Does a little screen shake efect by moving the canvas and some other elements
 *
 * @returns {void}
 */
const shakeScreen = () => {
  document.body.classList.remove('shake');
  document.body.classList.add('shake');
  setTimeout(() => document.body.classList.remove('shake'), 500);
};

// -----------------------------------------------------------------------------

export default shakeScreen;
