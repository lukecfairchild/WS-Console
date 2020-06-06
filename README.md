
WSConsole
	server
		.start()
		.stop()
		.getUser(name) User
		.getUsers() [User]
		.getProcesses() [Process]
		.getProcesse(name) Process

		User
			.addConnection(connection)
			.addPermission(permission)
			.addRole()
			.authenticate()
			.delete()
			.disconnect()
			.getName()
			.getPermissions()
			.getRoles()
			.hasPermission(permission)
			.on(event, callback)
			.removeEventListener(event, callback)
			.removePermission(permission)
			.removeRole(role)
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
