
const Command = require('../Command');

class TaskLogout extends Command {
	constructor (options) {
		super(options);

		this.arguments   = '<taskname> [connectionId]';
		this.description = 'Logs out the specified task entirely or given connection.';
		this.permissions = ['task.logout'];
	}

	async run (taskname, connectionId) {
		const Tasks = this.Server.Accounts.Tasks;

		if (!Tasks.exists(taskname)) {
			return 'Task does not exist';
		}

		if (connectionId) {
			if (!Tasks.get(username).Connections.exists(connectionId)) {
				return 'Invalid connectionId';
			}

			Tasks.get(taskname).Connections.get(connectionId).disconnect();

		} else {
			Users.get(taskname).Connections.disconnect();
		}
	}
}

module.exports = TaskLogout;
