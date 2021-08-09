
const Type = require('simpler-types');

const Server = require('../Server');

class Tasks {
	constructor (options) {
		Type.assert(options, Object);
		Type.assert(options.Server, Server);

		this.Server = options.Server;
	}

	create (name) {
		Type.assert(name, String);

		return this.Server.Accounts.create(name, 'task');
	}

	delete (name) {
		Type.assert(name, String);

		return this.Server.Accounts.delete(name, 'task');
	}

	get (name) {
		Type.assert(name, String);

		return this.Server.Accounts.get(name, 'task');
	}

	getAll () {
		return this.Server.Accounts.getAll('task');
	}

	exists (name) {
		Type.assert(name, String);

		return this.Server.Accounts.exists(name, 'task');
	}

	list () {
		return this.Server.Accounts.list('task');
	}
}

module.exports = Tasks;
