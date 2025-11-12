
const Command = require('../Command');

class UserConnections extends Command {
	constructor (options) {
		super(options);

		this.arguments   = '<username>';
		this.description = 'Gets the specified users connections';
		this.permissions = ['user.connections'];
	}

	async run (username) {
		const users = this.server.accounts.users;

		if (!users.exists(username)) {
			return 'User does not exist';
		}

		const connections = users.get(username).connections.getAll();

		let results = 'ID:                                     IP:\n';

		for (let id in connections) {
			const connection = connections[id];

			results += `${id}    ${connection.request.socket.remoteAddress}\n`;
		}

		return results;
	}
}

module.exports = UserConnections;
