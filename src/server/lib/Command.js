
class Command {
	constructor (options = {}) {
		this.account    = options.account;
		this.commands   = options.commands;
		this.connection = options.connection;
		this.server     = options.server;

		this.arguments   = '';
		this.description = '';
		this.permissions = [];
	}

	run () {
		return 'Command not found.';
	}
}

module.exports = Command;
