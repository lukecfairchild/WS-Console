
const Command = require('../Command');

class UserPermissionRemove extends Command {
	constructor (options) {
		super(options);

		this.arguments   = '<username> <permission>';
		this.description = 'Removes the given permission for the specified user';
		this.permissions = ['user.permission.remove'];
	}

	async run (username, permission) {
		const Users = this.Server.Accounts.Users;

		if (!this.Account.hasPermission(permission)) {
			return 'You cannot remove that permission';
		}

		if (!Users.exists(username)) {
			return 'User does not exist';
		}

		Users.get(username).removePermission(permission);
	}
}

module.exports = UserPermissionRemove;
