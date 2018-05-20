dirname
===
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][codecov-image]][codecov-url] [![Dependencies][dependencies-image]][dependencies-url]

> [Regular expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) to capture a path [dirname](https://en.wikipedia.org/wiki/Dirname).


## Installation

``` bash
$ npm install regex-dirname
```


## Usage

``` javascript
var re = require( 'regex-dirname' );
```

#### re

[Regular expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) to capture a path [dirname](https://en.wikipedia.org/wiki/Dirname). 

``` javascript
var dir;

// On a POSIX platform...
dir = re.exec( '/foo/bar/index.js' )[ 1 ];
// returns '/foo/bar'

// On a Windows platform...
dir = re.exec( 'C:\\foo\\bar\\index.js' )[ 1 ];
// returns 'C:\\foo\\bar'
```


#### re.posix

[Regular expression](https://github.com/kgryte/regex-dirname-posix) to capture a [POSIX](https://en.wikipedia.org/wiki/POSIX) path dirname.


#### re.win32

[Regular expression](https://github.com/kgryte/regex-dirname-windows) to capture a Windows path dirname.



## Notes

*	 The main exported [regular expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) is [platform](https://github.com/kgryte/node-check-if-windows)-dependent. If the current process is running on Windows, `re === re.win32`; otherwise, `re === re.posix`.


## Examples

``` javascript
var re = require( 'regex-dirname' );

var dir;

// Assuming a POSIX platform...
dir = re.exec( '/foo/bar/index.js' )[ 1 ];
console.log( dir );
// returns '/foo/bar'

dir = re.posix.exec( '/foo/bar/home.html' )[ 1 ];
console.log( dir );
// returns '/foo/bar'

dir = re.win32.exec( 'C:\\foo\\bar\\home.html' )[ 1 ];
console.log( dir );
// returns 'C:\\foo\\bar'
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


[npm-image]: http://img.shields.io/npm/v/regex-dirname.svg
[npm-url]: https://npmjs.org/package/regex-dirname

[travis-image]: http://img.shields.io/travis/kgryte/regex-dirname/master.svg
[travis-url]: https://travis-ci.org/kgryte/regex-dirname

[codecov-image]: https://img.shields.io/codecov/c/github/kgryte/regex-dirname/master.svg
[codecov-url]: https://codecov.io/github/kgryte/regex-dirname?branch=master

[dependencies-image]: http://img.shields.io/david/kgryte/regex-dirname.svg
[dependencies-url]: https://david-dm.org/kgryte/regex-dirname

[dev-dependencies-image]: http://img.shields.io/david/dev/kgryte/regex-dirname.svg
[dev-dependencies-url]: https://david-dm.org/dev/kgryte/regex-dirname

[github-issues-image]: http://img.shields.io/github/issues/kgryte/regex-dirname.svg
[github-issues-url]: https://github.com/kgryte/regex-dirname/issues
