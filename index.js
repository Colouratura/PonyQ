let fs = require('fs'),
	commander = require('commander'),
	Logger = require('./src/logger.js'),
	Saddle = require('./src/saddle.js');

// This is meta information from package.json
const program = require('./package.json');

let SADDLES = {},
	LOGGER = {};

/**
 * Set up our command-line options
 * 
 * [-d] With this flag set the program will not log to transports
 * [-c] Specifies an alternative config file [default: config.json]
 */
commander
	.version(program.version)
	.option('-v, --verbose', 'Will show errors and warnings in the console')
	.option('-d, --dry-run', 'Will not send results to transports')
	.option('--config [value]', 'Specify a config file')
	.parse(process.argv);

/**
 * removeSaddle
 * 
 * Removes a saddle from operation
 * 
 * @param { String } [uid] - uid of the saddle to remove
 */
const removeSaddle = function (uid) {
	if (SADDLES.hasOwnProperty(uid)) {
		delete SADDLES[uid];
		LOGGER.success('removedSaddle', [ uid ]);
	} else {
		LOGGER.error('noSaddle', [ uid ]);
	}
};

/**
 * getSaddleID
 * 
 * Gets and sets a unique saddle ID
 * 
 * @param { Object<Saddle> } [saddle] - initialized saddle object
 * @return { String } UID
 */
const getSaddleID = function (saddle) {
	let UID = '';

	while (true) {
		let saddleUID = saddle.genUID();

		if (!SADDLES.hasOwnProperty(saddleUID)) {
			LOGGER.success('uniqueID', [ saddleUID ]);
			UID = saddleUID;
			break;
		}
	}

	return UID;
};

/**
 * createSaddle
 * 
 * Creates a saddle
 * 
 * @param { String } [wiki] - wiki name to watch
 * @param { Array<Object> } [transports] - array of transports and their settings
 */
const createSaddle = function (wiki, transports) {
	let saddle = new Saddle(wiki, transports, LOGGER),
		saddleUID = getSaddleID(saddle);

	SADDLES[saddleUID] = saddle;
	saddle.setUID(saddleUID);

	LOGGER.success('createdSaddle', [ wiki, saddle._uid ]);
};

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
	let configFile = commander.config !== undefined ? commander.config : program.config.config;

	// Instantiate logger
	LOGGER = new Logger(commander.verbose);

	// Load the config
	if (fs.existsSync(configFile)) {
		config = require(`./${configFile}`);
		LOGGER.success('loadedConfig', [ configFile ]);
	} else {
		LOGGER.warn('noSuppliedConfig', [ configFile, program.config.config ]);

		try {
			config = require(`./${program.config.config}`);
			LOGGER.success('loadedConfig', [ program.config.config ]);
		} catch (e) {
			LOGGER.error('noConfig', [ program.config.config ]);
			return;
		}
	}

	config.wikis.forEach(function (wiki) {
		createSaddle(wiki.name, wiki.transports);
	});
};

init();
