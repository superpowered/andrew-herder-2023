
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
const isRectangularCollision = (rect1, rect2) => {
  return rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y;
}

// -----------------------------------------------------------------------------

export default isRectangularCollision;