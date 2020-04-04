import Cursors from "./cursors.js";

class Lobby extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.props.state;
		this.handleFormChange = this.handleFormChange.bind(this);
		this.handleFormSubmit = this.handleFormSubmit.bind(this);
	}

	handleFormChange(event) {
		this.setState({nickname: event.target.value});
	}

	handleFormSubmit(event) {
		this.connectUser();
		event.preventDefault();
	}

	setEventUpdatePlayerList() {
		this.state.socket.on("updatePlayerList", data => {
			this.setState({
				players: data.players,
				numberOfPlayers: data.numberOfPlayers
			});
		});
	}

	setEventUpdateCursorPos() {
		this.state.socket.on("updateCursorPos", cursor => {
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
			this.state.socket.emit("updateCursorPos", {
				socketId: this.state.socket.id,
				posX: cursor.clientX,
				posY: cursor.clientY
			});
		});
	}

	connectUser() {
		this.setEventUpdateCursorPos();
		this.setEventUpdatePlayerList();
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
					this.setState({
						color: result.color,
						connected: result.connected
					});
				},
				(error) => {
					console.log(error);
					this.setState({error});
				});
	}

	getForm() {
		if (!this.state.connected) {
			return <div>
				<form onSubmit={this.handleFormSubmit}>
					<input className="w-100 form-control form-control-lg rounded-0 border-0 text-center"
						   placeholder="Enter your name..."
						   type="text"
						   value={this.state.nickname}
						   required
						   onChange={this.handleFormChange}
						   maxLength="20"
					/>
					<input className="w-100 btn btn-dark rounded-0" type="submit" value="Join"/>
				</form>
			</div>
		}
		return null;
	}

	setCursor() {
		const body = $('body');

		if (this.state.color) {
			body.removeClass("cursor-hand");
			body.addClass("cursor-hand-" + this.state.color)
		} else {
			body.addClass("cursor-hand")
		}
	}

	getLobbyList() {
		if (this.state.connected) {
			const items = [];
			let color;

			for (const [index, player] of this.state.players.entries()) {
				color = player.color;
				items.push(<span key={index} className="lobby-player">
                    {player.nickname}<i className="fa fa-tint row-icon" aria-hidden="true" style={{color}}/>
                </span>)
			}

			return <div className="d-flex flex-column">
				<h5 id="lobby-header" className="card-header">Players {this.state.numberOfPlayers}/5</h5>
				<div id="lobby-list" className="d-flex flex-column">
					{items}
				</div>
			</div>
		}
		return null;
	}

	render() {

		const form = this.getForm();
		const lobbyList = this.getLobbyList();
		this.setCursor();

		return ([
			<div key={"lobby-container"} className="card border-dark mb-3 rounded-lg border-0 radius-25">
				<div className="card-body d-flex">
					{lobbyList}
					<div id="lobby-image">
						<img className="card-img-top" src="img/girls-fighting.png" alt="girls fighting"/>
					</div>
				</div>
				{form}
			</div>,
			<Cursors key={"cursors"} nickname={this.state.nickname} players={this.state.players}/>
		]);
	}
}

export default Lobby