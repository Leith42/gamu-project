import React from 'react'
import Cursors from "./cursors.js";

class Lobby extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.props.state; // Get parent state.
		this.state.connected = false; // True if the user is connected.
		this.handleFormChange = this.handleFormChange.bind(this);
		this.handleFormSubmit = this.handleFormSubmit.bind(this);
		this.startGame = this.startGame.bind(this);
		this.setEventUpdatePlayerList();
		this.setEventStartGame();
	}

	handleFormChange(event) {
		this.setState({nickname: event.target.value});
	}

	handleFormSubmit(event) {
		this.connectUser();
		event.preventDefault();
	}

	setEventStartGame() {
		this.state.socket.on("startGame", () => {
			this.props.startGame(this.state.nickname, this.state.color, this.state.isLeader, this.state.players);
		});
	}

	setEventUpdatePlayerList() {
		this.state.socket.on("updatePlayerList", data => {
			// Gives the user the game lead if necessary.
			for (let i = 0; i < data.players.length; i++) {
				if (data.players[i].socketId === this.state.socket.id) {
					this.setState({isLeader: data.players[i].isLeader});
					break;
				}
			}
			// Updates the player list.
			this.setState({
				players: data.players,
				numberOfPlayers: data.numberOfPlayers
			});
		});
	}

	setEventUpdateCursorPos() {
		this.state.socket.on("update-cursor-pos", cursor => {
			if (cursor.socketId !== this.state.socket.id) {
				for (let i = 0; i < this.state.players.length; i++) {
					if (this.state.players[i].socketId === cursor.socketId) {
						this.state.players[i].cursor.posX = cursor.posX;
						this.state.players[i].cursor.posY = cursor.posY;
						this.forceUpdate();
						return;
					}
				}
			}
		});

		document.body.addEventListener("mousemove", cursor => {
			this.state.socket.emit("update-cursor-pos", {
				socketId: this.state.socket.id,
				posX: cursor.clientX,
				posY: cursor.clientY
			});
		});
	}

	connectUser() {
		fetch("/api/connect", {
			method: "post",
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				socketId: this.state.socket.id,
				nickname: this.state.nickname
			})
		})
			.then(res => res.json())
			.then((result) => {
					this.setEventUpdateCursorPos();
					this.setState({
						color: result.color,
						connected: result.connected,
						isLeader: result.isLeader
					});
				},
				(error) => {
					console.log(error);
				});
	}

	getConnectionForm() {
		if (this.state.connected === false) {
			return <div>
				<form onSubmit={this.handleFormSubmit}>
					<input className="w-100 form-control form-control-lg rounded-0 border-0 text-center"
						   placeholder="Enter your name..."
						   type="text"
						   value={this.state.nickname}
						   required
						   onChange={this.handleFormChange}
						   maxLength="15"
					/>
					<input className="w-100 btn btn-dark rounded-0" type="submit" value="Join"/>
				</form>
			</div>
		}
	}

	setCustomCursor() {
		const body = $('body');

		if (this.state.color !== null) {
			body.removeClass("cursor-hand");
			body.addClass(`cursor-hand-${this.state.color}`)
		} else {
			body.addClass("cursor-hand")
		}
	}

	getLobbyList() {
		if (this.state.connected === true) {
			const items = [];
			let icon, color;

			for (const [index, player] of this.state.players.entries()) {
				color = player.color;
				if (player.isLeader === true) {
					icon = <i className="fas fa-crown row-icon" aria-hidden="true" style={{color}}/>;
				} else {
					icon = <i className="fas fa-paint-brush row-icon" aria-hidden="true" style={{color}}/>;
				}

				items.push(<span key={index} className="lobby-player">
					<span className="lobby-player-nickname">{player.nickname}</span>
					<span className="lobby-player-icons">{icon}</span>
                </span>)
			}

			return <div className="lobby-list d-flex flex-column">
				<h5 id="lobby-header" className="card-header">Players {this.state.numberOfPlayers}/5</h5>
				<div id="lobby-list" className="d-flex flex-column">
					{items}
				</div>
			</div>
		}
	}

	startGame() {
		if (this.state.isLeader === true) {
			fetch("/api/start", {
				method: "post",
				headers: {
					"Accept": "application/json",
					"Content-Type": "application/json"
				},
				body: JSON.stringify({socketId: this.state.socket.id})
			});
		} else {
			console.error(`${this.state.nickname} is not the game leader!`);
		}
	}

	getStartGameButton() {
		if (this.state.connected && this.state.isLeader) {
			return <input className="w-100 btn btn-dark rounded-0"
						  onClick={this.startGame}
						  readOnly
						  type="button"
						  value="Start game"/>
		}
	}

	componentWillUnmount() {
		this.state.socket.removeAllListeners();
	}

	render() {
		// this.setCustomCursor();
		return (
			<>
				<div key="lobby-container" className="card border-dark mb-3 rounded-lg border-0 radius-25">
					<div className="card-body d-flex">
						{this.getLobbyList()}
						<div id="lobby-image">
							<img className="card-img-top" src="img/monkey.png" alt="lobby image"/>
						</div>
					</div>
					{this.getConnectionForm()}
					{this.getStartGameButton()}
				</div>
				{this.state.connected &&
				<Cursors key="cursors" nickname={this.state.nickname} players={this.state.players}/>}
			</>
		);
	}
}

export default Lobby