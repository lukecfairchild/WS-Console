
class Permissions {
	#permissions;

	constructor (options) {
		this.User = options.User;

		const data = this.User.Accounts.Server.Database.get(this.User.type).find({
			name : this.User.name
		}).value() || {};

		this.#permissions = [
			'help',
			'logout',
			'password'
		].concat(data.permissions || []).concat(options.permissions || []);
	}

	add (permission) {
		if (!this.#permissions.includes(permission)) {
			this.#permissions.push(permission);

			this.User.Users.Server.Database.get(this.User.type).find({
				name : this.User.name
			}).set('permissions', this.#permissions).write();
		}
	}

	getAll () {
		return this.#permissions;
	}

	has (permission) {
		if (this.#permissions.includes(permission)
		||  this.#permissions.includes('*')) {
			return true;
		}

		const splitPermission = permission.split('.');

		let wholePermission = '';

		for (const i in splitPermission) {
			const permissionPart = splitPermission[i];

			if (permissionPart !== '*'
			&&  this.#permissions.includes(wholePermission + permissionPart + '.*')) {
				return true;
			}

			wholePermission += permissionPart + '.';
		}

		return false;
	}

	remove (permission) {
		if (this.#permissions.includes(permission)) {
			this.#permissions.splice(this.#permissions.indexOf(permission), 1);

			this.User.Users.Server.Database.get(this.User.type).find({
				name : this.User.name
			}).set('permissions', this.#permissions).write();
		}
	}
}

module.exports = Permissions;
