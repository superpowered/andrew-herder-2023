
/**
 * isRectangularCollision
 * Checks if two rectangles are colliding or not
 * 
 * @param {Object} rect1
 * @param {Number} rect1.x
 * @param {Number} rect1.y
 * @param {Number} rect1.height
 * @param {Number} rect1.width
 * @param {Object} rect2 
 * @param {Number} rect2.x
 * @param {Number} rect2.y
 * @param {Number} rect2.height
 * @param {Number} rect2.width
 * 
 * @returns {Boolean} - is colliding
 */
export const isRectangularCollision = (rect1, rect2) => {
  return rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y;
}

/**
 * isInGameBounds
 * Checks if rectange is within the game bounds
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
export const isInGameBounds = (rect, game) => {
  return rect.x > game.width || rect.x + rect.width < 0 || rect.y > game.height || rect.y + rect.height < 0;
}

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
export const keepInBounds = (rect, game) => {
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