function Bot() {
	var theBot = this;
	var hunter = battleship.get("Hunter");
	var destroyer = battleship.get("Destroyer");

	function createHuntTask() {
        return hunter.createTask().then(function(hitPoint) {
			theBot.task = createDestroyTask(hitPoint);
		});
	}
	function createDestroyTask(hitPoint) {
		return destroyer.createTask(hitPoint).then(function() {
			theBot.task = createHuntTask();
		});
	}

	// For intellij indexing
	var sampleTurn = {
		attack: function(x, y) {
			return true;
		}
	};

	// This will create an infinite loop of hunt and destroy tasks
	this.task = createHuntTask();
}

Bot.prototype.play = function(turn) {
	this.task.execute(turn);
};