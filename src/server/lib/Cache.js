'use strict';

class Cache {
	constructor (options) {
		this.options = options;
		this.cache   = [];
	}

	push (value) {
		this.cache.push(value);

		if (this.cache.length > this.options.cacheSize) {
			this.cache.shift();
		}
	}

	get () {
		return this.cache;
	}
}

module.exports = Cache;
