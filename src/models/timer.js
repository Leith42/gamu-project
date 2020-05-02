/*
		A basic timer using setInterval.
 */
class Timer {
	constructor(callback, interval) {
		this.callback = callback;
		this.interval = interval;
		this.timer = null;
	}

	// start timer
	start() {
		this.stop();
		this.timer = setInterval(this.callback, this.interval);
	}

	// stop timer
	stop() {
		if (this.timer !== null) {
			clearInterval(this.timer);
			this.timer = null;
		}
	}
}

exports.Timer = Timer;