
const bcrypt = require('bcryptjs');
const Type   = require('simpler-types');

const AccountCommands = require('./AccountCommands');
const Connections     = require('./Connections');
const EventSystem     = require('../../lib/EventSystem');
const Server          = require('..');

class Account extends EventSystem {
	#hash;
	#permissions;

	constructor (options) {
		super();
		Type.assert(options, Object);
		Type.assert(options.server, Server);

		this.server      = options.server;
		this.connections = new Connections({
			account : this
		});
		this.commands    = new AccountCommands({
			account : this,
			server  : options.server
		});

		if (options.name.match(/\./)) {
			throw new Error('Account names may not contain periods');
		}

		this.name = options.name;
		this.type = options.type;

		const data = this.server.database.get('accounts').find({
			name : this.name
		}).value() || {};

		this.#hash        = data.hash;
		this.#permissions = data.permissions || [];
	}

	addPermission (permission) {
		if (!this.#permissions.includes(permission)) {
			this.#permissions.push(permission);

			this.server.database.get('accounts').find({
				name : this.name
			}).set('permissions', this.#permissions).write();
			this.trigger('addPermission', permission);
		}
	}

	authenticate (password) {
		Type.assert(password, String);

		const authenticate = bcrypt.compareSync(password, this.#hash);

		this.trigger('addPermission', authenticate);

		return authenticate;
	}

	delete () {
		this.disconnect();
		this.server.accounts.delete(this.name, this.type);
	}

	disconnect () {
		this.connections.disconnect();
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

			this.server.database.get('accounts').find({
				name : this.name
			}).set('permissions', this.#permissions).write();
			this.trigger('removePermission', permission);
		}
	}

	setPassword (password) {
		Type.assert(password, String);

		const salt = bcrypt.genSaltSync(10);
		const hash = bcrypt.hashSync(password, salt);

		this.#hash = hash;

		this.server.database.get('accounts').find({
			name : this.name
		}).set('hash', hash).write();
		this.trigger('passwordChange');
	}
}

module.exports = Account;
