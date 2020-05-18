'use strict';

class Connection {
	#events;

	constructor (webSocket) {
		this.authenticated = false;
		this.#events       = {};
		this.webSocket     = webSocket;
		this.webSocket.on('message', (message) => {
			let data = {};

			try {
				data = JSON.parse(message);

			} catch (error) {
				this.webSocket.terminate();
			}

			if (data.action === 'login') {
				this.trigger('login', data);
			}
		});
		this.send({
			action : 'ready'
		});
	}

	isAuthenticated () {
		return this.authenticated;
	}

	setAuthenticated (state) {
		this.authenticated = state;
	}

	disconnect () {
		this.webSocket.terminate();
	}

	send (message) {
		if (this.webSocket.readyState === 1) {
			return this.webSocket.send(JSON.stringify(message), (error) => {
				if (error) {
					console.error(error);
				}
			});
		}
	}
	on (event, callback) {
		return this.webSocket.on(event, callback);
	}

	trigger (event, data) {
		if (!event
		||  !data) {
			return;
		}

		if (this.#events[event]) {
			for (const i in this.#events[event]) {
				this.#events[event][i](data);
			}
		}
	}
}

module.exports = Connection;
