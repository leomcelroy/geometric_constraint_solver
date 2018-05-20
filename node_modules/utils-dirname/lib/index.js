'use strict';

// MODULES //

var isString = require( 'validate.io-string-primitive' ),
	re = require( 'regex-dirname' );


// DIRNAME //

/**
* FUNCTION: dirname( path )
*	Returns a path dirname.
*
* @param {String} path - path
* @returns {String} directory name
*/
function dirname( path ) {
	if ( !isString( path ) ) {
		throw new TypeError( 'invalid input argument. Path must be a primitive string. Value: `' + path + '`.' );
	}
	return re.exec( path )[ 1 ];
} // end FUNCTION dirname()


// EXPORTS //

module.exports = dirname;
