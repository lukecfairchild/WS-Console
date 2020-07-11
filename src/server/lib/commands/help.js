
const Command = require('../Command');

class Help extends Command {
	constructor (options) {
		super(options);

		this.description = '';
		this.permissions = [];
	}

	run (...args) {
		console.log('args:', args);
		console.log('this.parent:', this.parent);
		return args;
	}

	help (...args) {

	}
}

module.exports = Help;
