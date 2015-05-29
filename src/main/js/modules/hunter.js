battleship
    .factory("Hunter", function() {
        return {
            createTask : function() {
                return {
                    execute: function(turn) {
                        var piece = turn.attack(0, 1);
                    }
                };
            }
        };
    })
;