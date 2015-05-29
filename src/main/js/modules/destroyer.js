battleship
    .factory("Destroyer", function(Map) {
        return {
            createTask : function(firstHit) {
                var onDestroyed;

                var isVertical = null;

                var shipPoints = [];

                function examine() {
                    // Examine
                    if (Map.shouldNotHit(firstHit.x - 1, firstHit.y) && Map.shouldNotHit(firstHit.x + 1, firstHit.y)) {
                        isVertical = true;
                    } else if (Map.shouldNotHit(firstHit.x, firstHit.y - 1) && Map.shouldNotHit(firstHit.x, firstHit.y + 1)) {
                        isVertical = false;
                    }
                }

                function hit(p, result) {
                    var h = Map.get(p);
                    h.attacked = true;
                    h.onShip = true;

                    shipPoints.push(p);

                    if (result === true) {

                    } else {
                        Map.markShip(shipPoints);
                        onDestroyed();
                    }
                }

                hit(firstHit, true);
                examine();

                return {
                    execute: function(turn) {
                        if (isVertical == null) {
                            // Try vertical
                            var attacking = new Point(firstHit.x, firstHit.y - 1);
                            if (Map.shouldNotHit(attacking)) {
                                attacking = new Point(firstHit.x, firstHit.y + 1);
                                if (Map.shouldNotHit(attacking)) {
                                    isVertical = false;
                                    this.execute(turn); // Go back with isVertical set
                                    return;
                                }
                            }

                            var result = turn.attack(attacking.x, attacking.y);
                            if (!result) {
                                // Missed
                                Map.noShip(attacking);
                            } else {
                                isVertical = true;
                                hit(attacking, result);
                            }
                        } else { // isVertical != null
                            var dirChanges = isVertical ? [directionChanges[0], directionChanges[2]] : [directionChanges[1], directionChanges[3]];

                            var point = ObjectUtil.clone(firstHit);
                            for (var i = 0; i < dirChanges.length; i++) {
                                var dirChange = dirChanges[i];

                                THIS_DIRECTION:
                                for (;;) {
                                    dirChange(point);
                                    var h = Map.get(point);
                                    if (!h.attacked) {
                                        if (!Map.shouldNotHit(point)) {
                                            var result = turn.attack(point.x, point.y);
                                            if (!result) {
                                                // Missed
                                                Map.noShip(point);
                                            } else {
                                                isVertical = true;
                                                hit(point, result);
                                            }
                                            return;
                                        } else {
                                            break THIS_DIRECTION;
                                        }
                                    } else if (h.attacked) {
                                        if (h.onShip) {
                                            // continue this direction
                                            continue THIS_DIRECTION;
                                        } else {
                                            break THIS_DIRECTION;
                                        }
                                    }
                                }

                                // Apply to firstPoint until find a !attacked && !shouldNotAttack
                            }

                            throw "Why can not find a attack point?";
                        }
                    },
                    then: function(onDestroyed1) {
                        onDestroyed = onDestroyed1;
                        return this;
                    }
                };
            }
        };
    })
;


var directionChanges = {
    0: function(p) {
        p.y--;
    },
    1: function(p) {
        p.x++;
    },
    2: function(p) {
        p.y++;
    },
    3: function(p) {
        p.x--;
    }
};