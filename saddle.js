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

const fs = require( 'fs' );

class Saddle {
	constructor ( wiki, transports, logger ) {
		this._logger = logger;
		this._wiki = wiki;
		this._transports = {};

		// Register each transport
		transports.forEach( function ( transport ) {
			this.registerTransport( transport );
		} );
	}

	registerTransport ( transport ) {
		if ( fs.existsSync( `./transports/${ transport }.js` ) ) {
			
		} else {

		}
	}
}
