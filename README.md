
WSConsole
	server
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
			.permissions
				.add(permission)
				.getAll()
				.has(permission)
				.remove(permission)
			.connections
				.add(connection)
				.remove(connection)
			.roles
				.add(role)
				.getAll()
				.has(role)
				.remove(role)

			.addConnection(connection)

			.addRole()
			.getRoles()
			.removeRole(role)

			.addPermission(permission)
			.getPermissions()
			.hasPermission(permission)
			.removePermission(permission)

			.authenticate()
			.delete()
			.disconnect()
			.getName()
			.on(event, callback)
			.removeEventListener(event, callback)
			.send(data)
			.setPassword(password)

		Process
			.addConnection(connection)
			.authenticate()
			.delete()
			.disconnect()
			.getName()
			.on(event, callback)
			.removeEventListener(event, callback)
			.send(command)
			.setPassword(password)

		Connection
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

	process
		connect()
		disconnect()
		log(data)

	client
		.on(event, callback)
			connect
			disconnect
			processConnect {
				Process
			}
			processDisconnect {
				Process
			}
			processData {
				Process,
				data
			}

		.connect()
		.disconnect()
		.getProcess(name) Process
		.getProcesses() [Process]

		Process
			.send(data) {
				data
			}
			.on(event, callback)
				data {
					data
				}
				disconnect {}
