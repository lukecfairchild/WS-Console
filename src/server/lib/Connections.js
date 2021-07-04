
class Connections {
	#connections = {};

	constructor (options) {
		this.User = options.User;
	}

	add (connection) {
		this.#connections[connection.id] = connection;

		connection.on('close',() => {
			if (this.#connections[connection.id]) {
				delete this.#connections[connection.id];
			}
		});
	}

	disconnect () {
		for (const i in this.#connections) {
			this.#connections[i].disconnect();
		}
	}

	exists (id) {
		return this.#connections[id] !== undefined;
	}

	get (id) {
		if (this.exists(id)) {
			return this.#connections[id];
		}
	}

	remove (connection) {
		delete this.#connections[connection.id];
	}
}

module.exports = Connections;
