'use strict';

const Connection = require('./Connection');
//const Data       = require('./Database');
const FileSystem = require('http');
const HTTP       = require('http');
const HTTPS      = require('https');
const WebSocket  = require('ws');

class WebSocketServer {
	#events;
	#webServer;
	#webSocketServer;

	constructor (options) {
		this.Server  = options.Server;
		this.#events = {};

		if (this.Server.settings.ssl) {
			this.#webServer = HTTPS.createServer({
				cert : FileSystem.readFileSync(this.Server.settings.sslCert),
				key  : FileSystem.readFileSync(this.Server.settings.sslKey)
			});

		} else {
			this.#webServer = HTTP.createServer();
		}

		this.#webSocketServer = new WebSocket.Server({
			server : this.#webServer
		});

		this.#webSocketServer.on('listening', () => {
			this.trigger('listening', {});

			console.log('WebSocketServer listening on port: ' + this.Server.settings.webSocketPort);
		});

		this.#webSocketServer.on('connection', (webSocket) => {
			this.trigger('connection', webSocket);
			this.webSocketListener(webSocket);
		});
	}

	start () {
		this.#webServer.listen(this.Server.settings.webSocketPort);
	}

	stop () {
		this.#webServer.close();
	}

	webSocketListener (webSocket) {
		new Connection({
			Server    : this.Server,
			webSocket : webSocket
		});

		/*
		webSocket.on('message', (rawData) => {
			let data = {};

			try {
				data = JSON.parse(rawData);
				this.trigger(data.action, data);

			} catch (error) {
				webSocket.terminate();
			}

			this.trigger('message', {
				data      : data,
				webSocket : webSocket
			});

			switch (data.action) {
				case 'login' : {
					console.log(data, this.Server.Accounts.exists(data.name, data.type));
					break;
				}

				case 'command' : {
					try {
						const server = connection.getServer().getName();

						if (server === 'Console'
						||  Data.userHasPermission(connection.getUsername(), 'console.command.' + connection.getServer().getName())) {

							connection.getServer().getWebSocket().send(JSON.stringify({
								action   : 'command',
								data     : data.data,
								username : connection.getUsername(),
								uuid     : connection.getUUID()
							}));

						} else {
							connection.getWebSocket().send(JSON.stringify({
								action : 'data',
								data   : ['You do not have permission for that.'],
								server : server
							}));
						}
					} catch (error) {}

					break;
				}
			}
		});
		*/
	}

	consoleCommand (data) {
		const command = data.data;

		switch (command[0]) {
			case '?'    :
			case 'help' : {
				const commands = [
					'----- Commands -----',
					' - help',
					' - logout',
					' - password <password>'
				];

				if (Data.userHasPermission(data.username, 'user.list')) {
					commands.push(' - user list');
				}

				if (Data.userHasPermission(data.username, 'user.create')) {
					commands.push(' - user create <username>');
				}

				if (Data.userHasPermission(data.username, 'user.delete')) {
					commands.push(' - user delete <username>');
				}

				if (Data.userHasPermission(data.username, 'user.logout')) {
					commands.push(' - user logout <username>');
				}

				if (Data.userHasPermission(data.username, 'user.edit')) {
					commands.push(
						' - user password <username> <password>',
						' - user generate password <username>',
						' - user permission',
						' - user permission add <username> <permission>',
						' - user permission remove <username> <permission>',
						' - user permission list [username]'
					);
				}

				if (Data.userHasPermission(data.username, 'server.list')) {
					commands.push(' - server list');
				}

				if (Data.userHasPermission(data.username, 'server.logout')) {
					commands.push(' - server logout <server>');
				}

				if (Data.userHasPermission(data.username, 'server.create')) {
					commands.push(' - server create <server>');
				}

				if (Data.userHasPermission(data.username, 'server.delete')) {
					commands.push(' - server delete <server>');
				}

				if (Data.userHasPermission(data.username, 'server.edit')) {
					commands.push(
						' - server password <server> <password>',
						' - server generate password <server>'
					);
				}

				commands.push(
					'--------------------',
					''
				);

				this.users[data.uuid].getWebSocket().send(JSON.stringify({
					server : 'Console',
					data   : commands,
					action : 'data'
				}));

				return;
			}

			case 'quit'   :
			case 'exit'   :
			case 'logout' : {
				this.users[data.uuid].logout();

				return;
			}

			case 'password' : {
				Data.setUserPassword(data.username, command[1]);

				this.users[data.uuid].getWebSocket().send(JSON.stringify({
					server : 'Console',
					data   : ['Password successfully changed.'],
					action : 'data'
				}));

				return;
			}

			case 'roles' :
			case 'role'  : {
				switch (command[1]) {
					case 'list'   :
					case 'create' :
					case 'delete' :
					case 'permission' : {

						switch (command[2]) {
							case 'add'    :
							case 'remove' :
							case 'list'   :
						}
					}
				}
			}

			case 'users' :
			case 'user'  : {
				switch (command[1]) {
					case 'roles' :
					case 'role'  : {
						switch (command[2]) {
							case 'add'    :
							case 'remote' :
							case 'list'   :
						}

						return;
					}

					// /user list
					case 'list' : {
						if (Data.userHasPermission(data.username, 'user.list')) {
							const users = Data.getUsers();

							for (const i in users) {
								users[i] = ' - ' + users[i];
							}

							users.unshift('----- Users -----');
							users.push('-----------------', '');

							this.users[data.uuid].getWebSocket().send(JSON.stringify({
								server : 'Console',
								data   : users,
								action : 'data'
							}));

						} else {
							this.users[data.uuid].getWebSocket().send(JSON.stringify({
								server : 'Console',
								data   : ['You do not have permission to do that.'],
								action : 'data'
							}));
						}

						return;
					}

					// /user create
					case 'create' : {
						if (Data.userHasPermission(data.username, 'user.create')) {
							if (Data.createUser(command[2])) {
								this.users[data.uuid].getWebSocket().send(JSON.stringify({
									server : 'Console',
									data   : ['User "' + command[2] + '" created.'],
									action : 'data'
								}));

							} else {
								this.users[data.uuid].getWebSocket().send(JSON.stringify({
									server : 'Console',
									data   : ['User "' + command[2] + '" already exists.'],
									action : 'data'
								}));
							}

						} else {
							this.users[data.uuid].getWebSocket().send(JSON.stringify({
								server : 'Console',
								data   : ['You do not have permission to do that.'],
								action : 'data'
							}));
						}

						return;
					}

					// /user delete
					case 'delete' : {
						if (Data.userHasPermission(data.username, 'user.delete')) {
							if (Data.deleteUser(command[2])) {
								for (const i in this.users) {
									const user = this.users[i];

									if (user.getUsername() === command[2]) {
										user.logout();
									}
								}

								this.users[data.uuid].getWebSocket().send(JSON.stringify({
									server : 'Console',
									data   : ['User "' + command[2] + '" deleted.'],
									action : 'data'
								}));

							} else {
								this.users[data.uuid].getWebSocket().send(JSON.stringify({
									server : 'Console',
									data   : ['User "' + command[2] + '" does not exist.'],
									action : 'data'
								}));
							}

						} else {
							this.users[data.uuid].getWebSocket().send(JSON.stringify({
								server : 'Console',
								data   : ['You do not have permission to do that.'],
								action : 'data'
							}));
						}

						return;
					}

					case 'logout' : {
						if (Data.userHasPermission(data.username, 'user.logout')) {
							if (Data.getUser(command[2])) {
								for (const i in this.users) {
									const user = this.users[i];

									if (user.getUsername() === command[2]) {
										user.logout();
									}
								}

								this.users[data.uuid].getWebSocket().send(JSON.stringify({
									server : 'Console',
									data   : ['User "' + command[2] + '" logged out.'],
									action : 'data'
								}));

							} else {
								this.users[data.uuid].getWebSocket().send(JSON.stringify({
									server : 'Console',
									data   : ['User "' + command[2] + '" does not exist.'],
									action : 'data'
								}));
							}

						} else {
							this.users[data.uuid].getWebSocket().send(JSON.stringify({
								server : 'Console',
								data   : ['You do not have permission to do that.'],
								action : 'data'
							}));
						}

						return;
					}

					case 'password' : {
						if (Data.userHasPermission(data.username, 'user.edit')) {
							if (Data.setUserPassword(command[2], command[3])) {
								this.users[data.uuid].getWebSocket().send(JSON.stringify({
									server : 'Console',
									data   : ['User "' + command[2] + '" password changed.'],
									action : 'data'
								}));

							} else {
								this.users[data.uuid].getWebSocket().send(JSON.stringify({
									server : 'Console',
									data   : ['User "' + command[2] + '" does not exist.'],
									action : 'data'
								}));
							}

						} else {
							this.users[data.uuid].getWebSocket().send(JSON.stringify({
								server : 'Console',
								data   : ['You do not have permission to do that.'],
								action : 'data'
							}));
						}

						return;
					}

					case 'permission' : {
						if (Data.userHasPermission(data.username, 'user.edit')) {
							const permissions = [
								'*',
								'user.*',
								'user.list',
								'user.create',
								'user.delete',
								'user.edit',
								'user.logout',
								'server.*',
								'server.list',
								'server.logout',
								'server.delete',
								'server.create',
								'server.edit',
								'console.*',
								'console.view.*',
								'console.command.*'
							];

							switch (command[2]) {
								case 'add' : {
									const permission       = command[4];
									const serverPermission = permission.match('^console\.(command|view)\.(.+)');
									const userCheck        = Data.getUser(command[3]);

									if (!userCheck
									||  !userCheck.permissions) {
										this.users[data.uuid].getWebSocket().send(JSON.stringify({
											server : 'Console',
											data   : ['User "' + command[2] + '" does not exist.'],
											action : 'data'
										}));

										return;
									}

									if (userCheck.permissions[permission]) {
										this.users[data.uuid].getWebSocket().send(JSON.stringify({
											server : 'Console',
											data   : ['User "' + command[2] + '" already has the permission "' + permission + '".'],
											action : 'data'
										}));

										return;
									}

									if (permissions.indexOf(permission) === -1
									&&  !serverPermission) {
										this.users[data.uuid].getWebSocket().send(JSON.stringify({
											server : 'Console',
											data   : ['Invalid permission "' + permission + '".'],
											action : 'data'
										}));

										return;
									}

									if (!Data.userHasPermission(data.username, permission)) {
										this.users[data.uuid].getWebSocket().send(JSON.stringify({
											server : 'Console',
											data   : ['You do not have permissiont to do that.'],
											action : 'data'
										}));

										return;
									}

									userCheck.permissions[permission] = true;

									Data.setUserPermissions(command[3], userCheck.permissions);

									if (permission === 'console.*'
									||  permission === '*'
									||  (serverPermission
									&&   serverPermission[1] === 'view')) {
										const users = this.getUsers();

										for (const i in users) {
											const user = users[i];

											if (user.getUsername() === command[3]) {
												user.updateServers();
											}
										}
									}

									this.users[data.uuid].getWebSocket().send(JSON.stringify({
										server : 'Console',
										data   : ['Permission "' + permission +'" given to "' + command[3] + '".'],
										action : 'data'
									}));

									return;
								}

								case 'remove' : {
									const permission       = command[4];
									const serverPermission = permission.match('^console\.(command|view)\.(.+)');
									const userCheck        = Data.getUser(command[3]);

									if (!userCheck
									||  !userCheck.permissions) {
										this.users[data.uuid].getWebSocket().send(JSON.stringify({
											server : 'Console',
											data   : ['User "' + command[2] + '" does not exist.'],
											action : 'data'
										}));

										return;
									}

									if (!userCheck.permissions[permission]) {
										this.users[data.uuid].getWebSocket().send(JSON.stringify({
											server : 'Console',
											data   : ['User "' + command[2] + '" does not have the permission "' + permission + '".'],
											action : 'data'
										}));

										return;
									}

									if (permissions.indexOf(permission) === -1
									&&   !serverPermission) {
										this.users[data.uuid].getWebSocket().send(JSON.stringify({
											server : 'Console',
											data   : ['Invalid permission "' + permission + '".'],
											action : 'data'
										}));

										return;
									}

									if (!Data.userHasPermission(data.username, permission)) {
										this.users[data.uuid].getWebSocket().send(JSON.stringify({
											server : 'Console',
											data   : ['You do not have permissiont to do that.'],
											action : 'data'
										}));

										return;
									}

									delete userCheck.permissions[permission];

									Data.setUserPermissions(command[3], userCheck.permissions);

									if ((serverPermission
									&&     serverPermission[1] === 'view')
									||   permission === 'console.*'
									||   permission === '*') {
										const users = this.getUsers();

										for (const i in users) {
											const user = users[i];

											if (user.getUsername() === command[3]) {
												user.updateServers();
											}
										}
									}

									this.users[data.uuid].getWebSocket().send(JSON.stringify({
										server : 'Console',
										data   : ['Permission "' + permission +'" taken from "' + command[3] + '".'],
										action : 'data'
									}));

									return;
								}

								case 'list' : {
									const userCheck = Data.getUser(command[3] || data.username);

									if (userCheck
									&&   userCheck.permissions) {
										const permissions = Object.keys(userCheck.permissions);

										permissions.unshift('----- Permissions -----');
										permissions.push('-----------------------', '');

										this.users[data.uuid].getWebSocket().send(JSON.stringify({
											server : 'Console',
											data   : permissions,
											action : 'data'
										}));

									} else {
										this.users[data.uuid].getWebSocket().send(JSON.stringify({
											server : 'Console',
											data   : ['User "' + command[3] + '" does not exist.'],
											action : 'data'
										}));
									}

									return;
								}

								default : {
									permissions.unshift('----- Permissions -----');
									permissions.push('-----------------------', '');

									this.users[data.uuid].getWebSocket().send(JSON.stringify({
										server : 'Console',
										data   : permissions,
										action : 'data'
									}));

									return;
								}
							}

						} else {
							this.users[data.uuid].getWebSocket().send(JSON.stringify({
								server : 'Console',
								data   : ['You do not have permission to do that.'],
								action : 'data'
							}));
						}

						return;
					}

					case 'generate' : {

						switch (command[2]) {
							case 'password' : {
								if (Data.userHasPermission(data.username, 'user.edit')) {
									//const uuid = Utils.getUUID();

									Data.setUserPassword(command[3], uuid);

									this.users[data.uuid].getWebSocket().send(JSON.stringify({
										server : 'Console',
										action : 'data',
										//data   : ['Password: ' + uuid]
									}));

								} else {
									this.users[data.uuid].getWebSocket().send(JSON.stringify({
										server : 'Console',
										data   : ['You do not have permission to do that.'],
										action : 'data'
									}));
								}

								return;
							}
						}
					}
				}
			}

			case 'servers' :
			case 'server'  : {

				switch (command[1]) {
					case 'list' : {

						if (Data.userHasPermission(data.username, 'server.list')) {
							const servers = Data.getServers();

							for (const i in servers) {
								servers[i] = ' - ' + servers[i];
							}

							servers.unshift('----- Servers -----');
							servers.push('-------------------', '');

							this.users[data.uuid].getWebSocket().send(JSON.stringify({
								server : 'Console',
								data   : servers,
								action : 'data'
							}));

						} else {
							this.users[data.uuid].getWebSocket().send(JSON.stringify({
								server : 'Console',
								data   : ['You do not have permission to do that.'],
								action : 'data'
							}));
						}

						return;
					}

					case 'delete' : {
						if (Data.userHasPermission(data.username, 'server.delete')) {
							if (Data.getServer(command[2])) {
								const server = this.getServer(command[2]);

								if (server) {
									server.logout();
								}

								Data.deleteServer(command[2]);
								this.users[data.uuid].getWebSocket().send(JSON.stringify({
									server : 'Console',
									data   : ['Server "' + command[2] + '" deleted.'],
									action : 'data'
								}));

							} else {
								this.users[data.uuid].getWebSocket().send(JSON.stringify({
									server : 'Console',
									data   : ['Server "' + command[2] + '" does not exist.'],
									action : 'data'
								}));
							}

						} else {
							this.users[data.uuid].getWebSocket().send(JSON.stringify({
								server : 'Console',
								data   : ['You do not have permission to do that.'],
								action : 'data'
							}));
						}

						return;
					}

					case 'logout' : {

						if (Data.userHasPermission(data.username, 'server.logout')) {
							const server = this.getServer(command[2]);

							if (server) {
								server.logout();

								this.users[data.uuid].getWebSocket().send(JSON.stringify({
									server : 'Console',
									data   : ['Server "' + command[2] + '" logged out.'],
									action : 'data'
								}));

							} else {
								this.users[data.uuid].getWebSocket().send(JSON.stringify({
									server : 'Console',
									data   : ['Server "' + command[2] + '" does not exist.'],
									action : 'data'
								}));
							}

						} else {
							this.users[data.uuid].getWebSocket().send(JSON.stringify({
								server : 'Console',
								data   : ['You do not have permission to do that.'],
								action : 'data'
							}));
						}

						return;
					}

					case 'create' : {
						if (Data.userHasPermission(data.username, 'server.create')) {
							if (!Data.getServer(command[2])) {
								const uuid = Data.createServer(command[2]);

								this.users[data.uuid].getWebSocket().send(JSON.stringify({
									server : 'Console',
									action : 'data',
									data   : [
										'Server "' + command[2] + '" created.',
										'Server password: ' + uuid
									]
								}));

							} else {
								this.users[data.uuid].getWebSocket().send(JSON.stringify({
									server : 'Console',
									data   : ['Server "' + command[2] + '" already exists.'],
									action : 'data'
								}));
							}

						} else {
							this.users[data.uuid].getWebSocket().send(JSON.stringify({
								server : 'Console',
								data   : ['You do not have permission to do that.'],
								action : 'data'
							}));
						}

						return;
					}

					case 'password' : {
						if (Data.userHasPermission(data.username, 'server.edit')) {
							if (Data.getServer(command[2])) {
								Data.setServerPassword(command[2], command[3]);
								this.users[data.uuid].getWebSocket().send(JSON.stringify({
									server : 'Console',
									data   : ['Server "' + command[2] + '" password set.'],
									action : 'data'
								}));

							} else {
								this.users[data.uuid].getWebSocket().send(JSON.stringify({
									server : 'Console',
									data   : ['Server "' + command[2] + '" does not exist.'],
									action : 'data'
								}));
							}

						} else {
							this.users[data.uuid].getWebSocket().send(JSON.stringify({
								server : 'Console',
								data   : ['You do not have permission to do that.'],
								action : 'data'
							}));
						}

						return;
					}

					case 'generate' : {
						switch (command[2]) {
							case 'password' : {
								if (Data.userHasPermission(data.username, 'server.edit')) {
									if (Data.getServer(command[3])) {
										//const uuid = Utils.getUUID();

										Data.setServerPassword(command[3], uuid);

										this.users[data.uuid].getWebSocket().send(JSON.stringify({
											server : 'Console',
											action : 'data',
											data   : [
												'Server "' + command[3] + '" created.',
										//		'Server password: ' + uuid
											]
										}));

									} else {
										this.users[data.uuid].getWebSocket().send(JSON.stringify({
											server : 'Console',
											action : 'data',
											data   : ['Server "' + command[3] + '" does not exist.']
										}));
									}

								} else {
									this.users[data.uuid].getWebSocket().send(JSON.stringify({
										server : 'Console',
										action : 'data',
										data   : ['You do not have permission to do that.']
									}));
								}

								return;
							}
						}
					}
				}
			}

			default : {
				this.users[data.uuid].getWebSocket().send(JSON.stringify({
					server : 'Console',
					data   : ['Invalid command. Type "help".'],
					action : 'data'
				}));
			}
		}
	}

	on (event, callback) {
		if (!event
		||  !callback) {
			return;
		}

		if (!this.#events[event]) {
			this.#events[event] = [];
		}

		if (this.#events[event].includes(callback)) {
			return;
		}

		this.#events[event].push(callback);
	}

	removeEventListener (event, callback) {
		if (!event
		||  !callback
		||  !this.#events[event]) {
			return;
		}

		if (this.#events[event].includes(callback)) {
			this.#events[event].splice(this.#events[event].indexOf(callback), 1);
		}
	}

	trigger (event, data) {
		if (!event
		||  !data) {
			return;
		}

		if (this.#events[event]) {
			for (const i in this.#events[event]) {
				this.#events[event][i](data);
			}
		}
	}
}

module.exports = WebSocketServer;
