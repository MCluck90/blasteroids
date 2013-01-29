/**
 * Collection of utility functions
 */

function normalize(x, y) {
    var length = Math.sqrt( (x * x) + (y * y) );
    return { x: x / length, y: y / length };
}