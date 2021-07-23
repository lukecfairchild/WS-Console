
const Command = require('../Command');

class Logout extends Command {
	constructor (options) {
		super(options);

		this.arguments   = '[connectionId]';
		this.description = 'Logs out your current connection or the provided connection.';
		this.permissions = ['logout'];
	}

	async run (connectionId) {
		if (connectionId) {
			if (this.Account.Connections.exists(connectionId)) {
				return 'Invalid connectionId';
			}

			this.Account.Connections.get(connectionId).disconnect();

		} else {
			this.Connection.logout();
		}
	}
}

module.exports = Logout;
