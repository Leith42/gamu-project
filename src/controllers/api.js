"use strict";

const express = require('express')
	, router = express.Router()
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
			color: player.color,
			isLeader: player.isLeader
		});
		logger.info(`A user joined as "${req.body.nickname}" (${req.body.socketId})`);
	} else {
		res.json({connected: false});
		logger.info(`A user tried to join as "${req.body.nickname}" but failed (${req.body.socketId})`);
	}
});

router.post('/disconnect', (req, res) => {
	if (game.removePlayerBySocketId(req.body.socketId) === true) {
		req.app.io.emit('updatePlayerList', {
			players: game.players,
			numberOfPlayers: game.numberOfPlayers
		});
	}
	res.json({connected: false});
});

router.post('/start', (req, res) => {
	if (game.getGameLeader().socketId === req.body.socketId) {
		game.gameInProgress = true;
		req.app.io.emit('startGame');
		game.games.mapQuiz.start(game.players);
	} else {
		throw "Game start request wasn't made by the game leader!";
	}
	res.sendStatus(200);
});

router.get('/leaderboard', (req, res) => {
	// Sort players in score descending order.
	game.players.sort((a, b) => b.score - a.score);
	res.json(game.players);
});

router.get('/gameInProgress', (req, res) => {
	res.json({gameInProgress: game.gameInProgress});
});

module.exports = router;