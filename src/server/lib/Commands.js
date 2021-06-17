
const Command    = require('./Command');
const FileSystem = require('fs');
const Path       = require('path');
const Type       = require('simpler-types');

class Commands {
	#commands = {};

	constructor (options) {
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
		this.#commands[command] = commandPackage;
	}

	remove (command) {
		delete this.#commands[command];
	}

	getAll (account) {
		const commands = {};

		for (const i in this.#commands) {
			commands[i] = this.get(account, i);
		}

		return commands;
	}

	get (account, commandRaw) {
		const commandTrimmed = (commandRaw || '').trim();

		for (const i in commandTrimmed.split(' ')) {
			const commandParts = commandTrimmed.split(' ');
			const commandName  = commandParts.splice(0, commandParts.length - i).join(' ');

			if (this.#commands[commandName] && Type.get(this.#commands[commandName]) === 'Function') {
				const command = new this.#commands[commandName]({
					Account  : account,
					Commands : this
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
						}
					}
				};
			}
		}

		return this.unknownCommand;
	}
}

module.exports = Commands;
