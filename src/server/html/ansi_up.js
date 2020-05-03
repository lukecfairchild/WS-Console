// ansi_up.js
// version : 1.3.0
// author : Dru Nelson
// license : MIT
// http://github.com/drudru/ansi_up

((Date, undefined) => {

	// Normal and then Bright
	const ANSI_COLORS = [
		[
			{color : '0,   0,   0', class : 'ansi-black'},
			{color : '187,   0,   0', class : 'ansi-red'},
			{color : '0, 187,   0', class : 'ansi-green'},
			{color : '187, 187,   0', class : 'ansi-yellow'},
			{color : '0,   0, 187', class : 'ansi-blue'},
			{color : '187,   0, 187', class : 'ansi-magenta'},
			{color : '0, 187, 187', class : 'ansi-cyan'},
			{color : '255, 255, 255', class : 'ansi-white'}
		], [
			{color : '85,  85,  85', class : 'ansi-bright-black'},
			{color : '255,  85,  85', class : 'ansi-bright-red'},
			{color : '0, 255,   0', class : 'ansi-bright-green'},
			{color : '255, 255,  85', class : 'ansi-bright-yellow'},
			{color : '85,  85, 255', class : 'ansi-bright-blue'},
			{color : '255,  85, 255', class : 'ansi-bright-magenta'},
			{color : '85, 255, 255', class : 'ansi-bright-cyan'},
			{color : '255, 255, 255', class : 'ansi-bright-white'}
		]
	];

	// 256 Colors Palette
	let PALETTE_COLORS;

	class Ansi_Up {
		constructor () {
			this.fg     = this.bg = this.fg_truecolor = this.bg_truecolor = null;
			this.bright = 0;
		}

		setup_palette () {
			PALETTE_COLORS = []
			// Index 0..15 : System color
			(() => {
				let i; let 
					j;
				for (i = 0; i < 2; ++i) {
					for (j = 0; j < 8; ++j) {
						PALETTE_COLORS.push(ANSI_COLORS[i][j]['color']);
					}
				}
			})();

			// Index 16..231 : RGB 6x6x6
			// https://gist.github.com/jasonm23/2868981#file-xterm-256color-yaml
			(() => {
				const levels = [0, 95, 135, 175, 215, 255];
				const format = (r, g, b) => {
					return levels[r] + ', ' + levels[g] + ', ' + levels[b];
				};
				let r; let g; let 
					b;

				for (r = 0; r < 6; ++r) {
					for (g = 0; g < 6; ++g) {
						for (b = 0; b < 6; ++b) {
							PALETTE_COLORS.push(format.call(this, r, g, b));
						}
					}
				}
			})()

			// Index 232..255 : Grayscale
			(() => {
				let level    = 8;
				const format = (level) => {
					return level + ', ' + level + ', ' + level;
				};

				for (let i = 0; i < 24; ++i, level += 10) {
					PALETTE_COLORS.push(format.call(this, level));
				}
			})();
		}

		escape_for_html (txt) {
			return txt.replace(/[&<>]/gm, (str) => {
				if (str == '&') {
					return '&amp;';
				}
				if (str == '<') {
					return '&lt;';
				}
				if (str == '>') {
					return '&gt;';
				}
			});
		}

		linkify (txt) {
			return txt.replace(/(https?:\/\/[^\s]+)/gm, (str) => {
				return '<a href="' + str + '">' + str + '</a>';
			});
		}

		ansi_to_html (txt, options) {
			return this.process(txt, options, true);
		}

		ansi_to_text (txt) {
			return this.process(txt, {}, false);
		}

		process (txt, options, markup) {
			const self = this;

			let raw_text_chunks = txt.split(/\033\[/);
			let first_chunk     = raw_text_chunks.shift(); // the first chunk is not the result of the split

			let color_chunks = raw_text_chunks.map((chunk) => {
				return self.process_chunk(chunk, options, markup);
			});

			color_chunks.unshift(first_chunk);

			return color_chunks.join('');
		}

		process_chunk (text, options, markup) {
			const self = this;

			// Are we using classes or styles?
			options = typeof options == 'undefined' ? {} : options;

			const use_classes = typeof options.use_classes != 'undefined' && options.use_classes;
			var key           = use_classes ? 'class' : 'color';

			// Each 'chunk' is the text after the CSI (ESC + '[') and before the next CSI/EOF.
			//
			// This regex matches four groups within a chunk.
			//
			// The first and third groups match code type.
			// We supported only SGR command. It has empty first group and 'm' in third.
			//
			// The second group matches all of the number+semicolon command sequences
			// before the 'm' (or other trailing) character.
			// These are the graphics or SGR commands.
			//
			// The last group is the text (including newlines) that is colored by
			// the other group's commands.
			var matches = text.match(/^([!\x3c-\x3f]*)([\d;]*)([\x20-\x2c]*[\x40-\x7e])([\s\S]*)/m);

			if (!matches) {
				return text;
			}

			var orig_txt = matches[4];
			var nums     = matches[2].split(';');

			// We currently support only 'SGR' (Select Graphic Rendition)
			// Simply ignore if not a SGR command.
			if (matches[1] !== '' || matches[3] !== 'm') {
				return orig_txt;
			}

			if (!markup) {
				return orig_txt;
			}

			while (nums.length > 0) {
				var num_str = nums.shift();
				var num     = parseInt(num_str);

				if (isNaN(num) || num === 0) {
					self.fg     = self.bg = null;
					self.bright = 0;

				} else if (num === 1) {
					self.bright = 1;

				} else if (num == 39) {
					self.fg = null;

				} else if (num == 49) {
					self.bg = null;

				} else if ((num >= 30) && (num < 38)) {
					self.fg = ANSI_COLORS[self.bright][(num % 10)][key];

				} else if ((num >= 90) && (num < 98)) {
					self.fg = ANSI_COLORS[1][(num % 10)][key];

				} else if ((num >= 40) && (num < 48)) {
					self.bg = ANSI_COLORS[0][(num % 10)][key];

				} else if ((num >= 100) && (num < 108)) {
					self.bg = ANSI_COLORS[1][(num % 10)][key];

				} else if (num === 38 || num === 48) { // extend color (38=fg, 48=bg)
					(() => {
						var is_foreground = (num === 38);

						if (nums.length >= 1) {
							var mode = nums.shift();

							if (mode === '5' && nums.length >= 1) { // palette color
								var palette_index = parseInt(nums.shift());

								if (palette_index >= 0 && palette_index <= 255) {
									if (!use_classes) {
										if (!PALETTE_COLORS) {
											self.setup_palette.call(self);
										}

										if (is_foreground) {
											self.fg = PALETTE_COLORS[palette_index];

										} else {
											self.bg = PALETTE_COLORS[palette_index];
										}

									} else {
										var klass = (palette_index >= 16)
											? ('ansi-palette-' + palette_index)
											: ANSI_COLORS[palette_index > 7 ? 1 : 0][palette_index % 8]['class'];

										if (is_foreground) {
											self.fg = klass;

										} else {
											self.bg = klass;
										}
									}
								}

							} else if (mode === '2' && nums.length >= 3) { // true color
								var r = parseInt(nums.shift());
								var g = parseInt(nums.shift());
								var b = parseInt(nums.shift());

								if ((r >= 0 && r <= 255) && (g >= 0 && g <= 255) && (b >= 0 && b <= 255)) {
									var color = r + ', ' + g + ', ' + b;

									if (!use_classes) {
										if (is_foreground) {
											self.fg = color;

										} else {
											self.bg = color;
										}

									} else if (is_foreground) {
										self.fg           = 'ansi-truecolor';
										self.fg_truecolor = color;

									} else {
										self.bg           = 'ansi-truecolor';
										self.bg_truecolor = color;
									}
								}
							}
						}
					})();
				}
			}

			if ((self.fg === null) && (self.bg === null)) {
				return orig_txt;

			} else {
				var styles      = [];
				var classes     = [];
				var data        = {};
				var render_data = (data) => {
					var fragments = [];

					for (var key in data) {
						if (data.hasOwnProperty(key)) {
							fragments.push('data-' + key + '="' + this.escape_for_html(data[key]) + '"');
						}
					}

					return fragments.length > 0 ? ' ' + fragments.join(' ') : '';
				};

				if (self.fg) {
					if (use_classes) {
						classes.push(self.fg + '-fg');

						if (self.fg_truecolor !== null) {
							data['ansi-truecolor-fg'] = self.fg_truecolor;
							self.fg_truecolor         = null;
						}

					} else {
						styles.push('color:rgb(' + self.fg + ')');
					}
				}

				if (self.bg) {
					if (use_classes) {
						classes.push(self.bg + '-bg');

						if (self.bg_truecolor !== null) {
							data['ansi-truecolor-bg'] = self.bg_truecolor;
							self.bg_truecolor         = null;
						}

					} else {
						styles.push('background-color:rgb(' + self.bg + ')');
					}
				}

				if (use_classes) {
					return '<span class="' + classes.join(' ') + '"' + render_data.call(self, data) + '>' + orig_txt + '</span>';

				} else {
					return '<span style="' + styles.join(';') + '"' + render_data.call(self, data) + '>' + orig_txt + '</span>';
				}
			}
		}
	}

	// Module exports
	const ansi_up = {
		escape_for_html : (txt) => {
			var a2h = new Ansi_Up();
			return a2h.escape_for_html(txt);
		},

		linkify : (txt) => {
			var a2h = new Ansi_Up();
			return a2h.linkify(txt);
		},

		ansi_to_html : (txt, options) => {
			var a2h = new Ansi_Up();
			return a2h.ansi_to_html(txt, options);
		},

		ansi_to_text : (txt) => {
			var a2h = new Ansi_Up();
			return a2h.ansi_to_text(txt);
		},

		ansi_to_html_obj : () => {
			return new Ansi_Up();
		}
	};

	/*global ender:false */
	if (typeof window !== 'undefined'
	&&  typeof ender  === 'undefined') {
		window.ansi_up = ansi_up;
	}

	/*global define:false */
	if (typeof define === 'function'
	&&  define.amd) {
		define('ansi_up', [], () => {
			return ansi_up;
		});
	}
})(Date);
