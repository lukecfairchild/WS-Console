
const Command = require('../Command');

class TaskCreate extends Command {
	constructor (options) {
		super(options);

		this.arguments   = '<task name> [password]';
		this.description = 'Creates a new task account';
		this.permissions = ['task.create'];

		this.Tasks = this.Commands.Server.Accounts.Tasks;
	}

	async run (name, password = null) {
		if (this.Tasks.exists(name)) {
			return `An Account already exists with that name: "${name}"`;
		}

		const task = this.Tasks.create({
			name : name
		});

		if (password) {
			task.setPassword(password);
		}
	}
}

module.exports = TaskCreate;
