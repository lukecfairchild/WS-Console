
const Command = require('../Command');

class TaskList extends Command {
	constructor (options) {
		super(options);

		this.description = 'Lists all task accounts';
		this.permissions = [];
	}

	async run () {
		console.log(this.Commands.Server.Accounts.getAll());
	}
}

module.exports = TaskList;
