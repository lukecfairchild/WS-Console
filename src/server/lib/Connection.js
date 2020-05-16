'use strict';

class Connection {
	constructor (webSocket) {
		this.authenticated = false;
		this.events        = {
			login   : [],
			data    : [],
			command : []
		};
		this.webSocket     = webSocket;
		this.webSocket.on('message', (message) => {
			let data = {};

			try {
				data = JSON.parse(message);

			} catch (error) {
				this.webSocket.terminate();
			}

			for (const i in this.events[data.action]) {
				this.events[data.action][i](data);
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
}

module.exports = Connection;
