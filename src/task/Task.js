'use strict';

const Cache       = require('../lib/Cache');
const EventSystem = require('../lib/EventSystem');
const Spawn       = require('child_process').spawn;
const WebSocket   = require('./lib/WebSocket');

class Task extends EventSystem {
	constructor (options) {
		super();

		this.cache   = new Cache(options.cacheSize);
		this.options = options;

		this.#startWebSocket();
		this.#startTask();

		if (options.useStdin) {
			this.#startCmdlineListener();
		}
	}

	#startWebSocket = () => {
		this.websocket = new WebSocket(this.options);

		this.websocket.on('open', () => {
			// Authenticate with Hub
			this.websocket.send(JSON.stringify({
				type   : 'task',
				action : 'login',
				data   : {
					name     : this.options.name,
					password : this.options.password
				}
			}));

			const cache = this.cache.get();

			// Send Cache
			if (cache.length) {
				for (const i in cache) {
					this.websocket.send(JSON.stringify({
						type   : 'task',
						action : 'data',
						data   : cache[i]
					}));
				}
			}
		});

		// Remote commands
		if (this.options.allowRemoteInput) {
			this.websocket.on('message', (rawData) => {
				let data = {};

				try {
					data = JSON.parse(rawData);
				} catch (error) {}

				switch (data.action) {
					case 'ready' : {
						this.trigger('ready');
					}

					case 'command' : {
						const message = '[WebCommand:' + data.username +'] ' + data.data;

						this.cache.push(message);

						console.log(message);
						this.websocket.send(JSON.stringify({
							type   : 'task',
							action : 'data',
							data   : message
						}));

						this.process.stdin.write(data.data + '\n');
						break;
					}

					case 'settingsSync' : {
						this.cache.cacheSize = data.data.cacheSize;
					}
				}
			});
		}
	}

	#startTask = () => {
		// Start Task
		this.process = Spawn(this.options.command[0], this.options.command.slice(1, this.options.command.length), {
			shell : true,
			stdio : [
				'pipe',
				'pipe',
				process.stderr
			]
		});

		// Exit if Task closes
		this.process.on('close', async () => {
			await this.trigger('close');

			process.exit();
		});

		// Relay Task data to Hub
		this.process.stdout.on('data', async (rawData) => {
			const data = rawData.toString();

			this.cache.push(data);

			process.stdout.write(data);
			this.websocket.send(JSON.stringify({
				type   : 'task',
				action : 'data',
				data   : data
			}));
		});
	}

	#startCmdlineListener = () => {
		// Allow local command input
		process.stdin.resume();
		process.stdin.setEncoding('utf8');
		process.stdin.on('data', (rawData) => {
			const data = rawData.toString();

			this.cache.push(data);

			this.websocket.send(JSON.stringify({
				type   : 'task',
				action : 'data',
				data   : data
			}));

			process.stdin.write(data);
		});
	}

	send (data) {
		this.websocket.send(JSON.stringify({
			type   : 'task',
			action : 'data',
			data   : data
		}));
	}
}

module.exports = Task;
