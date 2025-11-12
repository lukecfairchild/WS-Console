
const Command = require('../Command');

class UserPermissionRemove extends Command {
	constructor (options) {
		super(options);

		this.arguments   = '<username> <permission>';
		this.description = 'Removes the given permission for the specified user';
		this.permissions = ['user.permission.remove'];
	}

	async run (username, permission) {
		const users = this.server.accounts.users;

		if (!this.account.hasPermission(permission.replace(/^-/, '') + '.grant')) {
			return 'You cannot remove that permission';
		}

		if (!users.exists(username)) {
			return 'User does not exist';
		}

		users.get(username).removePermission(permission);
	}
}

module.exports = UserPermissionRemove;
