
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

		this.on('login', (event) => {
			event.connection.send({
				action : 'settingsSync',
				data   : {
					cacheSize : options.cacheSize
				}
			});
		});
	}

	disconnect () {}
}

module.exports = Task;
