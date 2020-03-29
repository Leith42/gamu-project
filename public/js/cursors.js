class Cursors extends React.Component {
    getCursors(players) {
        const items = [];

        for (const [index, player] of players.entries()) {
            if (player.nickname !== this.props.nickname) {
                let left = player.cursor.x + 'px';
                let top = player.cursor.y + 'px';

                items.push(
                    <span key={index} className="player-cursor" style={{left, top}}>
                    <i className="fas fa-hand-point-up fa-2x"/>
                    <p>{player.nickname}</p>
                </span>
                )
            }
        }
        return items;
    }

    render() {
        const cursors = this.getCursors(this.props.players);

        console.log(this.props.nickname);

        return (
            <div id={"cursors-container"}>
                {cursors}
            </div>
        );
    }
}

export default Cursors
