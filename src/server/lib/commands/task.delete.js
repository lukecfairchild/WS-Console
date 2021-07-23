
const Command = require('../Command');

class TaskDelete extends Command {
	constructor (options) {
		super(options);

		this.arguments   = '<taskname>';
		this.description = 'Deletes a task account';
		this.permissions = ['task.delete'];
	}

	async run (taskname) {
		const Tasks = this.Commands.Server.Accounts.Tasks;

		if (!Tasks.exists(taskname)) {
			return 'Task does not exist';
		}

		Tasks.delete(taskname);
	}
}

module.exports = TaskDelete;
