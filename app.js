"use strict";

const express = require('express')
    , app = express()
    , server = require('http').Server(app)
    , mustacheExpress = require('mustache-express')
    , io = require('socket.io')(server)
    , axios = require('axios');

app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.use(express.json());
app.use(express.static(__dirname + '/public'));
app.use(require('./controllers'));
app.io = io;
// app.use(require('./middlewares/users'));

// SOCKET SERVER
io.on('connection', (socket) => {
    console.log('❌ [' + socket.id + '] as disconnected');

    socket.on("updateCursorPos", (cursor) => {
        io.emit("updateCursorPos", cursor);
    });

    socket.on('disconnect', () => {
        axios({
            method: 'post',
            url: 'http://localhost:1337/game/disconnect',
            data: {
                socketId: socket.id,
            },
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        }).then(response => {
            console.log('❌ [' + socket.id + '] as disconnected');
        }).catch(error => {
            console.log(error);
        });
    });
});

// HTTP LISTENER
server.listen(1337, () => {
    console.log('Listening on port 1337...');
});
