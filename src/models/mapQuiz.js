/*
        Map quiz game.
*/
const {Timer} = require("./timer");

class MapQuiz {
	constructor() {
		this.players = {}; // Players in the game.
		this.roundInProgress = false; // Check if a round is currently in progress.
		this.maxRounds = 10; // Max rounds of the game.
		this.currentRoundTimer = this.maxRoundTimer = 15; // Round timer in seconds.
		this.roundPauseDuration = 6; // Pause duration in seconds between rounds.
		this.summaryPauseDuration = 6; // Pause duration in seconds round summaries.
		this.currentRound = 1; // Current round, starting at 1.
		this.timerObject = new Timer(() => this.timerTick(this.timerObject), 1000); // Timer object for rounds (see timer.js).
		this.countries = []; // Countries retrieved from the database.
	}

	// Starts the game.
	async start(players) {
		logger.info("[MAP QUIZ] Game starts.");
		this.players = players;
		this.countries = await this.getCountries();
		this.setResponseListener();
		this.emitGameUpdate();

		const gameLoop = setInterval(async function () {
			if (this.currentRound > this.maxRounds) { // Stop looping if maxRounds has been reached.
				clearInterval(gameLoop);
				this.pointsDistribution();
				this.gameSummary();
			} else if (this.roundInProgress === false) { // Start a round if none is in progress
				this.roundInProgress = true;
				logger.info(`[MAP QUIZ] Loaded country is: ${this.countries[this.currentRound - 1].name} (${this.countries[this.currentRound - 1].code2l})`);
				logger.info(`[MAP QUIZ] Round ${this.currentRound} is going to start...`);
				await new Promise(r => setTimeout(r, this.roundPauseDuration * 1000)); // Pause before starting timer.
				this.emitGameUpdate();
				this.timerObject.start(); // Start the timer for the current round.
			}
		}.bind(this), 5000); // Bind class object context to the callback.
	}

	// Display wrong responses to all players before stopping the game.
	async gameSummary() {
		logger.info(`[MAP QUIZ] Loading wrong responses...`);
		await new Promise(r => setTimeout(r, this.summaryPauseDuration * 1000));

		for (let round = 1; round <= this.maxRounds; round++) {
			let playersWhoFailed = this.getPlayersWhoFailed(round);

			if (playersWhoFailed.length > 0) {
				this.emitRoundSummary(playersWhoFailed, round);
				logger.info(`[MAP QUIZ] Round ${round} (${this.countries[round - 1].code2l}) :`);
				playersWhoFailed.forEach((response, index) => {
					logger.info(`[MAP QUIZ] ${response.nickname}: ${this.players[index].gameResponses[round - 1]}`);
				});
				await new Promise(r => setTimeout(r, this.summaryPauseDuration * 1000));
			}
		}
		this.stopGame();
		logger.info("[MAP QUIZ] Game ends.");
	}

	pointsDistribution() {
		logger.info("[MAP QUIZ] Points distribution...");
		for (let i = 0; i < this.players.length; i++) {
			let currentPlayer = this.players[i];

			for (let i = 0; i < this.countries.length; i++) {
				let currentResponse = currentPlayer.gameResponses[i];
				let currentCountry = this.countries[i];

				if (currentResponse === currentCountry.code2l) {
					currentPlayer.score += 1;
				}
			}
			logger.info(`[MAP QUIZ] ${currentPlayer.nickname}: ${currentPlayer.score} pts.`);
		}
	}

	// Emit round summary for the given round.
	emitRoundSummary(playersWhoFailed, round) {
		io.emit("map-quiz-round-summary", {
			playersWhoFailed: playersWhoFailed,
			country: this.countries[round - 1],
			round: round
		});
	}

	// Get players who failed for the given round.
	getPlayersWhoFailed(round) {
		let playersWhoFailed = [];

		for (let i = 0; i < this.players.length; i++) {
			if (this.players[i].gameResponses[round - 1] !== this.countries[round - 1].code2l) {
				playersWhoFailed.push(this.players[i]);
			}
		}
		return playersWhoFailed;
	}

	// Retrieve countries and their code (ISO 3166-1 alpha-2).
	async getCountries() {
		logger.info("[MAP QUIZ] Loading countries from DB...");
		return new Promise((resolve, reject) => {
			database.connect((err) => {
				if (err) return reject(err);
				database.query("SELECT name, code2l" +
					" FROM country" +
					" WHERE enabled = 1" +
					" ORDER BY RAND()" +
					` LIMIT ${this.maxRounds}`, (err, result) => {
					if (err) return reject(err);
					resolve(result);
				});
				database.end();
			});
		});
	}

	// SetGet the responses from clients.
	setResponseListener() {
		this.players.forEach(player => {
			io.of("/").connected[player.socketId].on('map-quiz-send-response', data => {
				for (let i = 0; i < this.players.length; i++) {
					if (this.players[i].socketId === data.socketId) {
						this.players[i].gameResponses.push(data.response);
						logger.info(`[MAP QUIZ] ${this.players[i].nickname} selected: ${data.response}`);
						return;
					}
				}
			});
		});
	}

	// Ask players to emit their responses.
	emitGetResponses() {
		io.emit('map-quiz-get-response');
	}

	// Stop the game when maxRounds has been reached.
	stopGame() {
		io.emit('map-quiz-stop');
	}

	// Emit current state of the game.
	emitGameUpdate() {
		io.emit('map-quiz-update', {
			currentCountry: this.currentRound <= this.maxRounds ? this.countries[this.currentRound - 1] : null,
			summaryInProgress: this.currentRound > this.maxRounds,
			roundInProgress: this.roundInProgress,
			currentRound: this.currentRound,
			currentRoundTimer: this.currentRoundTimer,
			maxRoundTimer: this.maxRoundTimer,
			maxRounds: this.maxRounds,
		});
	}

	// Called every seconds by roundTimer.
	timerTick() {
		if (this.currentRoundTimer > 0) {
			this.currentRoundTimer--;
			this.emitGameUpdate();
			logger.info(`[MAP QUIZ] Round ${this.currentRound}: ${this.currentRoundTimer}`);
		} else {
			this.timerObject.stop();
			this.currentRound++;
			this.currentRoundTimer = this.maxRoundTimer;
			this.roundInProgress = false;
			this.emitGameUpdate();
			this.emitGetResponses();
		}
	}
}

exports.MapQuiz = MapQuiz;