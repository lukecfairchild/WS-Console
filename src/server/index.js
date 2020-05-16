'use strict';

const Database        = require('./lib/Database');
const Randomize       = require('randomatic');
const User            = require('./lib/User');
const WebServer       = require('./lib/WebServer');
const WebSocketServer = require('./lib/WebSocketServer');

class  WSServer {
	constructor (settings) {
		this.settings = settings;

		this.users     = {};
		this.processes = {};

		this.database        = new Database(this.settings);
		this.webServer       = new WebServer(this.settings);
		this.WebSocketServer = new WebSocketServer(this.settings);

		this.webSocketServer.on('connection', (connection) => {
			connection.on('login', (event) => {
				switch (event.type) {
					case 'user' : {
						const user = this.getUser(event.name);

						if (!user) {
							return connection.disconnect();
						}

						this.getUser(event.name).authenticate({
							name     : event.name,
							password : event.password
						});
					}
					case 'process' : {
						const wsprocess = this.getProcess(event.name);

						if (!wsprocess) {
							return connection.disconnect();
						}

						wsprocess.authenticate({
							name     : event.name,
							password : event.password
						});
					}
				}
			});
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

	createUser (username) {
		if (!this.getUser(username)) {
			this.database.get('users').push({
				username    : username,
				hash        : null,
				permissions : {},
				roles       : []
			}).write();

			this.users[username] = new User({
				database : this.database,
				username : username
			});
		}
	}

	createProcess (name) {
		if (!this.getProcess(name)) {
			let password = Randomize('*', 30);

			this.database.get('processes').push({
				name     : name,
				password : password
			}).write();

			return this.getProcess(name);
		}
	}

	getUser (username) {
		if (this.users[username]) {
			return this.users[username];
		}

		const user = this.database.get('users').find({
			username : username
		}).value();

		if (!user) {
			return;
		}

		return new User({
			database : this.database,
			username : user.username
		});
	}

	getProcess () {

	}

	/*
	getUsers () {

	}

	getProcesses () {

	}
	*/
}

module.exports = WSServer;
