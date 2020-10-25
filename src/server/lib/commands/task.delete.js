
const Command = require('../Command');

class TaskDelete extends Command {
	constructor (options) {
		super(options);

		this.arguments   = '<task name>';
		this.description = 'Deletes a task account';
		this.permissions = [];
	}

	async run (name) {

	}
}

module.exports = TaskDelete;
