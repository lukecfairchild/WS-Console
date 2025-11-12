
const Command = require('../Command');

class TaskDelete extends Command {
	constructor (options) {
		super(options);

		this.arguments   = '<taskname>';
		this.description = 'Deletes a task account';
		this.permissions = ['task.delete'];
	}

	async run (taskname) {
		const tasks = this.commands.server.accounts.tasks;

		if (!tasks.exists(taskname)) {
			return 'Task does not exist';
		}

		tasks.delete(taskname);
	}
}

module.exports = TaskDelete;
