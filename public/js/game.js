import Lobby from "./lobby.js";

const e = React.createElement;

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            socket: io.connect("/"),
            nickname: "",
            players: [],
            submitted: false,
            error: null,
            connected: false,
        };
    }

    updateState(state) {
        this.state = state;
    }

    render() {
        return ([
            <Lobby key={"lobby"} state={this.state}/>,
        ])
    }
}

const domContainer = document.querySelector("#game-container");
ReactDOM.render(e(Game), domContainer);