
const Command = require('../Command');

class UserPermissionList extends Command {
	constructor (options) {
		super(options);

		this.arguments   = '<username>';
		this.description = 'Lists all permissions the specified user has';
		this.permissions = ['user.permission.list'];
	}

	async run (username) {
		const users = this.server.accounts.users;

		if (!users.exists(username)) {
			return 'User does not exist';
		}

		return users.get(username).getPermissions().join(', ');
	}
}

module.exports = UserPermissionList;
