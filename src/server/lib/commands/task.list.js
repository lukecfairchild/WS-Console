
const Command = require('../Command');

class TaskList extends Command {
	constructor (options) {
		super(options);

		this.description = 'Lists all task accounts';
		this.permissions = ['task.list'];
	}

	async run () {
		const tasks = this.server.accounts.tasks.list();

		return tasks.join(', ');
	}
}

module.exports = TaskList;
