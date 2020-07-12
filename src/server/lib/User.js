'use strict';

const Account     = require('./Account');
const Permissions = require('./Permissions');
const Roles       = require('./Roles');

class User extends Account {
	constructor (options) {
		options.type = 'user';
		super(options);

		this.Permissions = new Permissions({
			permissions : options.permissions,
			User        : this
		});

		this.roles = new Roles({
			roles : options.roles,
			User  : this
		});
	}
}

module.exports = User;
