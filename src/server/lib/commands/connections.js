
const Command = require('../Command');

class UserConnections extends Command {
	constructor (options) {
		super(options);

		this.arguments   = '';
		this.description = 'Gets your connections';
		this.permissions = ['connections'];
	}

	async run () {
		const connections = this.Account.Connections.getAll();

		let results = 'ID:                                     IP:\n';

		for (let id in connections) {
			const connection = connections[id];

			results += `${id}    ${connection.request.socket.remoteAddress}\n`;
		}

		return results;
	}
}

module.exports = UserConnections;
