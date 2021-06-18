'use strict';

const Type = require('simple-type-assert');

const Accounts        = require('./lib/Accounts');
const Commands        = require('./lib/Commands');
const Database        = require('./lib/Database');
const WebServer       = require('./lib/WebServer');
const WebSocketServer = require('./lib/webSocketServer');

class  Server {
	constructor (settings) {
		// Required settings
		Type.assert(settings, {
			cacheSize     : Number,
			dbPath        : String,
			webServerPort : Number,
			webSocketPort : Number
		});

		// Optional settings
		settings.useStdin = settings.useStdin || false;
		settings.ssl      = settings.ssl      || false;
		settings.sslKey   = settings.sslKey   || '';
		settings.sslCert  = settings.sslCert  || '';
		Type.assert(settings, {
			useStdin : Boolean,
			ssl      : Boolean,
			sslKey   : String,
			sslCert  : String
		});

		this.settings = settings;

		this.Commands        = new Commands({Server : this});
		this.Database        = new Database({Server : this});
		this.Accounts        = new Accounts({Server : this});
		this.WebServer       = new WebServer({Server : this});
		this.WebSocketServer = new WebSocketServer({Server : this});

		this.WebSocketServer.on('connection', (connection) => {
			connection.on('login', (event) => {
				const account = this.Accounts.get(event.name);

				if (!account
				||  !account.authenticate(event.password)) {
					return connection.disconnect();
				}

				account.addConnection(connection);
			});
		});

		if (this.settings.useStdin) {
			this.#startCmdlineListener();
		}
	}

	#startCmdlineListener = () => {
		process.stdin.resume();
		process.stdin.setEncoding('utf8');
		process.stdin.on('data', async (command) => {
			this.Accounts.get('Console').Commands.run(command);
		});
	}

	start () {
		this.WebServer.start();
		this.WebSocketServer.start();
	}

	stop () {
		this.WebServer.stop();
		this.WebSocketServer.stop();
	}
}

module.exports = Server;
