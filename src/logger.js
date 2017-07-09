/**
 * logger.js
 * 
 * This class is fairly simple in that it provides a simple interface
 * through which colored console messages can be sent.
 */

let colors = require('colors'),
	format = require('string-template');

class Logger {
	/**
	 * constructor
	 * 
	 * Sets the instance verbosity and loads messages from a file
	 * 
	 * @param { Boolean } [verbose] - Whether or not to enable verbose output 
	 */
	constructor (verbose) {
		this._verbose = !verbose;
		this._messages = require('../messages.json');
	}

	/**
	 * _render
	 * 
	 * Handles the rendering and logging of templates
	 * 
	 * @param { String } [type] - Type of message to render 
	 * @param { String } [template] - Template to render 
	 * @param { Array<String> } [args] - Template parameters 
	 */
	_render (type, template, args) {
		if (this._verbose) return;

		let msg = format(this._messages[type][template], args),
			clr = type === 'success' ? 'green' : type === 'warning' ? 'yellow' : 'red';

		console.log(`[${type.toUpperCase()}] ${msg}`[clr]);
	}

	/**
	 * error
	 * 
	 * Renders an error message as red in the console
	 * 
	 * @param { String } [template] - Name of the template to render
	 * @param { Array<String> } [args] - Array of template parameters 
	 */
	error (template, args) {
		if (this._messages.error.hasOwnProperty(template)) {
			this._render('error', template, args);
		} else {
			this._render('error', 'noTemplate', [ template ]);
		}
	}

	/**
	 * warn
	 * 
	 * Renders a warning message as yellow in the console
	 * 
	 * @param { String } [template] - Name of the template to render
	 * @param { Array<String> } [args] - Array of template parameters 
	 */
	warn (template, args) {
		if (this._messages.warning.hasOwnProperty(template)) {
			this._render('warning', template, args);
		} else {
			this._render('error', 'noTemplate', [ template ]);
		}
	}

	/**
	 * success
	 * 
	 * Renders a success message as green in the console
	 * 
	 * @param { String } [template] - Name of the template to render
	 * @param { Array<String> } [args] - Array of template parameters 
	 */
	success (template, args) {
		if (this._messages.success.hasOwnProperty(template)) {
			this._render('success', template, args);
		} else {
			this._render('error', 'noTemplate', [ template ]);
		}
	}
}

module.exports = Logger;
