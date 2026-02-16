
const Type      = require('simpler-types');
const Uuid      = require('uuid').v4;
const WebSocket = require('ws');

const EventSystem = require('../../lib/EventSystem');
const Server      = require('..');

class Connection extends EventSystem {
	#authenticated;

	constructor (options) {
		super();

		Type.assert(options, Object);
		Type.assert(options.server, Server);
		Type.assert(options.webSocket, WebSocket);

		this.authenticated = false;
		this.id            = Uuid();
		this.request       = options.request;
		this.server        = options.server;
		this.webSocket     = options.webSocket;

		const authTimeout = setTimeout(() => {
			if (!this.#authenticated) {
				this.disconnect();
			}
		}, 5000);

		this.webSocket.on('message', async (message) => {
			let json = {};

			try {
				json = JSON.parse(message);

			} catch (error) {
				this.webSocket.terminate();
			}

			if (!this.#authenticated) {
				if (json.action !== 'login') {
					return this.disconnect();
				}

				if (!this.server.accounts.exists(json.data.name, json.type)) {
					return this.disconnect();
				}

				this.trigger('login', json);
				const account = this.server.accounts.get(json.data.name, json.type);

				this.#authenticated = account.authenticate(json.data.password);

				if (!this.#authenticated) {
					return this.disconnect();
				}

				this.account = account;

				clearTimeout(authTimeout);
				account.connections.add(this);
			}

			if (this.#authenticated) {
				this.trigger('message', json);

				switch (json.action) {
					case 'command' : {
						if (json.target === 'console') {
							this.send({
								target : 'console',
								data   : await this.account.commands.run(json.data)
							});

						} else if (this.account.hasPermission(`task.console.${json.target}.command`)
						&&  this.server.accounts.tasks.exists(json.target)) {
							const task = this.server.accounts.tasks.get(json.target);

							task.connections.send({
								action   : 'command',
								data     : json.data,
								username : this.account.name
							});
						}

						break;
					}

					case 'data' : {
						this.account.trigger('data', {
							connection : this,
							data       : json.data
						});

						break;
					}
				}
			}
		});

		this.webSocket.on('close', () => {
			this.trigger('close', {});
		});

		this.send({
			action : 'ready'
		});
	}

	disconnect () {
		this.webSocket.terminate();
	}

	send (message) {
		Type.assert(message, Object);

		if (this.webSocket.readyState === 1) {
			return this.webSocket.send(JSON.stringify(message), (error) => {
				if (error) {
					console.error(error);
				}
			});
		}
	}
}

module.exports = Connection;
