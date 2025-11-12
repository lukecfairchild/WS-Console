
const Command = require('../Command');

class TaskCreate extends Command {
	constructor (options) {
		super(options);

		this.arguments   = '<taskname> [password]';
		this.description = 'Creates a new task account with an optional password';
		this.permissions = ['task.create'];
	}

	async run (taskname, password = null) {
		const tasks = this.commands.server.accounts.Tasks;

		if (tasks.exists(taskname)) {
			return `A Task already exists with that name: "${taskname}"`;
		}

		if (taskname.match(/\./)) {
			return 'Account names may not contain periods.';
		}

		const task = tasks.create({
			name : taskname
		});

		if (password) {
			task.setPassword(password);
		}
	}
}

module.exports = TaskCreate;
