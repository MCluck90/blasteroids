

var Player = (function(Game, undefined) {

    var

    // Color to draw the player as
    COLOR = "#1D1",

    // Speed at which the character moves
    SPEED = 10,

    // The actual object being passed back
    _player = new GameObject();

    // Initialize the players' size
    _player.size = {
        width: 50,
        height: 50
    };

    /**
     * Define how the player is actually drawn
     *
     * @param {CanvasRenderingContext2D} context
     */
    _player.draw = function(context) {
        context.fillStyle = COLOR;
        context.fillRect(_player.x, _player.y, _player.size.width, _player.size.height);
    };

    /**
     * Define how the player moves
     */
    _player.update = function(delta) {
        // Adjust movement based on amount of time passed
        var change = SPEED * delta;

        // Move the player is a movement key is pressed
        if (Game.isKeyDown(KEYS.UP) || Game.isKeyDown(KEYS.W)) {
            _player.y -= change;
        } else if (Game.isKeyDown(KEYS.DOWN) || Game.isKeyDown(KEYS.S)) {
            _player.y += change;
        }

        if (Game.isKeyDown(KEYS.LEFT) || Game.isKeyDown(KEYS.A)) {
            _player.x -= change;
        } else if (Game.isKeyDown(KEYS.RIGHT) || Game.isKeyDown(KEYS.D)) {
            _player.x += change;
        }

        if (Game.isMousePressed()) {
            // Move the player towards the mouse
            var mousePosition = Game.getMousePosition(),
                x = mousePosition.x - _player.x - (_player.size.width / 2),
                y = mousePosition.y - _player.y - (_player.size.height / 2),
                vLength = Math.sqrt((x * x) + (y * y));

            if (Math.abs(x) > 2) {
                x /= vLength;
                _player.x += x * change;
            }

            if (Math.abs(y) > 2) {
                y /= vLength;
                _player.y += y * change;
            }
        }
    };

    return _player;

})(Game);