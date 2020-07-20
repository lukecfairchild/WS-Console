'use strict';

const FileSync = require('lowdb/adapters/FileSync');
const LowDB    = require('lowdb');
const Path     = require('path');

class Database {
	constructor (options) {
		this.Server = options.Server;

		const database = LowDB(new FileSync(Path.resolve(this.Server.settings.dbPath)));

		database.defaults({
			accounts : [],
			role     : {}
		}).write();

		return database;
	}
}

module.exports = Database;
