
module.exports.handler = (...args) => {
	console.log('original:', args);
	return args;
};
