/*
        Main game structure.
*/

const {MapQuiz} = require("./mapQuiz");

class Game {
	constructor() {
		this.gameInProgress = false; // True if the game is currently in progress.
		this.players = []; // Array of objects, each object represent a player.
		this.numberOfPlayers = 0; // Number of players currently connected to the game.
		this.colors = [
			{color: "blue", available: true},
			{color: "red", available: true},
			{color: "green", available: true},
			{color: "orange", available: true},
			{color: "pink", available: true},
		];
		this.games = {
			mapQuiz: new MapQuiz()
		};
	}

	/*
		Return the game leader.
 	*/
	getGameLeader() {
		for (let i = 0; i < this.players.length; i++) {
			if (this.players[i].isLeader === true) {
				return this.players[i];
			}
		}
		return null;
	}

	/*
	    Return true if the given player nickname is available.
	 */
	isPlayerNicknameAvailable(player) {
		for (let i = 0; i < this.players.length; i++) {
			if (this.players[i].nickname === player.nickname) {
				return false;
			}
		}
		return true;
	}

	/*
		Return an available color.
	 */
	getAvailableColor() {
		for (let i = 0; i < this.colors.length; i++) {
			if (this.colors[i].available === true) {
				this.colors[i].available = false;
				return this.colors[i].color;
			}
		}
		return null;
	}

	/*
		Set the given code color as available.
	 */
	setColorAsAvailable(color) {
		for (let i = 0; i < this.colors.length; i++) {
			if (this.colors[i].color === color) {
				this.colors[i].available = true;
				return;
			}
		}
	}

	/*
	    Return true if the player was successfully added to the game.
	*/
	addPlayer(player) {
		if (this.numberOfPlayers < 5 && this.isPlayerNicknameAvailable(player) === true) {
			player.color = this.getAvailableColor();
			player.isLeader = !this.numberOfPlayers;
			this.players.push(player);
			this.numberOfPlayers++;
			return true;
		}
		return false;
	}

	/*
		Gives a player the game lead.
	 */
	setNewGameLeader() {
		for (let i = 0; i < this.players.length; i++) {
			if (this.players[i].isLeader === false) {
				this.players[i].isLeader = true;
				return;
			}
		}
	}

	/*
	    Return true if the player was successfully removed from the game.
	*/
	removePlayerBySocketId(socketId) {
		for (let i = 0; i < this.players.length; i++) {
			if (this.players[i].socketId === socketId) {
				this.setColorAsAvailable(this.players[i].color);
				if (this.players[i].isLeader === true) {
					this.setNewGameLeader();
				}
				logger.info(`${this.players[i].nickname} has disconnected (${socketId})`);
				this.players.splice(i, 1);
				this.numberOfPlayers--;
				return true;
			}
		}
		return false;
	}
}

exports.Game = Game;