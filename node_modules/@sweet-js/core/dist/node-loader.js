'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _sweetLoader = require('./sweet-loader');

var _sweetLoader2 = _interopRequireDefault(_sweetLoader);

var _fs = require('fs');

var _path = require('path');

var _resolve = require('resolve');

var _resolve2 = _interopRequireDefault(_resolve);

var _vm = require('vm');

var _vm2 = _interopRequireDefault(_vm);

var _store = require('./store');

var _store2 = _interopRequireDefault(_store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class NodeLoader extends _sweetLoader2.default {

  constructor(baseDir, options = {}) {
    super(baseDir, options);
    this.extensions = options.extensions || ['.js', '.mjs'];
  }

  normalize(name, refererName, refererAddress) {
    let normName = super.normalize(name, refererName, refererAddress);
    let match = normName.match(_sweetLoader.phaseInModulePathRegexp);
    if (match && match.length >= 3) {
      let resolvedName = match[1];
      try {
        resolvedName = _resolve2.default.sync(match[1], {
          basedir: refererName ? (0, _path.dirname)(refererName) : this.baseDir,
          extensions: this.extensions
        });
      } catch (e) {
        // ignored
      }
      return `${resolvedName}:${match[2]}`;
    }
    throw new Error(`Module ${name} is missing phase information`);
  }

  fetch({
    name,
    address,
    metadata
  }) {
    let src = this.sourceCache.get(address.path);
    if (src != null) {
      return src;
    } else {
      try {
        src = (0, _fs.readFileSync)(address.path, 'utf8');
      } catch (e) {
        src = '';
      }
      this.sourceCache.set(address.path, src);
      return src;
    }
  }

  freshStore() {
    let sandbox = {
      process: global.process,
      console: global.console
    };
    return new _store2.default(_vm2.default.createContext(sandbox));
  }

  eval(source, store) {
    return _vm2.default.runInContext(source, store.getBackingObject());
  }
}
exports.default = NodeLoader;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9ub2RlLWxvYWRlci5qcyJdLCJuYW1lcyI6WyJOb2RlTG9hZGVyIiwiY29uc3RydWN0b3IiLCJiYXNlRGlyIiwib3B0aW9ucyIsImV4dGVuc2lvbnMiLCJub3JtYWxpemUiLCJuYW1lIiwicmVmZXJlck5hbWUiLCJyZWZlcmVyQWRkcmVzcyIsIm5vcm1OYW1lIiwibWF0Y2giLCJsZW5ndGgiLCJyZXNvbHZlZE5hbWUiLCJzeW5jIiwiYmFzZWRpciIsImUiLCJFcnJvciIsImZldGNoIiwiYWRkcmVzcyIsIm1ldGFkYXRhIiwic3JjIiwic291cmNlQ2FjaGUiLCJnZXQiLCJwYXRoIiwic2V0IiwiZnJlc2hTdG9yZSIsInNhbmRib3giLCJwcm9jZXNzIiwiZ2xvYmFsIiwiY29uc29sZSIsImNyZWF0ZUNvbnRleHQiLCJldmFsIiwic291cmNlIiwic3RvcmUiLCJydW5JbkNvbnRleHQiLCJnZXRCYWNraW5nT2JqZWN0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQTs7OztBQUNBOztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBS2UsTUFBTUEsVUFBTiwrQkFBcUM7O0FBR2xEQyxjQUFZQyxPQUFaLEVBQTZCQyxVQUE2QixFQUExRCxFQUE4RDtBQUM1RCxVQUFNRCxPQUFOLEVBQWVDLE9BQWY7QUFDQSxTQUFLQyxVQUFMLEdBQWtCRCxRQUFRQyxVQUFSLElBQXNCLENBQUMsS0FBRCxFQUFRLE1BQVIsQ0FBeEM7QUFDRDs7QUFFREMsWUFBVUMsSUFBVixFQUF3QkMsV0FBeEIsRUFBOENDLGNBQTlDLEVBQXVFO0FBQ3JFLFFBQUlDLFdBQVcsTUFBTUosU0FBTixDQUFnQkMsSUFBaEIsRUFBc0JDLFdBQXRCLEVBQW1DQyxjQUFuQyxDQUFmO0FBQ0EsUUFBSUUsUUFBUUQsU0FBU0MsS0FBVCxzQ0FBWjtBQUNBLFFBQUlBLFNBQVNBLE1BQU1DLE1BQU4sSUFBZ0IsQ0FBN0IsRUFBZ0M7QUFDOUIsVUFBSUMsZUFBZUYsTUFBTSxDQUFOLENBQW5CO0FBQ0EsVUFBSTtBQUNGRSx1QkFBZSxrQkFBUUMsSUFBUixDQUFhSCxNQUFNLENBQU4sQ0FBYixFQUF1QjtBQUNwQ0ksbUJBQVNQLGNBQWMsbUJBQVFBLFdBQVIsQ0FBZCxHQUFxQyxLQUFLTCxPQURmO0FBRXBDRSxzQkFBWSxLQUFLQTtBQUZtQixTQUF2QixDQUFmO0FBSUQsT0FMRCxDQUtFLE9BQU9XLENBQVAsRUFBVTtBQUNWO0FBQ0Q7QUFDRCxhQUFRLEdBQUVILFlBQWEsSUFBR0YsTUFBTSxDQUFOLENBQVMsRUFBbkM7QUFDRDtBQUNELFVBQU0sSUFBSU0sS0FBSixDQUFXLFVBQVNWLElBQUssK0JBQXpCLENBQU47QUFDRDs7QUFFRFcsUUFBTTtBQUNKWCxRQURJO0FBRUpZLFdBRkk7QUFHSkM7QUFISSxHQUFOLEVBUUc7QUFDRCxRQUFJQyxNQUFNLEtBQUtDLFdBQUwsQ0FBaUJDLEdBQWpCLENBQXFCSixRQUFRSyxJQUE3QixDQUFWO0FBQ0EsUUFBSUgsT0FBTyxJQUFYLEVBQWlCO0FBQ2YsYUFBT0EsR0FBUDtBQUNELEtBRkQsTUFFTztBQUNMLFVBQUk7QUFDRkEsY0FBTSxzQkFBYUYsUUFBUUssSUFBckIsRUFBMkIsTUFBM0IsQ0FBTjtBQUNELE9BRkQsQ0FFRSxPQUFPUixDQUFQLEVBQVU7QUFDVkssY0FBTSxFQUFOO0FBQ0Q7QUFDRCxXQUFLQyxXQUFMLENBQWlCRyxHQUFqQixDQUFxQk4sUUFBUUssSUFBN0IsRUFBbUNILEdBQW5DO0FBQ0EsYUFBT0EsR0FBUDtBQUNEO0FBQ0Y7O0FBRURLLGVBQWE7QUFDWCxRQUFJQyxVQUFVO0FBQ1pDLGVBQVNDLE9BQU9ELE9BREo7QUFFWkUsZUFBU0QsT0FBT0M7QUFGSixLQUFkO0FBSUEsV0FBTyxvQkFBVSxhQUFHQyxhQUFILENBQWlCSixPQUFqQixDQUFWLENBQVA7QUFDRDs7QUFFREssT0FBS0MsTUFBTCxFQUFxQkMsS0FBckIsRUFBbUM7QUFDakMsV0FBTyxhQUFHQyxZQUFILENBQWdCRixNQUFoQixFQUF3QkMsTUFBTUUsZ0JBQU4sRUFBeEIsQ0FBUDtBQUNEO0FBM0RpRDtrQkFBL0JuQyxVIiwiZmlsZSI6Im5vZGUtbG9hZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcbmltcG9ydCBTd2VldExvYWRlciwgeyBwaGFzZUluTW9kdWxlUGF0aFJlZ2V4cCB9IGZyb20gJy4vc3dlZXQtbG9hZGVyJztcbmltcG9ydCB7IHJlYWRGaWxlU3luYyB9IGZyb20gJ2ZzJztcbmltcG9ydCB7IGRpcm5hbWUgfSBmcm9tICdwYXRoJztcbmltcG9ydCByZXNvbHZlIGZyb20gJ3Jlc29sdmUnO1xuaW1wb3J0IHZtIGZyb20gJ3ZtJztcbmltcG9ydCBTdG9yZSBmcm9tICcuL3N0b3JlJztcbmltcG9ydCB0eXBlIHsgTG9hZGVyT3B0aW9ucyB9IGZyb20gJy4vc3dlZXQtbG9hZGVyJztcblxudHlwZSBOb2RlTG9hZGVyT3B0aW9ucyA9IExvYWRlck9wdGlvbnMgJiB7IGV4dGVuc2lvbnM/OiBBcnJheTxzdHJpbmc+IH07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE5vZGVMb2FkZXIgZXh0ZW5kcyBTd2VldExvYWRlciB7XG4gIGV4dGVuc2lvbnM6IEFycmF5PHN0cmluZz47XG5cbiAgY29uc3RydWN0b3IoYmFzZURpcjogc3RyaW5nLCBvcHRpb25zOiBOb2RlTG9hZGVyT3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoYmFzZURpciwgb3B0aW9ucyk7XG4gICAgdGhpcy5leHRlbnNpb25zID0gb3B0aW9ucy5leHRlbnNpb25zIHx8IFsnLmpzJywgJy5tanMnXTtcbiAgfVxuXG4gIG5vcm1hbGl6ZShuYW1lOiBzdHJpbmcsIHJlZmVyZXJOYW1lPzogc3RyaW5nLCByZWZlcmVyQWRkcmVzcz86IHN0cmluZykge1xuICAgIGxldCBub3JtTmFtZSA9IHN1cGVyLm5vcm1hbGl6ZShuYW1lLCByZWZlcmVyTmFtZSwgcmVmZXJlckFkZHJlc3MpO1xuICAgIGxldCBtYXRjaCA9IG5vcm1OYW1lLm1hdGNoKHBoYXNlSW5Nb2R1bGVQYXRoUmVnZXhwKTtcbiAgICBpZiAobWF0Y2ggJiYgbWF0Y2gubGVuZ3RoID49IDMpIHtcbiAgICAgIGxldCByZXNvbHZlZE5hbWUgPSBtYXRjaFsxXTtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJlc29sdmVkTmFtZSA9IHJlc29sdmUuc3luYyhtYXRjaFsxXSwge1xuICAgICAgICAgIGJhc2VkaXI6IHJlZmVyZXJOYW1lID8gZGlybmFtZShyZWZlcmVyTmFtZSkgOiB0aGlzLmJhc2VEaXIsXG4gICAgICAgICAgZXh0ZW5zaW9uczogdGhpcy5leHRlbnNpb25zLFxuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gaWdub3JlZFxuICAgICAgfVxuICAgICAgcmV0dXJuIGAke3Jlc29sdmVkTmFtZX06JHttYXRjaFsyXX1gO1xuICAgIH1cbiAgICB0aHJvdyBuZXcgRXJyb3IoYE1vZHVsZSAke25hbWV9IGlzIG1pc3NpbmcgcGhhc2UgaW5mb3JtYXRpb25gKTtcbiAgfVxuXG4gIGZldGNoKHtcbiAgICBuYW1lLFxuICAgIGFkZHJlc3MsXG4gICAgbWV0YWRhdGEsXG4gIH06IHtcbiAgICBuYW1lOiBzdHJpbmcsXG4gICAgYWRkcmVzczogeyBwYXRoOiBzdHJpbmcsIHBoYXNlOiBudW1iZXIgfSxcbiAgICBtZXRhZGF0YToge30sXG4gIH0pIHtcbiAgICBsZXQgc3JjID0gdGhpcy5zb3VyY2VDYWNoZS5nZXQoYWRkcmVzcy5wYXRoKTtcbiAgICBpZiAoc3JjICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBzcmM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHNyYyA9IHJlYWRGaWxlU3luYyhhZGRyZXNzLnBhdGgsICd1dGY4Jyk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHNyYyA9ICcnO1xuICAgICAgfVxuICAgICAgdGhpcy5zb3VyY2VDYWNoZS5zZXQoYWRkcmVzcy5wYXRoLCBzcmMpO1xuICAgICAgcmV0dXJuIHNyYztcbiAgICB9XG4gIH1cblxuICBmcmVzaFN0b3JlKCkge1xuICAgIGxldCBzYW5kYm94ID0ge1xuICAgICAgcHJvY2VzczogZ2xvYmFsLnByb2Nlc3MsXG4gICAgICBjb25zb2xlOiBnbG9iYWwuY29uc29sZSxcbiAgICB9O1xuICAgIHJldHVybiBuZXcgU3RvcmUodm0uY3JlYXRlQ29udGV4dChzYW5kYm94KSk7XG4gIH1cblxuICBldmFsKHNvdXJjZTogc3RyaW5nLCBzdG9yZTogU3RvcmUpIHtcbiAgICByZXR1cm4gdm0ucnVuSW5Db250ZXh0KHNvdXJjZSwgc3RvcmUuZ2V0QmFja2luZ09iamVjdCgpKTtcbiAgfVxufVxuIl19