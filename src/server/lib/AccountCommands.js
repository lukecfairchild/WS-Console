
const IndentString = require('indent-string');

class AccountCommands {
	constructor (options) {
		this.Account = options.Account;
		this.Server  = options.Server;
	}

	get (command) {
		return this.Server.Commands.get(this.Account, command);
	}

	getAll () {
		return this.Server.Commands.getAll(this.Account);
	}

	async run (rawCommand) {
		const command  = this.Server.Commands.get(this.Account, rawCommand);
		const response = await command.run();

		if (response) {
			console.log(IndentString(response, 4));
		}
	}
}

module.exports = AccountCommands;
