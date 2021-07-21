
const Type = require('simpler-types');

const Account = require('./Account');

class Task extends Account {
	constructor (options) {
		options.type = 'task';
		super(options);

		Type.assert(options, Object);
		//Type.assert(options.cacheSize, Number);

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
