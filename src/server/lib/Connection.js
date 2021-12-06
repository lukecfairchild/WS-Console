
const Type      = require('simpler-types');
const Uuid      = require('uuid').v4;
const WebSocket = require('ws');

const EventSystem = require('../../lib/EventSystem');
const Server      = require('../Server');

class Connection extends EventSystem {
	#authenticated;

	constructor (options) {
		super();

		Type.assert(options, Object);
		Type.assert(options.Server, Server);
		Type.assert(options.webSocket, WebSocket);

		this.authenticated = false;
		this.id            = Uuid();
		this.request       = options.request;
		this.Server        = options.Server;
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
console.log(json);
			if (!this.#authenticated) {
				if (json.action !== 'login') {
					return this.disconnect();
				}

				if (!this.Server.Accounts.exists(json.data.name, json.type)) {
					return this.disconnect();
				}

				this.trigger('login', json);
				const account = this.Server.Accounts.get(json.data.name, json.type);

				this.#authenticated = account.authenticate(json.data.password);

				if (!this.#authenticated) {
					return this.disconnect();
				}

				this.Account = account;

				clearTimeout(authTimeout);
				account.Connections.add(this);
			}

			if (this.#authenticated) {
				this.trigger('message', json);

				switch (json.action) {
					case 'command' : {
						if (json.target === 'console') {
							this.send({
								target : 'console',
								data   : await this.Account.Commands.run(json.data)
							});

						} else if (this.Account.hasPermission(`task.console.${json.target}.command`)
						&&  this.Server.Accounts.Tasks.exists(json.target)) {
							const task = this.Server.Accounts.Tasks.get(json.target);

							task.Connections.send({
								action   : 'command',
								data     : json.data,
								username : this.Account.name
							});
						}

						break;
					}

					case 'data' : {
						this.Account.trigger('data', {
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
