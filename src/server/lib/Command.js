
class Command {
	constructor (options = {}) {
		this.Account    = options.Account;
		this.Commands   = options.Commands;
		this.Connection = options.Connection;

		this.arguments   = '';
		this.description = '';
		this.permissions = [];
	}

	run () {
		return 'Command not found.';
	}
}

module.exports = Command;
