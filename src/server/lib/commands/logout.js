
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
			if (this.account.connections.exists(connectionId)) {
				return 'Invalid connectionId';
			}

			this.account.connections.get(connectionId).disconnect();

		} else {
			this.connection.logout();
		}
	}
}

module.exports = Logout;
