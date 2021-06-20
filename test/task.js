'use strict';

const Path      = require('path');
const WSConsole = require('../src');

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
