
const User = require('./User');

class Users {
	#database;
	#users = {};

	constructor (database) {
		this.#database = database;
	}

	create (name) {
		if (this.exists(name)) {
			return this.get(name);
		}

		this.#database.get('user').push({
			name        : name,
			hash        : null,
			permissions : {},
			roles       : []
		}).write();

		const user = new User({
			database : this.#database,
			name     : name
		});

		this.#users[name] = user;

		return user;
	}

	delete (name) {

	}

	get (name) {
		if (this.#users[name]) {
			return this.#users[name];
		}

		if (!this.exists(name)) {
			return;
		}

		const user = new User({
			database : this.#database,
			name     : name
		});

		this.#users[name] = user;

		return user;
	}

	getAll () {
		return this.#users;
	}

	exists (name) {
		if (this.#tasks[name]) {
			return true;
		}

		const data = this.#database.get('user').find({
			name : name
		}).value();

		return Boolean(data);
	}
}

module.exports = Users;
