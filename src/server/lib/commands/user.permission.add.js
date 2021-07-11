
const Command = require('../Command');

class UserPermissionAdd extends Command {
	constructor (options) {
		super(options);

		this.arguments   = '<username> <permission>';
		this.description = 'Gives specified user the given permission';
		this.permissions = ['user.permission.add'];
	}

	async run (username, permission) {
		const Users = this.Commands.Server.Accounts.Users;

		console.log(this.Account);
		if (!this.Account.hasPermissions(permission)) {
			return 'You cannot give that permission';
		}

		if (!Users.exists(username)) {
			return 'User does not exist';
		}

		Users.get(username).addPermissions(permission);
	}
}

module.exports = UserPermissionAdd;
