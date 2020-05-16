'use strict';

const Account = require('./Account');

class Task extends Account {
	constructor (options) {
		super(options);

		this.events = {
			connect    : [],
			disconnect : [],
			log        : []
		};
	}
}

module.exports = Task;
