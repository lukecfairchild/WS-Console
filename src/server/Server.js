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

		this.Commands        = new Commands({Server : this});
		this.Database        = new Database({Server : this});
		this.Accounts        = new Accounts({Server : this});
		this.WebServer       = new WebServer({Server : this});
		this.WebSocketServer = new WebSocketServer({Server : this});

		if (this.settings.useStdin) {
			const Console = this.Accounts.get('Console', 'user');

			process.stdin.resume();
			process.stdin.setEncoding('utf8');
			process.stdin.on('data', async (command) => {
				console.log(await Console.Commands.run(command));
			});
		}
	}

	start () {
		this.WebServer.start();
		this.WebSocketServer.start();
		this.trigger('start');
	}

	stop () {
		this.WebServer.stop();
		this.WebSocketServer.stop();
		this.trigger('stop');
	}
}

module.exports = Server;
