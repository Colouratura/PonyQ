const fs = require( 'fs' ),
      commander = require( 'commander' ),
      Logger = require( './logger.js' );

// This is meta information from package.json
const program = require( './package.json' );

/**
 * Set up our command-line options
 * 
 * [-d] With this flag set the program will not log to transports
 * [-c] Specifies an alternative config file [default: config.json]
 */
commander.version( program.version )
         .option( '-v, --verbose', 'Will show errors and warnings in the console')
         .option( '-d, --dry-run', 'Will not send results to transports' )
         .option( '--config [value]', 'Specify a config file' )
         .parse( process.argv );

/**
 * init
 * 
 * Initializes the PonyQ process that proceeds to load and configure
 * the transports.
 */
const init = function () {
	let dry = commander.dry,
	    config = {};
	
	// Fallback to config should there not have been one supplied
	let configFile = ( commander.config !== undefined ) 
		? commander.config
		: program.config.config;
	
	// Instantiate logger
	const logger = new Logger( commander.verbose );

	// Load the config
	if ( fs.existsSync( configFile ) ) {
		config = require( `./${ configFile }` );
		logger.success( 'loadedConfig', [ configFile ] );
	} else {
		logger.warn( 'noSuppliedConfig', [ configFile, program.config.config ] );

		try {
			config = require( `./${ program.config.config }` );
			logger.success( 'loadedConfig', [ program.config.config ] );
		} catch ( e ) {
			logger.error( 'noConfig', [ program.config.config ] );
			return;
		}
	}
};

init();