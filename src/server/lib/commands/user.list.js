
const Command = require('../Command');

class UserList extends Command {
	constructor (options) {
		super(options);

		this.description = 'Lists all user accounts';
		this.permissions = ['user.list'];
	}

	async run () {
		const users = this.Server.Accounts.Users.list();

		return users.join(', ');
	}
}

module.exports = UserList;
