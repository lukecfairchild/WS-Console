
const Command = require('../Command');

class TaskList extends Command {
	constructor (options) {
		super(options);

		this.description = 'Lists all task accounts';
		this.permissions = [];
	}

	async run () {
		const tasks = this.Commands.Server.Accounts.Tasks.getAll().map((account) => {
			return account.name;
		});

		return tasks.join(', ');
	}
}

module.exports = TaskList;
