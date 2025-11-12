
const Type = require('simpler-types');

const User = require('./User');

class Roles {
	#roles;

	constructor (options) {
		Type.assert(options, Object);
		Type.assert(options.user, User);

		this.user = options.user;

		const data = this.user.server.database.get(this.user.type).find({
			name : this.user.name
		}).value() || {};

		this.#roles = (data.roles || []).concat(options.roles || []);
	}

	add (role) {
		Type.assert(role, String);

		if (!this.#roles.includes(role)) {
			this.#roles.push(role);

			this.user.server.database.get(this.user.type).find({
				name : this.user.name
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

			this.user.server.database.get(this.user.type).find({
				name : this.user.name
			}).set('roles', this.#roles).write();
		}
	}
}

module.exports = Roles;
