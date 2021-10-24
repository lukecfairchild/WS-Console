
const Type = require('simpler-types');

const Account = require('./Account');
const Roles   = require('./Roles');

class User extends Account {
	constructor (options) {
		options.type = 'user';
		super(options);

		Type.assert(options, Object);
		Type.assert(options.roles, Array);

		this.roles = new Roles({
			roles : options.roles,
			User  : this
		});

		this.Connections.on('login', () => {
			console.log('(user) login!!!');

			const tasks = this.Server.Accounts.getAll('task');
			for (const i in tasks) {
				const task = tasks[i];

				console.log(`(task) checking if "${this.name}" has permission "task.console.${task.name}.view"`);
				if (this.hasPermission(`task.console.${task.name}.view`)) {
					this.Connections.send({
						action : 'taskConnect',
						name   : task.name,
						data   : task.Cache.get()
					});
				}
			}
		});
	}
}

module.exports = User;
