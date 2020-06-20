
const FileSystem = require('fs');
const Path       = require('path');

class Commands {
	#commands = {};
	constructor () {
		const files = FileSystem.readdirSync(Path.join(__dirname, 'commands'));

		files.forEach(fileName => {
			const filePath = Path.join(__dirname, 'commands', fileName);
			const command  = fileName.split('.').slice(0, -1).join(' ');

			this.#commands[command] = require(filePath);
		});
	}

	run (rawCommand) {
		const command = rawCommand.trim();

		for (const i in command.split(' ')) {
			const commandParts = command.split(' ');
			const check        = commandParts.splice(0, commandParts.length - i).join(' ');

			if (this.#commands[check]) {

			}
		}
	}
}

module.exports = Commands;
