
const Command = require('../Command');

class UserPassword extends Command {
	constructor (options) {
		super(options);

		this.arguments   = '<username> <password>';
		this.description = 'Sets the specified users password';
		this.permissions = ['user.password'];
	}

	async run (username, password) {
		const users = this.server.accounts.users;

		if (!users.exists(username)) {
			return 'User does not exist';
		}

		users.get(username).setPassword(password);
	}
}

module.exports = UserPassword;
