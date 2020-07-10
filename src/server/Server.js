'use strict';

const Commands        = require('./lib/Commands');
const Database        = require('./lib/Database');
const Users           = require('./lib/Users');
const Tasks           = require('./lib/Tasks');
const WebServer       = require('./lib/WebServer');
const WebSocketServer = require('./lib/WebSocketServer');

class  Server {
	constructor (settings) {
		this.settings = settings;

		this.commands        = new Commands();
		this.database        = new Database({parent : this});
		this.tasks           = new Tasks({parent : this});
		this.users           = new Users({parent : this});
		this.webServer       = new WebServer({parent : this});
		this.WebSocketServer = new WebSocketServer({parent : this});

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
			const response = await this.commands.get(data).run();

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
