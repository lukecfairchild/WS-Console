
const Command = require('../Command');

class TaskDelete extends Command {
	constructor (options) {
		super(options);

		this.arguments   = '<taskname>';
		this.description = 'Deletes a task account';
		this.permissions = [];

		this.Tasks = this.Commands.Server.Accounts.Tasks;
	}

	async run (name) {
		if (!this.Tasks.exists(name)) {
			return `An Account does not exist with that name: "${name}"`;
		}

		this.Tasks.delete(name);
	}
}

module.exports = TaskDelete;
