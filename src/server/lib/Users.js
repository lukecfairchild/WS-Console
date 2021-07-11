
class Users {
	constructor (options) {
		this.Accounts = options.Accounts;
	}

	create (name) {
		return this.Accounts.create(name, 'user');
	}

	delete (name) {
		return this.Accounts.delete(name, 'user');
	}

	get (name) {
		return this.Accounts.get(name, 'user');
	}

	exists (name) {
		return this.Accounts.exists(name, 'user');
	}

	list () {
		return this.Accounts.list('user');
	}
}

module.exports = Users;
