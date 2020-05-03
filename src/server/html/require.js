const require = (url) => {
	const maskedEval = (code) => {
		// set up an object to serve as the context for the code being evaluated.
		const mask = {
			maskedEval : undefined,
			url        : undefined,
			code       : undefined
		};

		return (new Function(`
			with(this) {
				const codePromise = new Promise(async function (resolve) {
					let exports = {};
					const module = {};
					module.exports = {};
					await (async () => {
						${code};
					})();

					resolve(module.exports || exports);
				});

				return codePromise;
			}
		`)).call(mask);
	};

	if (!require.cache) {
		require.cache = {};
	}

	if (require.cache[url]) {
		return require.cache[url].results;
	}

	return new Promise(resolve => {
		var xhttp = new XMLHttpRequest();

		xhttp.onreadystatechange = async function () {
			if (this.readyState == 4 && this.status == 200) {
				const codePromise = maskedEval(this.responseText);

				codePromise.then((results) => {
					require.cache[url] = {
						results : results
					};

					resolve(results);
				});
			}
		};

		xhttp.open('GET', url, true);
		xhttp.send();
	});
};