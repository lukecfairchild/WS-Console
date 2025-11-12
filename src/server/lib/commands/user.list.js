
const Command = require('../Command');

class UserList extends Command {
	constructor (options) {
		super(options);

		this.description = 'Lists all user accounts';
		this.permissions = ['user.list'];
	}

	async run () {
		const users = this.server.accounts.users.list();

		return users.join(', ');
	}
}

module.exports = UserList;
