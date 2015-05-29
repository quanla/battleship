battleship
    .factory("Map", function() {

        function findAround(x, y, func) {
            for (var x1 = -1; x1 < 3; x1++) {
                for (var y1 = -1; y1 < 3; y1++) {
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

                    if (func(h)) {
                        return {x: x, y: y};
                    }
                }
            }
        }

        return {
            // Not attacked or on or around any ship
            newWhitePoint: function() {
                for (var i=0; i<100;i++) {
                    var x = Math.floor(Math.random() * 10);
                    var y = Math.floor(Math.random() * 10);

                    var h = rows[y][x];
                    if (!h.attacked && !h.aroundShip) {
                        return {
                            x: x,
                            y: y
                        };
                    }
                }

                // Can not find?
                return findPoint(function(h) {
                    return !h.attacked && !h.onShip && !h.aroundShip;
                });
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
                    throw "Out of map: " + x + ", " + y;
                }
                return rows[y][x];
            },
            hasScoutShip: function(p) {
                this.markShip([p]);
            },
            markShip: function(shipPoints) {
                for (var i = 0; i < shipPoints.length; i++) {
                    var p = shipPoints[i];

                    findAround(p.x, p.y, function(x, y) {
                        if (x < 0 || x >= 10 || y < 0 || y >= 10) {
                            return;
                        }
                        rows[y][x].aroundShip = true;
                    });
                }

                for (var i = 0; i < shipPoints.length; i++) {
                    var p = shipPoints[i];

                    var h = this.get(p);
                    h.aroundShip = false;
                    h.onShip = true;
                }
            }

        };
    })
;

function Point(x, y) {
    this.x = x;
    this.y = y;
}