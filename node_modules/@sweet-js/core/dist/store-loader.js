'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _sweetLoader = require('./sweet-loader');

var _sweetLoader2 = _interopRequireDefault(_sweetLoader);

var _vm = require('vm');

var _vm2 = _interopRequireDefault(_vm);

var _store = require('./store');

var _store2 = _interopRequireDefault(_store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = class extends _sweetLoader2.default {

  constructor(baseDir, store, noBabel = false) {
    super(baseDir, { noBabel });
    this.store = store;
  }

  fetch({ name, address }) {
    if (this.store.has(address.path)) {
      return this.store.get(address.path);
    }
    throw new Error(`The module ${name} is not in the debug store: addr.path is ${address.path}`);
  }

  freshStore() {
    return new _store2.default(_vm2.default.createContext());
  }

  eval(source, store) {
    return _vm2.default.runInContext(source, store.getBackingObject());
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zdG9yZS1sb2FkZXIuanMiXSwibmFtZXMiOlsiY29uc3RydWN0b3IiLCJiYXNlRGlyIiwic3RvcmUiLCJub0JhYmVsIiwiZmV0Y2giLCJuYW1lIiwiYWRkcmVzcyIsImhhcyIsInBhdGgiLCJnZXQiLCJFcnJvciIsImZyZXNoU3RvcmUiLCJjcmVhdGVDb250ZXh0IiwiZXZhbCIsInNvdXJjZSIsInJ1bkluQ29udGV4dCIsImdldEJhY2tpbmdPYmplY3QiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O2tCQUVlLG9DQUEwQjs7QUFHdkNBLGNBQ0VDLE9BREYsRUFFRUMsS0FGRixFQUdFQyxVQUFtQixLQUhyQixFQUlFO0FBQ0EsVUFBTUYsT0FBTixFQUFlLEVBQUVFLE9BQUYsRUFBZjtBQUNBLFNBQUtELEtBQUwsR0FBYUEsS0FBYjtBQUNEOztBQUVERSxRQUFNLEVBQUVDLElBQUYsRUFBUUMsT0FBUixFQUFOLEVBQXlEO0FBQ3ZELFFBQUksS0FBS0osS0FBTCxDQUFXSyxHQUFYLENBQWVELFFBQVFFLElBQXZCLENBQUosRUFBa0M7QUFDaEMsYUFBTyxLQUFLTixLQUFMLENBQVdPLEdBQVgsQ0FBZUgsUUFBUUUsSUFBdkIsQ0FBUDtBQUNEO0FBQ0QsVUFBTSxJQUFJRSxLQUFKLENBQ0gsY0FBYUwsSUFBSyw0Q0FBMkNDLFFBQVFFLElBQUssRUFEdkUsQ0FBTjtBQUdEOztBQUVERyxlQUFhO0FBQ1gsV0FBTyxvQkFBVSxhQUFHQyxhQUFILEVBQVYsQ0FBUDtBQUNEOztBQUVEQyxPQUFLQyxNQUFMLEVBQXFCWixLQUFyQixFQUFtQztBQUNqQyxXQUFPLGFBQUdhLFlBQUgsQ0FBZ0JELE1BQWhCLEVBQXdCWixNQUFNYyxnQkFBTixFQUF4QixDQUFQO0FBQ0Q7QUEzQnNDLEMiLCJmaWxlIjoic3RvcmUtbG9hZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcbmltcG9ydCBTd2VldExvYWRlciBmcm9tICcuL3N3ZWV0LWxvYWRlcic7XG5pbXBvcnQgdm0gZnJvbSAndm0nO1xuaW1wb3J0IFN0b3JlIGZyb20gJy4vc3RvcmUnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBleHRlbmRzIFN3ZWV0TG9hZGVyIHtcbiAgc3RvcmU6IE1hcDxzdHJpbmcsIHN0cmluZz47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgYmFzZURpcjogc3RyaW5nLFxuICAgIHN0b3JlOiBNYXA8c3RyaW5nLCBzdHJpbmc+LFxuICAgIG5vQmFiZWw6IGJvb2xlYW4gPSBmYWxzZSxcbiAgKSB7XG4gICAgc3VwZXIoYmFzZURpciwgeyBub0JhYmVsIH0pO1xuICAgIHRoaXMuc3RvcmUgPSBzdG9yZTtcbiAgfVxuXG4gIGZldGNoKHsgbmFtZSwgYWRkcmVzcyB9OiB7IG5hbWU6IHN0cmluZywgYWRkcmVzczogYW55IH0pIHtcbiAgICBpZiAodGhpcy5zdG9yZS5oYXMoYWRkcmVzcy5wYXRoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuc3RvcmUuZ2V0KGFkZHJlc3MucGF0aCk7XG4gICAgfVxuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGBUaGUgbW9kdWxlICR7bmFtZX0gaXMgbm90IGluIHRoZSBkZWJ1ZyBzdG9yZTogYWRkci5wYXRoIGlzICR7YWRkcmVzcy5wYXRofWAsXG4gICAgKTtcbiAgfVxuXG4gIGZyZXNoU3RvcmUoKSB7XG4gICAgcmV0dXJuIG5ldyBTdG9yZSh2bS5jcmVhdGVDb250ZXh0KCkpO1xuICB9XG5cbiAgZXZhbChzb3VyY2U6IHN0cmluZywgc3RvcmU6IFN0b3JlKSB7XG4gICAgcmV0dXJuIHZtLnJ1bkluQ29udGV4dChzb3VyY2UsIHN0b3JlLmdldEJhY2tpbmdPYmplY3QoKSk7XG4gIH1cbn1cbiJdfQ==