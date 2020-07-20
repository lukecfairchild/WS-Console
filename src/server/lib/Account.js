'use strict';

const bcrypt      = require('bcryptjs');
const Connections = require('./Connections');

class Account {
	#events;
	#hash;

	constructor (options) {
		this.#events     = {};
		this.Accounts    = options.Accounts;
		this.connections = new Connections({
			Account : this
		});

		this.name = options.name;
		this.type = options.type;

		const data = this.database.get('accounts').find({
			name : this.name
		}).value() || {};

		this.#hash = data.hash;
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

		this.Users.Server.database.get('accounts').find({
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
