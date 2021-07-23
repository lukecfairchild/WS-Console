
const bcrypt = require('bcryptjs');
const Type   = require('simpler-types');

const AccountCommands = require('./AccountCommands');
const Connections     = require('./Connections');
const EventSystem     = require('../../lib/EventSystem');
const Server          = require('../Server');

class Account extends EventSystem {
	#hash;
	#permissions;

	constructor (options) {
		super();
		Type.assert(options, Object);
		Type.assert(options.Server, Server);

		this.Server      = options.Server;
		this.Connections = new Connections({
			Account : this
		});
		this.Commands    = new AccountCommands({
			Account : this,
			Server  : options.Server
		});

		this.name = options.name;
		this.type = options.type;

		const data = this.Server.Database.get('accounts').find({
			name : this.name
		}).value() || {};

		this.#hash        = data.hash;
		this.#permissions = data.permissions || [];
	}

	addPermission (permission) {
		if (!this.#permissions.includes(permission)) {
			this.#permissions.push(permission);

			this.Server.Database.get('accounts').find({
				name : this.name
			}).set('permissions', this.#permissions).write();
		}
	}

	authenticate (password) {
		Type.assert(password, String);

		return bcrypt.compareSync(password, this.#hash);
	}

	getPermissions () {
		return this.#permissions;
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
			const permission = permissions[j];

			if (this.#permissions.includes(`-${permission}`)) {
				return false;
			}

			if (this.#permissions.includes(permission)) {
				return true;
			}

			const permissionSplit = permission.split('.');

			for (let i = 0; i < permissionSplit.length; i++) {
				const parts = permissionSplit.slice(0, permissionSplit.length - i - 1);
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

	removePermission (permission) {
		if (this.#permissions.includes(permission)) {
			this.#permissions.splice(this.#permissions.indexOf(permission), 1);

			this.Server.Database.get('accounts').find({
				name : this.name
			}).set('permissions', this.#permissions).write();
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

		this.Server.Database.get('accounts').find({
			name : this.name
		}).set('hash', hash).write();
	}
}

module.exports = Account;
