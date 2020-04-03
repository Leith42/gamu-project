"use strict";

const express = require('express')
	, router = express.Router()
	, logger = require('winston').createLogger()
	, {Game} = require("../models/game")
	, {Player} = require("../models/player");

const game = new Game();

router.post('/connect', (req, res) => {
	const player = new Player();
	player.nickname = req.body.nickname;
	player.socketId = req.body.socketId;

	if (game.addPlayer(player) === true) {
		req.app.io.emit('updatePlayerList', {
			players: game.players,
			numberOfPlayers: game.numberOfPlayers
		});

		res.json({
			connected: true,
			color: player.color
		});
		console.log("🖧 [" + req.body.socketId + "] has set his nickname to \"" + req.body.nickname + "\"");
	} else {
		res.json({connected: false});
		console.log("🖧 [" + req.body.socketId + "] tried to connect as " + req.body.nickname + " but failed.");
	}
});

router.post('/disconnect', (req, res) => {
	if (game.removePlayerBySocketId(req.body.socketId) === true) {
		req.app.io.emit('updatePlayerList', {
			players: game.players,
			numberOfPlayers: game.numberOfPlayers
		});
		res.json({connected: false});
		console.log("🖧 [" + req.body.socketId + "] Player removed from the game session.")
	} else {
		console.log("❌ [" + req.body.socketId + "] Failed to remove the player from the game session!")
	}
});

module.exports = router;