
const Command = require('../Command');

class UserCreate extends Command {
	constructor (options) {
		super(options);

		this.arguments   = '<username> [password]';
		this.description = 'Creates a new user account';
		this.permissions = ['user.create'];
	}

	async run (username, password = null) {
		const Users = this.Commands.Server.Accounts.Users;

		if (Users.exists(username)) {
			return `A User already exists with that name: "${username}"`;
		}

		const user = Users.create({
			name : username
		});

		if (password) {
			user.setPassword(password);
		}
	}
}

module.exports = UserCreate;
