const getCookie = (cname) => {
	var name          = cname + '=';
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca            = decodedCookie.split(';');

	for (var i = 0; i <ca.length; i++) {
		var c = ca[i];

		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}

		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}

	return '';
};

const getSelectedText = function () {
	if (window.getSelection) {
		return window.getSelection().toString();

	} else if (document.selection && document.selection.type != 'Control') {
		return document.selection.createRange().text;
	}
};

var webSocket;

var commands = {};

var codes = [
	{ // Black
		css  : 'color: Black;',
		code : '\u001b[0;30;22m'

	}, { // Dark Blue
		css  : 'color: DarkBlue;',
		code : '\u001b[0;34;22m'

	}, { // Dark Green
		css  : 'color: DarkGreen;',
		code : '\u001b[0;32;22m'

	}, { // Dark Aqua
		css  : 'color: DarkCyan;',
		code : '\u001b[0;36;22m'

	}, { // Dark Red
		css  : 'color: #800000;',
		code : '\u001b[0;31;22m'

	}, { // Dark Purple
		css  : 'color: DarkMagenta;',
		code : '\u001b[0;35;22m'

	}, { // Orange
		css  : 'color: #808000;',
		code : '\u001b[0;33;22m'

	}, { // Gray
		css  : 'color: #ADADAD;',
		code : '\u001b[0;37;22m'

	}, { // Dark Gray
		css  : 'color: #737373;',
		code : '\u001b[0;30;1m'

	}, { // Blue
		css  : 'color: Blue;',
		code : '\u001b[0;34;1m'

	}, { // Green
		css  : 'color: Green;',
		code : '\u001b[0;32;1m'

	}, { // Aqua
		css  : 'color: Cyan;',
		code : '\u001b[0;36;1m'

	}, { // Red
		css  : 'color: #FF0000;',
		code : '\u001b[0;31;1m'

	}, { // Purple
		css  : 'color: Fuchsia;',
		code : '\u001b[0;35;1m'

	}, { // Yellow
		css  : 'color: Yellow;',
		code : '\u001b[0;33;1m'

	}, { // White
		css  : 'color: White;',
		code : '\u001b[0;37;1m'

	}, { // Bold
		css  : 'font-weight: bold;',
		code : '\u001b[1m'

	}, { // Strikethrough
		css  : 'text-decoration: line-through;',
		code : '\u001b[9m'

	}, { // Underline
		css  : 'text-decoration: underline;',
		code : '\u001b[4m'

	}, { // Italic
		css  : 'font-style: italic;',
		code : '\u001b[3m'

	}, { // Reset
		css  : 'display: inline-block; font-weight: normal; color: #ADADAD; font-style: normal;',
		code : '\u001b[m'
	}
];

// Select input on Select-All
document.addEventListener('selectionchange', function (event) {
	const selection = window.getSelection();

	if (selection.anchorNode
	&&  selection.extentNode
	&&  selection.anchorNode.parentElement
	&&  selection.extentNode.previousSibling
	&&  typeof selection.anchorNode.parentElement.getAttribute === 'function'
	&&  typeof selection.extentNode.previousSibling.getAttribute === 'function'
	&&  selection.anchorNode.parentElement.getAttribute('class') === 'ui-tabs-anchor'
	&&  selection.extentNode.previousSibling.getAttribute('class') === 'console') {
		const selectedTab = $('.ui-state-active')[0];

		if (selectedTab) {
			const tabId = selectedTab.children[0].id.replace(/ui-id-/, '');
			const input = document.getElementById('input-' + tabId);

			input.select();
		}
	}
});

// Copy Selection when using shift+arrows
document.addEventListener('keydown', (event) => {
	const key = event.key;

	if (key === 'ArrowUp'
	||  key === 'ArrowDown'
	||  key === 'ArrowLeft'
	||  key === 'ArrowRight') {
		const selection  = window.getSelection();
		const currentTab = $('.ui-state-active')[0];
		try {
			const element = selection.getRangeAt(0).startContainer.parentNode.parentNode;

			// Verify its the console
			if (element.getAttribute('class') === 'console' && getSelectedText()) {
				setTimeout(() => {
					document.execCommand('copy');
				}, 1);

			// Nothing is selected so select input
			} else if (currentTab) {
				const index = currentTab.getAttribute('wrapperindex');
				const name  = currentTab.getAttribute('wrappername');
				const input = document.getElementById('input-' + index);

				input.focus();

				// Up
				if (event.keyCode == 38) {
					event.preventDefault();
					var newIndex = commands[name].current - 1;

					if (newIndex > -1) {
						commands[name].current = newIndex;
						var newValue           = commands[name].history[newIndex];

						if (newValue) {
							input.value = newValue;
						}
					}

				// Down
				} else if (event.keyCode == 40) {
					event.preventDefault();
					const newIndex = commands[name].current + 1;

					if (newIndex < commands[name].history.length) {
						commands[name].current = newIndex;
						const newValue         = commands[name].history[newIndex];

						if (newValue) {
							input.value = newValue;
						}

					} else {
						input.value            = '';
						commands[name].current = commands[name].history.length;
					}
				}
			}
		} catch (error) {/* Die silently */}
	}
});

document.addEventListener('keydown', (event) => {
	const selectedTab = $('.ui-state-active')[0];
	const key         = event.key;

	// No tabs exist yet
	if (!selectedTab) {
		return;
	}

	const tabId = selectedTab.children[0].id.replace(/ui-id-/, '');
	const input = document.getElementById('input-' + tabId);

	switch (key) {
		case 'Backspace' : {
			// Input is selected
			if (input === document.activeElement) {
				return;
			}

			input.select();
			event.preventDefault();

			input.value = input.value.substring(0, input.value.length - 1);

			return;
		}
	}
});

// Select input on typing & submit on enter
document.addEventListener('keypress', (event) => {
	const selectedTab = $('.ui-state-active')[0];
	const key         = event.key;

	// No tabs exist yet
	if (!selectedTab) {
		return;
	}

	const tabId = selectedTab.children[0].id.replace(/ui-id-/, '');
	const input = document.getElementById('input-' + tabId);

	switch (key) {
		case 'Enter' : {
			const name    = selectedTab.getAttribute('wrappername');
			const command = input.value;

			input.select();
			event.preventDefault();

			input.value	= '';

			if (command !== '') {
				commands[name].history.push(command);
				commands[name].current = commands[name].history.length;
				webSocket.send(JSON.stringify({
					clientType : 'user',
					action     : 'serverCommand',
					data       : command
				}));
			}

			return;
		}

		default : {
			// Input is selected
			if (input === document.activeElement) {
				return;
			}

			// Non single character key
			if (key.length > 1) {
				return;
			}

			input.select();
			event.preventDefault();

			input.value = input.value + key;

			return;
		}
	}
});

class UI {
	constructor () {
		this.index = 0;
		this.tabs  = {};
	}

	getTabs () {
		return this.tabs;
	}

	getCurrentTab () {
		const jquerySelectedTab = $('.ui-state-active')[0].textContent;

		return this.tabs[jquerySelectedTab];
	}

	getTabCount () {
		return Object.keys(this.tabs).length;
	}

	addTab (name) {
		if (!this.tabs[name]) {
			var tabs = $('#tabs').tabs();

			this.index++;

			var li = document.createElement('li');
			var a  = document.createElement('a');

			a.href        = '#tabs-' + this.index;
			a.textContent = name;

			li.setAttribute('wrapperIndex', this.index);
			li.setAttribute('wrapperName', name);
			li.appendChild(a);

			document.getElementById('tabButtons').appendChild(li);

			var div   = document.createElement('div');
			var div2  = document.createElement('div');
			var form  = document.createElement('form');
			let input = document.createElement('input');

			div.id   = 'tabs-' + this.index;
			div2.id  = 'console-' + name;
			form.id  = 'inputForm-' + this.index;
			input.id = 'input-' + this.index;

			if (!commands[name]) {
				commands[name] = {
					current : 0,
					history : []
				};
			}

			div2.classList.add('console');

			div2.addEventListener('paste', () => {
				input.focus();
			});

			div2.addEventListener('mouseup', () => {
				document.execCommand('copy');
			});

			li.addEventListener('click', () => {

				window.scrollTo(window.pageXOffset, document.body.scrollHeight);

				webSocket.send(JSON.stringify({
					clientType : 'user',
					action     : 'serverSelect',
					data       : name
				}));
			});

			input.addEventListener('focus', () => {

				webSocket.send(JSON.stringify({
					clientType : 'user',
					action     : 'serverSelect',
					data       : name
				}));
			});

			form.addEventListener('submit', function (element, event) {
				event.preventDefault();

				var command = input.value;

				input.value	= '';

				if (command !== '') {
					commands[name].history.push(command);
					commands[name].current = commands[name].history.length;
					webSocket.send(JSON.stringify({
						clientType : 'user',
						action     : 'serverSelect',
						data       : command
					}));
				}
			}.bind(null, input));

			var autofocus    = document.createAttribute('autofocus');
			var autocomplete = document.createAttribute('autocomplete');
			var lpIgnore     = document.createAttribute('data-lpignore');

			lpIgnore.value = true;

			autocomplete.value = 'off';

			input.setAttributeNode(lpIgnore);
			input.setAttributeNode(autofocus);
			input.setAttributeNode(autocomplete);

			input.style.position   = 'fixed';
			input.style.left       = '0px';
			input.style.bottom     = '0px';
			input.style.background = '#151515';

			form.style.color    = 'ADADAD';
			form.style.position = 'fixed';
			form.style.bottom   = 0;

			form.appendChild(input);

			div.appendChild(div2);
			div.appendChild(form);
			document.getElementById('tabBodies').appendChild(div);

			li.addEventListener('click', () => {
				input.select();
			});

			this.tabs[name] = {
				button : li,
				body   : div,
				lines  : []
			};

			tabs.tabs('refresh');

			tabs.find('.ui-tabs-nav').sortable({
				axis : 'x',
				stop : () => {
					tabs.tabs('refresh');
				}
			});

			if (name === 'Console') {
				$('#tabs').tabs('option', 'active', 0);
				input.select();
			}
		}

		var selectedTab = $('.ui-state-active')[0];

		if (selectedTab) {
			webSocket.send(JSON.stringify({
				clientType : 'user',
				action     : 'serverSelect',
				data       : selectedTab.getAttribute('wrapperName')
			}));
		}
	}

	removeTab (name) {
		delete commands[name];

		if (this.tabs[name]) {
			this.tabs[name].button.remove();
			this.tabs[name].body.remove();

			delete this.tabs[name];
		}

		var checkForSelectedTab = $('.ui-state-active')[0];

		if (checkForSelectedTab) {
			var selectedTab = checkForSelectedTab.getAttribute('wrapperName');

			if (selectedTab && WebSocket.readyState === 1) {
				webSocket.send(JSON.stringify({
					clientType : 'user',
					action     : 'serverSelect',
					data       : selectedTab
				}));
			}
		}
	}
}

const ui = new UI();

const startListener = function () {
	var username = document.getElementById('username').value;
	var password = document.getElementById('password').value;

	document.getElementById('password').value = '';

	document.getElementById('login').style.visibility    = 'hidden';
	document.getElementById('username').style.visibility = 'hidden';
	document.getElementById('password').style.visibility = 'hidden';

	var tabs = $('#tabs').tabs();

	tabs.find('.ui-tabs-nav').sortable({
		axis : 'x',
		stop : function () {

			tabs.tabs('refresh');
		}
	});

	// Create WebSocket connection.
	webSocket = new WebSocket('ws' + (document.location.protocol === 'https:' ? 's' : '') + '://' + window.location.hostname + ':' + getCookie('port'));

	// Connection opened
	webSocket.addEventListener('open', function (event) {

	});

	// Listen for messages
	webSocket.addEventListener('message', function (rawData) {

		var data = {};

		try {
			data = JSON.parse(rawData.data);

		} catch (error) {
			console.error('Invalid JSON recieved: ' + rawData.data);
		}

		switch (data.action) {
			case 'ready' : {
				webSocket.send(JSON.stringify({
					clientType : 'user',
					action     : 'login',
					username   : username,
					password   : password
				}));

				break;
			}

			case 'serverConnect' : {
				ui.addTab(data.serverName);

				break;
			}

			case 'serverDisconnect' : {
				ui.removeTab(data.serverName);

				break;
			}

			case 'resetData' : {
				var targetConsole = document.getElementById('console-' + data.server);

				while (targetConsole.firstChild) {
					targetConsole.removeChild(targetConsole.firstChild);
				}
			}

			case 'data' : {

				var getDocHeight = function () {

					return Math.max(
						document.body.scrollHeight, document.documentElement.scrollHeight,
						document.body.offsetHeight, document.documentElement.offsetHeight,
						document.body.clientHeight, document.documentElement.clientHeight
					);
				};

				var getPosition = function () {
					return window.pageYOffset + (window.innerHeight
						||  html.clientHeight
						||  body.clientHeight
						||  screen.availHeight
					);
				};

				let scroll = false;

				if (getDocHeight() - getPosition() < 1) {
					scroll = true;
				}

				var targetConsole = document.getElementById('console-' + data.server);
				var children      = targetConsole.children;
				var consoleY      = Math.round(targetConsole.getBoundingClientRect().y);

				if (children.length > 0) {
					var lastChildY = Math.round(children[children.length - 1].getBoundingClientRect().y);

					if (consoleY === lastChildY) {
						scroll = true;
					}
				}

				var buffer = document.getElementById('buffer-' + data.server);

				if (buffer) {
					buffer.remove();
				}

				for (var i in data.data) {
					var whole = data.data[i];
					var div   = document.createElement('div');

					var htmlLines = [];
					var lines     = whole.split(/(?:\r\n|\n)/);

					for (var i in lines) {
						var line = lines[i];

						var htmlLine = line
						.replace(/>/g, '&gt;')
						.replace(/</g, '&lt;')
						.replace(/ /g, '&#160;');

						var spans = 0;

						for (var j in codes) {
							var code       = codes[j];
							var splitLine  = htmlLine.split(code.code);
							var lineString = '';

							if (splitLine.length) {
								lineString += '<span style="' + code.css + '">';

								spans   += splitLine.length;
								htmlLine = splitLine.join(lineString);
							}
						}

						htmlLine += '</span>'.repeat(spans);

						htmlLine = `<div class="line" style="color:#ADADAD">${htmlLine}</div>`;

						htmlLines.push(htmlLine + '\n');

						lines[i] = htmlLine;
					}

					div.innerHTML = ansi_up.ansi_to_html(htmlLines.join('\n'));

					targetConsole.appendChild(div);
					ui.tabs[data.server].lines.push(div);
				}

				while (ui.tabs[data.server].lines.length > 1000) {
					ui.tabs[data.server].lines[0].remove();
					ui.tabs[data.server].lines.shift();
				}

				var selectedTab = $('.ui-state-active')[0].getAttribute('wrapperName');

				if (scroll
				&&  data.server === selectedTab) {
					window.scrollTo(window.pageXOffset, document.body.scrollHeight);
				}
			}
		}
	});

	webSocket.addEventListener('error', () => {});

	webSocket.addEventListener('close', () => {
		commands = {};

		var tabs = ui.getTabs();

		for (var i in tabs) {
			ui.removeTab(i);
		}

		document.getElementById('login').style.visibility    = 'visible';
		document.getElementById('username').style.visibility = 'visible';
		document.getElementById('password').style.visibility = 'visible';
		document.getElementById('password').select();
	});
};

var listener = function (event) {
	if (!event) {
		event = window.event || {};
	}

	var EnterKey = '13';
	var keyCode  = event.keyCode || event.which;

	// Enter key pressed
	if (event.type === 'keypress'
	&&  keyCode == EnterKey) {
		startListener();

	// Sign In button pressed
	} else if (event.type === 'click') {
		startListener();
	}
};

const loginElement      = document.getElementById('login');
const usernameElement   = document.getElementById('username');
const passwordElement   = document.getElementById('password');
const loginButtoElement = document.getElementById('loginButton');

document.addEventListener('click', function (event) {

	if (loginElement.style.visibility === 'visible'
	&&  document.activeElement !== usernameElement
	&&  document.activeElement !== passwordElement) {

		if (usernameElement.value) {
			passwordElement.select();

		} else {
			usernameElement.select();
		}
	}
});

usernameElement.addEventListener('keypress', listener);
passwordElement.addEventListener('keypress', listener);
loginButtoElement.addEventListener('click', listener);

if (usernameElement.value) {
	passwordElement.select();

} else {
	usernameElement.select();
}