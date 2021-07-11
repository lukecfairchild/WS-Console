
class Tasks {
	constructor (options) {
		this.Accounts = options.Accounts;
	}

	create (name) {
		return this.Accounts.create(name, 'task');
	}

	delete (name) {
		return this.Accounts.delete(name, 'task');
	}

	get (name) {
		return this.Accounts.get(name, 'task');
	}

	exists (name) {
		return this.Accounts.exists(name, 'task');
	}

	list () {
		return this.Accounts.list('task');
	}
}

module.exports = Tasks;
