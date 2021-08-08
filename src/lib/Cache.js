
class Cache {
	#cache = [];

	constructor (options = {}) {
		this.cacheSize = options.cacheSize || 300;
	}

	push (value) {
		this.#cache.push(value);

		if (this.#cache.length > this.cacheSize) {
			this.#cache.shift();
		}
	}

	get () {
		return this.#cache;
	}
}

module.exports = Cache;
