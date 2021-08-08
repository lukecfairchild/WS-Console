
const Type = require('simpler-types');

const Server = require('../Server');

class Tasks {
	constructor (options) {
		Type.assert(options, Object);
		Type.assert(options.Server, Server);

		this.Accounts = options.Server.Accounts;
	}

	create (name) {
		Type.assert(name, String);

		return this.Accounts.create(name, 'task');
	}

	delete (name) {
		Type.assert(name, String);

		return this.Accounts.delete(name, 'task');
	}

	get (name) {
		Type.assert(name, String);

		return this.Accounts.get(name, 'task');
	}

	getAll () {
		return this.Accounts.getAll('task');
	}

	exists (name) {
		Type.assert(name, String);

		return this.Accounts.exists(name, 'task');
	}

	list () {
		return this.Accounts.list('task');
	}
}

module.exports = Tasks;
