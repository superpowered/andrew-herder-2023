/**
 * getDistance
 * Finds the distance between 2 points
 * 
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 * 
 * @returns {Number} - distance
 */
 const getDistance = (x1, y1, x2, y2) => {
  const y = x2 - x1;
  const x = y2 - y1;
  return Math.sqrt(x * x + y * y);
}

// -----------------------------------------------------------------------------

export default getDistance;
