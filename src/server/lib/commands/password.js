
const Command = require('../Command');

class Password extends Command {
	constructor (options) {
		super(options);

		this.arguments   = '<password>';
		this.description = 'Allows you to change your current password';
		this.permissions = ['password'];
	}

	async run (...password) {
		password = password.join(' ');
		console.log(password);
	}
}

module.exports = Password;
