'use strict';

const FileSync = require('lowdb/adapters/FileSync');
const LowDB    = require('lowdb');
const Path     = require('path');

class Database {
	constructor (server) {
		const database = LowDB(new FileSync(Path.resolve(server.settings.dbPath)));

		database.defaults({
			user    : [],
			process : [],
			role    : {}
		}).write();

		return database;
	}
}

module.exports = Database;
