
const Command = require('../Command');

class UserPermissionAdd extends Command {
	constructor (options) {
		super(options);

		this.arguments   = '<username> <permission>';
		this.description = 'Gives specified user the given permission';
		this.permissions = ['user.permission.add'];
	}

	async run (username, permission) {
		const users = this.server.accounts.users;

		if (!this.account.hasPermission(permission.replace(/^-/, '') + '.grant')) {
			return 'You cannot give that permission';
		}

		if (!users.exists(username)) {
			return 'User does not exist';
		}

		users.get(username).addPermission(permission);
	}
}

module.exports = UserPermissionAdd;
