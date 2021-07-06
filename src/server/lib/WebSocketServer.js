'use strict';

const Connection  = require('./Connection');
const EventSystem = require('../../lib/EventSystem');
const FileSystem  = require('fs');
const HTTP        = require('http');
const HTTPS       = require('https');
const WebSocket   = require('ws');

class WebSocketServer {
	#webServer;
	#webSocketServer;

	constructor (options) {
		this.Server = options.Server;

		new EventSystem(this);

		if (this.Server.settings.ssl) {
			this.#webServer = HTTPS.createServer({
				cert : FileSystem.readFileSync(this.Server.settings.sslCert),
				key  : FileSystem.readFileSync(this.Server.settings.sslKey)
			});

		} else {
			this.#webServer = HTTP.createServer();
		}

		this.#webSocketServer = new WebSocket.Server({
			server : this.#webServer
		});

		this.#webSocketServer.on('listening', () => {
			this.trigger('listening');

			console.log('WebSocketServer listening on port: ' + this.Server.settings.webSocketPort);
		});

		this.#webSocketServer.on('connection', (webSocket) => {
			const connection = new Connection({
				Server    : this.Server,
				webSocket : webSocket
			});
			this.trigger('connection', connection);

			webSocket.on('close', () => {
				this.trigger('disconnect', connection);
			});
		});
	}

	start () {
		this.#webServer.listen(this.Server.settings.webSocketPort);
		this.trigger('start', {
			port : this.Server.settings.webSocketPort
		});
	}

	stop () {
		this.#webServer.close();
		this.trigger('stop');
	}
}

module.exports = WebSocketServer;
