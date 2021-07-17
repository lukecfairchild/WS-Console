
const Command = require('../Command');

class UserPermissionList extends Command {
	constructor (options) {
		super(options);

		this.arguments   = '<username>';
		this.description = 'Lists all permissions the specified user has';
		this.permissions = ['user.permission.list'];
	}

	async run (username) {
		const Users = this.Server.Accounts.Users;

		if (!Users.exists(username)) {
			return 'User does not exist';
		}

		return Users.get(username).getPermissions().join(', ');
	}
}

module.exports = UserPermissionList;
