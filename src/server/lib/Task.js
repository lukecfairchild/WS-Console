
const Type = require('simpler-types');

const Account = require('./Account');
const Cache   = require('../../lib/Cache');

class Task extends Account {
	constructor (options) {
		options.type = 'task';
		super(options);

		Type.assert(options, Object);
		//Type.assert(options.cacheSize, Number);
		this.Cache = new Cache({
			cacheSize : options.cacheSize
		});

		this.on('data', (event) => {
			this.Cache.push(event.data);

			console.log('cache',this.Cache.get());
			const accounts = this.Server.Accounts.Users.getAll();
			for (let i in accounts) {
				const account = accounts[i];

				if (account.hasPermission(`task.console.${this.name}.view`)) {
					account.Connections.send({
						action : 'data',
						target : this.name,
						data   : event.data
					});
				}
			}
		});

		this.Connections.on('data', (event) => {
			console.log('task send data', event);
		});

		this.Connections.on('login', () => {
			this.Connections.send({
				action : 'settingsSync',
				data   : {
					cacheSize : options.cacheSize
				}
			});

			console.log('(task) login!!!');

			const users = this.Server.Accounts.getAll('user');

			for (const i in users) {
				const user = users[i];

				console.log(`(task) checking if "${user.name}" has permission "task.console.${this.name}.view"`);
				if (user.hasPermission(`task.console.${this.name}.view`)) {
					user.Connections.send({
						action : 'taskConnect',
						name   : this.name,
						data   : this.Cache.get()
					});
				}
			}
		});
	}

	disconnect () {}
}

module.exports = Task;
