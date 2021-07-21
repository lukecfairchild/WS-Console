
const FileSync = require('lowdb/adapters/FileSync');
const LowDB    = require('lowdb');
const Path     = require('path');
const Type     = require('simpler-types');

const Server = require('../Server');

class Database {
	constructor (options) {
		Type.assert(options, Object);
		Type.assert(options.Server, Server);
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
