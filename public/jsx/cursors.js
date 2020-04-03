var _jsxFileName = 'public/js/cursors.js';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Cursors = function (_React$Component) {
	_inherits(Cursors, _React$Component);

	function Cursors() {
		_classCallCheck(this, Cursors);

		return _possibleConstructorReturn(this, (Cursors.__proto__ || Object.getPrototypeOf(Cursors)).apply(this, arguments));
	}

	_createClass(Cursors, [{
		key: 'getCursors',
		value: function getCursors(players) {
			var items = [];
			var left = void 0,
			    top = void 0,
			    color = void 0;

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = players.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var _ref = _step.value;

					var _ref2 = _slicedToArray(_ref, 2);

					var index = _ref2[0];
					var player = _ref2[1];

					// if (player.nickname !== this.props.nickname) {
					left = player.cursor.posX + 'px';
					top = player.cursor.posY + 'px';
					color = player.color;

					items.push(React.createElement(
						'span',
						{ key: index, className: 'player-cursor', style: { left: left, top: top, color: color }, __source: {
								fileName: _jsxFileName,
								lineNumber: 13
							},
							__self: this
						},
						React.createElement('i', { className: 'far fa-hand-point-up fa-2x', __source: {
								fileName: _jsxFileName,
								lineNumber: 14
							},
							__self: this
						}),
						React.createElement(
							'p',
							{
								__source: {
									fileName: _jsxFileName,
									lineNumber: 15
								},
								__self: this
							},
							player.nickname
						)
					));
					// }
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

			return items;
		}
	}, {
		key: 'render',
		value: function render() {
			var cursors = this.getCursors(this.props.players);

			return React.createElement(
				'div',
				{ id: "cursors-container", __source: {
						fileName: _jsxFileName,
						lineNumber: 27
					},
					__self: this
				},
				cursors
			);
		}
	}]);

	return Cursors;
}(React.Component);

export default Cursors;