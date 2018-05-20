'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = resolveModule;

var _resolve = require('resolve');

var _resolve2 = _interopRequireDefault(_resolve);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function resolveModule(path, cwd) {
  return _resolve2.default.sync(path, { basedir: cwd });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9ub2RlLW1vZHVsZS1yZXNvbHZlci5qcyJdLCJuYW1lcyI6WyJyZXNvbHZlTW9kdWxlIiwicGF0aCIsImN3ZCIsInN5bmMiLCJiYXNlZGlyIl0sIm1hcHBpbmdzIjoiOzs7OztrQkFFd0JBLGE7O0FBRnhCOzs7Ozs7QUFFZSxTQUFTQSxhQUFULENBQXVCQyxJQUF2QixFQUE2QkMsR0FBN0IsRUFBa0M7QUFDL0MsU0FBTyxrQkFBUUMsSUFBUixDQUFhRixJQUFiLEVBQW1CLEVBQUVHLFNBQVNGLEdBQVgsRUFBbkIsQ0FBUDtBQUNEIiwiZmlsZSI6Im5vZGUtbW9kdWxlLXJlc29sdmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHJlc29sdmUgZnJvbSAncmVzb2x2ZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJlc29sdmVNb2R1bGUocGF0aCwgY3dkKSB7XG4gIHJldHVybiByZXNvbHZlLnN5bmMocGF0aCwgeyBiYXNlZGlyOiBjd2QgfSk7XG59XG4iXX0=