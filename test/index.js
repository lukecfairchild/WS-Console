'use strict';

const Path      = require('path');
const WSConsole = require('../src');

const server = new WSConsole.server({
	webSocketPort : 9000,
	webServerPort : 8081,
	cacheSize     : 300,
	dbPath        : Path.join(__dirname, 'db.json'),
	useStdin      : false
	//ssl           : false,
	//sslKey        : '/path/to/key',
	//sslCert       : '/path/to/cert'
});
const Console = server.Accounts.get('Console', 'user');

const client = new WSConsole.client({
	path     : 'ws:localhost:9000',
	name     : 'testUser',
	password : 'pass',
	useStdin : false
});

process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', async (command) => {
	const split = command.replace(/\n/, '').split(' ');
	const targetCommand = split.slice(1, split.length).join(' ');

	switch (split[0]) {
		case 'server' :
			Console.Commands.run(targetCommand);
		case 'client' :
			console.log('not implemented');
	}
});

server.start();
client.start();

new WSConsole.task({
	path             : 'ws:localhost:9000',
	name             : 'test',
	password         : 'pass',
	useStdin         : false,
	allowRemoteInput : true,
	command          : [
		'node',
		Path.join(__dirname, 'test_process.js')
	]
});
