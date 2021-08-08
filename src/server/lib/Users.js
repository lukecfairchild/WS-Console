
const Type = require('simpler-types');

const Server = require('../Server');

class Users {
	constructor (options) {
		Type.assert(options, Object);
		Type.assert(options.Server, Server);

		this.Server = options.Server;
	}

	create (name) {
		Type.assert(name, String);

		return this.Server.Accounts.create(name, 'user');
	}

	delete (name) {
		Type.assert(name, String);

		return this.Server.Accounts.delete(name, 'user');
	}

	get (name) {
		Type.assert(name, String);

		return this.Server.Accounts.get(name, 'user');
	}

	getAll () {
		return this.Server.Accounts.getAll('user');
	}

	exists (name) {
		Type.assert(name, String);

		return this.Server.Accounts.exists(name, 'user');
	}

	list () {
		return this.Server.Accounts.list('user');
	}
}

module.exports = Users;
