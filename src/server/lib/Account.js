'use strict';

const bcrypt = require('bcryptjs');
const Type   = require('simple-type-assert');

const AccountCommands = require('./AccountCommands');
const Connections     = require('./Connections');

class Account {
	#events;
	#hash;
	#permissions;

	constructor (options) {
		this.#events     = {};
		this.Accounts    = options.Accounts;
		this.connections = new Connections({
			Account : this
		});
		this.Commands    = new AccountCommands({
			Account : this
		});

		this.name = options.name;
		this.type = options.type;

		const data = this.Accounts.Server.Database.get('accounts').find({
			name : this.name
		}).value() || {};

		this.#hash        = data.hash;
		this.#permissions = data.permissions || [];
	}

	hasPermission (permissions) {
		if (Type.is(permissions, String)) {
			permissions = [permissions];
		}

		Type.assert(permissions, Array);

		if (permissions.length === 0) {
			return true;
		}

		for (const j in permissions) {
			const permission = permissions[j].split('.');

			if (this.#permissions.includes(`-${permission}`)) {
				return false;
			}

			if (this.#permissions.includes(permission)) {
				return true;
			}

			for (let i = 0; i < permission.length; i++) {
				const parts = permission.slice(0, permission.length - i - 1);
				parts.push('*');

				const permissionParts = parts.join('.');

				if (this.#permissions.includes(`-${permissionParts}`)) {
					return false;
				}

				if (this.#permissions.includes(permissionParts)) {
					return true;
				}
			}
		}

		return false;
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
		Type.assert(password, String);

		const salt = bcrypt.genSaltSync(10);
		const hash = bcrypt.hashSync(password, salt);

		this.#hash = hash;

		this.Accounts.Server.Database.get('accounts').find({
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
