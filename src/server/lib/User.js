
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

		this.Connections.on('login', async () => {
			/*
			console.log('(user) login!!!');
			const commands = Object.keys(this.Commands.getAll());
			console.log('commands', commands);
			*/
			this.send({
				action : 'taskConnect',
				name   : 'Console',
				data   : []
			});
			this.send({
				target : 'console',
				data   : await this.Account.Commands.run('help')
			});

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
