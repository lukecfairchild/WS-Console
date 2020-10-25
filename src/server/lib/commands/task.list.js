
const Command = require('../Command');

class TaskList extends Command {
	constructor (options) {
		super(options);

		this.description = 'Lists all task accounts';
		this.permissions = [];
	}

	async run () {

	}
}

module.exports = TaskList;
