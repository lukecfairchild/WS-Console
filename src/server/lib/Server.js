'use strict';

const Cache    = require('./Cache');
const Database = require('./Database');

class Server {
	constructor (options) {
		this.options = options;

		this.webSocket = this.options.webSocket || {
			terminate : () => {},
			send      : (json) => {
				const data = JSON.parse(json);

				data.data = data.data.replace(/[\n\r]/g, '').split(' ');

				this.options.webSocketServer.consoleCommand(data);
			}
		};

		this.users         = {};
		this.cache         = new Cache(this.options);
		this.authenticated = false;

		if (this.options.webSocket) {
			this.timeout = setTimeout(() => {
				this.webSocket.terminate();
			}, 1000);

			this.webSocket.on('close', () => {
				if (this.isAuthenticated()) {
					const users = this.options.webSocketServer.getUsers();

					for (const i in users) {
						const user = users[i];

						user.getWebSocket().send(JSON.stringify({
							action     : 'serverDisconnect',
							serverName : this.getName()
						}));
					}

					this.options.webSocketServer.removeServer(this);
				}
			});

		} else {
			this.name          = 'Console';
			this.authenticated = true;

			this.options.webSocketServer.addServer(this);
			this.pushCache('For help, type "help"');
		}
	}

	logout () {
		this.webSocket.terminate();
	}

	isAuthenticated () {
		return this.authenticated;
	}

	authenticate (data) {
		const server = Database.getServer(data.name);

		if (server
		&&  data.name !== undefined
		&&  data.password !== undefined
		&&  server.password === data.password) {
			const loggedInServer = this.options.webSocketServer.getServer(data.name);

			if (loggedInServer) {
				loggedInServer.logout();
			}

			clearTimeout(this.timeout);

			delete this.timeout;

			this.name          = data.name;
			this.authenticated = true;

			this.options.webSocketServer.addServer(this);

			this.webSocket.send(JSON.stringify({
				action : 'settingsSync',
				data   : {
					cacheSize : this.options.cacheSize
				}
			}));

			const users = this.options.webSocketServer.getUsers();

			for (const i in users) {
				const user = users[i];

				user.getWebSocket().send(JSON.stringify({
					action     : 'serverConnect',
					serverName : this.getName()
				}));
			}

		} else {
			this.webSocket.terminate();
		}
	}

	getName () {
		return this.name;
	}

	getWebSocket () {
		return this.webSocket;
	}

	getCache () {
		return this.cache.get();
	}

	pushCache (value) {
		if (this.isAuthenticated()) {
			this.cache.push(value);
		}
	}
}

module.exports = Server;
