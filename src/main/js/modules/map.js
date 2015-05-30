battleship
    .factory("Map", function() {

        function findAround(x, y, func) {
            for (var x1 = -1; x1 < 2; x1++) {
                for (var y1 = -1; y1 < 2; y1++) {
                    if (func(x + x1, y + y1)) {
                        return true;
                    }
                }
            }
            return false;
        }

        function createRows() {
            var rows = [];
            for (var i = 0; i < 10; i++) {
                var row = [];

                for (var j = 0; j < 10; j++) {
                    row.push({
                        attacked: false,
                        onShip: false, // when attacked && hit
                        aroundShip: false // !onShip
                    });
                }

                rows.push(row);
            }
            return rows;
        }

        var rows = createRows();

        function findPoint(func) {
            for (var y = 0; y < rows.length; y++) {
                var row = rows[y];
                for (var x = 0; x < row.length; x++) {
                    var h = row[x];

                    if (func(h, x, y)) {
                        return {x: x, y: y};
                    }
                }
            }
        }

        var floatingShips = [1, 1, 2, 2, 3, 4, 5];

        var map;
        return map = {
            // Not attacked or on or around any ship and can fit ship
            newWhitePoint: function() {
                var points = [];
                // Can not find?
                findPoint(function(h, x, y) {
                    if (!h.attacked && !h.aroundShip && map.canFitShip(x, y)) {
                        points.push(new Point(x, y));
                    }
                });
                return points[Math.floor(Math.random() * points.length)];
            },
            shouldNotHit: function(x, y) {
                if (y == null) {
                    y = x.y;
                    x = x.x;
                }
                // Out of map
                if (x < 0 || x >= 10 || y < 0 || y >= 10) {
                    return true;
                }

                var h = rows[y][x];
                return h.attacked || h.aroundShip;
            },
            noShip: function(p) {
                this.get(p).attacked = true;
            },
            get: function(x, y) {
                if (y == null) {
                    y = x.y;
                    x = x.x;
                }

                if (x < 0 || x >= 10 || y < 0 || y >= 10) {
                    return null;
                }
                return rows[y][x];
            },
            hasScoutShip: function(p) {
                this.markShip([p]);
            },
            markShip: function(shipPoints) {
                var i, p;
                for (i = 0; i < shipPoints.length; i++) {
                    p = shipPoints[i];

                    findAround(p.x, p.y, function(x, y) {
                        if (x < 0 || x >= 10 || y < 0 || y >= 10) {
                            return;
                        }
                        rows[y][x].aroundShip = true;
                    });
                }

                for (i = 0; i < shipPoints.length; i++) {
                    p = shipPoints[i];

                    var h = this.get(p);
                    h.attacked = true;
                    h.aroundShip = false;
                    h.onShip = true;
                }

                //console.log("Sank " + shipPoints.length);
                //console.log("Before: " + floatingShips);
                //Cols.remove(shipPoints.length, floatingShips);
                //console.log("After : " + floatingShips);
            },

            canFitShip: function(x, y) {
                if (floatingShips.length == 0) {
                    return true;
                }

                function getMax() {
                    function count(dirSet) {
                        var count = 1;
                        for (var i = 0; i < dirSet.length; i++) {
                            var dirChange = dirSet[i];

                            var point = new Point(x, y);

                            for (;;) {
                                dirChange(point);
                                var h = map.get(point);

                                if (h != null && !h.attacked && !h.aroundShip) {
                                    count ++;
                                } else {
                                    break;
                                }
                            }
                        }
                        return count;
                    }

                    return Math.max(
                        count([directionChanges[0], directionChanges[2]]),
                        count([directionChanges[1], directionChanges[3]])
                    );
                }

                var max = getMax();
                return floatingShips[0] <= max;
            },
            log: function() {
                var ret = "";
                for (var i = 0; i < rows.length; i++) {
                    var row = rows[i];

                    var rStr = "[";

                    for (var j = 0; j < rows.length; j++) {
                        var mapPos = rows[j];
                        rStr += mapPos + ", ";
                    }

                    rStr += "]";

                    ret += rStr + "\n";
                }
                return ret;
            }

        };
    })
;

function Point(x, y) {
    this.x = x;
    this.y = y;
}
Point.prototype = {
    toString: function() {
        return "[" + this.x + ", " + this.y + "]";
    }
};

function MapPos() {
    this.attacked= false;
    this.onShip = false; // when attacked && hit
    this.aroundShip = false; // !onShip
}
MapPos.prototype = {
    toString: function() {
        return (this.attacked ? "a" : " ") +
        (this.onShip ? "o" : " ") +
        (this.aroundShip ? "r" : " ");
    }
};