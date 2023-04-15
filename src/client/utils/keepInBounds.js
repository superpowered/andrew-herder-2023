/**
 * keepInBounds
 * Forces rectangle to stay in bounds
 * 
 * @param {Object} rect
 * @param {Number} rect.x
 * @param {Number} rect.y
 * @param {Number} rect.height
 * @param {Number} rect.width
 * @param {Object} game 
 * @param {Number} game.height
 * @param {Number} game.width
 * 
 * @returns {Boolean} - is colliding
 */
const keepInBounds = (rect, game) => {
  if(rect.x < 0) {
    rect.x = 0;
  }
  if(rect.x > game.width - rect.width) {
    rect.x = game.width - rect.width;
  }
  if(rect.y > game.height - rect.height) {
    rect.y = game.height - rect.height;
  }
  if(rect.y < 0) {
    rect.y = 0;
  }
}

// -----------------------------------------------------------------------------

export default keepInBounds;