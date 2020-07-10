
class Help {
	constructor (options) {
		this.parent = options.parent;

		this.description = '';
		this.permissions = [];
	}

	run (...args) {
		console.log('original:', args, this.parent);
		return args;
	}

	help (...args) {

	}
}

module.exports = Help;
