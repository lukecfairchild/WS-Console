
class Roles {
	#roles;

	constructor (options) {
		this.User = options.User;

		const data = this.Users.Server.database.get(this.User.type).find({
			name : this.User.name
		}).value() || {};

		this.#roles = (data.roles || []).concat(options.roles || []);
	}

	add (role) {
		if (!this.#roles.includes(role)) {
			this.#roles.push(role);

			this.User.Users.Server.database.get(this.User.type).find({
				name : this.User.name
			}).set('roles', this.#roles).write();
		}
	}

	getAll () {
		return this.#roles;
	}

	remove (role) {
		if (this.#roles.includes(role)) {
			this.#roles.splice(this.#roles.indexOf(role), 1);

			this.User.Users.Server.database.get(this.User.type).find({
				name : this.User.name
			}).set('roles', this.#roles).write();
		}
	}
}

module.exports = Roles;
