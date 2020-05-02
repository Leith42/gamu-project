import React from 'react'
import Cursors from "./cursors.js";

class Leaderboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.props.state; // Get parent state.
		this.state.leaderboard = null;
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

	componentDidMount() {
		fetch("/api/leaderboard", {
			method: "get",
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json"
			},
		})
			.then(res => res.json())
			.then((result) => {
					this.setState({leaderboard: result});
				},
				(error) => {
					console.error(error);
				});
		this.setEventUpdateCursorPos();
	}

	getLeaderboardList() {
		if (this.state.leaderboard) {
			const items = [];
			let icon, color;

			for (const [index, player] of this.state.leaderboard.entries()) {
				color = player.color;

				switch (index) {
					case 0:
						icon = "medal1.svg";
						break;
					case 1:
						icon = "medal2.svg";
						break;
					case 2:
						icon = "medal3.svg";
						break;
					default:
						icon = "shit.svg";
				}

				items.push(<div key={index} className="leaderboard-player">
					<img className="leaderboard-icon" src={`img/${icon}`}/>
					<span className="leaderboard-player-nickname">{player.nickname}</span>
					<span className="leaderboard-player-score">{player.score} pts</span>
				</div>)
			}

			return items;
		}
	}

	componentWillUnmount() {
		this.state.socket.removeAllListeners();
	}

	render() {
		return (
			<>
				<div id="leaderboard-container" key="leaderboard-container"
					 className="card border-dark mb-3 rounded-lg border-0 radius-25">
					<h5 id="leaderboard-header" className="card-header">Leaderboard</h5>
					<div id="leaderboard-list" className="d-flex flex-column">
						{this.getLeaderboardList()}
					</div>
				</div>
				{this.state.connected &&
				<Cursors key="cursors" nickname={this.state.nickname} players={this.state.players}/>}
			</>
		);
	}
}

export default Leaderboard