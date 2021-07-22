
const Command = require('../Command');

class UserConnections extends Command {
	constructor (options) {
		super(options);

		this.arguments   = '<username>';
		this.description = 'Gets the specified users connections';
		this.permissions = ['user.connections'];
	}

	async run (username) {
		const Users = this.Server.Accounts.Users;

		if (!Users.exists(username)) {
			return 'User does not exist';
		}

		const connections = Users.get(username).Connections.getAll();

		let results = 'ID:                                     IP:\n';

		for (let id in connections) {
			const connection = connections[id];

			results += `${id}    ${connection.request.socket.remoteAddress}\n`;
		}

		return results;
	}
}

module.exports = UserConnections;
