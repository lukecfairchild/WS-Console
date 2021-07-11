'use strict';

const Account = require('./Account');
const Roles   = require('./Roles');

class User extends Account {
	constructor (options) {
		options.type = 'user';
		super(options);

		this.roles = new Roles({
			roles : options.roles,
			User  : this
		});
	}
}

module.exports = User;
