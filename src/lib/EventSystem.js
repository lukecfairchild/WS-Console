
class EventSystem {
	#events = {};

	constructor (object) {
		object.on = (...args) => {
			return this.on(...args);
		};

		object.removeEventListener = (...args) => {
			return this.removeEventListener(...args);
		};

		object.trigger = (...args) => {
			return this.trigger(...args);
		};
	}

	on (event, callback) {
		if (!event
		||  !callback) {
			return;
		}

		if (!this.#events[event]) {
			this.#events[event] = [];
		}

		if (this.#events[event].includes(callback)) {
			return;
		}

		this.#events[event].push(callback);
	}

	removeEventListener (event, callback) {
		if (!event
		||  !callback
		||  !this.#events[event]) {
			return;
		}

		if (this.#events[event].includes(callback)) {
			this.#events[event].splice(this.#events[event].indexOf(callback), 1);
		}
	}

	trigger (event, ...args) {
		if (this.#events[event]) {
			for (const i in this.#events[event]) {
				this.#events[event][i](...args);
			}
		}
	}
}

module.exports = EventSystem;
