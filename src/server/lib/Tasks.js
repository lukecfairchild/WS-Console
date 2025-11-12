
const Type = require('simpler-types');

const Server = require('../Server');

class Tasks {
	constructor (options) {
		Type.assert(options, Object);
		Type.assert(options.server, Server);

		this.server = options.server;
	}

	create (name) {
		Type.assert(name, String);

		return this.server.Accounts.create(name, 'task');
	}

	delete (name) {
		Type.assert(name, String);

		return this.server.accounts.delete(name, 'task');
	}

	get (name) {
		Type.assert(name, String);

		return this.server.accounts.get(name, 'task');
	}

	getAll () {
		return this.server.accounts.getAll('task');
	}

	exists (name) {
		Type.assert(name, String);

		return this.server.accounts.exists(name, 'task');
	}

	list () {
		return this.server.accounts.list('task');
	}
}

module.exports = Tasks;
