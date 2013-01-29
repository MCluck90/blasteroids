/**
 * Collection of utility functions
 */

function normalize(x, y) {
    var length = Math.sqrt( (x * x) + (y * y) );
    return { x: x / length, y: y / length };
}

/**
 * Returns the sign of a function
 * @param {Number} x
 * @return {Number}
 */
Math.sign = function(x) {
    return x ? x < 0 ? -1 : 1 : 0;
};