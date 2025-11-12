
const Type = require('simpler-types');

const Server = require('../Server');

class Users {
	constructor (options) {
		Type.assert(options, Object);
		Type.assert(options.server, Server);

		this.server = options.server;
	}

	create (name) {
		Type.assert(name, String);

		return this.server.accounts.create(name, 'user');
	}

	delete (name) {
		Type.assert(name, String);

		return this.server.accounts.delete(name, 'user');
	}

	get (name) {
		Type.assert(name, String);

		return this.server.accounts.get(name, 'user');
	}

	getAll () {
		return this.server.accounts.getAll('user');
	}

	exists (name) {
		Type.assert(name, String);

		return this.server.accounts.exists(name, 'user');
	}

	list () {
		return this.server.accounts.list('user');
	}
}

module.exports = Users;
