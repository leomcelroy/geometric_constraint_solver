Platform
===
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][codecov-image]][codecov-url] [![Dependencies][dependencies-image]][dependencies-url]

> Returns the platform on which the current process is running.


## Installation

``` bash
$ npm install utils-platform
```


## Usage

``` javascript
var platform = require( 'utils-platform' );
```

#### platform

Alias for [`process.platform`](https://nodejs.org/api/process.html#process_process_platform).

``` javascript
console.log( platform );
```


## Examples

``` javascript
var platform = require( 'utils-platform' );

if ( platform === 'win32' ) {
	console.log( 'Running on a PC...' );
}
else if ( platform === 'darwin' ) {
	console.log( 'Running on a Mac...' );
}
else {
	console.log( 'Running on something else...' );
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


[npm-image]: http://img.shields.io/npm/v/utils-platform.svg
[npm-url]: https://npmjs.org/package/utils-platform

[travis-image]: http://img.shields.io/travis/kgryte/utils-platform/master.svg
[travis-url]: https://travis-ci.org/kgryte/utils-platform

[codecov-image]: https://img.shields.io/codecov/c/github/kgryte/utils-platform/master.svg
[codecov-url]: https://codecov.io/github/kgryte/utils-platform?branch=master

[dependencies-image]: http://img.shields.io/david/kgryte/utils-platform.svg
[dependencies-url]: https://david-dm.org/kgryte/utils-platform

[dev-dependencies-image]: http://img.shields.io/david/dev/kgryte/utils-platform.svg
[dev-dependencies-url]: https://david-dm.org/dev/kgryte/utils-platform

[github-issues-image]: http://img.shields.io/github/issues/kgryte/utils-platform.svg
[github-issues-url]: https://github.com/kgryte/utils-platform/issues
