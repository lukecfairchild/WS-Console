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

server.start();
client.start();

const task = new WSConsole.task({
	path             : 'ws:localhost:9000',
	name             : 'test',
	password         : 'pass',
	useStdin         : true,
	allowRemoteInput : true,
	command          : [
		'node',
		Path.join(__dirname, 'test_process.js')
	]
});


process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', async (command) => {
	const split         = command.replace(/\n/, '').split(' ');
	const targetCommand = split.slice(1, split.length);

	switch (split[0]) {
		case 'server' :
			console.log(await Console.Commands.run(targetCommand.join(' ')));
			break;

		case 'client' :
			client.send({
				action : 'command',
				target : 'console',
				data   : targetCommand.join(' ')
			});
			break;
		case 'task' :
			task.process.stdin.write(targetCommand.join(' ') + '\n');
	}
});