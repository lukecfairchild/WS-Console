'use strict';

const Commands        = require('./lib/Commands');
const Database        = require('./lib/Database');
const Users           = require('./lib/Users');
const Task            = require('./lib/Task');
const Tasks           = require('./lib/Tasks');
const WebServer       = require('./lib/WebServer');
const WebSocketServer = require('./lib/WebSocketServer');

class  Server {
	#tasks;

	constructor (settings) {
		this.settings = settings;

		this.commands        = new Commands();
		this.database        = new Database(this);
		this.users           = new Users(this.database);
		this.tasks           = new Tasks(this.database);
		this.webServer       = new WebServer(this.settings);
		this.WebSocketServer = new WebSocketServer(this.settings);

		this.WebSocketServer.on('connection', (connection) => {
			connection.on('login', (event) => {
				let account;

				switch (event.type) {
					case 'user' : account = this.users.get(event.name); break;
					case 'task' : account = this.tasks.get(event.name); break;
					default : {
						return connection.disconnect();
					}
				}

				if (!account
				||  !account.authenticate(event.password)) {
					return connection.disconnect();
				}

				account.addConnection(connection);
			});
		});

		if (this.settings.useStdin) {
			this.#startCmdlineListener();
		}
	}

	#startCmdlineListener = () => {
		process.stdin.resume();
		process.stdin.setEncoding('utf8');
		process.stdin.on('data', async (data) => {
			const response = await this.commands.get(data).handler();

			if (response) {
				console.log(response);
			}
		});
	}

	start () {
		this.webServer.start();
		this.WebSocketServer.start();
	}

	stop () {
		this.webServer.stop();
		this.WebSocketServer.stop();
	}
}

module.exports = Server;
