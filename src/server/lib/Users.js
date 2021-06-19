
class Users {
	#type = 'user';

	constructor (options) {
		this.Accounts = options.Accounts;
	}

	create (name) {
		return this.Accounts.create(name, this.#type);
	}

	delete (name) {
		return this.Accounts.delete(name, this.#type);
	}

	get (name) {
		return this.Accounts.get(name, this.#type);
	}

	getAll () {
		return this.Accounts.getAll(this.#type);
	}

	exists (name) {
		return this.Accounts.exists(name, this.#type);
	}
}

module.exports = Users;
