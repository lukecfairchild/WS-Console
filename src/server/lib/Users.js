
const User = require('./User');

class Users {
	#users = {};

	constructor (options) {
		this.Server = options.Server;

		this.#users.Console = new User({
			name        : 'Console',
			Accounts    : this,
			permissions : ['*']
		});
	}

	create (name) {
		if (this.exists(name)) {
			return this.get(name);
		}

		this.Server.Database.get('user').push({
			name        : name,
			hash        : null,
			permissions : {},
			roles       : []
		}).write();

		const user = new User({
			name     : name,
			Accounts : this
		});

		this.#users[name] = user;

		return user;
	}

	delete (name) {
		if (this.exists(name)) {
			this.#users[name].disconnect();

			delete this.#users[name];
			this.Server.Database.get('user').remove({
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
			Accounts : this,
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

		const data = this.Server.Database.get('user').find({
			name : name
		}).value();

		return Boolean(data);
	}
}

module.exports = Users;
