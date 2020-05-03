'use strict';

const WebServer       = require('./lib/WebServer');
const WebSocketServer = require('./lib/WebSocketServer');

class  WSConsoleServer {
	constructor (options) {
		this.options = options;

		this.webServer       = new WebServer(this.options);
		this.WebSocketServer = new WebSocketServer(this.options);
	}
}

module.exports = WSConsoleServer;
