
module.exports.handler = (...args) => {
	console.log('original:', args, this);
	return args;
};
