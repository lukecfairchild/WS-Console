
const IndentString = require('indent-string');

class AccountCommands {
	constructor (options) {
		this.Account = options.Account;
	}

	get (command) {
		return this.Account.Accounts.Server.Commands.get(this.Account, command);
	}

	getAll () {
		return this.Account.Accounts.Server.Commands.getAll(this.Account);
	}

	async run (rawCommand) {
		const command  = this.Account.Accounts.Server.Commands.get(this.Account, rawCommand);
		const response = await command.run();

		if (response) {
			console.log(IndentString(response, 4));
		}
	}
}

module.exports = AccountCommands;
