
const Type = require('simple-type-assert');

const Task  = require('./Task');
const Tasks = require('./Tasks');
const User  = require('./User');
const Users = require('./Users');

class Accounts {
	#accounts = {
		user : {},
		task : {}
	};

	constructor (options) {
		// Required options
		Type.assert(options, {
			Server : options.Server
		});

		this.Server = options.Server;
		this.Tasks  = new Tasks({Accounts : this});
		this.Users  = new Users({Accounts : this});
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
		// Required options
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
			Accounts : this,
			type     : type,
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

		const account = new this.types[data.type]({
			Accounts : this,
			...data
		});

		this.#accounts[type][name] = account;

		return account;
	}

	getAll (type) {
		Type.assert(type, String);

		const results = this.Server.Database.get('accounts').value().filter((result) => {
			return result.type === type;
		});

		const accounts = results.map((result) => {
			return this.get(result.name, result.type);
		});

		return accounts;
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
