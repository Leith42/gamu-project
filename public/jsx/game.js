var _jsxFileName = "public/js/game.js";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import Lobby from "./lobby.js";

var e = React.createElement;

var Game = function (_React$Component) {
    _inherits(Game, _React$Component);

    function Game(props) {
        _classCallCheck(this, Game);

        var _this = _possibleConstructorReturn(this, (Game.__proto__ || Object.getPrototypeOf(Game)).call(this, props));

        _this.state = {
            socket: io.connect("/", { reconnection: false }),
            nickname: "",
            players: [],
            submitted: false,
            error: null,
            connected: false
        };
        return _this;
    }

    _createClass(Game, [{
        key: "updateState",
        value: function updateState(state) {
            this.state = state;
        }
    }, {
        key: "render",
        value: function render() {
            return [React.createElement(Lobby, { key: "lobby", state: this.state, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 24
                },
                __self: this
            })];
        }
    }]);

    return Game;
}(React.Component);

var domContainer = document.querySelector("#game-container");
ReactDOM.render(e(Game), domContainer);