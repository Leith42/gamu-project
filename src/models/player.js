/*
    Represent a player.
*/
class Player {
	constructor() {
		this.socketId = undefined;
		this.nickname = undefined;
		this.color = undefined;
		this.isLeader = false;
		this.score = 0;
		this.gameResponses = [];
		this.cursor = {
			posX: 0,
			posY: 0,
		}
	}
}

exports.Player = Player;