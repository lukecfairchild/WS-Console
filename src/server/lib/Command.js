
class Command {
	constructor (options = {}) {
		this.Commands = options.Commands;
		this.Account  = options.Account;

		this.arguments   = '';
		this.description = '';
		this.permissions = [];
	}

	run () {
		return 'Command not found.';
	}
}

module.exports = Command;
