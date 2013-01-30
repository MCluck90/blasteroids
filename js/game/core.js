/**
 * Blasteroids!
 *
 * Created for January entry of One Game A Month
 *
 * Author: Mike Cluck
 * Version: 1.0
 *
 *             DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 *                   Version 2, December 2004
 *
 * Copyright (C) 2004 Sam Hocevar <sam@hocevar.net>
 *
 * Everyone is permitted to copy and distribute verbatim or modified
 * copies of this license document, and changing it is allowed as long
 * as the name is changed.
 *
 * DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 * TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION
 *
 * 0. You just DO WHAT THE FUCK YOU WANT TO.
 */

var Game = (function($, undefined) {

    var

    // The main Game instance
    _game,

    // The current players' score
    score = 0,

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
    FPS = 40,

    // The actual game loop
    gameLoop,

    // If true, the game is over (wait for an 'R' key press)
    isGameOver = false;

    // Update all of the objects
    function update() {
        if (isGameOver) {
            return;
        }

        var delta = (new Date() - gameTime) / 1000;
        for (var id in gameObjects) {
            if (gameObjects.hasOwnProperty(id) && gameObjects[id] instanceof GameObject) {
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
        if (isGameOver) {
            return;
        }

        context.fillStyle = CLEAR_COLOR;
        context.fillRect(0, 0, WIDTH, HEIGHT);

        for (var id in gameObjects) {
            if (gameObjects.hasOwnProperty(id) && gameObjects[id] instanceof GameObject) {
                gameObjects[id].draw(context);
            }
        }

        context.fillStyle = "#FFF";
        context.font = "bold 14px 'Roboto Condensed',Arial,sans-serif";
        context.fillText("Score: " + score, 24, 24);
    }

    // Capture the key events
    $(document).keydown(function(e) {
        keysPressed[e.which] = true;

        if (isGameOver && e.which == KEYS.R) {
            _game.resetGame();
            isGameOver = false;
        }
    });

    $(document).keyup(function(e) {
        keysPressed[e.which] = undefined;
    });

    // Capture the mouse events
    $(document).mousedown(function(e) {
        if (e.which == 1) {
            mousePressed = true;
        }
    });

    $(document).mouseup(function(e) {
        if (e.which == 1) {
            mousePressed = false;
        }
    });

    $(document).mousemove(function(e) {
        mousePosition.x = e.clientX - LEFT + $(window).scrollLeft();
        mousePosition.y = e.clientY - TOP + $(window).scrollTop();
    });

    // Tell the user how to start the game
    context.fillStyle = CLEAR_COLOR;
    context.fillRect(0, 0, WIDTH, HEIGHT);

    context.fillStyle = "#F00";
    context.font = "80px 'Droid Sans',Arial,sans-serif";
    context.fillText("Blasteroids!", (WIDTH / 4) - 40, (HEIGHT / 4));

    context.font = "30px 'Droid Sans',Arial,sans-serif";
    context.fillText("Just like Asteroids!", (WIDTH / 3) - 10, (HEIGHT / 3));

    context.font = "12px 'Droid Sans',Arial,sans-serif";
    context.fillText("(without the physics, or spaceships or asteroids...)", (WIDTH / 3) - 20, (HEIGHT / 3) + 20);

    context.fillStyle = "#FFF";
    context.font = "40px 'Droid Sans',Arial,sans-serif";
    context.fillText("Click to Start", (WIDTH / 2) - 110, (HEIGHT *.9));

    _game = {
        /**
         * Initialize the game
         */
        init: function() {
            clearInterval(gameLoop);
            QuadTree.init(WIDTH, HEIGHT);
            Game.addObject(new Enemy());
            Game.addObject(Player);
            gameLoop = setInterval(function() {
                update();
                draw();
            }, 1000 / FPS);
        },

        stop: function() {
            clearInterval(gameLoop);
        },

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
            QuadTree.remove(obj);
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
        },

        addScore: function(x) {
            x = x || 100;
            score += x;
        },

        resetGame: function() {
            for (var id in gameObjects) {
                if (gameObjects.hasOwnProperty(id) && gameObjects[id] instanceof GameObject) {
                    _game.removeObject(gameObjects[id]);
                }
            }

            gameObjects = {};
            _game.init();
        },

        gameOver: function() {
            isGameOver = true;
            _game.stop();

            context.fillStyle = "#FFF";
            context.font = "80px 'Droid Sans',Arial,sans-serif";
            context.fillText("Game Over!", (WIDTH / 4) - 40, (HEIGHT / 4));

            context.font = "30px 'Droid Sans',Arial,sans-serif";
            context.fillText("Press R to restart", (WIDTH / 2) - 110, (HEIGHT *.9));
        }
    };

    return _game;

})(jQuery);