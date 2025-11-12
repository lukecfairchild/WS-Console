
const Command = require('../Command');

class UserLogout extends Command {
	constructor (options) {
		super(options);

		this.arguments   = '<username> [connectionId]';
		this.description = 'Logs out the specified user entirely or given connection.';
		this.permissions = ['user.logout'];
	}

	async run (username, connectionId) {
		const users = this.server.accounts.users;

		if (!users.exists(username)) {
			return 'User does not exist';
		}

		if (connectionId) {
			if (!Users.get(username).connections.exists(connectionId)) {
				return 'Invalid connectionId';
			}

			users.get(username).connections.get(connectionId).disconnect();

		} else {
			users.get(username).connections.disconnect();
		}
	}
}

module.exports = UserLogout;
