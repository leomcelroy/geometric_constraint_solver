"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _terms = require("./terms");

var _terms2 = _interopRequireDefault(_terms);

var _shiftReducer = require("shift-reducer");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class MapSyntaxReducer extends _shiftReducer.CloneReducer {
  constructor(fn) {
    super();
    this.fn = fn;
  }

  reduceBindingIdentifier(node) {
    let name = this.fn(node.name);

    return new _terms2.default("BindingIdentifier", {
      name: name
    });
  }

  reduceIdentifierExpression(node) {
    let name = this.fn(node.name);

    return new _terms2.default("IdentifierExpression", {
      name: name
    });
  }
}
exports.default = MapSyntaxReducer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tYXAtc3ludGF4LXJlZHVjZXIuanMiXSwibmFtZXMiOlsiTWFwU3ludGF4UmVkdWNlciIsImNvbnN0cnVjdG9yIiwiZm4iLCJyZWR1Y2VCaW5kaW5nSWRlbnRpZmllciIsIm5vZGUiLCJuYW1lIiwicmVkdWNlSWRlbnRpZmllckV4cHJlc3Npb24iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFFZSxNQUFNQSxnQkFBTixvQ0FBNEM7QUFDekRDLGNBQVlDLEVBQVosRUFBZ0I7QUFDZDtBQUNBLFNBQUtBLEVBQUwsR0FBVUEsRUFBVjtBQUNEOztBQUVEQywwQkFBd0JDLElBQXhCLEVBQThCO0FBQzVCLFFBQUlDLE9BQU8sS0FBS0gsRUFBTCxDQUFRRSxLQUFLQyxJQUFiLENBQVg7O0FBRUEsV0FBTyxvQkFBUyxtQkFBVCxFQUE4QjtBQUNuQ0EsWUFBTUE7QUFENkIsS0FBOUIsQ0FBUDtBQUdEOztBQUVEQyw2QkFBMkJGLElBQTNCLEVBQWlDO0FBQy9CLFFBQUlDLE9BQU8sS0FBS0gsRUFBTCxDQUFRRSxLQUFLQyxJQUFiLENBQVg7O0FBRUEsV0FBTyxvQkFBUyxzQkFBVCxFQUFpQztBQUN0Q0EsWUFBTUE7QUFEZ0MsS0FBakMsQ0FBUDtBQUdEO0FBcEJ3RDtrQkFBdENMLGdCIiwiZmlsZSI6Im1hcC1zeW50YXgtcmVkdWNlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBUZXJtIGZyb20gXCIuL3Rlcm1zXCI7XG5pbXBvcnQgeyBDbG9uZVJlZHVjZXIgfSBmcm9tIFwic2hpZnQtcmVkdWNlclwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNYXBTeW50YXhSZWR1Y2VyIGV4dGVuZHMgQ2xvbmVSZWR1Y2VyIHtcbiAgY29uc3RydWN0b3IoZm4pIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuZm4gPSBmbjtcbiAgfVxuXG4gIHJlZHVjZUJpbmRpbmdJZGVudGlmaWVyKG5vZGUpIHtcbiAgICBsZXQgbmFtZSA9IHRoaXMuZm4obm9kZS5uYW1lKTtcblxuICAgIHJldHVybiBuZXcgVGVybShcIkJpbmRpbmdJZGVudGlmaWVyXCIsIHtcbiAgICAgIG5hbWU6IG5hbWVcbiAgICB9KTtcbiAgfVxuXG4gIHJlZHVjZUlkZW50aWZpZXJFeHByZXNzaW9uKG5vZGUpIHtcbiAgICBsZXQgbmFtZSA9IHRoaXMuZm4obm9kZS5uYW1lKTtcblxuICAgIHJldHVybiBuZXcgVGVybShcIklkZW50aWZpZXJFeHByZXNzaW9uXCIsIHtcbiAgICAgIG5hbWU6IG5hbWVcbiAgICB9KTtcbiAgfVxufVxuIl19