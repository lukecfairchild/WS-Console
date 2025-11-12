
const IndentString = require('indent-string');
const Type         = require('simpler-types');

const Account = require('./Account');
const Server  = require('../Server');

class AccountCommands {
	constructor (options) {
		Type.assert(options, Object);
		Type.assert(options.account, Account);
		Type.assert(options.server, Server);

		this.account = options.account;
		this.server  = options.server;
	}

	get (command) {
		Type.assert(command, String);

		return this.server.Commands.get(this.account, command);
	}

	getAll () {
		return this.server.commands.getAll(this.account);
	}

	async run (command) {
		Type.assert(command, String);

		const response = await this.server.commands.get(this.account, command).run();

		if (response) {
			return IndentString(response, 4);
		}
	}
}

module.exports = AccountCommands;
