'use strict';

const FileSync = require('lowdb/adapters/FileSync');
const LowDB    = require('lowdb');
const Path     = require('path');

class Database {
	constructor (options) {
		this.parent = options.parent;

		const database = LowDB(new FileSync(Path.resolve(this.parent.settings.dbPath)));

		database.defaults({
			user    : [],
			process : [],
			role    : {}
		}).write();

		return database;
	}
}

module.exports = Database;
