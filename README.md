
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
			.delete()
			.disconnect()
			.getPermissions()
			.getUsername()
			.on(event, callback)
			.removePermission(permission)
			.send(data)
			.setPassword(password)

		Process
			.delete()
			.disconnect()
			.send(command)
			.setPassword(password)

		Connection
			.diconnect()
			.send(message)
			.isAuthenticated()
			.on()

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
