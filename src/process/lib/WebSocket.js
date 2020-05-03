'use strict';

const WS = require('ws');

class WebSocket {
	constructor (options) {
		this.options = options;

		this.options.reconnectDelay = this.options.reconnectDelay || 1000;

		this.path   = this.options.path;
		this.events = {};

		this.connect();
	}

	connect (callback = () => {}) {
		this.webSocket = new WS(this.path);

		this.webSocket.on('close', this.terminate);
		this.webSocket.on('error', () => {}); // Die Silently
		this.webSocket.on('connection', callback);

		for (const i in this.events) {
			for (const j in this.events[i]) {
				this.webSocket.on(i, this.events[i][j]);
			}
		}
	}

	on (event, callback) {
		if (!this.events[event]) {
			this.events[event] = [];
		}

		this.events[event].push(callback);

		if (this.webSocket) {
			this.webSocket.on(event, callback);
		}
	}

	send (data) {
		if (this.status()) {
			if (typeof data === 'object') {
				data = JSON.stringify(data);
			}

			this.webSocket.send(data.toString(), () => {}); // Die Silently

			return true;
		}

		return false;
	}

	terminate () {
		this.webSocket.terminate();
		this.webSocket.removeAllListeners();
		this.webSocket.close();
		this.webSocket = undefined;

		this.reconnect();
	}

	reconnect () {
		setTimeout(this.connect, this.options.reconnectDelay);
	}

	status () {
		if (!this.webSocket) {
			return false;
		}

		return this.webSocket && this.webSocket.readyState === 1;
	}
}


module.exports = WebSocket;
