/**
 * Quad Tree used for detecting collisions
 */

var QuadTree = (function(undefined) {

    var

    // Size of the collision area
    worldWidth = 0,
    worldHeight = 0,

    // Root of the tree
    root = {},

    // Size of each cell
    CELL_WIDTH = 10,
    CELL_HEIGHT = 10;

    /**
     * Each node carries a set of GameObjects
     *
     * @param {number} x The x origin
     * @param {number} y The y origin
     * @param {number} width Width of the bucket
     * @param {number} height Height of the bucket
     */
    function TreeNode(x, y, width, height) {
        var self = this;

        // Origin of the node
        this.x = x || 0;
        this.y = y || 0;

        // Dimensions of the node
        this.width = width || 0;
        this.height = height || 0;

        /**
         * Returns the quadrant it should go to
         *
         * @param obj
         */
        this.getQuadrant = function(obj) {
            var halfWidth = self.width / 2,
                halfHeight = self.height / 2,
                quadrant = 0;

            quadrant += obj.x > halfWidth * 1;
            quadrant += obj.y > halfHeight * 2;
            return quadrant;
        };

        /**
         * Inserts an object in to the tree
         *
         * @param {GameObject} obj
         */
        this.insert = function(obj) {
            // If this node has an objects property, it's a leaf
            if (self.objects !== undefined) {
                self.objects.push(obj);
            } else {
                var quadrant = self.getQuadrant(obj);
                self.children[quadrant].insert(obj);
            }
        };

        /**
         * Removes an object from the tree
         *
         * @param {GameObject} obj
         */
        this.remove = function(obj) {
            // If this node has an objects property, it's a leaf
            if (self.objects !== undefined) {
                for (var i = 0, len = self.objects.length; i < len; i++) {
                    if (self.objects[i]._id === obj._id) {
                        self.objects.splice(i, 1);
                        break;
                    }
                }
            } else {
                var quadrant = self.getQuadrant(obj);
                self.children[quadrant].remove(obj);
            }
        };

        /**
         * Returns whether or not two objects are colliding
         *
         * @param {GameObject} a
         * @param {GameObject} b
         */
        this.isColliding = function(a, b) {
            var xCollision = a.x - b.x,
                yCollision = a.y - b.y,
                widthCheck = (xCollision >= 0) ? b.size.width : a.size.width,
                heightCheck = (yCollision >= 0) ? b.size.height : a.size.height;

            return (Math.abs(xCollision) < widthCheck) && (Math.abs(yCollision) < heightCheck);
        };

        /**
         * Returns the set of collisions for the object
         *
         * @param {GameObject} obj
         */
        this.getCollisions = function(obj) {
            // If this node has an objects property, it's a leaf
            if (self.objects !== undefined) {
                var collisions = [];
                for (var i = 0, len = self.objects.length; i < len; i++) {
                    var other = self.objects[i];

                    if (obj._id == other._id)
                        continue;

                    if (self.isColliding(obj, other)) {
                        collisions.push(other);
                    }
                }

                return collisions;
            } else {
                var quadrant = self.getQuadrant(obj);
                return self.children[quadrant].getCollisions(obj);
            }
        };

        if (this.width > CELL_WIDTH || this.height > CELL_HEIGHT) {
            this.children = [];

            var childWidth = this.width / 2,
                childHeight = this.height / 2;

            this.children.push(new TreeNode(x, y, childWidth, childHeight));
            this.children.push(new TreeNode(x + childWidth, y, childWidth, childHeight));
            this.children.push(new TreeNode(x, y + childHeight, childWidth, childHeight));
            this.children.push(new TreeNode(x + childWidth, y + childHeight, childWidth, childHeight));
        } else {
            this.objects = [];
        }
    }

    return {
        /**
         * Initialize the collision area
         *
         * @param {number} width Width of the playing area
         * @param {number} height Height of the playing area
         */
        init: function(width, height) {
            worldWidth = width;
            worldHeight = height;

            root = new TreeNode(0, 0, worldWidth, worldHeight);
        },

        /**
         * Inserts an object to the tree
         *
         * @param {GameObject} obj Object to be inserted in to the tree
         */
        insert: function(obj) {
            root.insert(obj);
        },

        /**
         * Removes an object from the tree
         *
         * @param {GameObject} obj Object to remove from the tree
         */
        remove: function(obj) {
            root.remove(obj);
        },

        getCollisions: function(obj) {
            return root.getCollisions(obj);
        },

        logRoot: function() {
            console.log(root);
        }
    }

})();