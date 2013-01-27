/**
 * Defines a simple game object to enforce function declarations.
 */

var GameObject = function() {
    this._id = undefined;

    this.x = 0;

    this.y = 0;

    this.size = {
        width: 0,
        height: 0
    };

    /**
     *
     * @param {CanvasRenderingContext2D} context
     */
    this.draw = function(context) {};

    /**
     * @param {number} delta
     */
    this.update = function(delta) {};
};