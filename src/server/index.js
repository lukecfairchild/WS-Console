'use strict';

const Database        = require('./lib/Database');
const WebServer       = require('./lib/WebServer');
const WebSocketServer = require('./lib/WebSocketServer');

class  WSServer {
	#database;
	#options;
	#webServer;
	#WebSocketServer;

	constructor (options) {
		this.#options = options;

		this.#database        = new Database(this.#options);
		this.#webServer       = new WebServer(this.#options);
		this.#WebSocketServer = new WebSocketServer(this.#options);
	}

	start () {
		this.#webServer.start();
		this.#WebSocketServer.start();
	}

	stop () {
		this.#webServer.stop();
		this.#WebSocketServer.stop();
	}

	getUser () {

	}
	getUsers () {

	}
	getProcesses () {

	}
	getProcesse () {

	}
}

module.exports = WSServer;
