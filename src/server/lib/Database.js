'use strict';

const FileSync = require('lowdb/adapters/FileSync');
const LowDB    = require('lowdb');
const Path     = require('path');

class Database {
	constructor (options) {
		const database = LowDB(new FileSync(Path.resolve(options.dbPath)));

		database.defaults({
			user    : [],
			process : [],
			role    : {}
		}).write();

		return database;
	}
}

module.exports = Database;
