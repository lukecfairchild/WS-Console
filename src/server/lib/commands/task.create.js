
const Command = require('../Command');

class TaskCreate extends Command {
	constructor (options) {
		super(options);

		this.arguments   = '<task name>';
		this.description = 'Creates a new task account';
		this.permissions = [];
	}

	async run (name) {

	}
}

module.exports = TaskCreate;
