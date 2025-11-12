
const Command = require('../Command');

class UserDelete extends Command {
	constructor (options) {
		super(options);

		this.arguments   = '<username>';
		this.description = 'Deletes a task account';
		this.permissions = ['user.delete'];
	}

	async run (username) {
		const users = this.commands.server.accounts.users;

		if (!users.exists(username)) {
			return 'User does not exist';
		}

		users.delete(username);
	}
}

module.exports = UserDelete;
