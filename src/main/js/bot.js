function Bot() {
	this.task = battleship.get("Hunter").createTask();
}

Bot.prototype.play = function(turn) {
	this.task.execute(turn);
};