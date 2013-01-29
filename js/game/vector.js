


function Vector2D(x, y) {
    this.x = x || 0;
    this.y = y || 0;
}

Vector2D.equals = function(p1, p2) {
    return p1.x == p2.x && p1.y == p2.y;
};

Vector2D.calculateGradient = function(p1, p2) {
    if (p1.x == p2.x) {
        // Vertical line
        return null;
    } else {
        return (p1.y - p2.y) / (p1.x - p2.x);
    }
};

Vector2D.calculateYAxisIntersect = function(m, p1) {
    return p1.y - (m * p1.x);
};

Vector2D.getIntersectPoint = function(p1, p2, p3, p4) {
    var m1 = Vector2D.calculateGradient(p1, p2),
        m2 = Vector2D.calculateGradient(p3, p4),
        x, y, b1, b2;

    // Check if the lines are parallel
    if (m1 != m2) {
        // See if either line is vertical
        if (m1 != null && m2 != null) {
            b1 = Vector2D.calculateYAxisIntersect(m1, p1);
            b2 = Vector2D.calculateYAxisIntersect(m2, p3);
            x = (b2 - b1) / (m1 - m2);
            y = (m1 * x) + b1;
        } else {
            // Line 1 is vertical so use line 2's values
            if (m1 == null) {
                b2 = Vector2D.calculateYAxisIntersect(m2, p3);
                x = p1.x;
                y = (m2 * x) + b2;
            } else {
                b1 = Vector2D.calculateYAxisIntersect(m1, p1);
                x = p3.x,
                y = (m1 * x) + b1;
            }
        }

        return new Vector2D(x, y);
    } else {
        b1 = null;
        b2 = null;

        if (m1 != null) {
            b1 = Vector2D.calculateYAxisIntersect(m1, p1);
        }

        if (m2 != null) {
            b2 = Vector2D.calculateYAxisIntersect(m2, p3);
        }

        // If these parallels lines are on top of each other
        if (b1 == b2) {
            return new Vector2D(p2.x, p2.y);
        } else {
            return null;
        }
    }

};