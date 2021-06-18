
const User = require('./User');
//const Server = require('./Server');
const Task = require('./Task');
const Type = require('simple-type-assert');

class Accounts {
	#accounts = {};

	constructor (options) {
		// Required options
		Type.assert(options, {
			Server : options.Server
		});

		this.Server = options.Server;
		this.types  = {
			user : User,
			task : Task
		};

		this.create({
			name        : 'Console',
			type        : 'user',
			permissions : ['*', '-logout', '-password']
		});
	}

	create (accountOptions) {
		// Required options
		Type.assert(accountOptions, {
			name : String,
			type : String
		});

		// Optional options
		accountOptions.permissions = accountOptions.permissions || [];
		accountOptions.roles       = accountOptions.roles       || [];
		Type.assert(accountOptions, {
			permissions : Array,
			roles       : Array
		});

		if (this.exists(accountOptions.name)) {
			return this.get(accountOptions.name);
		}

		this.Server.Database.get('accounts').push({
			name        : accountOptions.name,
			hash        : null,
			permissions : accountOptions.permissions || [],
			roles       : accountOptions.roles || [],
			type        : accountOptions.type
		}).write();

		const account = new this.types[accountOptions.type]({
			Accounts : this,
			...accountOptions
		});

		this.#accounts[account.name] = account;

		return account;
	}

	delete (name) {
		Type.assert(name, String);

		if (this.exists(name)) {
			this.unload(name);
			this.Server.Database.get('accounts').remove({
				name : name
			}).write();
		}
	}

	exists (name) {
		Type.assert(name, String);

		if (this.#accounts[name]) {
			return true;
		}

		const data = this.Server.Database.get('accounts').find({
			name : name
		}).value();

		return Boolean(data);
	}

	get (name) {
		Type.assert(name, String);

		if (this.#accounts[name]) {
			return this.#accounts[name];
		}

		if (!this.exists(name)) {
			return;
		}

		const data = this.Server.Database.get('accounts').find({
			name : name
		}).value();

		const account = new this.types[data.type]({
			Accounts : this,
			...data
		});

		this.#accounts[name] = account;

		return account;
	}

	getAll () {
		return this.#accounts;
	}

	unload (name) {
		Type.assert(name, String);

		if (this.exists(name)) {
			this.#accounts[name].disconnect();

			delete this.#accounts[name];
		}
	}

}

module.exports = Accounts;
