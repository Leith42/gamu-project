"use strict";

const express = require('express')
	, app = express()
	, server = require('http').Server(app)
	, mustacheExpress = require('mustache-express')
	, io = require('socket.io')(server)
	, axios = require('axios')
	, path = require("path")
	, winston = require('winston')
	, mysql = require('mysql')
	, config = require('./config/config.json');

app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', path.join(__dirname, '/src/views'));
app.use(express.json());
app.use(express.static(__dirname + '/src/public'));
app.use(express.static('node_modules'));
app.use(require('./src/controllers'));
app.io = io;

// Init database client;
global.database = mysql.createConnection({
	host: config.database.host,
	user: config.database.user,
	password: config.database.password,
	database: config.database.name
});

// Init logger.
global.logger = winston.createLogger({
	format: winston.format.combine(
		winston.format.timestamp({
			format: 'YYYY-MM-DD HH:mm:ss'
		}),
		winston.format.printf(info => `[${info.timestamp}] ${info.message}` + (info.splat !== undefined ? `${info.splat}` : " ")),
	),
	transports: [
		// new winston.transports.File({filename: 'logs/error.log', level: 'error'}),
		new winston.transports.File({filename: 'logs/combined.log'}),
		new winston.transports.Console(),
	]
});

// Init websocket server.
global.io = io;
io.on('connection', (socket) => {
	logger.info(`New socket connection: ${socket.id}`);

	socket.on("update-cursor-pos", cursor => {
		io.emit("update-cursor-pos", cursor);
	});

	socket.on('disconnect', () => {
		axios({
			method: 'post',
			url: `http://localhost:${config.http.port}/api/disconnect`,
			data: {socketId: socket.id},
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json"
			}
		}).then(response => {
			logger.info(`Socket connection ended: ${socket.id}`);
		}).catch(error => {
			logger.error(`${error}: ${socket.id}`);
		});
	});
});

// Init HTTP listener.
server.listen(config.http.port, () => {
	logger.info(`Web server is listening on port ${config.http.port}...`);
});
