
const Type = require('simpler-types');

const Account = require('./Account');
const Cache   = require('../../lib/Cache');

class Task extends Account {
	constructor (options) {
		options.type = 'task';
		super(options);

		Type.assert(options, Object);
		//Type.assert(options.cacheSize, Number);

		this.cache = new Cache({
			cacheSize : options.cacheSize
		});

		this.on('data', (event) => {
			const data = event.data instanceof Array ? event.data.join('') : event.data;

			this.cache.push(data);

			const accounts = this.server.accounts.users.getAll();
			for (let i in accounts) {
				const account = accounts[i];

				if (account.hasPermission(`task.console.${this.name}.view`)) {
					account.connections.send({
						action : 'data',
						target : this.name,
						data   : event.data
					});
				}
			}
		});

		this.connections.on('login', () => {
			this.connections.send({
				action : 'settingsSync',
				data   : {
					cacheSize : options.cacheSize
				}
			});

			const users = this.server.accounts.getAll('user');

			for (const i in users) {
				const user = users[i];

				if (user.hasPermission(`task.console.${this.name}.view`)) {
					user.connections.send({
						action : 'taskConnect',
						name   : this.name,
						data   : this.cache.get()
					});
				}
			}
		});
	}
}

module.exports = Task;
