
class Command {
	constructor (options) {
		this.parent    = options.parent;
		this.arguments = options.arguments || [];

		this.description = '';
		this.permissions = [];
	}

	run () {}

	help () {}
}

module.exports = Command;
