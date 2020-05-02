import React from 'react'
import ReactDOM from 'react-dom'
import io from 'socket.io-client'
import Lobby from "./lobby.js";
import MapQuiz from "./mapQuiz.js";
import Header from "./header";
import Footer from "./footer";
import Leaderboard from "./leaderboard";

const e = React.createElement;

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			socket: io.connect("/"), // Player socket connection.
			gameInProgress: false,
			connected: false,
			nickname: "", // Player nickname.
			color: null,
			isLeader: false, // True if the player is the game leader.
			players: [], // Other connected players (also contains the current player).
			games: [{ // List of games in play order.
				name: 'Map Quiz',
				completed: false,
			}],
		};
		this.startGame = this.startGame.bind(this);
		this.stopCurrentGame = this.stopCurrentGame.bind(this);
		this.isGameInProgress();
	}

	// Ask the server if a game is currently in progress or not.
	isGameInProgress() {
		fetch("/api/gameInProgress", {
			method: "get",
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json"
			},
		})
			.then(res => res.json())
			.then((result) => {
					this.setState({gameInProgress: result.gameInProgress});
				},
				(error) => {
					console.error(error);
				});
	}

	startGame(nickname, color, isLeader, players) {
		this.setState({
			nickname: nickname,
			color: color,
			isLeader: isLeader,
			players: players,
			connected: true,
			gameInProgress: true,
		});
	}

	// Get header component.
	getHeader() {
		if (!this.state.gameInProgress) {
			return <Header key="header"/>
		}
	}

	// Get lobby component.
	getLobby() {
		if (!this.state.gameInProgress) {
			return <Lobby key="lobby" state={this.state} startGame={this.startGame}/>
		}
	}

	// Get footer component.
	getFooter() {
		if (!this.state.gameInProgress) {
			return <Footer key="footer"/>
		}
	}

	// Called by games components every time a game is finished.
	stopCurrentGame() {
		for (let i = 0; i < this.state.games.length; i++) {
			if (!this.state.games[i].completed) {
				const updatedGameList = this.state.games;
				updatedGameList[i].completed = true;
				this.setState({
					games: updatedGameList
				});
				return;
			}
		}
	}

	// Get the final leaderboard.
	getLeaderboard() {
		return <Leaderboard key="leaderboard" state={this.state}/>;
	}

	// Get the next game component to play from the game list.
	getNextGame() {
		if (this.state.connected && this.state.gameInProgress) {
			for (let i = 0; i < this.state.games.length; i++) {
				if (!this.state.games[i].completed) {
					switch (this.state.games[i].name) {
						case 'Map Quiz':
							return <MapQuiz key="mapQuiz" state={this.state} stopGame={this.stopCurrentGame}/>;
						case 'Test Game':
							return <h1>TEST GAME</h1>;
						default:
							throw new Error(`${this.state.games[i].name} has no component.`);
					}
				}
			}
		} else if (!this.state.connected && this.state.gameInProgress) {
			return <h1>A game is already in progress...</h1>; //TODO: Spectate mode.
		}
	}

	// Check if all games have been played.
	isGameOver() {
		for (let i = 0; i < this.state.games.length; i++) {
			if (!this.state.games[i].completed) {
				return false;
			}
		}
		return true;
	}

	render() {
		return (
			<>
				{this.getHeader()}
				{this.getLobby()}
				{this.isGameOver() ? this.getLeaderboard() : this.getNextGame()}
				{this.getFooter()}
			</>
		);
	}
}

const domContainer = document.querySelector("#game-container");
ReactDOM.render(e(Game), domContainer);