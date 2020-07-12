
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
			.name
			.type
			.permissions
				.add(permission)
				.getAll()
				.has(permission)
				.remove(permission)
			.connections
				.add(connection)
				.disconnect()
				.getAll()
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


		Process
			.name
			.type
			.connections
				.add(connection)
				.disconnect()
				.getAll()
				.remove(connection)
				.send(data)
			.delete()
			.on(event, callback)
			.removeEventListener(event, callback)
			.setPassword(password)

		Connection
			.authenticate(credentials)
			.diconnect()
			.send(message)
			.isAuthenticated()
			.on()

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
		.tasks
			.get(name) Task
			.getAll() [Task]

		Task
			.send(data)
			.on(event, callback)
				data {
					data
				}
				disconnect {}
