
const Command = require('../Command');

class UserPassword extends Command {
	constructor (options) {
		super(options);

		this.arguments   = '<username> <password>';
		this.description = 'Sets the specified users password';
		this.permissions = ['user.password'];
	}

	async run (username, password) {
		const Users = this.Server.Accounts.Users;

		if (!Users.exists(username)) {
			return 'User does not exist';
		}

		Users.get(username).setPassword(password);
	}
}

module.exports = UserPassword;
