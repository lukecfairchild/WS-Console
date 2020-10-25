
const Command = require('../Command');

class Logout extends Command {
	constructor (options) {
		super(options);

		this.description = 'Logs you out';
	}

	async run () {

	}
}

module.exports = Logout;
