'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _termExpander = require('./term-expander.js');

var _termExpander2 = _interopRequireDefault(_termExpander);

var _tokenExpander = require('./token-expander');

var _tokenExpander2 = _interopRequireDefault(_tokenExpander);

var _ramda = require('ramda');

var _ = _interopRequireWildcard(_ramda);

var _multimap = require('./multimap');

var _multimap2 = _interopRequireDefault(_multimap);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Compiler {
  constructor(phase, env, store, context) {
    this.phase = phase;
    this.env = env;
    this.store = store;
    this.invokedRegistry = new _multimap2.default();
    this.context = context;
  }

  compile(stxl) {
    let tokenExpander = new _tokenExpander2.default(_.merge(this.context, {
      phase: this.phase,
      env: this.env,
      store: this.store,
      invokedRegistry: this.invokedRegistry
    }));
    let termExpander = new _termExpander2.default(_.merge(this.context, {
      phase: this.phase,
      env: this.env,
      store: this.store,
      invokedRegistry: this.invokedRegistry
    }));

    return tokenExpander.expand(stxl).map(t => termExpander.expand(t));
  }
}
exports.default = Compiler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb21waWxlci5qcyJdLCJuYW1lcyI6WyJfIiwiQ29tcGlsZXIiLCJjb25zdHJ1Y3RvciIsInBoYXNlIiwiZW52Iiwic3RvcmUiLCJjb250ZXh0IiwiaW52b2tlZFJlZ2lzdHJ5IiwiY29tcGlsZSIsInN0eGwiLCJ0b2tlbkV4cGFuZGVyIiwibWVyZ2UiLCJ0ZXJtRXhwYW5kZXIiLCJleHBhbmQiLCJtYXAiLCJ0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7O0lBQVlBLEM7O0FBQ1o7Ozs7Ozs7O0FBRWUsTUFBTUMsUUFBTixDQUFlO0FBQzVCQyxjQUFZQyxLQUFaLEVBQW1CQyxHQUFuQixFQUF3QkMsS0FBeEIsRUFBK0JDLE9BQS9CLEVBQXdDO0FBQ3RDLFNBQUtILEtBQUwsR0FBYUEsS0FBYjtBQUNBLFNBQUtDLEdBQUwsR0FBV0EsR0FBWDtBQUNBLFNBQUtDLEtBQUwsR0FBYUEsS0FBYjtBQUNBLFNBQUtFLGVBQUwsR0FBdUIsd0JBQXZCO0FBQ0EsU0FBS0QsT0FBTCxHQUFlQSxPQUFmO0FBQ0Q7O0FBRURFLFVBQVFDLElBQVIsRUFBYztBQUNaLFFBQUlDLGdCQUFnQiw0QkFDbEJWLEVBQUVXLEtBQUYsQ0FBUSxLQUFLTCxPQUFiLEVBQXNCO0FBQ3BCSCxhQUFPLEtBQUtBLEtBRFE7QUFFcEJDLFdBQUssS0FBS0EsR0FGVTtBQUdwQkMsYUFBTyxLQUFLQSxLQUhRO0FBSXBCRSx1QkFBaUIsS0FBS0E7QUFKRixLQUF0QixDQURrQixDQUFwQjtBQVFBLFFBQUlLLGVBQWUsMkJBQ2pCWixFQUFFVyxLQUFGLENBQVEsS0FBS0wsT0FBYixFQUFzQjtBQUNwQkgsYUFBTyxLQUFLQSxLQURRO0FBRXBCQyxXQUFLLEtBQUtBLEdBRlU7QUFHcEJDLGFBQU8sS0FBS0EsS0FIUTtBQUlwQkUsdUJBQWlCLEtBQUtBO0FBSkYsS0FBdEIsQ0FEaUIsQ0FBbkI7O0FBU0EsV0FBT0csY0FBY0csTUFBZCxDQUFxQkosSUFBckIsRUFBMkJLLEdBQTNCLENBQStCQyxLQUFLSCxhQUFhQyxNQUFiLENBQW9CRSxDQUFwQixDQUFwQyxDQUFQO0FBQ0Q7QUE1QjJCO2tCQUFUZCxRIiwiZmlsZSI6ImNvbXBpbGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFRlcm1FeHBhbmRlciBmcm9tICcuL3Rlcm0tZXhwYW5kZXIuanMnO1xuaW1wb3J0IFRva2VuRXhwYW5kZXIgZnJvbSAnLi90b2tlbi1leHBhbmRlcic7XG5pbXBvcnQgKiBhcyBfIGZyb20gJ3JhbWRhJztcbmltcG9ydCBNdWx0aW1hcCBmcm9tICcuL211bHRpbWFwJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29tcGlsZXIge1xuICBjb25zdHJ1Y3RvcihwaGFzZSwgZW52LCBzdG9yZSwgY29udGV4dCkge1xuICAgIHRoaXMucGhhc2UgPSBwaGFzZTtcbiAgICB0aGlzLmVudiA9IGVudjtcbiAgICB0aGlzLnN0b3JlID0gc3RvcmU7XG4gICAgdGhpcy5pbnZva2VkUmVnaXN0cnkgPSBuZXcgTXVsdGltYXAoKTtcbiAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuICB9XG5cbiAgY29tcGlsZShzdHhsKSB7XG4gICAgbGV0IHRva2VuRXhwYW5kZXIgPSBuZXcgVG9rZW5FeHBhbmRlcihcbiAgICAgIF8ubWVyZ2UodGhpcy5jb250ZXh0LCB7XG4gICAgICAgIHBoYXNlOiB0aGlzLnBoYXNlLFxuICAgICAgICBlbnY6IHRoaXMuZW52LFxuICAgICAgICBzdG9yZTogdGhpcy5zdG9yZSxcbiAgICAgICAgaW52b2tlZFJlZ2lzdHJ5OiB0aGlzLmludm9rZWRSZWdpc3RyeSxcbiAgICAgIH0pLFxuICAgICk7XG4gICAgbGV0IHRlcm1FeHBhbmRlciA9IG5ldyBUZXJtRXhwYW5kZXIoXG4gICAgICBfLm1lcmdlKHRoaXMuY29udGV4dCwge1xuICAgICAgICBwaGFzZTogdGhpcy5waGFzZSxcbiAgICAgICAgZW52OiB0aGlzLmVudixcbiAgICAgICAgc3RvcmU6IHRoaXMuc3RvcmUsXG4gICAgICAgIGludm9rZWRSZWdpc3RyeTogdGhpcy5pbnZva2VkUmVnaXN0cnksXG4gICAgICB9KSxcbiAgICApO1xuXG4gICAgcmV0dXJuIHRva2VuRXhwYW5kZXIuZXhwYW5kKHN0eGwpLm1hcCh0ID0+IHRlcm1FeHBhbmRlci5leHBhbmQodCkpO1xuICB9XG59XG4iXX0=