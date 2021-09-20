
const Type = require('simpler-types');

const Account     = require('./Account');
const EventSystem = require('../../lib/EventSystem');

class Connections extends EventSystem {
	#connections = {};

	constructor (options) {
		super();
		Type.assert(options, Object);
		Type.assert(options.Account, Account);

		this.Account = options.Account;
	}

	add (connection) {
		this.#connections[connection.id] = connection;

		connection.on('close',() => {
			if (this.#connections[connection.id]) {
				delete this.#connections[connection.id];
			}
		});
		this.trigger('login', () => {
			console.log('Login Connections!!!');
			this.trigger('login', {connection});
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

	getAll () {
		return this.#connections;
	}

	remove (id) {
		if (this.exists(id)) {
			delete this.#connections[id];
		}

	}

	send (message) {
		if (!message) {
			return;
		}

		for (const i in this.#connections) {
			this.#connections[i].send(message);
		}
	}
}

module.exports = Connections;
