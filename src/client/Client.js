'use strict';

const Tasks = require('./Tasks');

class Client {
	constructor () {
		this.Tasks = new Tasks({
			Client : this
		});
	}

	connect () {}
	disconnect () {}

	on (event, callback) {}

}

module.exports = Client;
