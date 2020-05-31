
const FileSystem = require('fs');
const Path       = require('path');

class Commands {
	constructor () {
		const files = FileSystem.readdirSync(Path.join(__dirname, 'commands'));

		files.forEach(fileName => {
			const permission = fileName.split('.').slice(0, -1).join('.');
			const filePath   = Path.join(__dirname, fileName);

			console.log(filePath, permission);
		});
	}
}

module.exports = Commands;



const __dirname  = process.env.PWD;
const FileSystem = require('fs');
const Path       = require('path');

const files = FileSystem.readdirSync(Path.join(__dirname, 'commands'));

files.forEach(fileName => {
	const permission = fileName.split('.').slice(0, -1).join('.');
	const filePath   = Path.join(__dirname, 'commands', fileName);

	console.log(filePath, permission);
});