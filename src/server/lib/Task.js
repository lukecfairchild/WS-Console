'use strict';

const Account = require('./Account');

class Task extends Account {
	constructor (options) {
		options.type = 'task';
		super(options);

		this.on('login', (event) => {
			event.connection.send({
				action : 'settingsSync',
				data   : {
					cacheSize : this.options.cacheSize
				}
			});
		});
	}

	disconnect () {}
}

module.exports = Task;
