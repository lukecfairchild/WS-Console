'use strict';

const Path      = require('path');
const WSConsole = require('../src');

new WSConsole.server({
	webSocketPort : 9000,
	webServerPort : 8081,
	cacheSize     : 300,
	ssl           : false,
	sslKey        : '/path/to/key',
	sslCert       : '/path/to/cert'
});

new WSConsole.process({
	path          : 'ws:localhost:9000',
	name          : 'test',
	password      : 'test',
	allowCommands : true,
	command       : [
		'node',
		Path.join(__dirname, 'test_process.js')
	]
});
