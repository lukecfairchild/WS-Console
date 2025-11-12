
const Command = require('../Command');

class TaskLogout extends Command {
	constructor (options) {
		super(options);

		this.arguments   = '<taskname> [connectionId]';
		this.description = 'Logs out the specified task entirely or given connection.';
		this.permissions = ['task.logout'];
	}

	async run (taskname, connectionId) {
		const tasks = this.server.accounts.tasks;

		if (!tasks.exists(taskname)) {
			return 'Task does not exist';
		}

		if (connectionId) {
			if (!tasks.get(username).connections.exists(connectionId)) {
				return 'Invalid connectionId';
			}

			tasks.get(taskname).connections.get(connectionId).disconnect();

		} else {
			Users.get(taskname).connections.disconnect();
		}
	}
}

module.exports = TaskLogout;
