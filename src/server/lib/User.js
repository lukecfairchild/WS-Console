'use strict';

const bcrypt = require('bcryptjs');
const Data   = require('./Data');
const Utils  = require('./Utils');

class User {
	constructor (options) {
		this.options = options;

		this.authenticated = false;
		this.UUID          = Utils.getUUID();
		this.webSocket     = {
			terminate : () => {

				if (this.options.webSocket) {
					return this.options.webSocket.terminate();

				} else {
					process.exit();
				}
			},
			send : (json) => {
				if (this.options.webSocket) {
					if (this.options.webSocket.readyState === 1) {
						return this.options.webSocket.send(json, (error) => {
							if (error) {
								console.error(error);
							}
						});
					}

				} else {
					const data = JSON.parse(json);

					if (!data.server
					||  data.server === 'Console') {

						for (const i in data.data) {
							console.log(data.data[i]);
						}
					}
				}
			},
			on : (event, callback) => {
				return this.options.webSocket.on(event, callback);
			}
		};

		if (this.options.webSocket) {
			this.timeout = setTimeout(() => {
				this.webSocket.terminate();
			}, 1000);

			this.webSocket.on('close', () => {
				if (this.isAuthenticated()) {
					this.options.webSocketServer.removeUser(this);
				}
			});

		} else {
			this.username      = 'Console';
			this.authenticated = true;

			this.options.webSocketServer.addUser(this);
		}
	}

	logout () {
		this.webSocket.terminate();
	}

	getUUID () {
		return this.UUID;
	}

	isAuthenticated () {
		return this.authenticated;
	}

	authenticate (data) {
		const user = Data.getUser(data.username);

		if (user
		&&  data.username !== undefined
		&&  data.password !== undefined
		&&  user.hash) {
			bcrypt.compare(data.password, user.hash, (error, result) => {
				if (result) {
					clearTimeout(this.timeout);

					delete this.timeout;

					this.username      = data.username;
					this.authenticated = true;

					this.options.webSocketServer.addUser(this);

					const servers = this.options.webSocketServer.getServers();

					for (const i in servers) {
						const server = servers[i];

						if (server.getName() === 'Console'
						||  Data.userHasPermission(this.getUsername(), 'console.view.' + server.getName())
						||  Data.userHasPermission(this.getUsername(), 'console.command.' + server.getName())) {

							this.getWebSocket().send(JSON.stringify({
								action     : 'serverConnect',
								serverName : server.getName()
							}));
							this.getWebSocket().send(JSON.stringify({
								server : server.getName(),
								data   : server.getCache(),
								action : 'data'
							}));
						}
					}

				} else {
					this.logout();
				}
			});

		} else {
			this.getWebSocket().terminate();
		}
	}

	getUsername () {
		return this.username;
	}

	getWebSocket () {
		return this.webSocket;
	}

	setServer (serverName) {
		const server = this.options.webSocketServer.getServer(serverName);

		if (server) {
			this.server = server;

			this.getWebSocket().send(JSON.stringify({
				server : server.getName(),
				data   : server.getCache()
			}));
		}
	}

	getServer () {
		return this.server;
	}

	updateServers () {
		const servers = this.options.webSocketServer.getServers();

		for (const i in servers) {
			const server = servers[i];

			if (server.getName() === 'Console'
			||   Data.userHasPermission(this.getUsername(), 'console.view.' + server.getName())
			||   Data.userHasPermission(this.getUsername(), 'console.command.' + server.getName())) {

				this.getWebSocket().send(JSON.stringify({
					action     : 'serverConnect',
					serverName : server.getName()
				}),function () {

					this.getWebSocket().send(JSON.stringify({
						server : server.getName(),
						data   : server.getCache(),
						action : 'resetData'
					}));
				}.bind(this));

			} else {
				this.getWebSocket().send(JSON.stringify({
					serverName : server.getName(),
					action     : 'serverDisconnect'
				}));
			}
		}
	}
}

module.exports = User;
