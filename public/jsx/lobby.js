var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _jsxFileName = "public/js/lobby.js";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// const e = React.createElement;

import Cursors from "./cursors.js";

var Lobby = function (_React$Component) {
    _inherits(Lobby, _React$Component);

    function Lobby(props) {
        _classCallCheck(this, Lobby);

        var _this = _possibleConstructorReturn(this, (Lobby.__proto__ || Object.getPrototypeOf(Lobby)).call(this, props));

        _this.state = _this.props.state;
        _this.handleFormChange = _this.handleFormChange.bind(_this);
        _this.handleFormSubmit = _this.handleFormSubmit.bind(_this);
        return _this;
    }

    _createClass(Lobby, [{
        key: "handleFormChange",
        value: function handleFormChange(event) {
            this.setState({ nickname: event.target.value });
        }
    }, {
        key: "handleFormSubmit",
        value: function handleFormSubmit(event) {
            this.connectUser();
            event.preventDefault();
        }
    }, {
        key: "setEventUpdatePlayerList",
        value: function setEventUpdatePlayerList() {
            var _this2 = this;

            this.state.socket.on("updatePlayerList", function (data) {
                _this2.setState({
                    players: data.players,
                    numberOfPlayers: data.numberOfPlayers
                });
            });
        }
    }, {
        key: "setEventUpdateCursorPos",
        value: function setEventUpdateCursorPos() {
            var _this3 = this;

            this.state.socket.on("updateCursorPos", function (cursor) {
                console.log(cursor);
                if (cursor.socketId !== _this3.state.socket.id) {
                    _this3.state.players.forEach(function (player) {
                        if (player.socketId === cursor.socketId) {
                            player.cursor.x = cursor.x;
                            player.cursor.y = cursor.y;
                            _this3.forceUpdate();
                        }
                    });
                }
            });

            document.body.addEventListener("mousemove", function (cursor) {
                _this3.state.socket.emit("updateCursorPos", {
                    socketId: _this3.state.socket.id,
                    x: cursor.clientX,
                    y: cursor.clientY
                });
            });
        }
    }, {
        key: "connectUser",
        value: function connectUser() {
            var _this4 = this;

            this.setEventUpdateCursorPos();
            this.setEventUpdatePlayerList();
            fetch("/game/connect", {
                method: "post",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    socketId: this.state.socket.id,
                    nickname: this.state.nickname
                })
            }).then(function (res) {
                return res.json();
            }).then(function (result) {
                _this4.setState({ connected: result.connected });
            }, function (error) {
                console.log(error);
                _this4.setState({ error: error });
            });
        }
    }, {
        key: "getForm",
        value: function getForm() {
            if (!this.state.connected) {
                return React.createElement(
                    "div",
                    {
                        __source: {
                            fileName: _jsxFileName,
                            lineNumber: 80
                        },
                        __self: this
                    },
                    React.createElement(
                        "form",
                        { onSubmit: this.handleFormSubmit, __source: {
                                fileName: _jsxFileName,
                                lineNumber: 81
                            },
                            __self: this
                        },
                        React.createElement("input", { className: "w-100 form-control form-control-lg rounded-0 border-0 text-center",
                            placeholder: "Enter your name...",
                            type: "text",
                            value: this.state.nickname,
                            required: true,
                            onChange: this.handleFormChange,
                            maxLength: "20",
                            __source: {
                                fileName: _jsxFileName,
                                lineNumber: 82
                            },
                            __self: this
                        }),
                        React.createElement("input", { className: "w-100 btn btn-dark rounded-0", type: "submit", value: "Join", __source: {
                                fileName: _jsxFileName,
                                lineNumber: 90
                            },
                            __self: this
                        })
                    )
                );
            }
            return null;
        }
    }, {
        key: "getLobbyList",
        value: function getLobbyList() {
            if (this.state.connected) {
                var items = [];

                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = this.state.players.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var _ref = _step.value;

                        var _ref2 = _slicedToArray(_ref, 2);

                        var index = _ref2[0];
                        var value = _ref2[1];

                        items.push(React.createElement(
                            "span",
                            { key: index, className: "lobby-player", __source: {
                                    fileName: _jsxFileName,
                                    lineNumber: 102
                                },
                                __self: this
                            },
                            value.nickname,
                            React.createElement("i", { className: "fa fa-signal row-icon", "aria-hidden": "true", __source: {
                                    fileName: _jsxFileName,
                                    lineNumber: 103
                                },
                                __self: this
                            })
                        ));
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                return React.createElement(
                    "div",
                    { className: "d-flex flex-column", __source: {
                            fileName: _jsxFileName,
                            lineNumber: 107
                        },
                        __self: this
                    },
                    React.createElement(
                        "h5",
                        { id: "lobby-header", className: "card-header", __source: {
                                fileName: _jsxFileName,
                                lineNumber: 108
                            },
                            __self: this
                        },
                        "Players ",
                        this.state.numberOfPlayers,
                        "/5"
                    ),
                    React.createElement(
                        "div",
                        { id: "lobby-list", className: "d-flex flex-column", __source: {
                                fileName: _jsxFileName,
                                lineNumber: 109
                            },
                            __self: this
                        },
                        items
                    )
                );
            }
            return null;
        }
    }, {
        key: "render",
        value: function render() {
            var form = this.getForm();
            var lobbyList = this.getLobbyList();

            return [React.createElement(
                "div",
                { key: "lobby-container", className: "card border-dark mb-3 rounded-lg border-0 radius-25", __source: {
                        fileName: _jsxFileName,
                        lineNumber: 122
                    },
                    __self: this
                },
                React.createElement(
                    "div",
                    { className: "card-body d-flex", __source: {
                            fileName: _jsxFileName,
                            lineNumber: 123
                        },
                        __self: this
                    },
                    lobbyList,
                    React.createElement(
                        "div",
                        { id: "lobby-image", __source: {
                                fileName: _jsxFileName,
                                lineNumber: 125
                            },
                            __self: this
                        },
                        React.createElement("img", { className: "card-img-top", src: "img/girls-fighting.png", alt: "girls fighting", __source: {
                                fileName: _jsxFileName,
                                lineNumber: 126
                            },
                            __self: this
                        })
                    )
                ),
                form
            ), React.createElement(Cursors, { key: "cursors", nickname: this.state.nickname, players: this.state.players, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 131
                },
                __self: this
            })];
        }
    }]);

    return Lobby;
}(React.Component);

export default Lobby;

// const domContainer = document.querySelector("#lobby-container");
// ReactDOM.render(e(Lobby), domContainer);