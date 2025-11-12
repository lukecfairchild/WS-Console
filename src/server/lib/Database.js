
const FileSync = require('lowdb/adapters/FileSync');
const LowDB    = require('lowdb');
const Path     = require('path');
const Type     = require('simpler-types');

const Server = require('../Server');

class Database {
	constructor (options) {
		Type.assert(options, Object);
		Type.assert(options.server, Server);
		this.server = options.server;

		const database = LowDB(new FileSync(Path.resolve(this.server.settings.dbPath)));

		database.defaults({
			accounts : [],
			role     : {}
		}).write();

		return database;
	}
}

module.exports = Database;
