
const Command = require('../Command');

class UserDelete extends Command {
	constructor (options) {
		super(options);

		this.arguments   = '<username>';
		this.description = 'Deletes a task account';
		this.permissions = ['user.delete'];
	}

	async run (username) {
		const Users = this.Commands.Server.Accounts.Users;

		if (!Users.exists(username)) {
			return 'User does not exist';
		}

		Users.delete(username);
	}
}

module.exports = UserDelete;
