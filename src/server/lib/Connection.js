'use strict';

const Uuid = require('uuid').uuidv4;

class Connection {
	#events = {};

	constructor (webSocket) {
		this.authenticated = false;
		this.id            = Uuid();
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

		this.webSocket.on('close', () => {
			if (this.Connections) {
				this.Connections.remove(this.id);
			}
		});

		this.send({
			action : 'ready'
		});
	}

	disconnect () {
		this.webSocket.terminate();
	}

	on (event, callback) {
		return this.webSocket.on(event, callback);
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

	trigger (event, data) {
		if (this.#events[event] && data) {
			for (const i in this.#events[event]) {
				this.#events[event][i](data);
			}
		}
	}
}

module.exports = Connection;
