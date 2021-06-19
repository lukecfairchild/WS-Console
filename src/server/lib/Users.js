
const User = require('./User');

class Users {
	constructor (options) {
		this.Accounts = options.Accounts;
	}

	create (user) {
		user.type = 'user';

		return this.Accounts.create(user);;
	}

	delete (name) {

	}

	get (name) {

	}

	getAll () {

	}

	exists (name) {

	}
}

module.exports = Users;
