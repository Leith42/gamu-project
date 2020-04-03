/*
    Represent a player.
*/
class Player {
	constructor() {
		this.socketId = undefined;
		this.nickname = undefined;
		this.color = undefined;
		this.cursor = {
			posX: 0,
			posY: 0,
		}
	}
}

exports.Player = Player;