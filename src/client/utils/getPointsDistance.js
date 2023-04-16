// Local Modules
import getDistance from './getDistance';

// -----------------------------------------------------------------------------

/**
 * getPointsDistance
 * Finds the distance between 2 points
 *
 * @param {Object} point1
 * @param {Number} point1.x
 * @param {Number} point1.y
 * @param {Object} point2
 * @param {Number} point2.x
 * @param {Number} point2.y
 *
 * @returns {Number} - distance
 */
const getPointsDistance = ({ x: x1, y: y1 }, { x: x2, y: y2 }) => {
  return getDistance(x1, y1, x2, y2);
};

// -----------------------------------------------------------------------------

export default getPointsDistance;
