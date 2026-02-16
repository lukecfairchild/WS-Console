'use strict';

const Connection  = require('./Connection');
const EventSystem = require('../../lib/EventSystem');
const FileSystem  = require('fs');
const HTTP        = require('http');
const HTTPS       = require('https');
const Type        = require('simpler-types');
const WebSocket   = require('ws');

const Server = require('..');

class WebSocketServer extends EventSystem {
	#webServer;
	#webSocketServer;

	constructor (options) {
		super();
		Type.assert(options, Object);
		Type.assert(options.server, Server);

		this.server = options.server;

		if (this.server.settings.ssl) {
			this.#webServer = HTTPS.createServer({
				cert : FileSystem.readFileSync(this.server.settings.sslCert),
				key  : FileSystem.readFileSync(this.server.settings.sslKey)
			});

		} else {
			this.#webServer = HTTP.createServer();
		}

		this.#webSocketServer = new WebSocket.Server({
			server : this.#webServer
		});

		this.#webSocketServer.on('listening', () => {
			this.trigger('listening');

			console.log('WebSocketServer listening on port: ' + this.server.settings.webSocketPort);
		});

		this.#webSocketServer.on('connection', (webSocket, request) => {
			const connection = new Connection({
				request   : request,
				server    : this.server,
				webSocket : webSocket
			});
			this.trigger('connection', connection);

			webSocket.on('close', () => {
				this.trigger('disconnect', connection);
			});
		});
	}

	start () {
		this.#webServer.listen(this.server.settings.webSocketPort);
		this.trigger('start', {
			port : this.server.settings.webSocketPort
		});
	}

	stop () {
		this.#webServer.close();
		this.trigger('stop');
	}
}

module.exports = WebSocketServer;
