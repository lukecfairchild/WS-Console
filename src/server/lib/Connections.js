
class Connections {
	#connections;

	constructor (options) {
		this.User = options.User;
	}

	add (connection) {
		this.#connections.push(connection);

		connection.webSocket.on('close',() => {
			if (this.#connections.includes(connection)) {
				this.#connections.splice(this.#connections.indexOf(connection), 1);
			}
		});

		connection.webSocket.on('message',() => {
			// do stuffs
		});

		this.User.trigger('login', {
			connection,
			...this.User
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
}

module.exports = Connections;
