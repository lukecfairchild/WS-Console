'use strict';

const bcrypt = require('bcryptjs');

class User {
	#passwordHash;

	constructor (options) {
		this.database = options.database;
		this.username = options.username;

		const user = this.database.get('users').find({
			username : username
		}).value();

		this.connections   = [];
		this.permissions   = user.permissions;
		this.#passwordHash = user.hash;
		this.roles         = user.roles
	}

	addPermission (permission) {
		if (!this.permissions.includes(permission)) {
			this.permissions.push(permission);

			this.database.get('users').find({
				username : this.username
			}).set('permissions', this.permissions).write();
		}
	}

	addRole (role) {
		if (!this.roles.includes(role)) {
			this.roles.push(role);

			this.database.get('users').find({
				username : this.username
			}).set('roles', this.roles).write();
		}
	}

	authenticate (credentials) {
		const user = this.database.getUser(data.username);

		if (user
		&&  credentials.username !== undefined
		&&  credentials.password !== undefined
		&&  user.hash) {
			bcrypt.compare(credentials.password, user.hash, (error, result) => {
				if (result) {
					clearTimeout(this.timeout);

					delete this.timeout;

					this.username      = credentials.username;
					this.authenticated = true;

					this.options.webSocketServer.addUser(this);

					const servers = this.options.webSocketServer.getServers();

					for (const i in servers) {
						const server = servers[i];

						if (server.getName() === 'Console'
						||  Database.userHasPermission(this.getUsername(), 'console.view.' + server.getName())
						||  Database.userHasPermission(this.getUsername(), 'console.command.' + server.getName())) {

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

	addConnection (connection) {
		this.connections.push(connection);

		connection.webSocket.on('close',() => {
			if (this.connections.includes(connection)) {
				this.connections.splice(this.connections.indexOf(connection), 1);
			}
		});

		connection.on('login', (event) => {
			this.authenticate({
				username : event.username,
				password : event.password
			});
		});

	}

	delete () {
		this.disconnect();

		this.database.database.get('users').remove({
			username : this.username
		}).write();
	}

	disconnect () {
		for (const i in this.connections) {
			this.connections[i].disconnect();
		}
	}

	getPermissions () {
		return this.permissions;
	}

	getUsername () {
		return this.username;
	}

	on (event, callback) {

	}

	removePermission (permission) {
		if (this.permissions.includes(permission)) {
			this.permissions.splice(this.permissions.indexOf(permission), 1);


			this.database.get('users').find({
				username : this.username
			}).set('permissions', this.permissions).write();
		}
	}

	removeRole (role) {
		if (this.roles.includes(role)) {
			this.roles.splice(this.roles.indexOf(role), 1);


			this.database.get('users').find({
				username : this.username
			}).set('roles', this.roles).write();
		}
	}

	send (message) {
		for (const i in this.connections) {
			this.connections[i].send(message);
		}
	}

	setPassword (password) {
		bcrypt.genSalt(10, (error, salt) => {
			if (error) {
				console.error('error generating salt', error);
			}

			bcrypt.hash(password, salt, (error, hash) => {
				if (error) {
					console.error('error hashing password', error);
				}

				this.database.get('users').find({
					username : this.username
				}).set('hash', hash).write();
			});
		});
	}
}

module.exports = User;
