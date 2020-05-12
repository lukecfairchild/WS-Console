'use strict';

const bcrypt   = require('bcryptjs');
const FileSync = require('lowdb/adapters/FileSync');
const LowDB    = require('lowdb');
const Path     = require('path');

class Database {
	constructor (options) {
		const database = LowDB(new FileSync(Path.resolve(options.dbPath)));

		database.defaults({
			users     : [],
			processes : [],
			roles     : {}
		}).write();

		return database;
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
		return this.database.get('processes').map('name').value();
	}

	getUser (username) {
		return this.database.get('users').find({
			username : username
		}).value();
	}

	getServer (name) {
		return this.database.get('processes').find({
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

	setServerPassword (name, password) {
		this.database.get('processes').find({
			name : name
		}).set('password', password).write();
	}

	deleteServer (name) {
		if (this.getServer(name)) {
			this.database.get('processes').remove({
				name : name
			}).write();

			return true;
		}
	}
}

module.exports = Database;
