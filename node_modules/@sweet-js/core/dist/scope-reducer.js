'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _sweetSpec = require('sweet-spec');

var S = _interopRequireWildcard(_sweetSpec);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// $FlowFixMe: flow doesn't know about the CloneReducer yet
exports.default = class extends S.default.CloneReducer {

  constructor(scopes, bindings) {
    super();
    this.scopes = scopes;
    this.bindings = bindings;
  }

  applyScopes(s) {
    return this.scopes.reduce((acc, sc) => {
      return acc.addScope(sc.scope, this.bindings, sc.phase, {
        flip: sc.flip
      });
    }, s);
  }

  reduceBindingIdentifier(t, s) {
    return new S.BindingIdentifier({
      name: this.applyScopes(s.name)
    });
  }

  reduceIdentifierExpression(t, s) {
    return new S.IdentifierExpression({
      name: this.applyScopes(s.name)
    });
  }

  reduceRawSyntax(t, s) {
    // TODO: fix this once reading tokens is reasonable
    if (s.value.isTemplate() && s.value.items) {
      s.value.token.items = s.value.token.items.map(t => {
        if (t instanceof S.default) {
          return t.reduce(this);
        }
        return t;
      });
    }
    return new S.RawSyntax({
      value: this.applyScopes(s.value)
    });
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zY29wZS1yZWR1Y2VyLmpzIl0sIm5hbWVzIjpbIlMiLCJDbG9uZVJlZHVjZXIiLCJjb25zdHJ1Y3RvciIsInNjb3BlcyIsImJpbmRpbmdzIiwiYXBwbHlTY29wZXMiLCJzIiwicmVkdWNlIiwiYWNjIiwic2MiLCJhZGRTY29wZSIsInNjb3BlIiwicGhhc2UiLCJmbGlwIiwicmVkdWNlQmluZGluZ0lkZW50aWZpZXIiLCJ0IiwiQmluZGluZ0lkZW50aWZpZXIiLCJuYW1lIiwicmVkdWNlSWRlbnRpZmllckV4cHJlc3Npb24iLCJJZGVudGlmaWVyRXhwcmVzc2lvbiIsInJlZHVjZVJhd1N5bnRheCIsInZhbHVlIiwiaXNUZW1wbGF0ZSIsIml0ZW1zIiwidG9rZW4iLCJtYXAiLCJSYXdTeW50YXgiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBOztJQUFrQkEsQzs7OztBQUtsQjtrQkFDZSxjQU5HQSxDQU1XLFNBQUtDLFlBQW5CLENBQWdDOztBQUk3Q0MsY0FDRUMsTUFERixFQUVFQyxRQUZGLEVBR0U7QUFDQTtBQUNBLFNBQUtELE1BQUwsR0FBY0EsTUFBZDtBQUNBLFNBQUtDLFFBQUwsR0FBZ0JBLFFBQWhCO0FBQ0Q7O0FBRURDLGNBQVlDLENBQVosRUFBdUI7QUFDckIsV0FBTyxLQUFLSCxNQUFMLENBQVlJLE1BQVosQ0FBbUIsQ0FBQ0MsR0FBRCxFQUFNQyxFQUFOLEtBQWE7QUFDckMsYUFBT0QsSUFBSUUsUUFBSixDQUFhRCxHQUFHRSxLQUFoQixFQUF1QixLQUFLUCxRQUE1QixFQUFzQ0ssR0FBR0csS0FBekMsRUFBZ0Q7QUFDckRDLGNBQU1KLEdBQUdJO0FBRDRDLE9BQWhELENBQVA7QUFHRCxLQUpNLEVBSUpQLENBSkksQ0FBUDtBQUtEOztBQUVEUSwwQkFBd0JDLENBQXhCLEVBQWlDVCxDQUFqQyxFQUFzRDtBQUNwRCxXQUFPLElBQUlOLEVBQUVnQixpQkFBTixDQUF3QjtBQUM3QkMsWUFBTSxLQUFLWixXQUFMLENBQWlCQyxFQUFFVyxJQUFuQjtBQUR1QixLQUF4QixDQUFQO0FBR0Q7O0FBRURDLDZCQUEyQkgsQ0FBM0IsRUFBb0NULENBQXBDLEVBQXlEO0FBQ3ZELFdBQU8sSUFBSU4sRUFBRW1CLG9CQUFOLENBQTJCO0FBQ2hDRixZQUFNLEtBQUtaLFdBQUwsQ0FBaUJDLEVBQUVXLElBQW5CO0FBRDBCLEtBQTNCLENBQVA7QUFHRDs7QUFFREcsa0JBQWdCTCxDQUFoQixFQUF5QlQsQ0FBekIsRUFBK0M7QUFDN0M7QUFDQSxRQUFJQSxFQUFFZSxLQUFGLENBQVFDLFVBQVIsTUFBd0JoQixFQUFFZSxLQUFGLENBQVFFLEtBQXBDLEVBQTJDO0FBQ3pDakIsUUFBRWUsS0FBRixDQUFRRyxLQUFSLENBQWNELEtBQWQsR0FBc0JqQixFQUFFZSxLQUFGLENBQVFHLEtBQVIsQ0FBY0QsS0FBZCxDQUFvQkUsR0FBcEIsQ0FBd0JWLEtBQUs7QUFDakQsWUFBSUEsYUEzQ01mLENBMkNOLFFBQUosRUFBdUI7QUFDckIsaUJBQU9lLEVBQUVSLE1BQUYsQ0FBUyxJQUFULENBQVA7QUFDRDtBQUNELGVBQU9RLENBQVA7QUFDRCxPQUxxQixDQUF0QjtBQU1EO0FBQ0QsV0FBTyxJQUFJZixFQUFFMEIsU0FBTixDQUFnQjtBQUNyQkwsYUFBTyxLQUFLaEIsV0FBTCxDQUFpQkMsRUFBRWUsS0FBbkI7QUFEYyxLQUFoQixDQUFQO0FBR0Q7QUE5QzRDLEMiLCJmaWxlIjoic2NvcGUtcmVkdWNlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5pbXBvcnQgVGVybSwgKiBhcyBTIGZyb20gJ3N3ZWV0LXNwZWMnO1xuaW1wb3J0IHR5cGUgU3ludGF4IGZyb20gJy4vc3ludGF4JztcbmltcG9ydCB0eXBlIHsgU3ltYm9sQ2xhc3MgfSBmcm9tICcuL3N5bWJvbCc7XG5pbXBvcnQgdHlwZSBCaW5kaW5nTWFwIGZyb20gJy4vYmluZGluZy1tYXAnO1xuXG4vLyAkRmxvd0ZpeE1lOiBmbG93IGRvZXNuJ3Qga25vdyBhYm91dCB0aGUgQ2xvbmVSZWR1Y2VyIHlldFxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgZXh0ZW5kcyBUZXJtLkNsb25lUmVkdWNlciB7XG4gIHNjb3BlczogQXJyYXk8eyBzY29wZTogU3ltYm9sQ2xhc3MsIHBoYXNlOiBudW1iZXIgfCB7fSwgZmxpcDogYm9vbGVhbiB9PjtcbiAgYmluZGluZ3M6IEJpbmRpbmdNYXA7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgc2NvcGVzOiBBcnJheTx7IHNjb3BlOiBTeW1ib2xDbGFzcywgcGhhc2U6IG51bWJlciB8IHt9LCBmbGlwOiBib29sZWFuIH0+LFxuICAgIGJpbmRpbmdzOiBCaW5kaW5nTWFwLFxuICApIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuc2NvcGVzID0gc2NvcGVzO1xuICAgIHRoaXMuYmluZGluZ3MgPSBiaW5kaW5ncztcbiAgfVxuXG4gIGFwcGx5U2NvcGVzKHM6IFN5bnRheCkge1xuICAgIHJldHVybiB0aGlzLnNjb3Blcy5yZWR1Y2UoKGFjYywgc2MpID0+IHtcbiAgICAgIHJldHVybiBhY2MuYWRkU2NvcGUoc2Muc2NvcGUsIHRoaXMuYmluZGluZ3MsIHNjLnBoYXNlLCB7XG4gICAgICAgIGZsaXA6IHNjLmZsaXAsXG4gICAgICB9KTtcbiAgICB9LCBzKTtcbiAgfVxuXG4gIHJlZHVjZUJpbmRpbmdJZGVudGlmaWVyKHQ6IFRlcm0sIHM6IHsgbmFtZTogU3ludGF4IH0pIHtcbiAgICByZXR1cm4gbmV3IFMuQmluZGluZ0lkZW50aWZpZXIoe1xuICAgICAgbmFtZTogdGhpcy5hcHBseVNjb3BlcyhzLm5hbWUpLFxuICAgIH0pO1xuICB9XG5cbiAgcmVkdWNlSWRlbnRpZmllckV4cHJlc3Npb24odDogVGVybSwgczogeyBuYW1lOiBTeW50YXggfSkge1xuICAgIHJldHVybiBuZXcgUy5JZGVudGlmaWVyRXhwcmVzc2lvbih7XG4gICAgICBuYW1lOiB0aGlzLmFwcGx5U2NvcGVzKHMubmFtZSksXG4gICAgfSk7XG4gIH1cblxuICByZWR1Y2VSYXdTeW50YXgodDogVGVybSwgczogeyB2YWx1ZTogU3ludGF4IH0pIHtcbiAgICAvLyBUT0RPOiBmaXggdGhpcyBvbmNlIHJlYWRpbmcgdG9rZW5zIGlzIHJlYXNvbmFibGVcbiAgICBpZiAocy52YWx1ZS5pc1RlbXBsYXRlKCkgJiYgcy52YWx1ZS5pdGVtcykge1xuICAgICAgcy52YWx1ZS50b2tlbi5pdGVtcyA9IHMudmFsdWUudG9rZW4uaXRlbXMubWFwKHQgPT4ge1xuICAgICAgICBpZiAodCBpbnN0YW5jZW9mIFRlcm0pIHtcbiAgICAgICAgICByZXR1cm4gdC5yZWR1Y2UodGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHQ7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBTLlJhd1N5bnRheCh7XG4gICAgICB2YWx1ZTogdGhpcy5hcHBseVNjb3BlcyhzLnZhbHVlKSxcbiAgICB9KTtcbiAgfVxufVxuIl19