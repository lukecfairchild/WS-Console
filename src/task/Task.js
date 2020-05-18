'use strict';

const Cache     = require('./lib/Cache');
const Spawn     = require('child_process').spawn;
const WebSocket = require('./lib/WebSocket');

class Task {
	constructor (options) {
		this.cache   = new Cache(options.cacheSize);
		this.options = options;

		this.#startWebSocket();
		this.#startTask();
		this.#startCmdlineListener();
	}

	#startWebSocket = () => {
		this.websocket = new WebSocket(this.options);

		this.websocket.on('open', () => {
			// Authenticate with Hub
			this.websocket.send(JSON.stringify({
				clientType : 'server',
				action     : 'login',
				name       : this.options.name,
				password   : this.options.password
			}));

			const cache = this.cache.get();

			// Send Cache
			if (cache.length) {
				for (const i in cache) {
					this.websocket.send(JSON.stringify({
						clientType : 'server',
						action     : 'data',
						data       : cache[i]
					}));
				}
			}
		});

		// Remote commands
		if (this.options.allowCommands) {
			this.websocket.on('message', (rawData) => {
				let data = {};

				try {
					data = JSON.parse(rawData);
				} catch (error) {}

				switch (data.action) {
					case 'command' : {
						const message = '[WebCommand:' + data.username +'] ' + data.data;

						this.cache.push(message);

						console.log(message);
						this.websocket.send(JSON.stringify({
							clientType : 'server',
							action     : 'data',
							data       : message
						}));

						this.task.stdin.write(data.data + '\n');
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
		// Start Process
		this.task = Spawn(this.options.command[0], this.options.command.slice(1, this.options.command.length), {
			shell : true,
			stdio : [
				'pipe',
				'pipe',
				process.stderr
			]
		});

		// Exit if Process closes
		this.task.on('close', () => {
			process.exit();
		});

		// Relay Process data to Hub
		this.task.stdout.on('data', (rawData) => {
			const data = rawData.toString();

			this.cache.push(data);

			process.stdout.write(data);
			this.websocket.send(JSON.stringify({
				clientType : 'server',
				action     : 'data',
				data       : data
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
				clientType : 'server',
				action     : 'data',
				data       : data
			}));

			this.task.stdin.write(data);
		});
	}
}

module.exports = Task;
