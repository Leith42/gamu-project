import React from 'react'

class MapQuiz extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.props.state; // Get parent state.
		this.state.roundInProgress = false;
		this.state.summaryInProgress = false;
		this.state.selectedCountryCode = null;
		this.state.maxRounds = null;
		this.state.currentRound = 1;
		this.state.maxRoundTimer = null;
		this.state.currentRoundTimer = null; // Round timer in seconds.
		this.state.blockInfo = null; // Information block
		this.state.currentCountry = {
			name: null,
			code: null
		}
	}

	// Zoom event for the world map.
	handleKeyDown(event) {
		if (event.deltaY < 0) {
			$("#map-quiz-map").vectorMap('zoomIn');
		} else {
			$("#map-quiz-map").vectorMap('zoomOut');
		}
	}

	// Executed when the player click on a country.
	onCountryClick(element, code) {
		const isMoving = $(element.currentTarget).data('mapObject').isMoving;
		const selectedCountry = $('#jqvmap1_' + code);

		if (this.state.roundInProgress && !isMoving) {
			code = code.toUpperCase();
			if (code !== this.state.selectedCountryCode) {
				this.clearSelectedCountries();
				selectedCountry.attr("fill", this.state.color);
				this.setState({selectedCountryCode: code});
			} else {
				this.clearSelectedCountries();
			}
		}
		element.preventDefault();
	}

	// Clear selected countries.
	clearSelectedCountries() {
		const selectedCountries = document.querySelectorAll("path[fill]:not([fill='#f4f3f0'])");

		for (let i = 0; i < selectedCountries.length; i++) {
			selectedCountries[i].setAttribute("fill", selectedCountries[i].getAttribute("original"));
		}
		this.setState({selectedCountryCode: null});
	}

	// Triggered every time the game state changed.
	setGameUpdateEvent() {
		this.state.socket.on("map-quiz-update", update => {
			// Update the game data.
			this.setState({
				maxRounds: update.maxRounds,
				currentRound: update.currentRound,
				roundInProgress: update.roundInProgress,
				summaryInProgress: update.summaryInProgress,
				currentRoundTimer: update.currentRoundTimer,
				maxRoundTimer: update.maxRoundTimer,
				currentCountry: update.currentCountry
			});

			if (this.state.roundInProgress) {
				this.setState({blockInfo: <span className="country-name">{this.state.currentCountry.name}</span>});
			} else if (!this.state.summaryInProgress) {
				this.setState({blockInfo: <span>Round <span className="text-highlight">{this.state.currentRound}</span> will start in a few seconds...</span>});
			} else if (this.state.summaryInProgress) {
				this.setState({blockInfo: <span>Game over! Let's take a look at who made mistakes... 😉</span>});
			}

			// Clear selected country at the start of each round.
			if (this.state.roundInProgress && this.state.currentRoundTimer === this.state.maxRoundTimer) {
				this.clearSelectedCountries();
			}
		});
	}

	// Triggered when the server asks the player response.
	setOnResponseEvent() {
		this.state.socket.on("map-quiz-get-response", () => {
			this.emitCurrentResponse();
		});
	}

	// Emit current selected response to the server.
	emitCurrentResponse() {
		this.state.socket.emit("map-quiz-send-response", {
			socketId: this.state.socket.id,
			response: this.state.selectedCountryCode,
		});
	}

	// Triggered when the server stopped the game.
	setGameStopEvent() {
		this.state.socket.on("map-quiz-stop", () => {
			this.props.stopGame();
		});
	}

	// Get round summary.
	setRoundSummaryEvent() {
		this.state.socket.on("map-quiz-round-summary", (roundSummary) => {
			this.clearSelectedCountries();
			const items = [];

			for (const [index, player] of roundSummary.playersWhoFailed.entries()) {
				let color = player.color;
				let countryCode = player.gameResponses[roundSummary.round - 1].toLowerCase();

				if (countryCode !== null) {
					let selectedCountry = $('#jqvmap1_' + countryCode);
					selectedCountry.attr("fill", color);
				}

				items.push(<span key={index} style={{color}} className="round-summary-players">
					{player.nickname}
				</span>);
			}

			this.setState({
				blockInfo: <div id="round-summary" className="d-flex flex-column">
					<div>
						❌ <span className="text-highlight">{roundSummary.country.name}</span>
					</div>
					<div>{items}</div>
				</div>,
				currentCountry: roundSummary.country
			});
		});
	}

	// Current round timer.
	getTimer() {
		if (this.state.roundInProgress) {
			return (
				<div id="timer-container" className="d-flex">
					<div id="timer">{this.state.currentRoundTimer}</div>
				</div>
			);
		}
	}

	// Current country flag.
	getFlag() {
		if (this.state.roundInProgress) {
			return (
				<div id="flag-container" className="d-flex">
					<img src={`/img/flags/${this.state.currentCountry.code2l}.svg`} alt="flag"/>
				</div>
			);
		}
	}

	// Init game map and socket events.
	componentDidMount() {
		// Generates the game map.
		$("#map-quiz-map").vectorMap({
			map: 'world_en',
			backgroundColor: '#92a8d1',
			borderColor: '#818181',
			borderOpacity: 0,
			borderWidth: 1,
			enableZoom: false,
			hoverColor: '#c9dfaf',
			hoverOpacity: 0.5,
			normalizeFunction: 'linear',
			scaleColors: ['#b6d6ff', '#005ace'],
			selectedColor: this.state.color,
			selectedRegions: null,
			showTooltip: false,
			onRegionClick: (element, code) => this.onCountryClick(element, code),
		});

		// Socket events.
		this.setGameUpdateEvent();
		this.setGameStopEvent();
		this.setOnResponseEvent();
		this.setRoundSummaryEvent();
	}

	componentWillUnmount() {
		this.state.socket.removeAllListeners();
	}

	render() {
		return (
			<div id="map-quiz-container" key="map-quiz-container" className="d-flex flex-column">
				<div id="map-quiz-header" className="d-flex">
					{this.getTimer()}
					<div id="map-quiz-info" className="d-flex">
						{this.state.blockInfo}
					</div>
					{this.getFlag()}
				</div>
				<div id="map-quiz-map" onWheel={this.handleKeyDown}/>
			</div>
		);
	}
}

export default MapQuiz