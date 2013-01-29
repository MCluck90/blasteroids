

var Player = (function(Game, undefined) {

    var

    // Color to draw the player as
    COLOR = "#1D1",

    // Color of the laser
    LASER_COLOR = "#00F",

    // Size of the canvas
    CANVAS_SIZE = Game.getCanvasSize(),

    // Speed at which the character moves
    SPEED = 100,

    // Time in which laser is active (in milliseconds)
    ACTIVE_LASER_TIME = 420,

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
     * Resets the player
     */
    function restart() {
        _player.x = 300;
        _player.y = 200;
    }

    var tempContext;

    /**
     * Handles laser collision
     *
     * @param {Object} vector Normalized vector representing laser direction
     */
    function laserCollsion(vector) {
        var laserX = _player.x + ((_player.size.width / 4)),
            laserY = _player.y + ((_player.size.height / 4)),
            collisions = [],
            collider = new GameObject();

        collider._id = null;
        collider.size = {
            width: 10,
            height: 10
        };

        while ( (laserX > 0 && laserX < CANVAS_SIZE.x) && (laserY > 0 && laserY < CANVAS_SIZE.y) ) {
            collider.x = laserX;
            collider.y = laserY;

            collisions = QuadTree.getCollisions(collider);

            if (collisions.length > 0) {
                for (var i = 0, len = collisions.length; i < len; i++) {
                    if (collisions[i] !== _player) {
                        return collisions[i];
                    }
                }
            }

            laserX += vector.x * 5;
            laserY += vector.y * 5;
        }

        return false;
    }

    /**
     * Define how the player is actually drawn
     *
     * @param {CanvasRenderingContext2D} context
     */
    _player.draw = function(context) {
        tempContext = context;
        if (laserActive && laserCooldown > ACTIVE_LASER_TIME * 0.9) {
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
            restart();
        }

        // Find out if the player shot an enemy
        if (laserActive && laserCooldown == ACTIVE_LASER_TIME) {
            var mousePosition = Game.getMousePosition(),
                playerX = _player.x + (_player.size.width / 2),
                playerY = _player.y + (_player.size.height / 2),
                vector = normalize(mousePosition.x - playerX, mousePosition.y - playerY),
                collision = laserCollsion(vector);

            if (collision) {
                Game.removeObject(collision);
            }
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
            laserCooldown = 0;
        }
    };

    return _player;

})(Game);