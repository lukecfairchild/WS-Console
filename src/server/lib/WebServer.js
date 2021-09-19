'use strict';

const FileSystem = require('fs');
const HTTP       = require('http');
const HTTPS      = require('https');
const Path       = require('path');
const Type       = require('simpler-types');
const Url        = require('url');

const EventSystem = require('../../lib/EventSystem');
const Server      = require('../Server');

class WebServer extends EventSystem {
	constructor (options) {
		super();
		Type.assert(options, Object);
		Type.assert(options.Server, Server);

		this.Server = options.Server;

		if (this.Server.settings.ssl) {
			this.webServer = HTTPS.createServer({
				cert : FileSystem.readFileSync(this.Server.settings.sslCert),
				key  : FileSystem.readFileSync(this.Server.settings.sslKey)
			});

		} else {
			this.webServer = HTTP.createServer();
		}

		this.webServer.on('request', (request, response) => {
			this.trigger('request', request, response);
			const filename = Path.basename(Url.parse(request.url).pathname);
			const files    = {
				'' : {
					type : 'text/html',
					path : Path.join(__dirname, '../html/index.html')
				},
				'index.css' : {
					type : 'text/css',
					path : Path.join(__dirname, '../html/index.css')
				},
				'index.js' : {
					type : 'application/javascript',
					path : Path.join(__dirname, '../html/index.js')
				},
				'require.js' : {
					type : 'application/javascript',
					path : Path.join(__dirname, '../html/require.js')
				},
				'ansi_up.js' : {
					type : 'application/javascript',
					path : Path.join(__dirname, '../html/ansi_up.js')
				},
				'jquery-ui.css' : {
					type : 'text/css',
					path : Path.join(__dirname, '../html/jquery-ui.css')
				},
				'jquery-ui.js' : {
					type : 'application/javascript',
					path : Path.join(__dirname, '../html/jquery-ui.js')
				},
				'jquery.js' : {
					type : 'application/javascript',
					path : Path.join(__dirname, '../html/jquery.js')
				}
			};

			let file = files[filename];

			if (!file) {
				response.end();
				return;
			}

			const responseBody = FileSystem.readFileSync(file.path, {
				encoding : 'utf8'
			});

			response.writeHead(200, {
				'Content-Type' : file.type,
				'Set-Cookie'   : `port=${this.Server.settings.webSocketPort}`
			});

			response.end(responseBody);
		});

		this.webServer.on('clientError', (error, socket) => {
			socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
		});
	}

	start () {
		this.webServer.listen(this.Server.settings.webServerPort, (error) => {
			if (error) {
				return console.error(error);
			}

			console.log('WebServer listening on port: ' + this.Server.settings.webServerPort);
			this.trigger('start', {
				port : this.Server.settings.webServerPort
			});
		});
	}

	stop () {
		this.webServer.close();
		this.trigger('stop');
	}
}

module.exports = WebServer;
