
const FileSystem = require('fs');
const Path       = require('path');

class Commands {
	#commands = {};

	constructor () {
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

	get (commandRaw) {
		const commandTrimmed = commandRaw.trim();

		for (const i in commandTrimmed.split(' ')) {
			const commandParts = commandTrimmed.split(' ');
			const commandName  = commandParts.splice(0, commandParts.length - i).join(' ');

			if (this.#commands[commandName]) {
				const command = this.#commands[commandName];

				const returns = async (...args) => {
					return await command.handler(...args);
				};

				returns.handler     = command.handler;
				returns.permissions = command.permissions;

				return returns;
			}
		}

		return {
			handler : () => {
				return 'Command not found.';
			},
			permissions : []
		};
	}

	run (commandRaw) {
		this.get(commandRaw).handler();
	}
}

module.exports = Commands;
