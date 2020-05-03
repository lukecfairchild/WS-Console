const vm = require('vm');

vm.createContext(global);

process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', (data) => {

	try {
		console.log(vm.runInContext(data, global));

	} catch (exception) {
		console.log(exception);
	}
});
