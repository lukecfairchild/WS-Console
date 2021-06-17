
const Command = require('../Command');

class Logout extends Command {
	constructor (options) {
		super(options);

		this.description = 'Logs you out';
		this.permissions = ['logout'];
	}

	async run () {
		//console.log(this.Account);
		this.Account.connections.disconnect();
	}
}

module.exports = Logout;
