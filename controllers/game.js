"use strict";

const express = require('express')
    , router = express.Router();

let game = {
    players: [],
    numberOfPlayers: 0,
};

router.post('/connect', (req, res) => {
    function isDuplicate(nickname) {
        let isDup = false;
        game.players.forEach((player) => {
            if (player.nickname === nickname) {
                return isDup = true;
            }
        });
        return isDup;
    }

    if (isDuplicate(req.body.nickname) === false) {
        game.players.push({
            nickname: req.body.nickname,
            socketId: req.body.socketId,
            cursor: {
                x: 0,
                y: 0,
                color: undefined
            }
        });
        game.numberOfPlayers++;

        req.app.io.emit('updatePlayerList', {
            players: game.players,
            numberOfPlayers: game.numberOfPlayers
        });

        res.json({connected: true});
        console.log('🖧 [' + req.body.socketId + '] ' + req.body.nickname + ' as connected');
    } else {
        res.json({connected: false});
        console.log('🖧 [' + req.body.socketId + '] tried to connect as "' + req.body.nickname + '" but failed.');
    }
});

router.post('/disconnect', (req, res) => {
    game.players.forEach((player, index, object) => {
        if (req.body.socketId === player.socketId) {
            object.splice(index, 1);
            game.numberOfPlayers--;
        }
    });

    req.app.io.emit('updatePlayerList', {
        players: game.players,
        numberOfPlayers: game.numberOfPlayers
    });
    res.json({connected: false})
});

module.exports = router;