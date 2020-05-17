'use strict';

const bcrypt = require('bcryptjs');

class Account {
	#passwordHash;

	constructor (options) {
		this.connections = [];
		this.events      = {};
		this.database    = options.database;
		this.name        = options.name;
	}

	addConnection (connection) {
		this.connections.push(connection);

		connection.webSocket.on('close',() => {
			if (this.connections.includes(connection)) {
				this.connections.splice(this.connections.indexOf(connection), 1);
			}
		});
	}

	authenticate (password) {
		if (!password) {
			return false;
		}

		const match = bcrypt.compareSync(password, this.#passwordHash);
		if (!match) {
			return false;
		}

		this.authenticated = true;

		return true;
	}

	delete () {
		this.disconnect();

		this.database.database.get(this.type).remove({
			name : this.name
		}).write();
	}

	disconnect () {
		for (const i in this.connections) {
			this.connections[i].disconnect();
		}
	}

	getName () {
		return this.name;
	}

	on (event, callback) {

	}

	removeEventListener (event, callback) {

	}

	send (message) {
		for (const i in this.connections) {
			this.connections[i].send(message);
		}
	}

	setPassword (password) {
		const salt = bcrypt.genSaltSync(10);
		const hash = bcrypt.hashSync(password, salt);

		this.#passwordHash = hash;

		this.database.get(this.type).find({
			name : this.name
		}).set('hash', hash).write();
	}
}

module.exports = Account;
