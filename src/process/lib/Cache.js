'use strict';

class Cache {
	constructor () {
		this.cache     = [];
		this.cacheSize = 300;
	}

	push (value) {
		this.cache.push(value);

		if (this.cache.length > this.cacheSize) {
			this.cache.shift();
		}
	}

	get () {
		return this.cache;
	}
}

module.exports = Cache;
