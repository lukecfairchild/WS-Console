
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
			//console.log('task send data', event);
		});

		this.Connections.on('login', () => {
			this.Connections.send({
				action : 'settingsSync',
				data   : {
					cacheSize : options.cacheSize
				}
			});

			const users = this.Server.Accounts.getAll('user');

			for (const i in users) {
				const user = users[i];

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
