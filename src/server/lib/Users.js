
const Type = require('simpler-types');

const Accounts = require('./Accounts');

class Users {
	constructor (options) {
		Type.assert(options, Object);
		Type.assert(options.Accounts, Accounts);

		this.Accounts = options.Accounts;
	}

	create (name) {
		Type.assert(name, String);

		return this.Accounts.create(name, 'user');
	}

	delete (name) {
		Type.assert(name, String);

		return this.Accounts.delete(name, 'user');
	}

	get (name) {
		Type.assert(name, String);

		return this.Accounts.get(name, 'user');
	}

	exists (name) {
		Type.assert(name, String);

		return this.Accounts.exists(name, 'user');
	}

	list () {
		return this.Accounts.list('user');
	}
}

module.exports = Users;
