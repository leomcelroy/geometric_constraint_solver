'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = moduleLoader;

var _fs = require('fs');

function moduleLoader(path) {
  try {
    return (0, _fs.readFileSync)(path, 'utf8');
  } catch (e) {
    return '';
  }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9ub2RlLW1vZHVsZS1sb2FkZXIuanMiXSwibmFtZXMiOlsibW9kdWxlTG9hZGVyIiwicGF0aCIsImUiXSwibWFwcGluZ3MiOiI7Ozs7O2tCQUV3QkEsWTs7QUFGeEI7O0FBRWUsU0FBU0EsWUFBVCxDQUFzQkMsSUFBdEIsRUFBNEI7QUFDekMsTUFBSTtBQUNGLFdBQU8sc0JBQWFBLElBQWIsRUFBbUIsTUFBbkIsQ0FBUDtBQUNELEdBRkQsQ0FFRSxPQUFPQyxDQUFQLEVBQVU7QUFDVixXQUFPLEVBQVA7QUFDRDtBQUNGIiwiZmlsZSI6Im5vZGUtbW9kdWxlLWxvYWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHJlYWRGaWxlU3luYyB9IGZyb20gJ2ZzJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbW9kdWxlTG9hZGVyKHBhdGgpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gcmVhZEZpbGVTeW5jKHBhdGgsICd1dGY4Jyk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cbn1cbiJdfQ==