

var Player = (function(Game, undefined) {

    var

    // Color to draw the player as
    COLOR = "#1D1",

    // Color of the laser
    LASER_COLOR = "#00F",

    // Speed at which the character moves
    SPEED = 100,

    // Time in which laser is active (in milliseconds)
    ACTIVE_LASER_TIME = 500,

    // Cooldown time on the laser
    laserCooldown = 0,

    // If true, laser is being fired
    laserActive = false,

    // The actual object being passed back
    _player = new GameObject();

    // Initialize the players' size
    _player.size = {
        width: 20,
        height: 20
    };

    _player.x = 300;
    _player.y = 200;

    /**
     * Define how the player is actually drawn
     *
     * @param {CanvasRenderingContext2D} context
     */
    _player.draw = function(context) {
        if (laserActive && laserCooldown > ACTIVE_LASER_TIME / 2) {
            var mousePosition = Game.getMousePosition(),
                playerX = _player.x + (_player.size.width / 2),
                playerY = _player.y + (_player.size.height / 2),
                vector = normalize(mousePosition.x - playerX, mousePosition.y - playerY);

            context.beginPath();
            context.strokeStyle = LASER_COLOR;
            context.moveTo(playerX, playerY);
            context.lineTo(vector.x * 100000, vector.y * 100000);
            context.stroke();
        }

        context.fillStyle = COLOR;
        context.fillRect(_player.x, _player.y, _player.size.width, _player.size.height);
    };

    /**
     * Define how the player moves
     */
    _player.update = function(delta) {
        if (QuadTree.getCollisions(_player).length > 0) {
            COLOR = "#D1D";
        } else {
            COLOR = "#1D1";
        }

        // Adjust movement based on amount of time passed
        var change = SPEED * delta;

        laserCooldown -= delta * 1000;
        if (laserCooldown < 0) {
            laserCooldown = 0;
        }

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
            if (laserCooldown <= 0) {
                laserActive = true;
                laserCooldown = ACTIVE_LASER_TIME;
            }
        } else {
            laserActive = false;
        }
    };

    return _player;

})(Game);