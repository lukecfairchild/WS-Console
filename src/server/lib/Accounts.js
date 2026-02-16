
const Type = require('simpler-types');

const Server = require('..');
const Task   = require('./Task');
const Tasks  = require('./Tasks');
const User   = require('./User');
const Users  = require('./Users');

class Accounts {
	#accounts = {
		user : {},
		task : {}
	};

	constructor (options) {
		Type.assert(options, Object);
		Type.assert(options.server, Server);

		this.server = options.server;
		this.tasks  = new Tasks({ server : this.server });
		this.users  = new Users({ server : this.server });
		this.types  = {
			user : User,
			task : Task
		};

		if (!this.exists('Console', 'user')) {
			this.create({
				name        : 'Console',
				type        : 'user',
				permissions : ['*', '-connections', '-logout', '-password']
			});
		}
	}

	create (accountOptions, type) {
		Type.assert(type, String);
		Type.assert(accountOptions, {
			name : String
		});

		if (this.exists(accountOptions.name, type)) {
			throw new Error(`Account name already exists: "${accountOptions.name}"`);
		}

		// Optional options
		accountOptions.permissions = accountOptions.permissions || [];
		accountOptions.roles       = accountOptions.roles       || [];
		Type.assert(accountOptions, {
			permissions : Array,
			roles       : Array
		});

		this.server.database.get('accounts').push({
			name        : accountOptions.name,
			hash        : null,
			permissions : accountOptions.permissions || [],
			roles       : accountOptions.roles || [],
			type        : type
		}).write();

		const account = new this.types[type]({
			type   : type,
			server : this.server,
			...accountOptions
		});

		this.#accounts[type][account.name] = account;

		return account;
	}

	delete (name, type) {
		Type.assert(name, String);
		Type.assert(type, String);

		if (this.exists(name, type)) {
			this.unload(name, type);
			this.server.database.get('accounts').remove({
				name : name,
				type : type
			}).write();
		}
	}

	exists (name, type) {
		Type.assert(name, String);
		Type.assert(type, String);

		if (!this.#accounts[type]) {
			return false;
		}

		if (this.#accounts[type][name]) {
			return true;
		}

		const data = this.server.database.get('accounts').find({
			name : name,
			type : type
		}).value();

		return Boolean(data);
	}

	get (name, type) {
		Type.assert(name, String);
		Type.assert(type, String);

		if (this.#accounts[type][name]) {
			return this.#accounts[type][name];
		}

		if (!this.exists(name, type)) {
			throw new Error(`Account does not exist: [${type}] ${name}`);
		}

		const data = this.server.database.get('accounts').find({
			name : name,
			type : type
		}).value();

		this.#accounts[type][name] = new this.types[data.type]({
			server : this.server,
			...data
		});

		return this.#accounts[type][name];
	}

	getAll (type) {
		return this.#accounts[type];
	}

	list (type) {
		Type.assert(type, String);

		const results = this.server.database.get('accounts').value().filter((result) => {
			return result.type === type;
		}).map((result) => {
			return result.name;
		});

		return results;
	}

	unload (name, type) {
		Type.assert(name, String);
		Type.assert(type, String);

		if (this.exists(name, type)) {
			const task = this.get(name, type);
			task.disconnect();

			delete this.#accounts[type][name];
		}
	}

}

module.exports = Accounts;
