'use strict';

const Uuid = require('uuid').v4;

const EventSystem = require('../../lib/EventSystem');

class Connection extends EventSystem {
	constructor (options) {
		super();

		this.authenticated = false;
		this.id            = Uuid();
		this.Server        = options.Server;
		this.webSocket     = options.webSocket;

		const authTimeout = setTimeout(() => {
			if (!this.authenticated) {
				this.disconnect();
			}
		}, 5000);

		this.webSocket.on('message', (message) => {
			let data = {};

			try {
				data = JSON.parse(message);

			} catch (error) {
				this.webSocket.terminate();
			}

			if (!this.authenticated) {
				if (data.action !== 'login') {
					return this.disconnect();
				}

				if (!this.Server.Accounts.exists(data.name, data.type)) {
					return this.disconnect();
				}

				this.trigger('login', data);
				const account = this.Server.Accounts.get(data.name, data.type);

				this.authenticated = account.authenticate(data.password);

				if (!this.authenticated) {
					return this.disconnect();
				}

				this.Account = account;

				clearTimeout(authTimeout);
				account.Connections.add(this);
console.log('authenticated', this.Account.name, this.Account.type);
			}

			if (this.authenticated) {
				if (this.Account.hasPermission(`${data.action}.${data.target}`)) {

				}
console.log('message', data);
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
