
const Type = require('simpler-types');

const User = require('./User');

class Roles {
	#roles;

	constructor (options) {
		Type.assert(options, Object);
		Type.assert(options.User, User);

		this.User = options.User;

		const data = this.User.Server.Database.get(this.User.type).find({
			name : this.User.name
		}).value() || {};

		this.#roles = (data.roles || []).concat(options.roles || []);
	}

	add (role) {
		Type.assert(role, String);

		if (!this.#roles.includes(role)) {
			this.#roles.push(role);

			this.User.Server.Database.get(this.User.type).find({
				name : this.User.name
			}).set('roles', this.#roles).write();
		}
	}

	getAll () {
		return this.#roles;
	}

	remove (role) {
		Type.assert(role, String);

		if (this.#roles.includes(role)) {
			this.#roles.splice(this.#roles.indexOf(role), 1);

			this.User.Server.Database.get(this.User.type).find({
				name : this.User.name
			}).set('roles', this.#roles).write();
		}
	}
}

module.exports = Roles;
