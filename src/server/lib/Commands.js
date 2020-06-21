
const FileSystem = require('fs');
const Path       = require('path');

class Commands {
	#commands = {};
	#user;
	constructor () {
		const files = FileSystem.readdirSync(Path.join(__dirname, 'commands'));

		files.forEach(fileName => {
			const filePath = Path.join(__dirname, 'commands', fileName);
			const command  = fileName.split('.').slice(0, -1).join(' ');

			this.#commands[command] = require(filePath);
		});
	}

	run (commandRaw) {
		const commandTrimmed = commandRaw.trim();

		for (const i in commandTrimmed.split(' ')) {
			const commandParts = commandTrimmed.split(' ');
			const command      = commandParts.splice(0, commandParts.length - i).join(' ');

			if (this.#commands[command]
			&&  (!this.#commands[command].permissions
			||   this.#user.hasPermission(this.#commands[command].permissions))) {
				this.#commands[command].handler(...commandParts);
			}
		}
	}
}

module.exports = Commands;
