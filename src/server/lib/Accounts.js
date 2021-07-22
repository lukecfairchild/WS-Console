
const Type = require('simple-type-assert');

const Server = require('../Server');
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
		Type.assert(options.Server, Server);

		this.Server = options.Server;
		this.Tasks  = new Tasks({Server : this.Server});
		this.Users  = new Users({Server : this.Server});
		this.types  = {
			user : User,
			task : Task
		};

		if (!this.exists('Console', 'user')) {
			this.create({
				name        : 'Console',
				type        : 'user',
				permissions : ['*', '-logout', '-password']
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

		this.Server.Database.get('accounts').push({
			name        : accountOptions.name,
			hash        : null,
			permissions : accountOptions.permissions || [],
			roles       : accountOptions.roles || [],
			type        : type
		}).write();

		const account = new this.types[type]({
			type   : type,
			Server : this.Server,
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
			this.Server.Database.get('accounts').remove({
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

		const data = this.Server.Database.get('accounts').find({
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

		const data = this.Server.Database.get('accounts').find({
			name : name,
			type : type
		}).value();

		this.#accounts[type][name] = new this.types[data.type]({
			Server : this.Server,
			...data
		});

		return this.#accounts[type][name];
	}

	list (type) {
		Type.assert(type, String);

		const results = this.Server.Database.get('accounts').value().filter((result) => {
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
