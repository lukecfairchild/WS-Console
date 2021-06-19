
const Command = require('../Command');

class TaskCreate extends Command {
	constructor (options) {
		super(options);

		this.arguments   = '<task name> [password]';
		this.description = 'Creates a new task account';
		this.permissions = [];
	}

	async run (name, password = null) {
		if (this.Commands.Server.Accounts.exists(name)) {
			return `An Account already exists with that name: "${name}"`;
		}

		const task = this.Commands.Server.Accounts.create({
			type : 'task',
			name : name
		});

		if (password) {
			task.setPassword(password);
		}
	}
}

module.exports = TaskCreate;
