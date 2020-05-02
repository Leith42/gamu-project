import React from 'react'

class Cursors extends React.Component {
	getCursors(players) {
		const cursors = [];
		let left, top, color;

		for (const [index, player] of players.entries()) {
			if (player.nickname !== this.props.nickname) {
				left = player.cursor.posX + "px";
				top = player.cursor.posY + "px";
				color = player.color;

				cursors.push(
					<span key={index} className="player-cursor" style={{left, top}}>
                    <i className="far fa-hand-point-up fa-2x" style={{color}}/>
                    <p>{player.nickname}</p>
                </span>
				)
			}
		}
		return cursors;
	}

	render() {
		const cursors = this.getCursors(this.props.players);

		return <>{cursors}</>;
	}
}

export default Cursors
