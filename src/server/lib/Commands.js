
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
		if (this.#commands[command]) {
			throw new Error(`Command already exists: ${command}`);
		}

		this.#commands[command] = commandPackage;
	}

	remove (command) {
		delete this.#commands[command];
	}

	get (commandRaw) {
		const commandTrimmed = commandRaw.trim();

		for (const i in commandTrimmed.split(' ')) {
			const commandParts = commandTrimmed.split(' ');
			const command      = commandParts.splice(0, commandParts.length - i).join(' ');

			if (this.#commands[command]) {
				return {
					handler : () => {
						this.#commands[command].handler(...commandParts);
					},
					permissions : this.#commands[command].permissions
				};
			}
		}
	}

	run (commandRaw) {
		this.get(commandRaw).handler();
	}
}

module.exports = Commands;
