
const Command = require('../Command');

class UserCreate extends Command {
	constructor (options) {
		super(options);

		this.arguments   = '<username> [password]';
		this.description = 'Creates a new user account';
		this.permissions = ['user.create'];
	}

	async run (username, password = null) {
		const users = this.commands.server.accounts.Users;

		if (users.exists(username)) {
			return `A User already exists with that name: "${username}"`;
		}

		if (username.match(/\./)) {
			return 'Account names may not contain periods.';
		}

		const user = users.create({
			name : username
		});

		if (password) {
			user.setPassword(password);
		}
	}
}

module.exports = UserCreate;
