'use strict';

const Database        = require('./lib/Database');
const Randomize       = require('randomatic');
const User            = require('./lib/User');
const WebServer       = require('./lib/WebServer');
const WebSocketServer = require('./lib/WebSocketServer');

class  WSServer {
	#users;
	#processes;

	constructor (settings) {
		this.settings = settings;

		this.#users     = {};
		this.#processes = {};

		this.database        = new Database(this.settings);
		this.webServer       = new WebServer(this.settings);
		this.WebSocketServer = new WebSocketServer(this.settings);
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

			this.#users[username] = new User();
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
		return this.database.get('users').find({
			username : username
		}).value();
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
