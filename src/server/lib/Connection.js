'use strict';

class Connection {
	constructor (webSocket) {
		this.webSocket = webSocket;

		this.authenticated = false;
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
