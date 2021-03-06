/**
 * Saddle.js
 * 
 * This file contains the saddle class which is just an object that we can 
 * create that will in turn watch a wiki's activity and then distribute what it
 * collects through the predefined transports.
 * 
 * In theory a saddle can handle any wiki and can be easily shutdown and
 * restarted without too much hassel. The saddle can load and unload
 * transports through a predefined API that they must expose and can then
 * be shutdown in the same way.
 * 
 * Saddles must handle their own errors and must never let an exception through
 * to the PonyQ layer. If a critical error is reached in a transport it must
 * kill it and then attempt to restart it. If this does not work then the
 * transport must be killed off for good, the other active transports must be
 * closed, and the saddle must return a 300 error to the PonyQ layer.
 */

let fs = require('fs'),
	ps = require('path');

class Saddle {
	/**
	 * constructor
	 * 
	 * @param { String } [wiki] - wiki name to watch 
	 * @param { Array<Object> } [transports] - array of transports to start
	 * @param { Object<Logger> } [logger] - instance of the logger class 
	 */
	constructor (wiki, transports, logger) {
		this._uid = '';
		this._logger = logger;
		this._wiki = wiki;
		this._transports = {};

		// Register each transport
		transports.forEach(
			function (transport) {
				this.registerTransport(transport);
			}.bind(this)
		);
	}

	start () {
		this._logger.success('startedSaddle', [ this._uid ]);
	}

	/**
	 * genUID
	 * 
	 * Generates a unique ID for the saddle
	 * 
	 * @return { String } 5 letter UID
	 */
	genUID () {
		return Math.random().toString(36).substr(2, 5).toUpperCase();
	}

	/**
	 * setUID
	 * 
	 * Sets a unique ID for the saddle
	 * 
	 * @param { String } [uid] - the saddle's UID 
	 */
	setUID (uid) {
		this._uid = uid;
	}

	/**
	 * registerTransport
	 * 
	 * Finds, loads, and initializes transports
	 * 
	 * @param { Object } [transport] - Config of the transport to load 
	 */
	registerTransport (transport) {
		let transportFile = ps.resolve(__dirname, `../transports/${transport.name}.js`);

		if (fs.existsSync(transportFile)) {
			this._transports[transport.name] = new (require(transportFile))(transport.config);
			this._logger.success('registerPlugin', [ transport.name ]);
		} else {
			this._logger.error('noPlugin', [ transportFile ]);
		}
	}
}

module.exports = Saddle;
