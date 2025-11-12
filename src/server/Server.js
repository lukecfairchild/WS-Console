'use strict';

const Type = require('simpler-types');

const Accounts        = require('./lib/Accounts');
const Commands        = require('./lib/Commands');
const EventSystem     = require('../lib/EventSystem');
const Database        = require('./lib/Database');
const WebServer       = require('./lib/WebServer');
const WebSocketServer = require('./lib/webSocketServer');

class Server extends EventSystem {
	constructor (settings) {
		super();

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

		this.commands        = new Commands({ server : this });
		this.database        = new Database({ server : this });
		this.accounts        = new Accounts({ server : this });
		this.webServer       = new WebServer({ server : this });
		this.webSocketServer = new WebSocketServer({ server : this });

		if (this.settings.useStdin) {
			const Console = this.accounts.get('Console', 'user');

			process.stdin.resume();
			process.stdin.setEncoding('utf8');
			process.stdin.on('data', async (command) => {
				console.log(await Console.commands.run(command));
			});
		}
	}

	start () {
		this.webServer.start();
		this.webSocketServer.start();
		this.trigger('start');
	}

	stop () {
		this.webServer.stop();
		this.webSocketServer.stop();
		this.trigger('stop');
	}
}

module.exports = Server;
