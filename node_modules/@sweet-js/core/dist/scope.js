'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.freshScope = freshScope;
exports.Scope = Scope;

var _symbol = require('./symbol');

let scopeIndex = 0;
function freshScope(name = 'scope') {
  scopeIndex++;
  return (0, _symbol.Symbol)(name + '_' + scopeIndex);
}

function Scope(name) {
  return (0, _symbol.Symbol)(name);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zY29wZS5qcyJdLCJuYW1lcyI6WyJmcmVzaFNjb3BlIiwiU2NvcGUiLCJzY29wZUluZGV4IiwibmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7UUFLZ0JBLFUsR0FBQUEsVTtRQUtBQyxLLEdBQUFBLEs7O0FBVGhCOztBQUVBLElBQUlDLGFBQWEsQ0FBakI7QUFFTyxTQUFTRixVQUFULENBQW9CRyxPQUFlLE9BQW5DLEVBQTRDO0FBQ2pERDtBQUNBLFNBQU8sb0JBQU9DLE9BQU8sR0FBUCxHQUFhRCxVQUFwQixDQUFQO0FBQ0Q7O0FBRU0sU0FBU0QsS0FBVCxDQUFlRSxJQUFmLEVBQTZCO0FBQ2xDLFNBQU8sb0JBQU9BLElBQVAsQ0FBUDtBQUNEIiwiZmlsZSI6InNjb3BlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcbmltcG9ydCB7IFN5bWJvbCB9IGZyb20gJy4vc3ltYm9sJztcblxubGV0IHNjb3BlSW5kZXggPSAwO1xuXG5leHBvcnQgZnVuY3Rpb24gZnJlc2hTY29wZShuYW1lOiBzdHJpbmcgPSAnc2NvcGUnKSB7XG4gIHNjb3BlSW5kZXgrKztcbiAgcmV0dXJuIFN5bWJvbChuYW1lICsgJ18nICsgc2NvcGVJbmRleCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBTY29wZShuYW1lOiBzdHJpbmcpIHtcbiAgcmV0dXJuIFN5bWJvbChuYW1lKTtcbn1cbiJdfQ==