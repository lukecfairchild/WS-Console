
WSConsole
	Server
		.start()
		.stop()
		.users
			.get(username) User
			.getAll() [User]
			.create() User
			.exists(username) Boolean
			.delete(username) Boolean
		.tasks
			.get(taskname) Task
			.getAll() [Task]
			.create() Task
			.exists(taskname) Boolean
			.delete(taskname) Boolean

		User
			.name String
			.type String
			.permissions
				.add(permission)
				.getAll() [String]
				.has(permission) Boolean
				.remove(permission)
			.connections
				.add(connection)
				.disconnect()
				.getAll() [Connection]
				.send()
			.roles
				.add(role)
				.getAll()
				.has(role)
				.remove(role)

			.delete()
			.on(event, callback)
			.removeEventListener(event, callback)
			.send(data)
			.setPassword(password)


		Task
			.name
			.type
			.connections
				.add(connection)
				.disconnect()
				.getAll()
				.send(data)
			.delete()
			.on(event, callback)
			.removeEventListener(event, callback)
			.setPassword(password)

		Connection
			.authenticate(credentials)
			.diconnect()
			.on()
			.send(message)
			.trigger(event, data)

		Permissions
			help (globalize)
			logout (globalize)
			password (globalize)
			server.create
			server.delete
			server.list
			server.logout
			server.password
			user.create
			user.delete
			user.list
			user.logout
			user.password
			user.permission.add
			user.permission
			user.permission.list
			user.permission.remove

			console.[name]
			console.[name].command

	Task
		.connect()
		.disconnect()
		.log(data)

	Client
		.on(event, callback)
			connect
			disconnect
			taskConnect {
				Task
			}
			taskDisconnect {
				Task
			}
			taskData {
				Task,
				data
			}

		.connect()
		.disconnect()
		.Tasks
			.get(name) Task
			.getAll() [Task]

		Task
			.send(data)
			.on(event, callback)
				data {
					data
				}
				disconnect {}

Server Commands
	help
	logout
	password <password>
	task connections <name>
	task connections logout <name>
	task create <name>
	task delete <name>
	task list
	task logout <name>
	task password <name> <password>
	user connections <name>
	user connections logout <name>
	user create <name>
	user delete <name>
	user list
	user logout <name>
	user password <name> <password>
	user permission add <name> <permission>
	user permission list <name>
	user permission remove <name> <permission>
	connections list [name]
	connections logout <connection>


TO DO:
	account names character restrictions
	account names character limits
	account password character limits
