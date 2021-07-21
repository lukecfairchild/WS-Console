
const IndentString = require('indent-string');
const Type         = require('simple-type-assert');

const Account = require('./Account');
const Server  = require('../Server');

class AccountCommands {
	constructor (options) {
		Type.assert(options, Object);
		Type.assert(options.Account, Account);
		Type.assert(options.Server, Server);

		this.Account = options.Account;
		this.Server  = options.Server;
	}

	get (command) {
		Type.assert(command, String);

		return this.Server.Commands.get(this.Account, command);
	}

	getAll () {
		return this.Server.Commands.getAll(this.Account);
	}

	async run (command) {
		Type.assert(command, String);

		const response = await this.Server.Commands.get(this.Account, command).run();

		if (response) {
			console.log(IndentString(response, 4));
		}
	}
}

module.exports = AccountCommands;
