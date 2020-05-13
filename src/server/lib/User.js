'use strict';

const bcrypt = require('bcryptjs');

class User {
	#passwordHash;

	constructor (options) {
		this.connections = [];
		this.database    = options.database;

		const user = this.database.get('users').find({
			username : options.username
		}).value();

		this.username      = user.username;
		this.permissions   = user.permissions;
		this.#passwordHash = user.hash;
		this.roles         = user.roles;
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

	authenticate (data) {
		const user = this.database.getUser(data.username);

		if (!user
		||  data.username === undefined
		||  data.password === undefined
		||  !user.hash) {
			return;
		}

		bcrypt.compare(data.password, user.hash, (error, result) => {
			if (!result) {
				return;
			}

			this.username      = data.username;
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
		});
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

	hasPermission (permission) {
		if (this.permissions.includes(permission)
		||  this.permissions.includes('*')) {
			return true;
		}

		const splitPermission = permission.split('.');

		let wholePermission = '';

		for (const i in splitPermission) {
			const permissionPart = splitPermission[i];

			if (permissionPart !== '*'
			&&  this.permissions.includes(wholePermission + permissionPart + '.*')) {
				return true;
			}

			wholePermission += permissionPart + '.';
		}

		return false;
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
