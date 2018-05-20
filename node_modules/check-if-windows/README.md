Is Windows
===
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][codecov-image]][codecov-url] [![Dependencies][dependencies-image]][dependencies-url]

> Returns a boolean indicating if the current process is running on Windows.


## Installation

``` bash
$ npm install check-if-windows
```


## Usage

``` javascript
var isWindows = require( 'check-if-windows' );
```

#### isWindows

`Boolean` indicating if the current process is running on Windows.

``` javascript
console.log( isWindows );
// returns <boolean>
```


## Examples

``` javascript
var isWindows = require( 'check-if-windows' );

if ( isWindows ) {
	console.log( 'Running on Windows...' );
} else {
	console.log( 'Running on %s...', process.platform );
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


[npm-image]: http://img.shields.io/npm/v/check-if-windows.svg
[npm-url]: https://npmjs.org/package/check-if-windows

[travis-image]: http://img.shields.io/travis/kgryte/node-check-if-windows/master.svg
[travis-url]: https://travis-ci.org/kgryte/node-check-if-windows

[codecov-image]: https://img.shields.io/codecov/c/github/kgryte/node-check-if-windows/master.svg
[codecov-url]: https://codecov.io/github/kgryte/node-check-if-windows?branch=master

[dependencies-image]: http://img.shields.io/david/kgryte/node-check-if-windows.svg
[dependencies-url]: https://david-dm.org/kgryte/node-check-if-windows

[dev-dependencies-image]: http://img.shields.io/david/dev/kgryte/node-check-if-windows.svg
[dev-dependencies-url]: https://david-dm.org/dev/kgryte/node-check-if-windows

[github-issues-image]: http://img.shields.io/github/issues/kgryte/node-check-if-windows.svg
[github-issues-url]: https://github.com/kgryte/node-check-if-windows/issues
