
const Command = require('../Command');

class TaskPassword extends Command {
	constructor (options) {
		super(options);

		this.arguments   = '<taskname> <password>';
		this.description = 'Sets the specified tasks password';
		this.permissions = ['task.password'];
	}

	async run (taskname, password) {
		const tasks = this.server.accounts.tasks;

		if (!tasks.exists(taskname)) {
			return 'Task does not exist';
		}

		tasks.get(taskname).setPassword(password);
	}
}

module.exports = TaskPassword;
