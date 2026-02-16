'use strict';

const EventSystem = require('../lib/EventSystem');
const Tasks       = require('./Tasks');
const WebSocket   = require('../task/lib/WebSocket');

class Client extends EventSystem {
	constructor (options) {
		super();

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
				type   : 'user',
				action : 'login',
				data   : {
					name     : this.options.name,
					password : this.options.password
				}
			}));
		});

		this.websocket.on('message', (rawData) => {
			let data = {};

			try {
				data = JSON.parse(rawData);
			} catch (error) {}

			this.trigger('message', data);
		});
	}

	send (message) {
		this.websocket.send(JSON.stringify(message));
	}
}

module.exports = Client;
