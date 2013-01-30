

var Enemy = (function(Game, undefined) {
    var

    // Minimum speed
    MIN_SPEED = 50,

    // Maximum possible speed
    MAX_SPEED = 250,

    // Color of the enemy
    COLOR = "#F00";

    return function() {
        var self = this,
            canvasSize = Game.getCanvasSize();

        this.prototype = GameObject.prototype;
        this.x = (Math.abs( Math.random() * canvasSize.x ) + (canvasSize.x / 2)) * ( (Math.random() >= .5) ? -1 : 1 );
        this.y = (Math.abs( Math.random() * canvasSize.y ) + (canvasSize.y / 2)) * ( (Math.random() >= .5) ? -1 : 1 );
        this.size = {
            width: 20,
            height: 20
        };

        // Determine the direction it's going to go
        var xDirection = Math.random(),
            yDirection = 1 - xDirection;

        this.direction = {
            x: xDirection * (Math.random() >= .5) ? -1 : 1,
            y: yDirection * (Math.random() >= .5) ? -1 : 1
        };

        // Give it a random speed
        this.speed = Math.random() * (MAX_SPEED - MIN_SPEED) + MIN_SPEED;

        this.draw = function(context) {
            context.fillStyle = COLOR;
            context.fillRect(self.x, self.y, self.size.width, self.size.height);
        };

        this.update = function(delta) {
            self.x += delta * self.speed * self.direction.x;
            self.y += delta * self.speed * self.direction.y;

            // Wrap it around the level
            if (self.x > canvasSize.x) {
                self.x = -self.size.width;
            } else if (self.x + self.size.width < 0) {
                self.x = canvasSize.x;
            }

            if (self.y > canvasSize.y) {
                self.y = -self.size.height;
            } else if (self.y + self.size.height < 0) {
                self.y = canvasSize.y - self.size.height;
            }
        }
    }

})(Game);
Enemy.prototype = GameObject.prototype;