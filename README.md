
WSConsole
	server
		.start()
		.stop()
		.getUser(name) User
		.getUsers() [User]
		.getProcesses() [Process]
		.getProcesse(name) Process

		User
			.on(event, callback)
				data {
					Process,
					data
				}
				connect
				disconnect

			.getPermissions()
			.addPermission(permission)
			.removePermission(permission)
			.setPassword(password)
			.disconnect()
			.delete()
			.send(data)
				{
					process,
					data
				}

		Process
			.disconnect()
			.delete()
			.send(command)
			.setPassword(password)

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
