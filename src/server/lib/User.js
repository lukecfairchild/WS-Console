'use strict';

const Account = require('./Account');

class User extends Account {
	constructor (options) {
		options.type = 'user';
		super(options);

		const data = this.database.get(this.type).find({
			name : this.name
		}).value();

		this.permissions = [
			'help',
			'logout',
			'password'
		].concat(data.permissions);
		this.roles = data.roles;
	}

	addPermission (permission) {
		if (!this.permissions.includes(permission)) {
			this.permissions.push(permission);

			this.database.get(this.type).find({
				name : this.name
			}).set('permissions', this.permissions).write();
		}
	}

	addRole (role) {
		if (!this.roles.includes(role)) {
			this.roles.push(role);

			this.database.get(this.type).find({
				name : this.name
			}).set('roles', this.roles).write();
		}
	}

	getPermissions () {
		return this.permissions;
	}

	getRoles () {
		return this.roles;
	}

	hasPermission (permission) {
		if (this.permissions.includes(permission)
		||  this.permissions.includes('*')) {
			return true;
		}

		const splitPermission = permission.split('.');

		let wholePermission = '';

		for (const i in splitPermission) {
			const permissionPart = splitPermission[i];

			if (permissionPart !== '*'
			&&  this.permissions.includes(wholePermission + permissionPart + '.*')) {
				return true;
			}

			wholePermission += permissionPart + '.';
		}

		return false;
	}

	removePermission (permission) {
		if (this.permissions.includes(permission)) {
			this.permissions.splice(this.permissions.indexOf(permission), 1);


			this.database.get(this.type).find({
				name : this.name
			}).set('permissions', this.permissions).write();
		}
	}

	removeRole (role) {
		if (this.roles.includes(role)) {
			this.roles.splice(this.roles.indexOf(role), 1);

			this.database.get(this.type).find({
				name : this.name
			}).set('roles', this.roles).write();
		}
	}
}

module.exports = User;
