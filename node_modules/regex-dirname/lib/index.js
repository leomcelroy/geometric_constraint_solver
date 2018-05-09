'use strict';

// MODULES //

var isWindows = require( 'check-if-windows' );


// REGEX //

var posix,
	win32,
	re;

posix = require( 'regex-dirname-posix' );
win32 = require( 'regex-dirname-windows' );

if ( isWindows ) {
	re = win32;
} else {
	re = posix;
}


// EXPORTS //

module.exports = re;
module.exports.posix = posix;
module.exports.win32 = win32;
