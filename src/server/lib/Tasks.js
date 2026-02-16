
const Type = require('simpler-types');

const Server = require('../Server');

class Tasks {
	constructor (options) {
		Type.assert(options, Object);
		Type.assert(options.server, Server);

		this.server = options.server;
	}

	create (taskname) {
		Type.assert(taskname, String);

		return this.server.Accounts.create(taskname, 'task');
	}

	delete (taskname) {
		Type.assert(taskname, String);
		const task = this.server.accounts.get(taskname, 'task');

		return task.delete();
	}

	get (taskname) {
		Type.assert(taskname, String);

		return this.server.accounts.get(taskname, 'task');
	}

	getAll () {
		return this.server.accounts.getAll('task');
	}

	exists (taskname) {
		Type.assert(taskname, String);

		return this.server.accounts.exists(taskname, 'task');
	}

	list () {
		return this.server.accounts.list('task');
	}
}

module.exports = Tasks;
