
const User = require('./User');

class Users {
	#users = {};

	constructor (options) {
		this.parent = options.parent;
	}

	create (name) {
		if (this.exists(name)) {
			return this.get(name);
		}

		this.parent.database.get('user').push({
			name        : name,
			hash        : null,
			permissions : {},
			roles       : []
		}).write();

		const user = new User({
			database : this.parent.database,
			name     : name
		});

		this.#users[name] = user;

		return user;
	}

	delete (name) {
		if (this.exists(name)) {
			this.#users[name].disconnect();

			delete this.#users[name];
			this.parent.database.get('user').remove({
				name : name
			}).write();
		}
	}

	get (name) {
		if (this.#users[name]) {
			return this.#users[name];
		}

		if (!this.exists(name)) {
			return;
		}

		const user = new User({
			database : this.parent.database,
			name     : name
		});

		this.#users[name] = user;

		return user;
	}

	getAll () {
		return this.#users;
	}

	exists (name) {
		if (this.#users[name]) {
			return true;
		}

		const data = this.parent.database.get('user').find({
			name : name
		}).value();

		return Boolean(data);
	}
}

module.exports = Users;
