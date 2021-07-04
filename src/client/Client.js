'use strict';

const Tasks = require('./Tasks');

const WebSocket = require('../task/lib/WebSocket');

class Client {
	constructor (options) {
		this.options = options;

		this.Tasks = new Tasks({
			Client : this
		});
	}

	start () {
		this.websocket = new WebSocket(this.options);

		this.websocket.on('open', () => {
			// Authenticate with Hub
			this.websocket.send(JSON.stringify({
				type     : 'user',
				action   : 'login',
				name     : this.options.name,
				password : this.options.password
			}));
		});

		// Remote commands
		if (this.options.allowRemoteInput) {
			this.websocket.on('message', (rawData) => {
				let data = {};

				try {
					data = JSON.parse(rawData);
				} catch (error) {}

				console.log(data);
			});
		}
	}

	send (message) {
		this.websocket.send(JSON.stringify(message));
	}
}

module.exports = Client;
