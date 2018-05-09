'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = codegen;

var _shiftCodegen = require('shift-codegen');

var _shiftCodegen2 = _interopRequireDefault(_shiftCodegen);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function codegen(modTerm) {
  return {
    code: (0, _shiftCodegen2.default)(modTerm, new _shiftCodegen.FormattedCodeGen())
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb2RlZ2VuLmpzIl0sIm5hbWVzIjpbImNvZGVnZW4iLCJtb2RUZXJtIiwiY29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7a0JBRXdCQSxPOztBQUZ4Qjs7Ozs7O0FBRWUsU0FBU0EsT0FBVCxDQUFpQkMsT0FBakIsRUFBMEI7QUFDdkMsU0FBTztBQUNMQyxVQUFNLDRCQUFhRCxPQUFiLEVBQXNCLG9DQUF0QjtBQURELEdBQVA7QUFHRCIsImZpbGUiOiJjb2RlZ2VuLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHNoaWZ0Q29kZWdlbiwgeyBGb3JtYXR0ZWRDb2RlR2VuIH0gZnJvbSAnc2hpZnQtY29kZWdlbic7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNvZGVnZW4obW9kVGVybSkge1xuICByZXR1cm4ge1xuICAgIGNvZGU6IHNoaWZ0Q29kZWdlbihtb2RUZXJtLCBuZXcgRm9ybWF0dGVkQ29kZUdlbigpKSxcbiAgfTtcbn1cbiJdfQ==