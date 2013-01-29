/**
 * The core of the game stuff.
 */

var Game = (function($, undefined) {

    var
    // The canvas element
    canvas = document.getElementById('canvas'),

    // Dimensions of the canvas
    WIDTH = canvas.width,
    HEIGHT = canvas.height,
    TOP = $(canvas).offset().top,
    LEFT = $(canvas).offset().left,

    // Drawing context, used for rendering stuff to the canvas
    context = canvas.getContext('2d'),

    // All of the game objects
    gameObjects = {},

    // Used to assign IDs
    nextObjectID = 0,

    // Key(s) currently pressed down
    keysPressed = {},

    // If the mouse is currently pressed
    mousePressed = false,

    // Current position of the mouse
    mousePosition = {
        x: 0,
        y: 0
    },

    // Color for clearing the canvas on each re-draw
    CLEAR_COLOR = '#000',

    // Keep track of time in the game
    gameTime = new Date(),

    // Frames per second
    FPS = 40;

    // Update all of the objects
    function update() {
        var delta = (new Date() - gameTime) / 1000;
        for (var id in gameObjects) {
            if (gameObjects.hasOwnProperty(id)) {
                var obj = gameObjects[id],
                    mock = {
                        _id: id,
                        x: obj.x,
                        y: obj.y
                    };
                gameObjects[id].update(delta);
                QuadTree.remove(mock);
                QuadTree.insert(obj);
            }
        }

        gameTime = new Date();
    }

    // Draw all of the objects
    function draw() {
        context.fillStyle = CLEAR_COLOR;
        context.fillRect(0, 0, WIDTH, HEIGHT);

        for (var id in gameObjects) {
            if (gameObjects.hasOwnProperty(id)) {
                gameObjects[id].draw(context);
            }
        }
    }

    // Capture the key events
    $(document).keydown(function(e) {
        keysPressed[e.which] = true;
    });

    $(document).keyup(function(e) {
        keysPressed[e.which] = undefined;
    });

    // Capture the mouse events
    $(document).mousedown(function() {
        mousePressed = true;
    });

    $(document).mouseup(function() {
        mousePressed = false;
    });

    $(document).mousemove(function(e) {
        mousePosition.x = e.clientX - LEFT + $(window).scrollLeft();
        mousePosition.y = e.clientY - TOP + $(window).scrollTop();
    });

    // Initialize the game
    QuadTree.init(WIDTH, HEIGHT);
    setInterval(function() {
        update();
        draw();
    }, 1000 / FPS);

    return {
        /**
         * Add/Set an object in the world
         *
         * @param {GameObject} obj
         * @return {number}
         */
        addObject: function(obj) {
            // Assign a new object an ID
            if (obj._id === undefined) {
                obj._id = nextObjectID++;
            }

            gameObjects['' + obj._id] = obj;

            QuadTree.insert(obj);

            return obj._id;
        },

        /**
         * Removes an object from the world
         *
         * @param {GameObject} obj
         */
        removeObject: function(obj) {
            if (obj._id === undefined) {
                return;
            }

            gameObjects['' + obj._id] = undefined;
        },

        /**
         * Returns if a key is currently pressed
         *
         * @param {number} keyCode
         * @return {Boolean}
         */
        isKeyDown: function(keyCode) {
            return keysPressed[keyCode] === true;
        },

        /**
         * Returns if the mouse is currently pressed
         * @return {Boolean}
         */
        isMousePressed: function() {
            return mousePressed;
        },

        /**
         * Returns the current position of the mouse
         * @return {Object}
         */
        getMousePosition: function() {
            return mousePosition;
        },

        /**
         * Returns the size of the canvas
         *
         * @return {Object}
         */
        getCanvasSize: function() {
            return { x: WIDTH, y: HEIGHT };
        }
    }

})(jQuery);