
class Connections {
	#connections = {};

	constructor (options) {
		this.User = options.User;
	}

	add (connection) {
		this.#connections[connection.id] = connection;

		connection.on('close',() => {
			console.log('closed');
			if (this.#connections[connection.id]) {
				delete this.#connections[connection.id];
			}
		});

		connection.webSocket.on('message',() => {
			// do stuffs
		});
	}

	disconnect () {
		for (const i in this.#connections) {
			this.#connections[i].disconnect();
		}
	}

	getAll () {
		return this.#connections;
	}

	remove (connection) {
		delete this.#connections[connection.id];
	}
}

module.exports = Connections;
