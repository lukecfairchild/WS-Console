
const Command = require('../Command');

class UserCreate extends Command {
	constructor (options) {
		super(options);

		this.arguments   = '<username> [password]';
		this.description = 'Creates a new user account';
		this.permissions = [];
	}

	async run (name, password = null) {
		const user = this.Commands.Server.Accounts.create({
			type : 'user',
			name : name
		});

		if (password) {
			user.setPassword(password);
		}
	}
}

module.exports = UserCreate;
