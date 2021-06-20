
const Command = require('../Command');

class Logout extends Command {
	constructor (options) {
		super(options);

		this.description = 'Logs you out';
		this.permissions = ['logout'];
	}

	async run () {
		this.Connection.logout();
		//this.Account.Connections.disconnect();
	}
}

module.exports = Logout;
