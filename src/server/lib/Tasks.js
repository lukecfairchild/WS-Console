
const Task = require('./Task');

class Tasks {
	#database;
	#tasks = {};

	constructor (database) {
		this.#database = database;
	}

	create (name) {
		if (this.exists(name)) {
			return this.get(name);
		}

		this.#database.get('task').push({
			name : name,
			hash : null
		}).write();

		const task = new Task({
			database : this.#database,
			name     : name
		});

		this.#tasks[name] = task;

		return task;
	}

	delete (name) {
		
	}

	get (name) {
		if (this.#tasks[name]) {
			return this.#tasks[name];
		}

		if (!this.exists(name)) {
			return;
		}

		const task = new Task({
			database : this.#database,
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

		const data = this.#database.get('task').find({
			name : name
		}).value();

		return Boolean(data);
	}
}

module.exports = Tasks;
