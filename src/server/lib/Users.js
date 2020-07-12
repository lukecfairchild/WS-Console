
const User = require('./User');

class Users {
	#users = {};

	constructor (options) {
		this.Server = options.Server;

		this.#users.Console = new User({
			name        : 'Console',
			parent      : this,
			permissions : ['*']
		});
	}

	create (name) {
		if (this.exists(name)) {
			return this.get(name);
		}

		this.Server.database.get('user').push({
			name        : name,
			hash        : null,
			permissions : {},
			roles       : []
		}).write();

		const user = new User({
			name   : name,
			parent : this
		});

		this.#users[name] = user;

		return user;
	}

	delete (name) {
		if (this.exists(name)) {
			this.#users[name].disconnect();

			delete this.#users[name];
			this.Server.database.get('user').remove({
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
			Users : this,
			name  : name
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

		const data = this.Server.database.get('user').find({
			name : name
		}).value();

		return Boolean(data);
	}
}

module.exports = Users;
