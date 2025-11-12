
const Command      = require('../Command');
const IndentString = require('indent-string');

class UserPermission extends Command {
	constructor (options) {
		super(options);

		this.description = '';
		this.permissions = [];
	}

	async run () {
		const commands = this.account.commands.getAll();

		const results = [];

		for (let i in commands) {
			const command = commands[i];
			let result    = i;

			if (result.match('^user permission')) {
				if (command.arguments) {
					result += ' ' + command.arguments;
				}

				if (command.description) {
					result += '\n' + IndentString(command.description, 4);
				}

				results.push(result);
			}
		}

		return results.join('\n');
	}
}

module.exports = UserPermission;
