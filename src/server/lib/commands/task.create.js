
const Command = require('../Command');

class TaskCreate extends Command {
	constructor (options) {
		super(options);

		this.arguments   = '<task name> [password]';
		this.description = 'Creates a new task account';
		this.permissions = [];
	}

	async run (name, password = null) {
console.log('task.create 1');
		const task = this.Commands.Server.Accounts.create({
			type : 'task',
			name : name
		});
console.log('task.create 2');
		if (password) {
			task.setPassword(password);
		}
console.log('task.create 3');
	}
}

module.exports = TaskCreate;
