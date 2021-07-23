
const Command = require('../Command');

class TaskCreate extends Command {
	constructor (options) {
		super(options);

		this.arguments   = '<taskname> [password]';
		this.description = 'Creates a new task account with an optional password';
		this.permissions = ['task.create'];
	}

	async run (taskname, password = null) {
		const Tasks = this.Commands.Server.Accounts.Tasks;

		if (Tasks.exists(taskname)) {
			return `A Task already exists with that name: "${taskname}"`;
		}

		const task = Tasks.create({
			name : taskname
		});

		if (password) {
			task.setPassword(password);
		}
	}
}

module.exports = TaskCreate;
