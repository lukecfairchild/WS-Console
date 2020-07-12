
const FileSystem = require('fs');
const Path       = require('path');

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
	}

	add (command, commandPackage) {
		this.#commands[command] = commandPackage;
	}

	remove (command) {
		delete this.#commands[command];
	}

	getAll () {
		const commands = [];

		for (const i in this.#commands) {
			commands.push(this.get(this.#commands[i]));
		}

		return commands;
	}

	get (commandRaw) {
		const commandTrimmed = commandRaw.trim();

		for (const i in commandTrimmed.split(' ')) {
			const commandParts = commandTrimmed.split(' ');
			const commandName  = commandParts.splice(0, commandParts.length - i).join(' ');

			if (this.#commands[commandName]) {
				const command = new this.#commands[commandName]({
					Commands : this
				});

				return {
					help        : command.help        || '',
					permissions : command.permissions || [],
					run         : async (...rawArgs) => {
						let args = commandParts;

						if (rawArgs.length) {
							args = rawArgs;
						}

						return await command.run(...args);
					}
				};
			}
		}

		return {
			help        : '',
			permissions : [],
			run         : () => {
				return 'Command not found.';
			}
		};
	}
}

module.exports = Commands;
