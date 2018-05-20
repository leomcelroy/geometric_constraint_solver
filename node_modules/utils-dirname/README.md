dirname
===
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][codecov-image]][codecov-url] [![Dependencies][dependencies-image]][dependencies-url]

> Returns a [directory name](https://en.wikipedia.org/wiki/Dirname).


## Installation

``` bash
$ npm install utils-dirname
```


## Usage

``` javascript
var dirname = require( 'utils-dirname' );
```

#### dirname( path )

Returns a [directory name](https://en.wikipedia.org/wiki/Dirname).

``` javascript
var dir = dirname( './foo/bar/index.js' );
// returns './foo/bar'
```


## Examples

``` javascript
var fs = require( 'fs' ),
	path = require( 'path' ),
	dirname = require( 'utils-dirname' );

var files,
	fpath,
	base,
	stat,
	dir,
	i;

base = path.resolve( __dirname, '..' );
files = fs.readdirSync( base );

for ( i = 0; i < files.length; i++ ) {
	fpath = path.join( base, files[ i ] );
	stat = fs.statSync( fpath );
	if ( !stat.isDirectory() ) {
		dir = dirname( fpath );
		console.log( '%s --> %s', fpath, dir );
	}
}
```

To run the example code from the top-level application directory,

``` bash
$ node ./examples/index.js
```


## Tests

### Unit

Unit tests use the [Mocha](http://mochajs.org/) test framework with [Chai](http://chaijs.com) assertions. To run the tests, execute the following command in the top-level application directory:

``` bash
$ make test
```

All new feature development should have corresponding unit tests to validate correct functionality.


### Test Coverage

This repository uses [Istanbul](https://github.com/gotwarlost/istanbul) as its code coverage tool. To generate a test coverage report, execute the following command in the top-level application directory:

``` bash
$ make test-cov
```

Istanbul creates a `./reports/coverage` directory. To access an HTML version of the report,

``` bash
$ make view-cov
```


---
## License

[MIT license](http://opensource.org/licenses/MIT).


## Copyright

Copyright &copy; 2015. Athan Reines.


[npm-image]: http://img.shields.io/npm/v/utils-dirname.svg
[npm-url]: https://npmjs.org/package/utils-dirname

[travis-image]: http://img.shields.io/travis/kgryte/utils-dirname/master.svg
[travis-url]: https://travis-ci.org/kgryte/utils-dirname

[codecov-image]: https://img.shields.io/codecov/c/github/kgryte/utils-dirname/master.svg
[codecov-url]: https://codecov.io/github/kgryte/utils-dirname?branch=master

[dependencies-image]: http://img.shields.io/david/kgryte/utils-dirname.svg
[dependencies-url]: https://david-dm.org/kgryte/utils-dirname

[dev-dependencies-image]: http://img.shields.io/david/dev/kgryte/utils-dirname.svg
[dev-dependencies-url]: https://david-dm.org/dev/kgryte/utils-dirname

[github-issues-image]: http://img.shields.io/github/issues/kgryte/utils-dirname.svg
[github-issues-url]: https://github.com/kgryte/utils-dirname/issues
