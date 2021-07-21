
const FileSystem = require('fs');
const Path       = require('path');
const Type       = require('simpler-types');

const Account = require('./Account');
const Command = require('./Command');
const Server  = require('../Server');

class Commands {
	#commands = {};

	constructor (options) {
		Type.assert(options, Object);
		Type.assert(options.Server, Server);

		this.Server = options.Server;

		const files = FileSystem.readdirSync(Path.join(__dirname, 'commands'));

		files.forEach(fileName => {
			const filePath = Path.join(__dirname, 'commands', fileName);
			const command  = fileName.split('.').slice(0, -1).join(' ');

			this.add(command, require(filePath));
		});

		this.unknownCommand = new Command();
	}

	add (command, commandPackage) {
		Type.assert(command, String);
		Type.assert([commandPackage], [Function, Object]);

		this.#commands[command] = commandPackage;
	}

	remove (command) {
		Type.assert(command, String);

		delete this.#commands[command];
	}

	getAll (account) {
		Type.assert(account, Account);

		const commands = {};

		for (const i in this.#commands) {
			const command = this.get(account, i);

			if (account.hasPermission(command.permissions || [])) {
				commands[i] = command;
			}
		}

		return commands;
	}

	get (account, commandRaw) {
		Type.assert(account, Account);
		Type.assert(commandRaw, String);

		const commandTrimmed = (commandRaw || '').trim();

		for (const i in commandTrimmed.split(' ')) {
			const commandParts = commandTrimmed.split(' ');
			const commandName  = commandParts.splice(0, commandParts.length - i).join(' ');

			if (this.#commands[commandName]
			&&  Type.get(this.#commands[commandName]) === 'Function') {
				const command = new this.#commands[commandName]({
					Account  : account,
					Commands : this,
					Server   : this.Server
				});

				return {
					...command,
					account     : account,
					help        : command.help        || '',
					permissions : command.permissions || [],
					run         : async (...rawArgs) => {
						let args = commandParts;

						if (rawArgs.length) {
							args = rawArgs;
						}

						if (account.hasPermission(command.permissions || [])) {
							return await command.run(...args);
						} else {
							return 'You do not have permission to do that.';
						}
					}
				};
			}
		}

		return this.unknownCommand;
	}
}

module.exports = Commands;
