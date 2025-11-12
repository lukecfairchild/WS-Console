
const Command = require('../Command');

class Password extends Command {
	constructor (options) {
		super(options);

		this.arguments   = '<password>';
		this.description = 'Allows you to change your current password';
		this.permissions = ['password'];
	}

	async run (...password) {
		this.account.setPassword(password.join(' '));

		return 'Password set'
	}
}

module.exports = Password;
