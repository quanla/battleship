battleship
    .factory("Hunter", function(Map) {
        return {
            createTask : function() {
                var onHit;

                return {
                    execute: function(turn) {
                        var p = Map.newWhitePoint();

                        var piece = turn.attack(p.x, p.y);

                        if (piece) {
                            if (piece === true) {
                                onHit(p);
                            } else {
                                console.log("Destroyed a Scout");
                                Map.hasScoutShip(p);
                            }
                        } else {
                            Map.noShip(p);
                        }
                    },
                    then: function(onHit1) {
                        onHit = onHit1;
                        return this;
                    }
                };
            }
        };
    })
;