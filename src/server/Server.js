'use strict';

const Database        = require('./lib/Database');
const User            = require('./lib/User');
const Task            = require('./lib/Task');
const WebServer       = require('./lib/WebServer');
const WebSocketServer = require('./lib/WebSocketServer');

class  Server {
	#users;
	#tasks;

	constructor (settings) {
		this.settings = settings;

		this.#users = {};
		this.#tasks = {};

		this.database        = new Database(this.settings);
		this.webServer       = new WebServer(this.settings);
		this.WebSocketServer = new WebSocketServer(this.settings);

		this.WebSocketServer.on('connection', (connection) => {
			connection.on('login', (event) => {
				let account;

				switch (event.type) {
					case 'user'    : account = this.getUser(event.name); break;
					case 'process' : account = this.getTask(event.name); break;
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

		if (options.useStdin) {
			this.#startCmdlineListener();
		}
	}

	#startCmdlineListener = () => {
		process.stdin.resume();
		process.stdin.setEncoding('utf8');
		process.stdin.on('data', (data) => {
			// Do stuff
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

	createUser (name) {
		if (this.userExists(name)) {
			return;
		}

		this.database.get('user').push({
			name        : name,
			hash        : null,
			permissions : {},
			roles       : []
		}).write();

		const user = new User({
			database : this.database,
			name     : name
		});

		this.#users[name] = user;

		return user;
	}

	createTask (name) {
		if (this.taskExists(name)) {
			return;
		}

		this.database.get('task').push({
			name : name,
			hash : null
		}).write();

		const task = new Task({
			database : this.database,
			name     : name
		});

		this.#tasks[name] = task;

		return task;
	}

	getUser (name) {
		if (this.#users[name]) {
			return this.#users[name];
		}

		if (!this.userExists(name)) {
			return;
		}

		const user = new User({
			database : this.database,
			name     : name
		});

		this.#users[name] = user;

		return user;
	}

	getTask () {

	}

	taskExists (name) {
		const data = this.database.get('task').find({
			name : name
		}).value();

		return Boolean(data);
	}

	userExists (name) {
		const data = this.database.get('user').find({
			name : name
		}).value();

		return Boolean(data);
	}
}

module.exports = Server;
