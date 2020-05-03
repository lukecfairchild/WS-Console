'use strict';

const bcrypt   = require('bcryptjs');
const FileSync = require('lowdb/adapters/FileSync');
const LowDB    = require('lowdb');
const Path     = require('path');
const Utils    = require('./Utils');

class Data {
	constructor () {
		this.database = LowDB(new FileSync(Path.join(__dirname, '../db.json')));

		this.database.defaults({
			users   : [],
			servers : [],
			roles   : {}
		}).write();
	}

	setUserPermissions (username, permissions) {
		this.database.get('users').find({
			username : username
		}).set('permissions', permissions).write();
	}

	setUserRoles (username, roles) {
		this.database.get('users').find({
			username : username
		}).set('roles', roles).write();
	}

	getUsers () {
		return this.database.get('users').map('username').value();
	}

	getServers () {

		return this.database.get('servers').map('name').value();
	}

	getUser (username) {
		return this.database.get('users').find({
			username : username
		}).value();
	}

	getServer (name) {
		return this.database.get('servers').find({
			name : name
		}).value();
	}

	userHasPermission (username, rawPermission) {
		if (username === 'Console') {
			return true;
		}

		const user = this.getUser(username);

		if (user
		&&  user.permissions) {

			if (user.permissions[rawPermission]
			||   user.permissions['*']) {

				return true;
			}

			const splitPermission = rawPermission.split('.');

			let wholePermission = '';

			for (const i in splitPermission) {
				const permissionPart = splitPermission[i];

				if (permissionPart !== '*'
				&&   user.permissions[wholePermission + permissionPart + '.*']) {

					return true;
				}

				wholePermission += permissionPart + '.';
			}
		}

		return false;
	}

	createUser (username) {
		if (!this.getUser(username)) {
			this.database.get('users').push({
				username    : username,
				hash        : null,
				permissions : {},
				roles       : []
			}).write();

			return true;
		}
	}

	createServer (name) {
		if (!this.getServer(name)) {
			let uuid = Utils.getUUID();

			this.database.get('servers').push({
				name     : name,
				password : uuid
			}).write();

			return uuid;
		}
	}

	setUserPassword (username, password) {
		if (this.getUser(username)) {
			let database = this.database;

			bcrypt.genSalt(10, function (error, salt) {

				bcrypt.hash(password, salt, function (error, hash) {

					database.get('users').find({
						username : username
					}).set('hash', hash).write();
				});
			});

			return true;
		}
	}

	setServerPassword (name, password) {
		this.database.get('servers').find({
			name : name
		}).set('password', password).write();
	}

	deleteUser (username) {
		if (this.getUser(username)) {
			this.database.get('users').remove({
				username : username
			}).write();

			return true;
		}
	}

	deleteServer (name) {
		if (this.getServer(name)) {
			this.database.get('servers').remove({
				name : name
			}).write();

			return true;
		}
	}
}

module.exports = new Data();
