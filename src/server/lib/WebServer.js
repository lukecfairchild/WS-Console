'use strict';

const FileSystem = require('fs');
const HTTP       = require('http');
const HTTPS      = require('https');
const Path       = require('path');
const Url        = require('url');

class WebServer {
	constructor (options) {
		this.options = options;

		if (this.options.ssl) {
			this.webServer = HTTPS.createServer({
				cert : FileSystem.readFileSync(this.options.sslCert),
				key  : FileSystem.readFileSync(this.options.sslKey)
			});

		} else {
			this.webServer = HTTP.createServer();
		}

		this.webServer.on('request', (request, response) => {
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
				}
			};

			let file = files[filename];

			if (!file) {
				file = files[''];
			}

			const responseBody = FileSystem.readFileSync(file.path, {
				encoding : 'utf8'
			});

			response.writeHead(200, {
				'Content-Type' : file.type,
				'Set-Cookie'   : `port=${this.options.webSocketPort}`
			});

			response.end(responseBody);
		});

		this.webServer.on('clientError', (error, socket) => {
			socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
		});
	}

	start () {
		this.webServer.listen(this.options.webServerPort, (error) => {
			if (error) {
				return console.error(error);
			}

			console.log('WebServer listening on port: ' + this.options.webServerPort);
		});
	}

	stop () {
		this.webServer.close();
	}
}

module.exports = WebServer;
