'use strict';

const bcrypt = require('bcryptjs');

class Account {
	#events;
	#hash;

	constructor (options) {
		this.connections = [];
		this.#events     = {};
		this.database    = options.database;
		this.name        = options.name;
		this.type        = options.type;

		const data = this.database.get(this.type).find({
			name : this.name
		}).value();

		this.#hash = data.hash;
	}

	addConnection (connection) {
		this.connections.push(connection);

		connection.webSocket.on('close',() => {
			if (this.connections.includes(connection)) {
				this.connections.splice(this.connections.indexOf(connection), 1);
			}
		});

		connection.webSocket.on('message',() => {
			// do stuffs
		});

		this.trigger('login', {
			connection,
			...this
		});
	}

	authenticate (password) {
		if (!password) {
			return false;
		}

		const match = bcrypt.compareSync(password, this.#hash);
		if (!match) {
			return false;
		}

		return true;
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
		if (!event
		||  !callback) {
			return;
		}

		if (!this.#events[event]) {
			this.#events[event] = [];
		}

		if (this.#events[event].includes(callback)) {
			return;
		}

		this.#events[event].push(callback);
	}

	removeEventListener (event, callback) {
		if (!event
		||  !callback
		||  !this.#events[event]) {
			return;
		}

		if (this.#events[event].includes(callback)) {
			this.#events[event].splice(this.#events[event].indexOf(callback), 1);
		}
	}

	send (message) {
		if (!message) {
			return;
		}

		for (const i in this.connections) {
			this.connections[i].send(message);
		}
	}

	setPassword (password) {
		if (!password) {
			return;
		}

		const salt = bcrypt.genSaltSync(10);
		const hash = bcrypt.hashSync(password, salt);

		this.#hash = hash;

		this.database.get(this.type).find({
			name : this.name
		}).set('hash', hash).write();
	}

	trigger (event, data) {
		if (!event
		||  !data) {
			return;
		}

		if (this.#events[event]) {
			for (const i in this.#events[event]) {
				this.#events[event][i](data);
			}
		}
	}
}

module.exports = Account;
