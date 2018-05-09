'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wrapInTerms = wrapInTerms;

var _errors = require('./errors');

var _immutable = require('immutable');

var _enforester = require('./enforester');

var _syntax = require('./syntax');

var _syntax2 = _interopRequireDefault(_syntax);

var _ramda = require('ramda');

var _ = _interopRequireWildcard(_ramda);

var _scopeReducer = require('./scope-reducer');

var _scopeReducer2 = _interopRequireDefault(_scopeReducer);

var _sweetSpec = require('sweet-spec');

var T = _interopRequireWildcard(_sweetSpec);

var S = _interopRequireWildcard(_sweetSpec);

var _tokens = require('./tokens');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function wrapInTerms(stx) {
  return stx.map(s => {
    if ((0, _tokens.isTemplate)(s)) {
      if (s.items) {
        s.items = wrapInTerms(s.items);
        return new T.RawSyntax({
          value: new _syntax2.default(s)
        });
      }
      return new T.RawSyntax({
        value: new _syntax2.default(s)
      });
    } else if ((0, _tokens.isDelimiter)(s)) {
      return new S.RawDelimiter({
        kind: (0, _tokens.getKind)(s),
        inner: wrapInTerms(s)
      });
    }
    return new S.RawSyntax({
      value: new _syntax2.default(s)
    });
  });
}

const privateData = new WeakMap();

function cloneEnforester(enf) {
  const { rest, prev, context } = enf;
  return new _enforester.Enforester(rest, prev, context);
}

function Marker() {}

/*
ctx :: {
  of: (Syntax) -> ctx
  next: (String) -> Syntax or Term
}
*/
class MacroContext {
  constructor(enf, name, context, useScope, introducedScope) {
    const startMarker = new Marker();
    const startEnf = cloneEnforester(enf);
    const priv = {
      name,
      context,
      enf: startEnf,
      startMarker,
      markers: new Map([[startMarker, enf]])
    };

    if (useScope && introducedScope) {
      priv.noScopes = false;
      priv.useScope = useScope;
      priv.introducedScope = introducedScope;
    } else {
      priv.noScopes = true;
    }
    privateData.set(this, priv);
    this.reset(); // set current enforester

    this[Symbol.iterator] = () => this;
  }

  name() {
    const { name } = privateData.get(this);
    return new T.RawSyntax({ value: name });
  }

  contextify(delim) {
    if (!(delim instanceof T.RawDelimiter)) {
      throw new Error(`Can only contextify a delimiter but got ${delim}`);
    }
    const { context } = privateData.get(this);

    let enf = new _enforester.Enforester(delim.inner.slice(1, delim.inner.size - 1), (0, _immutable.List)(), context);
    return new MacroContext(enf, 'inner', context);
  }

  expand(type) {
    const { enf } = privateData.get(this);
    if (enf.rest.size === 0) {
      return {
        done: true,
        value: null
      };
    }
    enf.expandMacro();
    let originalRest = enf.rest;
    let value;
    switch (type) {
      case 'AssignmentExpression':
      case 'expr':
        value = enf.enforestExpressionLoop();
        break;
      case 'Expression':
        value = enf.enforestExpression();
        break;
      case 'Statement':
      case 'stmt':
        value = enf.enforestStatement();
        break;
      case 'BlockStatement':
      case 'WhileStatement':
      case 'IfStatement':
      case 'ForStatement':
      case 'SwitchStatement':
      case 'BreakStatement':
      case 'ContinueStatement':
      case 'DebuggerStatement':
      case 'WithStatement':
      case 'TryStatement':
      case 'ThrowStatement':
      case 'ClassDeclaration':
      case 'FunctionDeclaration':
      case 'LabeledStatement':
      case 'VariableDeclarationStatement':
      case 'ReturnStatement':
      case 'ExpressionStatement':
        value = enf.enforestStatement();
        (0, _errors.expect)(_.whereEq({ type }, value), `Expecting a ${type}`, value, originalRest);
        break;
      case 'YieldExpression':
        value = enf.enforestYieldExpression();
        break;
      case 'ClassExpression':
        value = enf.enforestClass({ isExpr: true });
        break;
      case 'ArrowExpression':
        value = enf.enforestArrowExpression();
        break;
      case 'NewExpression':
        value = enf.enforestNewExpression();
        break;
      case 'ThisExpression':
      case 'FunctionExpression':
      case 'IdentifierExpression':
      case 'LiteralNumericExpression':
      case 'LiteralInfinityExpression':
      case 'LiteralStringExpression':
      case 'TemplateExpression':
      case 'LiteralBooleanExpression':
      case 'LiteralNullExpression':
      case 'LiteralRegExpExpression':
      case 'ObjectExpression':
      case 'ArrayExpression':
        value = enf.enforestPrimaryExpression();
        break;
      case 'UnaryExpression':
      case 'UpdateExpression':
      case 'BinaryExpression':
      case 'StaticMemberExpression':
      case 'ComputedMemberExpression':
      case 'CompoundAssignmentExpression':
      case 'ConditionalExpression':
        value = enf.enforestExpressionLoop();
        (0, _errors.expect)(_.whereEq({ type }, value), `Expecting a ${type}`, value, originalRest);
        break;
      default:
        throw new Error('Unknown term type: ' + type);
    }
    return {
      done: false,
      value: value
    };
  }

  _rest(enf) {
    const priv = privateData.get(this);
    if (priv.markers.get(priv.startMarker) === enf) {
      return priv.enf.rest;
    }
    throw Error('Unauthorized access!');
  }

  reset(marker) {
    const priv = privateData.get(this);
    let enf;
    if (marker == null) {
      // go to the beginning
      enf = priv.markers.get(priv.startMarker);
    } else if (marker && marker instanceof Marker) {
      // marker could be from another context
      if (priv.markers.has(marker)) {
        enf = priv.markers.get(marker);
      } else {
        throw new Error('marker must originate from this context');
      }
    } else {
      throw new Error('marker must be an instance of Marker');
    }
    priv.enf = cloneEnforester(enf);
  }

  mark() {
    const priv = privateData.get(this);
    let marker;

    // the idea here is that marking at the beginning shouldn't happen more than once.
    // We can reuse startMarker.
    if (priv.enf.rest === priv.markers.get(priv.startMarker).rest) {
      marker = priv.startMarker;
    } else if (priv.enf.rest.isEmpty()) {
      // same reason as above
      if (!priv.endMarker) priv.endMarker = new Marker();
      marker = priv.endMarker;
    } else {
      //TODO(optimization/dubious): check that there isn't already a marker for this index?
      marker = new Marker();
    }
    if (!priv.markers.has(marker)) {
      priv.markers.set(marker, cloneEnforester(priv.enf));
    }
    return marker;
  }

  next() {
    const {
      enf,
      noScopes,
      useScope,
      introducedScope,
      context
    } = privateData.get(this);
    if (enf.rest.size === 0) {
      return {
        done: true,
        value: null
      };
    }
    let value = enf.advance();
    if (!noScopes) {
      value = value.reduce(new _scopeReducer2.default([{ scope: useScope, phase: _syntax.ALL_PHASES, flip: false }, { scope: introducedScope, phase: _syntax.ALL_PHASES, flip: true }], context.bindings));
    }
    return {
      done: false,
      value: value
    };
  }
}
exports.default = MacroContext;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tYWNyby1jb250ZXh0LmpzIl0sIm5hbWVzIjpbIndyYXBJblRlcm1zIiwiXyIsIlQiLCJTIiwic3R4IiwibWFwIiwicyIsIml0ZW1zIiwiUmF3U3ludGF4IiwidmFsdWUiLCJSYXdEZWxpbWl0ZXIiLCJraW5kIiwiaW5uZXIiLCJwcml2YXRlRGF0YSIsIldlYWtNYXAiLCJjbG9uZUVuZm9yZXN0ZXIiLCJlbmYiLCJyZXN0IiwicHJldiIsImNvbnRleHQiLCJNYXJrZXIiLCJNYWNyb0NvbnRleHQiLCJjb25zdHJ1Y3RvciIsIm5hbWUiLCJ1c2VTY29wZSIsImludHJvZHVjZWRTY29wZSIsInN0YXJ0TWFya2VyIiwic3RhcnRFbmYiLCJwcml2IiwibWFya2VycyIsIk1hcCIsIm5vU2NvcGVzIiwic2V0IiwicmVzZXQiLCJTeW1ib2wiLCJpdGVyYXRvciIsImdldCIsImNvbnRleHRpZnkiLCJkZWxpbSIsIkVycm9yIiwic2xpY2UiLCJzaXplIiwiZXhwYW5kIiwidHlwZSIsImRvbmUiLCJleHBhbmRNYWNybyIsIm9yaWdpbmFsUmVzdCIsImVuZm9yZXN0RXhwcmVzc2lvbkxvb3AiLCJlbmZvcmVzdEV4cHJlc3Npb24iLCJlbmZvcmVzdFN0YXRlbWVudCIsIndoZXJlRXEiLCJlbmZvcmVzdFlpZWxkRXhwcmVzc2lvbiIsImVuZm9yZXN0Q2xhc3MiLCJpc0V4cHIiLCJlbmZvcmVzdEFycm93RXhwcmVzc2lvbiIsImVuZm9yZXN0TmV3RXhwcmVzc2lvbiIsImVuZm9yZXN0UHJpbWFyeUV4cHJlc3Npb24iLCJfcmVzdCIsIm1hcmtlciIsImhhcyIsIm1hcmsiLCJpc0VtcHR5IiwiZW5kTWFya2VyIiwibmV4dCIsImFkdmFuY2UiLCJyZWR1Y2UiLCJzY29wZSIsInBoYXNlIiwiZmxpcCIsImJpbmRpbmdzIl0sIm1hcHBpbmdzIjoiOzs7OztRQVlnQkEsVyxHQUFBQSxXOztBQVpoQjs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQUNBOztJQUFZQyxDOztBQUNa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LEVBQUVGLE9BQU96QyxlQUFULEVBQTBCMEMseUJBQTFCLEVBQTZDQyxNQUFNLElBQW5ELEVBRkYsQ0FERixFQUtFakQsUUFBUWtELFFBTFYsQ0FETSxDQUFSO0FBU0Q7QUFDRCxXQUFPO0FBQ0x6QixZQUFNLEtBREQ7QUFFTG5DLGFBQU9BO0FBRkYsS0FBUDtBQUlEO0FBN04rQjtrQkFBYlksWSIsImZpbGUiOiJtYWNyby1jb250ZXh0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZXhwZWN0IH0gZnJvbSAnLi9lcnJvcnMnO1xuaW1wb3J0IHsgTGlzdCB9IGZyb20gJ2ltbXV0YWJsZSc7XG5pbXBvcnQgeyBFbmZvcmVzdGVyIH0gZnJvbSAnLi9lbmZvcmVzdGVyJztcbmltcG9ydCB7IEFMTF9QSEFTRVMgfSBmcm9tICcuL3N5bnRheCc7XG5pbXBvcnQgKiBhcyBfIGZyb20gJ3JhbWRhJztcbmltcG9ydCBTY29wZVJlZHVjZXIgZnJvbSAnLi9zY29wZS1yZWR1Y2VyJztcbmltcG9ydCAqIGFzIFQgZnJvbSAnc3dlZXQtc3BlYyc7XG5pbXBvcnQgVGVybSwgKiBhcyBTIGZyb20gJ3N3ZWV0LXNwZWMnO1xuaW1wb3J0IFN5bnRheCBmcm9tICcuL3N5bnRheCc7XG5pbXBvcnQgeyBpc1RlbXBsYXRlLCBpc0RlbGltaXRlciwgZ2V0S2luZCB9IGZyb20gJy4vdG9rZW5zJztcbmltcG9ydCB0eXBlIHsgVG9rZW5UcmVlIH0gZnJvbSAnLi90b2tlbnMnO1xuXG5leHBvcnQgZnVuY3Rpb24gd3JhcEluVGVybXMoc3R4OiBMaXN0PFRva2VuVHJlZT4pOiBMaXN0PFRlcm0+IHtcbiAgcmV0dXJuIHN0eC5tYXAocyA9PiB7XG4gICAgaWYgKGlzVGVtcGxhdGUocykpIHtcbiAgICAgIGlmIChzLml0ZW1zKSB7XG4gICAgICAgIHMuaXRlbXMgPSB3cmFwSW5UZXJtcyhzLml0ZW1zKTtcbiAgICAgICAgcmV0dXJuIG5ldyBULlJhd1N5bnRheCh7XG4gICAgICAgICAgdmFsdWU6IG5ldyBTeW50YXgocyksXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG5ldyBULlJhd1N5bnRheCh7XG4gICAgICAgIHZhbHVlOiBuZXcgU3ludGF4KHMpLFxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChpc0RlbGltaXRlcihzKSkge1xuICAgICAgcmV0dXJuIG5ldyBTLlJhd0RlbGltaXRlcih7XG4gICAgICAgIGtpbmQ6IGdldEtpbmQocyksXG4gICAgICAgIGlubmVyOiB3cmFwSW5UZXJtcyhzKSxcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFMuUmF3U3ludGF4KHtcbiAgICAgIHZhbHVlOiBuZXcgU3ludGF4KHMpLFxuICAgIH0pO1xuICB9KTtcbn1cblxuY29uc3QgcHJpdmF0ZURhdGEgPSBuZXcgV2Vha01hcCgpO1xuXG5mdW5jdGlvbiBjbG9uZUVuZm9yZXN0ZXIoZW5mKSB7XG4gIGNvbnN0IHsgcmVzdCwgcHJldiwgY29udGV4dCB9ID0gZW5mO1xuICByZXR1cm4gbmV3IEVuZm9yZXN0ZXIocmVzdCwgcHJldiwgY29udGV4dCk7XG59XG5cbmZ1bmN0aW9uIE1hcmtlcigpIHt9XG5cbi8qXG5jdHggOjoge1xuICBvZjogKFN5bnRheCkgLT4gY3R4XG4gIG5leHQ6IChTdHJpbmcpIC0+IFN5bnRheCBvciBUZXJtXG59XG4qL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFjcm9Db250ZXh0IHtcbiAgY29uc3RydWN0b3IoZW5mLCBuYW1lLCBjb250ZXh0LCB1c2VTY29wZSwgaW50cm9kdWNlZFNjb3BlKSB7XG4gICAgY29uc3Qgc3RhcnRNYXJrZXIgPSBuZXcgTWFya2VyKCk7XG4gICAgY29uc3Qgc3RhcnRFbmYgPSBjbG9uZUVuZm9yZXN0ZXIoZW5mKTtcbiAgICBjb25zdCBwcml2ID0ge1xuICAgICAgbmFtZSxcbiAgICAgIGNvbnRleHQsXG4gICAgICBlbmY6IHN0YXJ0RW5mLFxuICAgICAgc3RhcnRNYXJrZXIsXG4gICAgICBtYXJrZXJzOiBuZXcgTWFwKFtbc3RhcnRNYXJrZXIsIGVuZl1dKSxcbiAgICB9O1xuXG4gICAgaWYgKHVzZVNjb3BlICYmIGludHJvZHVjZWRTY29wZSkge1xuICAgICAgcHJpdi5ub1Njb3BlcyA9IGZhbHNlO1xuICAgICAgcHJpdi51c2VTY29wZSA9IHVzZVNjb3BlO1xuICAgICAgcHJpdi5pbnRyb2R1Y2VkU2NvcGUgPSBpbnRyb2R1Y2VkU2NvcGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHByaXYubm9TY29wZXMgPSB0cnVlO1xuICAgIH1cbiAgICBwcml2YXRlRGF0YS5zZXQodGhpcywgcHJpdik7XG4gICAgdGhpcy5yZXNldCgpOyAvLyBzZXQgY3VycmVudCBlbmZvcmVzdGVyXG5cbiAgICB0aGlzW1N5bWJvbC5pdGVyYXRvcl0gPSAoKSA9PiB0aGlzO1xuICB9XG5cbiAgbmFtZSgpIHtcbiAgICBjb25zdCB7IG5hbWUgfSA9IHByaXZhdGVEYXRhLmdldCh0aGlzKTtcbiAgICByZXR1cm4gbmV3IFQuUmF3U3ludGF4KHsgdmFsdWU6IG5hbWUgfSk7XG4gIH1cblxuICBjb250ZXh0aWZ5KGRlbGltOiBhbnkpIHtcbiAgICBpZiAoIShkZWxpbSBpbnN0YW5jZW9mIFQuUmF3RGVsaW1pdGVyKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW4gb25seSBjb250ZXh0aWZ5IGEgZGVsaW1pdGVyIGJ1dCBnb3QgJHtkZWxpbX1gKTtcbiAgICB9XG4gICAgY29uc3QgeyBjb250ZXh0IH0gPSBwcml2YXRlRGF0YS5nZXQodGhpcyk7XG5cbiAgICBsZXQgZW5mID0gbmV3IEVuZm9yZXN0ZXIoXG4gICAgICBkZWxpbS5pbm5lci5zbGljZSgxLCBkZWxpbS5pbm5lci5zaXplIC0gMSksXG4gICAgICBMaXN0KCksXG4gICAgICBjb250ZXh0LFxuICAgICk7XG4gICAgcmV0dXJuIG5ldyBNYWNyb0NvbnRleHQoZW5mLCAnaW5uZXInLCBjb250ZXh0KTtcbiAgfVxuXG4gIGV4cGFuZCh0eXBlKSB7XG4gICAgY29uc3QgeyBlbmYgfSA9IHByaXZhdGVEYXRhLmdldCh0aGlzKTtcbiAgICBpZiAoZW5mLnJlc3Quc2l6ZSA9PT0gMCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZG9uZTogdHJ1ZSxcbiAgICAgICAgdmFsdWU6IG51bGwsXG4gICAgICB9O1xuICAgIH1cbiAgICBlbmYuZXhwYW5kTWFjcm8oKTtcbiAgICBsZXQgb3JpZ2luYWxSZXN0ID0gZW5mLnJlc3Q7XG4gICAgbGV0IHZhbHVlO1xuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSAnQXNzaWdubWVudEV4cHJlc3Npb24nOlxuICAgICAgY2FzZSAnZXhwcic6XG4gICAgICAgIHZhbHVlID0gZW5mLmVuZm9yZXN0RXhwcmVzc2lvbkxvb3AoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdFeHByZXNzaW9uJzpcbiAgICAgICAgdmFsdWUgPSBlbmYuZW5mb3Jlc3RFeHByZXNzaW9uKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnU3RhdGVtZW50JzpcbiAgICAgIGNhc2UgJ3N0bXQnOlxuICAgICAgICB2YWx1ZSA9IGVuZi5lbmZvcmVzdFN0YXRlbWVudCgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ0Jsb2NrU3RhdGVtZW50JzpcbiAgICAgIGNhc2UgJ1doaWxlU3RhdGVtZW50JzpcbiAgICAgIGNhc2UgJ0lmU3RhdGVtZW50JzpcbiAgICAgIGNhc2UgJ0ZvclN0YXRlbWVudCc6XG4gICAgICBjYXNlICdTd2l0Y2hTdGF0ZW1lbnQnOlxuICAgICAgY2FzZSAnQnJlYWtTdGF0ZW1lbnQnOlxuICAgICAgY2FzZSAnQ29udGludWVTdGF0ZW1lbnQnOlxuICAgICAgY2FzZSAnRGVidWdnZXJTdGF0ZW1lbnQnOlxuICAgICAgY2FzZSAnV2l0aFN0YXRlbWVudCc6XG4gICAgICBjYXNlICdUcnlTdGF0ZW1lbnQnOlxuICAgICAgY2FzZSAnVGhyb3dTdGF0ZW1lbnQnOlxuICAgICAgY2FzZSAnQ2xhc3NEZWNsYXJhdGlvbic6XG4gICAgICBjYXNlICdGdW5jdGlvbkRlY2xhcmF0aW9uJzpcbiAgICAgIGNhc2UgJ0xhYmVsZWRTdGF0ZW1lbnQnOlxuICAgICAgY2FzZSAnVmFyaWFibGVEZWNsYXJhdGlvblN0YXRlbWVudCc6XG4gICAgICBjYXNlICdSZXR1cm5TdGF0ZW1lbnQnOlxuICAgICAgY2FzZSAnRXhwcmVzc2lvblN0YXRlbWVudCc6XG4gICAgICAgIHZhbHVlID0gZW5mLmVuZm9yZXN0U3RhdGVtZW50KCk7XG4gICAgICAgIGV4cGVjdChcbiAgICAgICAgICBfLndoZXJlRXEoeyB0eXBlIH0sIHZhbHVlKSxcbiAgICAgICAgICBgRXhwZWN0aW5nIGEgJHt0eXBlfWAsXG4gICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgb3JpZ2luYWxSZXN0LFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ1lpZWxkRXhwcmVzc2lvbic6XG4gICAgICAgIHZhbHVlID0gZW5mLmVuZm9yZXN0WWllbGRFeHByZXNzaW9uKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnQ2xhc3NFeHByZXNzaW9uJzpcbiAgICAgICAgdmFsdWUgPSBlbmYuZW5mb3Jlc3RDbGFzcyh7IGlzRXhwcjogdHJ1ZSB9KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdBcnJvd0V4cHJlc3Npb24nOlxuICAgICAgICB2YWx1ZSA9IGVuZi5lbmZvcmVzdEFycm93RXhwcmVzc2lvbigpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ05ld0V4cHJlc3Npb24nOlxuICAgICAgICB2YWx1ZSA9IGVuZi5lbmZvcmVzdE5ld0V4cHJlc3Npb24oKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdUaGlzRXhwcmVzc2lvbic6XG4gICAgICBjYXNlICdGdW5jdGlvbkV4cHJlc3Npb24nOlxuICAgICAgY2FzZSAnSWRlbnRpZmllckV4cHJlc3Npb24nOlxuICAgICAgY2FzZSAnTGl0ZXJhbE51bWVyaWNFeHByZXNzaW9uJzpcbiAgICAgIGNhc2UgJ0xpdGVyYWxJbmZpbml0eUV4cHJlc3Npb24nOlxuICAgICAgY2FzZSAnTGl0ZXJhbFN0cmluZ0V4cHJlc3Npb24nOlxuICAgICAgY2FzZSAnVGVtcGxhdGVFeHByZXNzaW9uJzpcbiAgICAgIGNhc2UgJ0xpdGVyYWxCb29sZWFuRXhwcmVzc2lvbic6XG4gICAgICBjYXNlICdMaXRlcmFsTnVsbEV4cHJlc3Npb24nOlxuICAgICAgY2FzZSAnTGl0ZXJhbFJlZ0V4cEV4cHJlc3Npb24nOlxuICAgICAgY2FzZSAnT2JqZWN0RXhwcmVzc2lvbic6XG4gICAgICBjYXNlICdBcnJheUV4cHJlc3Npb24nOlxuICAgICAgICB2YWx1ZSA9IGVuZi5lbmZvcmVzdFByaW1hcnlFeHByZXNzaW9uKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnVW5hcnlFeHByZXNzaW9uJzpcbiAgICAgIGNhc2UgJ1VwZGF0ZUV4cHJlc3Npb24nOlxuICAgICAgY2FzZSAnQmluYXJ5RXhwcmVzc2lvbic6XG4gICAgICBjYXNlICdTdGF0aWNNZW1iZXJFeHByZXNzaW9uJzpcbiAgICAgIGNhc2UgJ0NvbXB1dGVkTWVtYmVyRXhwcmVzc2lvbic6XG4gICAgICBjYXNlICdDb21wb3VuZEFzc2lnbm1lbnRFeHByZXNzaW9uJzpcbiAgICAgIGNhc2UgJ0NvbmRpdGlvbmFsRXhwcmVzc2lvbic6XG4gICAgICAgIHZhbHVlID0gZW5mLmVuZm9yZXN0RXhwcmVzc2lvbkxvb3AoKTtcbiAgICAgICAgZXhwZWN0KFxuICAgICAgICAgIF8ud2hlcmVFcSh7IHR5cGUgfSwgdmFsdWUpLFxuICAgICAgICAgIGBFeHBlY3RpbmcgYSAke3R5cGV9YCxcbiAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgICBvcmlnaW5hbFJlc3QsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIHRlcm0gdHlwZTogJyArIHR5cGUpO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgZG9uZTogZmFsc2UsXG4gICAgICB2YWx1ZTogdmFsdWUsXG4gICAgfTtcbiAgfVxuXG4gIF9yZXN0KGVuZikge1xuICAgIGNvbnN0IHByaXYgPSBwcml2YXRlRGF0YS5nZXQodGhpcyk7XG4gICAgaWYgKHByaXYubWFya2Vycy5nZXQocHJpdi5zdGFydE1hcmtlcikgPT09IGVuZikge1xuICAgICAgcmV0dXJuIHByaXYuZW5mLnJlc3Q7XG4gICAgfVxuICAgIHRocm93IEVycm9yKCdVbmF1dGhvcml6ZWQgYWNjZXNzIScpO1xuICB9XG5cbiAgcmVzZXQobWFya2VyKSB7XG4gICAgY29uc3QgcHJpdiA9IHByaXZhdGVEYXRhLmdldCh0aGlzKTtcbiAgICBsZXQgZW5mO1xuICAgIGlmIChtYXJrZXIgPT0gbnVsbCkge1xuICAgICAgLy8gZ28gdG8gdGhlIGJlZ2lubmluZ1xuICAgICAgZW5mID0gcHJpdi5tYXJrZXJzLmdldChwcml2LnN0YXJ0TWFya2VyKTtcbiAgICB9IGVsc2UgaWYgKG1hcmtlciAmJiBtYXJrZXIgaW5zdGFuY2VvZiBNYXJrZXIpIHtcbiAgICAgIC8vIG1hcmtlciBjb3VsZCBiZSBmcm9tIGFub3RoZXIgY29udGV4dFxuICAgICAgaWYgKHByaXYubWFya2Vycy5oYXMobWFya2VyKSkge1xuICAgICAgICBlbmYgPSBwcml2Lm1hcmtlcnMuZ2V0KG1hcmtlcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ21hcmtlciBtdXN0IG9yaWdpbmF0ZSBmcm9tIHRoaXMgY29udGV4dCcpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ21hcmtlciBtdXN0IGJlIGFuIGluc3RhbmNlIG9mIE1hcmtlcicpO1xuICAgIH1cbiAgICBwcml2LmVuZiA9IGNsb25lRW5mb3Jlc3RlcihlbmYpO1xuICB9XG5cbiAgbWFyaygpIHtcbiAgICBjb25zdCBwcml2ID0gcHJpdmF0ZURhdGEuZ2V0KHRoaXMpO1xuICAgIGxldCBtYXJrZXI7XG5cbiAgICAvLyB0aGUgaWRlYSBoZXJlIGlzIHRoYXQgbWFya2luZyBhdCB0aGUgYmVnaW5uaW5nIHNob3VsZG4ndCBoYXBwZW4gbW9yZSB0aGFuIG9uY2UuXG4gICAgLy8gV2UgY2FuIHJldXNlIHN0YXJ0TWFya2VyLlxuICAgIGlmIChwcml2LmVuZi5yZXN0ID09PSBwcml2Lm1hcmtlcnMuZ2V0KHByaXYuc3RhcnRNYXJrZXIpLnJlc3QpIHtcbiAgICAgIG1hcmtlciA9IHByaXYuc3RhcnRNYXJrZXI7XG4gICAgfSBlbHNlIGlmIChwcml2LmVuZi5yZXN0LmlzRW1wdHkoKSkge1xuICAgICAgLy8gc2FtZSByZWFzb24gYXMgYWJvdmVcbiAgICAgIGlmICghcHJpdi5lbmRNYXJrZXIpIHByaXYuZW5kTWFya2VyID0gbmV3IE1hcmtlcigpO1xuICAgICAgbWFya2VyID0gcHJpdi5lbmRNYXJrZXI7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vVE9ETyhvcHRpbWl6YXRpb24vZHViaW91cyk6IGNoZWNrIHRoYXQgdGhlcmUgaXNuJ3QgYWxyZWFkeSBhIG1hcmtlciBmb3IgdGhpcyBpbmRleD9cbiAgICAgIG1hcmtlciA9IG5ldyBNYXJrZXIoKTtcbiAgICB9XG4gICAgaWYgKCFwcml2Lm1hcmtlcnMuaGFzKG1hcmtlcikpIHtcbiAgICAgIHByaXYubWFya2Vycy5zZXQobWFya2VyLCBjbG9uZUVuZm9yZXN0ZXIocHJpdi5lbmYpKTtcbiAgICB9XG4gICAgcmV0dXJuIG1hcmtlcjtcbiAgfVxuXG4gIG5leHQoKSB7XG4gICAgY29uc3Qge1xuICAgICAgZW5mLFxuICAgICAgbm9TY29wZXMsXG4gICAgICB1c2VTY29wZSxcbiAgICAgIGludHJvZHVjZWRTY29wZSxcbiAgICAgIGNvbnRleHQsXG4gICAgfSA9IHByaXZhdGVEYXRhLmdldCh0aGlzKTtcbiAgICBpZiAoZW5mLnJlc3Quc2l6ZSA9PT0gMCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZG9uZTogdHJ1ZSxcbiAgICAgICAgdmFsdWU6IG51bGwsXG4gICAgICB9O1xuICAgIH1cbiAgICBsZXQgdmFsdWUgPSBlbmYuYWR2YW5jZSgpO1xuICAgIGlmICghbm9TY29wZXMpIHtcbiAgICAgIHZhbHVlID0gdmFsdWUucmVkdWNlKFxuICAgICAgICBuZXcgU2NvcGVSZWR1Y2VyKFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIHsgc2NvcGU6IHVzZVNjb3BlLCBwaGFzZTogQUxMX1BIQVNFUywgZmxpcDogZmFsc2UgfSxcbiAgICAgICAgICAgIHsgc2NvcGU6IGludHJvZHVjZWRTY29wZSwgcGhhc2U6IEFMTF9QSEFTRVMsIGZsaXA6IHRydWUgfSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIGNvbnRleHQuYmluZGluZ3MsXG4gICAgICAgICksXG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgZG9uZTogZmFsc2UsXG4gICAgICB2YWx1ZTogdmFsdWUsXG4gICAgfTtcbiAgfVxufVxuIl19