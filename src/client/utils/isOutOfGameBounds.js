/**
 * isOutOfGameBounds
 * Checks if rectange is within the game bounds
 *
 * @param {Object} rect
 * @param {Number} rect.x
 * @param {Number} rect.y
 * @param {Number} rect.height
 * @param {Number} rect.width
 * @param {Object} gameBounds
 * @param {Number} gameBounds.height
 * @param {Number} gameBounds.width
 *
 * @returns {Boolean} - is colliding
 */
const isOutOfGameBounds = (rect, gameBounds) => {
  return (
    rect.x > gameBounds.width ||
    rect.x + rect.width < 0 ||
    rect.y > gameBounds.height ||
    rect.y + rect.height < 0
  );
};

// -----------------------------------------------------------------------------

export default isOutOfGameBounds;
