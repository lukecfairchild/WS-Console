
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
			user  : this
		});

		this.connections.on('login', async () => {
			this.connections.send({
				action : 'taskConnect',
				name   : 'Console',
				data   : []
			});
			this.connections.send({
				target : 'console',
				data   : await this.commands.run('help')
			});

			const tasks = this.server.accounts.getAll('task');
			for (const i in tasks) {
				const task = tasks[i];

				if (this.hasPermission(`task.console.${this.name}.view`)) {
					this.connections.send({
						action : 'taskConnect',
						name   : task.name,
						data   : task.cache.get()
					});
				}
			}
		});
	}
}

module.exports = User;
