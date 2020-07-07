'use strict';

const Path      = require('path');
const WSConsole = require('../src');

const server = new WSConsole.server({
	webSocketPort : 9000,
	webServerPort : 8081,
	cacheSize     : 300,
	dbPath        : Path.join(__dirname, 'db.json'),
	useStdin      : true
	//ssl           : false,
	//sslKey        : '/path/to/key',
	//sslCert       : '/path/to/cert'
});

server.start();

const help = server.commands.get('help');

server.commands.add('help', {
	handler : async (...args) => {
		console.log('new', args);
		return await help(...args);
	}
});


new WSConsole.task({
	path             : 'ws:localhost:9000',
	name             : 'test',
	password         : 'test',
	useStdin         : false,
	allowRemoteInput : true,
	command          : [
		'node',
		Path.join(__dirname, 'test_process.js')
	]
});
