
const Command = require('../Command');

class TaskPassword extends Command {
	constructor (options) {
		super(options);

		this.arguments   = '<taskname> <password>';
		this.description = 'Sets the specified tasks password';
		this.permissions = ['task.password'];
	}

	async run (taskname, password) {
		const Tasks = this.Server.Accounts.Tasks;

		if (!Tasks.exists(taskname)) {
			return 'Task does not exist';
		}

		Tasks.get(taskname).setPassword(password);
	}
}

module.exports = TaskPassword;
