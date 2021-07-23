
const Command = require('../Command');

class UserLogout extends Command {
	constructor (options) {
		super(options);

		this.arguments   = '<username> [connectionId]';
		this.description = 'Logs out the specified user entirely or given connection.';
		this.permissions = ['user.logout'];
	}

	async run (username, connectionId) {
		const Users = this.Server.Accounts.Users;

		if (!Users.exists(username)) {
			return 'User does not exist';
		}

		if (connectionId) {
			if (!Users.get(username).Connections.exists(connectionId)) {
				return 'Invalid connectionId';
			}

			Users.get(username).Connections.get(connectionId).disconnect();

		} else {
			Users.get(username).Connections.disconnect();
		}
	}
}

module.exports = UserLogout;
