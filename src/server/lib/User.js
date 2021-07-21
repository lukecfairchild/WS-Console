
const Type = require('simpler-types');

const Account = require('./Account');
const Roles   = require('./Roles');

class User extends Account {
	constructor (options) {
		options.type = 'user';
		super(options);

		Type.assert(options, Object);
		Type.assert(options.roles, Array);

		this.roles = new Roles({
			roles : options.roles,
			User  : this
		});
	}
}

module.exports = User;
