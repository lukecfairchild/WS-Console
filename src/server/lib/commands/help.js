
const Command      = require('../Command');
const IndentString = require('indent-string');

class Help extends Command {
	constructor (options) {
		super(options);

		this.description = 'Lists all available commands and their descriptions.';
		this.permissions = [];
	}

	async run (...args) {
		const commands = this.Account.Commands.getAll();

		if (args.length === 0) {
			const results = [];

			for (let i in commands) {
				const command = commands[i];
				let result    = i;

				if (command.arguments) {
					result += ' ' + command.arguments;
				}

				if (command.description) {
					result += '\n' + IndentString(command.description, 4);
				}

				results.push(result);
			}

			return results.join('\n');
		}

		if (commands[args.join()]) {
			return commands[args.join()].help();
		}

		return 'unknown command';
	}
}

module.exports = Help;
