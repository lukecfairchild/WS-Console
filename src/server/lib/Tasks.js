
const Task = require('./Task');

class Tasks {
	#tasks = {};

	constructor (options) {
		this.parent = options.parent;
	}

	create (name) {
		if (this.exists(name)) {
			return this.get(name);
		}

		this.parent.database.get('accounts').push({
			name : name,
			hash : null
		}).write();

		const task = new Task({
			database : this.parent.database,
			name     : name
		});

		this.#tasks[name] = task;

		return task;
	}

	delete (name) {
		if (this.exists(name)) {
			this.#tasks[name].disconnect();

			delete this.#tasks[name];
			this.parent.database.get('accounts').remove({
				name : name
			}).write();
		}
	}

	get (name) {
		if (this.#tasks[name]) {
			return this.#tasks[name];
		}

		if (!this.exists(name)) {
			return;
		}

		const task = new Task({
			database : this.parent.database,
			name     : name
		});

		this.#tasks[name] = task;

		return task;
	}

	getAll () {
		return this.#tasks;
	}

	exists (name) {
		if (this.#tasks[name]) {
			return true;
		}

		const data = this.parent.database.get('accounts').find({
			name : name
		}).value();

		return Boolean(data);
	}
}

module.exports = Tasks;
