'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ALL_PHASES = exports.Types = undefined;

var _immutable = require('immutable');

var _errors = require('./errors');

var _bindingMap = require('./binding-map');

var _bindingMap2 = _interopRequireDefault(_bindingMap);

var _ramdaFantasy = require('ramda-fantasy');

var _ramda = require('ramda');

var _ = _interopRequireWildcard(_ramda);

var _sweetSpec = require('sweet-spec');

var T = _interopRequireWildcard(_sweetSpec);

var _tokens = require('./tokens');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getFirstSlice(stx) {
  if (!stx || typeof stx.isDelimiter !== 'function') return null; // TODO: should not have to do this
  if (!stx.isDelimiter()) {
    return stx.token.slice;
  }
  return stx.token.get(0).token.slice;
}


function sizeDecending(a, b) {
  if (a.scopes.size > b.scopes.size) {
    return -1;
  } else if (b.scopes.size > a.scopes.size) {
    return 1;
  } else {
    return 0;
  }
}

let Types = exports.Types = {
  null: {
    match: token => !Types.delimiter.match(token) && token.type === _tokens.TokenType.NULL,
    create: (value, stx) => new Syntax({
      type: _tokens.TokenType.NULL,
      value: null,
      typeCode: _tokens.TypeCodes.Keyword
    }, stx)
  },
  number: {
    match: token => !Types.delimiter.match(token) && token.type.klass === _tokens.TokenClass.NumericLiteral,
    create: (value, stx) => new Syntax({
      type: _tokens.TokenType.NUMBER,
      value,
      typeCode: _tokens.TypeCodes.NumericLiteral
    }, stx)
  },
  string: {
    match: token => !Types.delimiter.match(token) && token.type.klass === _tokens.TokenClass.StringLiteral,
    create: (value, stx) => new Syntax({
      type: _tokens.TokenType.STRING,
      str: value,
      typeCode: _tokens.TypeCodes.StringLiteral
    }, stx)
  },
  punctuator: {
    match: token => !Types.delimiter.match(token) && token.type.klass === _tokens.TokenClass.Punctuator,
    create: (value, stx) => new Syntax({
      type: {
        klass: _tokens.TokenClass.Punctuator,
        name: value
      },
      typeCode: _tokens.TypeCodes.Punctuator,
      value
    }, stx)
  },
  keyword: {
    match: token => !Types.delimiter.match(token) && token.type.klass === _tokens.TokenClass.Keyword,
    create: (value, stx) => new Syntax({
      type: {
        klass: _tokens.TokenClass.Keyword,
        name: value
      },
      typeCode: _tokens.TypeCodes.Keyword,
      value
    }, stx)
  },
  identifier: {
    match: token => !Types.delimiter.match(token) && token.type.klass === _tokens.TokenClass.Ident,
    create: (value, stx) => new Syntax({
      type: _tokens.TokenType.IDENTIFIER,
      value,
      typeCode: _tokens.TypeCodes.Identifier
    }, stx)
  },
  regularExpression: {
    match: token => !Types.delimiter.match(token) && token.type.klass === _tokens.TokenClass.RegularExpression,
    create: (value, stx) => new Syntax({
      type: _tokens.TokenType.REGEXP,
      value,
      typeCode: _tokens.TypeCodes.RegExp
    }, stx)
  },
  // $FlowFixMe: cleanup all this
  braces: {
    match: token => Types.delimiter.match(token) && token.get(0).token.type === _tokens.TokenType.LBRACE,
    create: (inner, stx) => {
      let left = new T.RawSyntax({
        value: new Syntax({
          type: _tokens.TokenType.LBRACE,
          typeCode: _tokens.TypeCodes.Punctuator,
          value: '{',
          slice: getFirstSlice(stx)
        })
      });
      let right = new T.RawSyntax({
        value: new Syntax({
          type: _tokens.TokenType.RBRACE,
          typeCode: _tokens.TypeCodes.Punctuator,
          value: '}',
          slice: getFirstSlice(stx)
        })
      });
      return new T.RawDelimiter({
        kind: 'braces',
        inner: _immutable.List.of(left).concat(inner).push(right)
      });
    }
  },
  // $FlowFixMe: cleanup all this
  brackets: {
    match: token => Types.delimiter.match(token) && token.get(0).token.type === _tokens.TokenType.LBRACK,
    create: (inner, stx) => {
      let left = new T.RawSyntax({
        value: new Syntax({
          type: _tokens.TokenType.LBRACK,
          typeCode: _tokens.TypeCodes.Punctuator,
          value: '[',
          slice: getFirstSlice(stx)
        })
      });
      let right = new T.RawSyntax({
        value: new Syntax({
          type: _tokens.TokenType.RBRACK,
          typeCode: _tokens.TypeCodes.Punctuator,
          value: ']',
          slice: getFirstSlice(stx)
        })
      });
      return new T.RawDelimiter({
        kind: 'brackets',
        inner: _immutable.List.of(left).concat(inner).push(right)
      });
    }
  },
  // $FlowFixMe: cleanup all this
  parens: {
    match: token => Types.delimiter.match(token) && token.get(0).token.type === _tokens.TokenType.LPAREN,
    create: (inner, stx) => {
      let left = new T.RawSyntax({
        value: new Syntax({
          type: _tokens.TokenType.LPAREN,
          typeCode: _tokens.TypeCodes.Punctuator,
          value: '(',
          slice: getFirstSlice(stx)
        })
      });
      let right = new T.RawSyntax({
        value: new Syntax({
          type: _tokens.TokenType.RPAREN,
          typeCode: _tokens.TypeCodes.Punctuator,
          value: ')',
          slice: getFirstSlice(stx)
        })
      });
      return new T.RawDelimiter({
        kind: 'parens',
        inner: _immutable.List.of(left).concat(inner).push(right)
      });
    }
  },

  assign: {
    match: token => {
      if (Types.punctuator.match(token)) {
        switch (token.value) {
          case '=':
          case '|=':
          case '^=':
          case '&=':
          case '<<=':
          case '>>=':
          case '>>>=':
          case '+=':
          case '-=':
          case '*=':
          case '/=':
          case '%=':
            return true;
          default:
            return false;
        }
      }
      return false;
    }
  },

  boolean: {
    match: token => !Types.delimiter.match(token) && token.type === _tokens.TokenType.TRUE || token.type === _tokens.TokenType.FALSE
  },

  template: {
    match: token => !Types.delimiter.match(token) && token.type === _tokens.TokenType.TEMPLATE
  },

  delimiter: {
    match: token => _immutable.List.isList(token)
  },

  syntaxTemplate: {
    match: token => Types.delimiter.match(token) && token.get(0).val() === '#`'
  },

  eof: {
    match: token => !Types.delimiter.match(token) && token.type === _tokens.TokenType.EOS
  }
};
const ALL_PHASES = exports.ALL_PHASES = {};

class Syntax {

  constructor(token, oldstx) {
    this.token = token;
    this.bindings = oldstx && oldstx.bindings != null ? oldstx.bindings : new _bindingMap2.default();
    this.scopesets = oldstx && oldstx.scopesets != null ? oldstx.scopesets : {
      all: (0, _immutable.List)(),
      phase: (0, _immutable.Map)()
    };
    Object.freeze(this);
  }
  // token: Token | List<Token>;


  static of(token, stx) {
    return new Syntax(token, stx);
  }

  static from(type, value, stx) {
    if (!Types[type]) {
      throw new Error(type + ' is not a valid type');
    } else if (!Types[type].create) {
      throw new Error('Cannot create a syntax from type ' + type);
    }
    let newstx = Types[type].create(value, stx);
    let slice = getFirstSlice(stx);
    if (slice != null && newstx.token != null) {
      newstx.token.slice = slice;
    }
    return newstx;
  }

  from(type, value) {
    // TODO: this is gross, fix
    let s = Syntax.from(type, value, this);
    if (s instanceof Syntax) {
      return new T.RawSyntax({ value: s });
    }
    return s;
  }

  fromNull() {
    return this.from('null', null);
  }

  fromNumber(value) {
    return this.from('number', value);
  }

  fromString(value) {
    return this.from('string', value);
  }

  fromPunctuator(value) {
    return this.from('punctuator', value);
  }

  fromKeyword(value) {
    return this.from('keyword', value);
  }

  fromIdentifier(value) {
    return this.from('identifier', value);
  }

  fromRegularExpression(value) {
    return this.from('regularExpression', value);
  }

  static fromNull(stx) {
    return Syntax.from('null', null, stx);
  }

  static fromNumber(value, stx) {
    return Syntax.from('number', value, stx);
  }

  static fromString(value, stx) {
    return Syntax.from('string', value, stx);
  }

  static fromPunctuator(value, stx) {
    return Syntax.from('punctuator', value, stx);
  }

  static fromKeyword(value, stx) {
    return Syntax.from('keyword', value, stx);
  }

  static fromIdentifier(value, stx) {
    return Syntax.from('identifier', value, stx);
  }

  static fromRegularExpression(value, stx) {
    return Syntax.from('regularExpression', value, stx);
  }

  // () -> string
  resolve(phase) {
    (0, _errors.assert)(phase != null, 'must provide a phase to resolve');
    let allScopes = this.scopesets.all;
    let stxScopes = this.scopesets.phase.has(phase) ? this.scopesets.phase.get(phase) : (0, _immutable.List)();
    stxScopes = allScopes.concat(stxScopes);
    if (stxScopes.size === 0 || !(this.match('identifier') || this.match('keyword') || this.match('punctuator'))) {
      return this.token.value;
    }
    let scope = stxScopes.last();
    let bindings = this.bindings;
    if (scope) {
      // List<{ scopes: List<Scope>, binding: Symbol }>
      let scopesetBindingList = bindings.get(this);

      if (scopesetBindingList) {
        // { scopes: List<Scope>, binding: Symbol }
        let biggestBindingPair = scopesetBindingList.filter(({ scopes }) => {
          return scopes.isSubset(stxScopes);
        }).sort(sizeDecending);

        // if (
        //   biggestBindingPair.size >= 2 &&
        //   biggestBindingPair.get(0).scopes.size ===
        //     biggestBindingPair.get(1).scopes.size
        // ) {
        //   let debugBase =
        //     '{' + stxScopes.map(s => s.toString()).join(', ') + '}';
        //   let debugAmbigousScopesets = biggestBindingPair
        //     .map(({ scopes }) => {
        //       return '{' + scopes.map(s => s.toString()).join(', ') + '}';
        //     })
        //     .join(', ');
        //   throw new Error(
        //     'Scopeset ' +
        //       debugBase +
        //       ' has ambiguous subsets ' +
        //       debugAmbigousScopesets,
        //   );
        // } else
        if (biggestBindingPair.size !== 0) {
          let bindingStr = biggestBindingPair.get(0).binding.toString();
          if (_ramdaFantasy.Maybe.isJust(biggestBindingPair.get(0).alias)) {
            // null never happens because we just checked if it is a Just
            return biggestBindingPair.get(0).alias.getOrElse(null).resolve(phase);
          }
          return bindingStr;
        }
      }
    }
    return this.token.value;
  }

  val() {
    (0, _errors.assert)(!this.match('delimiter'), 'cannot get the val of a delimiter');
    if (this.match('string')) {
      return this.token.str;
    }
    if (this.match('template')) {
      if (!this.token.items) return this.token.value;
      return this.token.items.map(el => {
        if (typeof el.match === 'function' && el.match('delimiter')) {
          return '${...}';
        }
        return el.slice.text;
      }).join('');
    }
    return this.token.value;
  }

  lineNumber() {
    if (!this.match('delimiter')) {
      return this.token.slice.startLocation.line;
    } else {
      return this.token.get(0).lineNumber();
    }
  }

  setLineNumber(line) {
    let newTok = {};
    if (this.isDelimiter()) {
      newTok = this.token.map(s => s.setLineNumber(line));
    } else {
      for (let key of Object.keys(this.token)) {
        newTok[key] = this.token[key];
      }
      (0, _errors.assert)(newTok.slice && newTok.slice.startLocation, 'all tokens must have line info');
      newTok.slice.startLocation.line = line;
    }
    return new Syntax(newTok, this);
  }

  // () -> List<Syntax>
  // inner() {
  //   assert(this.match("delimiter"), "can only get the inner of a delimiter");
  //   return this.token.slice(1, this.token.size - 1);
  // }

  addScope(scope, bindings, phase, options = { flip: false }) {
    let token = this.match('delimiter') ? this.token.map(s => s.addScope(scope, bindings, phase, options)) : this.token;
    if (this.match('template')) {
      token = _.merge(token, {
        items: token.items.map(it => {
          if (it instanceof Syntax && it.match('delimiter')) {
            return it.addScope(scope, bindings, phase, options);
          }
          return it;
        })
      });
    }
    let oldScopeset;
    if (phase === ALL_PHASES) {
      oldScopeset = this.scopesets.all;
    } else {
      oldScopeset = this.scopesets.phase.has(phase) ? this.scopesets.phase.get(phase) : (0, _immutable.List)();
    }
    let newScopeset;
    if (options.flip) {
      let index = oldScopeset.indexOf(scope);
      if (index !== -1) {
        newScopeset = oldScopeset.remove(index);
      } else {
        newScopeset = oldScopeset.push(scope);
      }
    } else {
      newScopeset = oldScopeset.push(scope);
    }
    let newstx = {
      bindings,
      scopesets: {
        all: this.scopesets.all,
        phase: this.scopesets.phase
      }
    };

    if (phase === ALL_PHASES) {
      newstx.scopesets.all = newScopeset;
    } else {
      newstx.scopesets.phase = newstx.scopesets.phase.set(phase, newScopeset);
    }
    return new Syntax(token, newstx);
  }

  removeScope(scope, phase) {
    let token = this.match('delimiter') ? this.token.map(s => s.removeScope(scope, phase)) : this.token;
    let phaseScopeset = this.scopesets.phase.has(phase) ? this.scopesets.phase.get(phase) : (0, _immutable.List)();
    let allScopeset = this.scopesets.all;
    let newstx = {
      bindings: this.bindings,
      scopesets: {
        all: this.scopesets.all,
        phase: this.scopesets.phase
      }
    };

    let phaseIndex = phaseScopeset.indexOf(scope);
    let allIndex = allScopeset.indexOf(scope);
    if (phaseIndex !== -1) {
      newstx.scopesets.phase = this.scopesets.phase.set(phase, phaseScopeset.remove(phaseIndex));
    } else if (allIndex !== -1) {
      newstx.scopesets.all = allScopeset.remove(allIndex);
    }
    return new Syntax(token, newstx);
  }

  match(type, value) {
    if (!Types[type]) {
      throw new Error(type + ' is an invalid type');
    }
    return Types[type].match(this.token) && (value == null || (value instanceof RegExp ? value.test(this.val()) : this.val() == value));
  }

  isIdentifier(value) {
    return this.match('identifier', value);
  }

  isAssign(value) {
    return this.match('assign', value);
  }

  isBooleanLiteral(value) {
    return this.match('boolean', value);
  }

  isKeyword(value) {
    return this.match('keyword', value);
  }

  isNullLiteral(value) {
    return this.match('null', value);
  }

  isNumericLiteral(value) {
    return this.match('number', value);
  }

  isPunctuator(value) {
    return this.match('punctuator', value);
  }

  isStringLiteral(value) {
    return this.match('string', value);
  }

  isRegularExpression(value) {
    return this.match('regularExpression', value);
  }

  isTemplate(value) {
    return this.match('template', value);
  }

  isDelimiter(value) {
    return this.match('delimiter', value);
  }

  isParens(value) {
    return this.match('parens', value);
  }

  isBraces(value) {
    return this.match('braces', value);
  }

  isBrackets(value) {
    return this.match('brackets', value);
  }

  isSyntaxTemplate(value) {
    return this.match('syntaxTemplate', value);
  }

  isEOF(value) {
    return this.match('eof', value);
  }

  toString() {
    if (this.match('delimiter')) {
      return this.token.map(s => s.toString()).join(' ');
    }
    if (this.match('string')) {
      return `'${this.token.str}'`;
    }
    if (this.match('template')) {
      return this.val();
    }
    return this.token.value;
  }
}
exports.default = Syntax;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zeW50YXguanMiXSwibmFtZXMiOlsiXyIsIlQiLCJnZXRGaXJzdFNsaWNlIiwic3R4IiwiaXNEZWxpbWl0ZXIiLCJ0b2tlbiIsInNsaWNlIiwiZ2V0Iiwic2l6ZURlY2VuZGluZyIsImEiLCJiIiwic2NvcGVzIiwic2l6ZSIsIlR5cGVzIiwibnVsbCIsIm1hdGNoIiwiZGVsaW1pdGVyIiwidHlwZSIsIk5VTEwiLCJjcmVhdGUiLCJ2YWx1ZSIsIlN5bnRheCIsInR5cGVDb2RlIiwiS2V5d29yZCIsIm51bWJlciIsImtsYXNzIiwiTnVtZXJpY0xpdGVyYWwiLCJOVU1CRVIiLCJzdHJpbmciLCJTdHJpbmdMaXRlcmFsIiwiU1RSSU5HIiwic3RyIiwicHVuY3R1YXRvciIsIlB1bmN0dWF0b3IiLCJuYW1lIiwia2V5d29yZCIsImlkZW50aWZpZXIiLCJJZGVudCIsIklERU5USUZJRVIiLCJJZGVudGlmaWVyIiwicmVndWxhckV4cHJlc3Npb24iLCJSZWd1bGFyRXhwcmVzc2lvbiIsIlJFR0VYUCIsIlJlZ0V4cCIsImJyYWNlcyIsIkxCUkFDRSIsImlubmVyIiwibGVmdCIsIlJhd1N5bnRheCIsInJpZ2h0IiwiUkJSQUNFIiwiUmF3RGVsaW1pdGVyIiwia2luZCIsIm9mIiwiY29uY2F0IiwicHVzaCIsImJyYWNrZXRzIiwiTEJSQUNLIiwiUkJSQUNLIiwicGFyZW5zIiwiTFBBUkVOIiwiUlBBUkVOIiwiYXNzaWduIiwiYm9vbGVhbiIsIlRSVUUiLCJGQUxTRSIsInRlbXBsYXRlIiwiVEVNUExBVEUiLCJpc0xpc3QiLCJzeW50YXhUZW1wbGF0ZSIsInZhbCIsImVvZiIsIkVPUyIsIkFMTF9QSEFTRVMiLCJjb25zdHJ1Y3RvciIsIm9sZHN0eCIsImJpbmRpbmdzIiwic2NvcGVzZXRzIiwiYWxsIiwicGhhc2UiLCJPYmplY3QiLCJmcmVlemUiLCJmcm9tIiwiRXJyb3IiLCJuZXdzdHgiLCJzIiwiZnJvbU51bGwiLCJmcm9tTnVtYmVyIiwiZnJvbVN0cmluZyIsImZyb21QdW5jdHVhdG9yIiwiZnJvbUtleXdvcmQiLCJmcm9tSWRlbnRpZmllciIsImZyb21SZWd1bGFyRXhwcmVzc2lvbiIsInJlc29sdmUiLCJhbGxTY29wZXMiLCJzdHhTY29wZXMiLCJoYXMiLCJzY29wZSIsImxhc3QiLCJzY29wZXNldEJpbmRpbmdMaXN0IiwiYmlnZ2VzdEJpbmRpbmdQYWlyIiwiZmlsdGVyIiwiaXNTdWJzZXQiLCJzb3J0IiwiYmluZGluZ1N0ciIsImJpbmRpbmciLCJ0b1N0cmluZyIsImlzSnVzdCIsImFsaWFzIiwiZ2V0T3JFbHNlIiwiaXRlbXMiLCJtYXAiLCJlbCIsInRleHQiLCJqb2luIiwibGluZU51bWJlciIsInN0YXJ0TG9jYXRpb24iLCJsaW5lIiwic2V0TGluZU51bWJlciIsIm5ld1RvayIsImtleSIsImtleXMiLCJhZGRTY29wZSIsIm9wdGlvbnMiLCJmbGlwIiwibWVyZ2UiLCJpdCIsIm9sZFNjb3Blc2V0IiwibmV3U2NvcGVzZXQiLCJpbmRleCIsImluZGV4T2YiLCJyZW1vdmUiLCJzZXQiLCJyZW1vdmVTY29wZSIsInBoYXNlU2NvcGVzZXQiLCJhbGxTY29wZXNldCIsInBoYXNlSW5kZXgiLCJhbGxJbmRleCIsInRlc3QiLCJpc0lkZW50aWZpZXIiLCJpc0Fzc2lnbiIsImlzQm9vbGVhbkxpdGVyYWwiLCJpc0tleXdvcmQiLCJpc051bGxMaXRlcmFsIiwiaXNOdW1lcmljTGl0ZXJhbCIsImlzUHVuY3R1YXRvciIsImlzU3RyaW5nTGl0ZXJhbCIsImlzUmVndWxhckV4cHJlc3Npb24iLCJpc1RlbXBsYXRlIiwiaXNQYXJlbnMiLCJpc0JyYWNlcyIsImlzQnJhY2tldHMiLCJpc1N5bnRheFRlbXBsYXRlIiwiaXNFT0YiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQUNBOztBQUNBOztJQUFZQSxDOztBQUNaOztJQUFZQyxDOztBQUVaOzs7Ozs7QUEwQkEsU0FBU0MsYUFBVCxDQUF1QkMsR0FBdkIsRUFBcUM7QUFDbkMsTUFB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TCxDQUFXZSxLQUFsQjtBQUNEO0FBdll5QjtrQkFBUEMsTSIsImZpbGUiOiJzeW50YXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuaW1wb3J0IHsgTGlzdCwgTWFwIH0gZnJvbSAnaW1tdXRhYmxlJztcbmltcG9ydCB7IGFzc2VydCB9IGZyb20gJy4vZXJyb3JzJztcbmltcG9ydCBCaW5kaW5nTWFwIGZyb20gJy4vYmluZGluZy1tYXAnO1xuaW1wb3J0IHsgTWF5YmUgfSBmcm9tICdyYW1kYS1mYW50YXN5JztcbmltcG9ydCAqIGFzIF8gZnJvbSAncmFtZGEnO1xuaW1wb3J0ICogYXMgVCBmcm9tICdzd2VldC1zcGVjJztcblxuaW1wb3J0IHsgVG9rZW5UeXBlLCBUb2tlbkNsYXNzLCBUeXBlQ29kZXMgfSBmcm9tICcuL3Rva2Vucyc7XG5cbnR5cGUgVG9rZW4gPSB7XG4gIHR5cGU6IGFueSxcbiAgdmFsdWU6IGFueSxcbiAgc2xpY2U6IGFueSxcbn07XG5cbnR5cGUgVG9rZW5UYWcgPVxuICB8ICdudWxsJ1xuICB8ICdudW1iZXInXG4gIHwgJ3N0cmluZydcbiAgfCAncHVuY3R1YXRvcidcbiAgfCAna2V5d29yZCdcbiAgfCAnaWRlbnRpZmllcidcbiAgfCAncmVndWxhckV4cHJlc3Npb24nXG4gIHwgJ2Jvb2xlYW4nXG4gIHwgJ2JyYWNlcydcbiAgfCAncGFyZW5zJ1xuICB8ICdkZWxpbWl0ZXInXG4gIHwgJ2VvZidcbiAgfCAndGVtcGxhdGUnXG4gIHwgJ2Fzc2lnbidcbiAgfCAnc3ludGF4VGVtcGxhdGUnXG4gIHwgJ2JyYWNrZXRzJztcblxuZnVuY3Rpb24gZ2V0Rmlyc3RTbGljZShzdHg6ID9TeW50YXgpIHtcbiAgaWYgKCFzdHggfHwgdHlwZW9mIHN0eC5pc0RlbGltaXRlciAhPT0gJ2Z1bmN0aW9uJykgcmV0dXJuIG51bGw7IC8vIFRPRE86IHNob3VsZCBub3QgaGF2ZSB0byBkbyB0aGlzXG4gIGlmICghc3R4LmlzRGVsaW1pdGVyKCkpIHtcbiAgICByZXR1cm4gc3R4LnRva2VuLnNsaWNlO1xuICB9XG4gIHJldHVybiBzdHgudG9rZW4uZ2V0KDApLnRva2VuLnNsaWNlO1xufVxuXG5mdW5jdGlvbiBzaXplRGVjZW5kaW5nKGEsIGIpIHtcbiAgaWYgKGEuc2NvcGVzLnNpemUgPiBiLnNjb3Blcy5zaXplKSB7XG4gICAgcmV0dXJuIC0xO1xuICB9IGVsc2UgaWYgKGIuc2NvcGVzLnNpemUgPiBhLnNjb3Blcy5zaXplKSB7XG4gICAgcmV0dXJuIDE7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cbn1cblxudHlwZSBUeXBlc0hlbHBlciA9IHtcbiAgW2tleTogVG9rZW5UYWddOiB7XG4gICAgbWF0Y2godG9rZW46IGFueSk6IGJvb2xlYW4sXG4gICAgY3JlYXRlPzogKHZhbHVlOiBhbnksIHN0eDogP1N5bnRheCkgPT4gU3ludGF4LFxuICB9LFxufTtcblxuZXhwb3J0IGxldCBUeXBlczogVHlwZXNIZWxwZXIgPSB7XG4gIG51bGw6IHtcbiAgICBtYXRjaDogdG9rZW4gPT5cbiAgICAgICFUeXBlcy5kZWxpbWl0ZXIubWF0Y2godG9rZW4pICYmIHRva2VuLnR5cGUgPT09IFRva2VuVHlwZS5OVUxMLFxuICAgIGNyZWF0ZTogKHZhbHVlLCBzdHgpID0+XG4gICAgICBuZXcgU3ludGF4KFxuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogVG9rZW5UeXBlLk5VTEwsXG4gICAgICAgICAgdmFsdWU6IG51bGwsXG4gICAgICAgICAgdHlwZUNvZGU6IFR5cGVDb2Rlcy5LZXl3b3JkLFxuICAgICAgICB9LFxuICAgICAgICBzdHgsXG4gICAgICApLFxuICB9LFxuICBudW1iZXI6IHtcbiAgICBtYXRjaDogdG9rZW4gPT5cbiAgICAgICFUeXBlcy5kZWxpbWl0ZXIubWF0Y2godG9rZW4pICYmXG4gICAgICB0b2tlbi50eXBlLmtsYXNzID09PSBUb2tlbkNsYXNzLk51bWVyaWNMaXRlcmFsLFxuICAgIGNyZWF0ZTogKHZhbHVlLCBzdHgpID0+XG4gICAgICBuZXcgU3ludGF4KFxuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogVG9rZW5UeXBlLk5VTUJFUixcbiAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgICB0eXBlQ29kZTogVHlwZUNvZGVzLk51bWVyaWNMaXRlcmFsLFxuICAgICAgICB9LFxuICAgICAgICBzdHgsXG4gICAgICApLFxuICB9LFxuICBzdHJpbmc6IHtcbiAgICBtYXRjaDogdG9rZW4gPT5cbiAgICAgICFUeXBlcy5kZWxpbWl0ZXIubWF0Y2godG9rZW4pICYmXG4gICAgICB0b2tlbi50eXBlLmtsYXNzID09PSBUb2tlbkNsYXNzLlN0cmluZ0xpdGVyYWwsXG4gICAgY3JlYXRlOiAodmFsdWUsIHN0eCkgPT5cbiAgICAgIG5ldyBTeW50YXgoXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiBUb2tlblR5cGUuU1RSSU5HLFxuICAgICAgICAgIHN0cjogdmFsdWUsXG4gICAgICAgICAgdHlwZUNvZGU6IFR5cGVDb2Rlcy5TdHJpbmdMaXRlcmFsLFxuICAgICAgICB9LFxuICAgICAgICBzdHgsXG4gICAgICApLFxuICB9LFxuICBwdW5jdHVhdG9yOiB7XG4gICAgbWF0Y2g6IHRva2VuID0+XG4gICAgICAhVHlwZXMuZGVsaW1pdGVyLm1hdGNoKHRva2VuKSAmJlxuICAgICAgdG9rZW4udHlwZS5rbGFzcyA9PT0gVG9rZW5DbGFzcy5QdW5jdHVhdG9yLFxuICAgIGNyZWF0ZTogKHZhbHVlLCBzdHgpID0+XG4gICAgICBuZXcgU3ludGF4KFxuICAgICAgICB7XG4gICAgICAgICAgdHlwZToge1xuICAgICAgICAgICAga2xhc3M6IFRva2VuQ2xhc3MuUHVuY3R1YXRvcixcbiAgICAgICAgICAgIG5hbWU6IHZhbHVlLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgdHlwZUNvZGU6IFR5cGVDb2Rlcy5QdW5jdHVhdG9yLFxuICAgICAgICAgIHZhbHVlLFxuICAgICAgICB9LFxuICAgICAgICBzdHgsXG4gICAgICApLFxuICB9LFxuICBrZXl3b3JkOiB7XG4gICAgbWF0Y2g6IHRva2VuID0+XG4gICAgICAhVHlwZXMuZGVsaW1pdGVyLm1hdGNoKHRva2VuKSAmJiB0b2tlbi50eXBlLmtsYXNzID09PSBUb2tlbkNsYXNzLktleXdvcmQsXG4gICAgY3JlYXRlOiAodmFsdWUsIHN0eCkgPT5cbiAgICAgIG5ldyBTeW50YXgoXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiB7XG4gICAgICAgICAgICBrbGFzczogVG9rZW5DbGFzcy5LZXl3b3JkLFxuICAgICAgICAgICAgbmFtZTogdmFsdWUsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB0eXBlQ29kZTogVHlwZUNvZGVzLktleXdvcmQsXG4gICAgICAgICAgdmFsdWUsXG4gICAgICAgIH0sXG4gICAgICAgIHN0eCxcbiAgICAgICksXG4gIH0sXG4gIGlkZW50aWZpZXI6IHtcbiAgICBtYXRjaDogdG9rZW4gPT5cbiAgICAgICFUeXBlcy5kZWxpbWl0ZXIubWF0Y2godG9rZW4pICYmIHRva2VuLnR5cGUua2xhc3MgPT09IFRva2VuQ2xhc3MuSWRlbnQsXG4gICAgY3JlYXRlOiAodmFsdWUsIHN0eCkgPT5cbiAgICAgIG5ldyBTeW50YXgoXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiBUb2tlblR5cGUuSURFTlRJRklFUixcbiAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgICB0eXBlQ29kZTogVHlwZUNvZGVzLklkZW50aWZpZXIsXG4gICAgICAgIH0sXG4gICAgICAgIHN0eCxcbiAgICAgICksXG4gIH0sXG4gIHJlZ3VsYXJFeHByZXNzaW9uOiB7XG4gICAgbWF0Y2g6IHRva2VuID0+XG4gICAgICAhVHlwZXMuZGVsaW1pdGVyLm1hdGNoKHRva2VuKSAmJlxuICAgICAgdG9rZW4udHlwZS5rbGFzcyA9PT0gVG9rZW5DbGFzcy5SZWd1bGFyRXhwcmVzc2lvbixcbiAgICBjcmVhdGU6ICh2YWx1ZSwgc3R4KSA9PlxuICAgICAgbmV3IFN5bnRheChcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6IFRva2VuVHlwZS5SRUdFWFAsXG4gICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgdHlwZUNvZGU6IFR5cGVDb2Rlcy5SZWdFeHAsXG4gICAgICAgIH0sXG4gICAgICAgIHN0eCxcbiAgICAgICksXG4gIH0sXG4gIC8vICRGbG93Rml4TWU6IGNsZWFudXAgYWxsIHRoaXNcbiAgYnJhY2VzOiB7XG4gICAgbWF0Y2g6IHRva2VuID0+XG4gICAgICBUeXBlcy5kZWxpbWl0ZXIubWF0Y2godG9rZW4pICYmXG4gICAgICB0b2tlbi5nZXQoMCkudG9rZW4udHlwZSA9PT0gVG9rZW5UeXBlLkxCUkFDRSxcbiAgICBjcmVhdGU6IChpbm5lciwgc3R4KSA9PiB7XG4gICAgICBsZXQgbGVmdCA9IG5ldyBULlJhd1N5bnRheCh7XG4gICAgICAgIHZhbHVlOiBuZXcgU3ludGF4KHtcbiAgICAgICAgICB0eXBlOiBUb2tlblR5cGUuTEJSQUNFLFxuICAgICAgICAgIHR5cGVDb2RlOiBUeXBlQ29kZXMuUHVuY3R1YXRvcixcbiAgICAgICAgICB2YWx1ZTogJ3snLFxuICAgICAgICAgIHNsaWNlOiBnZXRGaXJzdFNsaWNlKHN0eCksXG4gICAgICAgIH0pLFxuICAgICAgfSk7XG4gICAgICBsZXQgcmlnaHQgPSBuZXcgVC5SYXdTeW50YXgoe1xuICAgICAgICB2YWx1ZTogbmV3IFN5bnRheCh7XG4gICAgICAgICAgdHlwZTogVG9rZW5UeXBlLlJCUkFDRSxcbiAgICAgICAgICB0eXBlQ29kZTogVHlwZUNvZGVzLlB1bmN0dWF0b3IsXG4gICAgICAgICAgdmFsdWU6ICd9JyxcbiAgICAgICAgICBzbGljZTogZ2V0Rmlyc3RTbGljZShzdHgpLFxuICAgICAgICB9KSxcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIG5ldyBULlJhd0RlbGltaXRlcih7XG4gICAgICAgIGtpbmQ6ICdicmFjZXMnLFxuICAgICAgICBpbm5lcjogTGlzdC5vZihsZWZ0KS5jb25jYXQoaW5uZXIpLnB1c2gocmlnaHQpLFxuICAgICAgfSk7XG4gICAgfSxcbiAgfSxcbiAgLy8gJEZsb3dGaXhNZTogY2xlYW51cCBhbGwgdGhpc1xuICBicmFja2V0czoge1xuICAgIG1hdGNoOiB0b2tlbiA9PlxuICAgICAgVHlwZXMuZGVsaW1pdGVyLm1hdGNoKHRva2VuKSAmJlxuICAgICAgdG9rZW4uZ2V0KDApLnRva2VuLnR5cGUgPT09IFRva2VuVHlwZS5MQlJBQ0ssXG4gICAgY3JlYXRlOiAoaW5uZXIsIHN0eCkgPT4ge1xuICAgICAgbGV0IGxlZnQgPSBuZXcgVC5SYXdTeW50YXgoe1xuICAgICAgICB2YWx1ZTogbmV3IFN5bnRheCh7XG4gICAgICAgICAgdHlwZTogVG9rZW5UeXBlLkxCUkFDSyxcbiAgICAgICAgICB0eXBlQ29kZTogVHlwZUNvZGVzLlB1bmN0dWF0b3IsXG4gICAgICAgICAgdmFsdWU6ICdbJyxcbiAgICAgICAgICBzbGljZTogZ2V0Rmlyc3RTbGljZShzdHgpLFxuICAgICAgICB9KSxcbiAgICAgIH0pO1xuICAgICAgbGV0IHJpZ2h0ID0gbmV3IFQuUmF3U3ludGF4KHtcbiAgICAgICAgdmFsdWU6IG5ldyBTeW50YXgoe1xuICAgICAgICAgIHR5cGU6IFRva2VuVHlwZS5SQlJBQ0ssXG4gICAgICAgICAgdHlwZUNvZGU6IFR5cGVDb2Rlcy5QdW5jdHVhdG9yLFxuICAgICAgICAgIHZhbHVlOiAnXScsXG4gICAgICAgICAgc2xpY2U6IGdldEZpcnN0U2xpY2Uoc3R4KSxcbiAgICAgICAgfSksXG4gICAgICB9KTtcbiAgICAgIHJldHVybiBuZXcgVC5SYXdEZWxpbWl0ZXIoe1xuICAgICAgICBraW5kOiAnYnJhY2tldHMnLFxuICAgICAgICBpbm5lcjogTGlzdC5vZihsZWZ0KS5jb25jYXQoaW5uZXIpLnB1c2gocmlnaHQpLFxuICAgICAgfSk7XG4gICAgfSxcbiAgfSxcbiAgLy8gJEZsb3dGaXhNZTogY2xlYW51cCBhbGwgdGhpc1xuICBwYXJlbnM6IHtcbiAgICBtYXRjaDogdG9rZW4gPT5cbiAgICAgIFR5cGVzLmRlbGltaXRlci5tYXRjaCh0b2tlbikgJiZcbiAgICAgIHRva2VuLmdldCgwKS50b2tlbi50eXBlID09PSBUb2tlblR5cGUuTFBBUkVOLFxuICAgIGNyZWF0ZTogKGlubmVyLCBzdHgpID0+IHtcbiAgICAgIGxldCBsZWZ0ID0gbmV3IFQuUmF3U3ludGF4KHtcbiAgICAgICAgdmFsdWU6IG5ldyBTeW50YXgoe1xuICAgICAgICAgIHR5cGU6IFRva2VuVHlwZS5MUEFSRU4sXG4gICAgICAgICAgdHlwZUNvZGU6IFR5cGVDb2Rlcy5QdW5jdHVhdG9yLFxuICAgICAgICAgIHZhbHVlOiAnKCcsXG4gICAgICAgICAgc2xpY2U6IGdldEZpcnN0U2xpY2Uoc3R4KSxcbiAgICAgICAgfSksXG4gICAgICB9KTtcbiAgICAgIGxldCByaWdodCA9IG5ldyBULlJhd1N5bnRheCh7XG4gICAgICAgIHZhbHVlOiBuZXcgU3ludGF4KHtcbiAgICAgICAgICB0eXBlOiBUb2tlblR5cGUuUlBBUkVOLFxuICAgICAgICAgIHR5cGVDb2RlOiBUeXBlQ29kZXMuUHVuY3R1YXRvcixcbiAgICAgICAgICB2YWx1ZTogJyknLFxuICAgICAgICAgIHNsaWNlOiBnZXRGaXJzdFNsaWNlKHN0eCksXG4gICAgICAgIH0pLFxuICAgICAgfSk7XG4gICAgICByZXR1cm4gbmV3IFQuUmF3RGVsaW1pdGVyKHtcbiAgICAgICAga2luZDogJ3BhcmVucycsXG4gICAgICAgIGlubmVyOiBMaXN0Lm9mKGxlZnQpLmNvbmNhdChpbm5lcikucHVzaChyaWdodCksXG4gICAgICB9KTtcbiAgICB9LFxuICB9LFxuXG4gIGFzc2lnbjoge1xuICAgIG1hdGNoOiB0b2tlbiA9PiB7XG4gICAgICBpZiAoVHlwZXMucHVuY3R1YXRvci5tYXRjaCh0b2tlbikpIHtcbiAgICAgICAgc3dpdGNoICh0b2tlbi52YWx1ZSkge1xuICAgICAgICAgIGNhc2UgJz0nOlxuICAgICAgICAgIGNhc2UgJ3w9JzpcbiAgICAgICAgICBjYXNlICdePSc6XG4gICAgICAgICAgY2FzZSAnJj0nOlxuICAgICAgICAgIGNhc2UgJzw8PSc6XG4gICAgICAgICAgY2FzZSAnPj49JzpcbiAgICAgICAgICBjYXNlICc+Pj49JzpcbiAgICAgICAgICBjYXNlICcrPSc6XG4gICAgICAgICAgY2FzZSAnLT0nOlxuICAgICAgICAgIGNhc2UgJyo9JzpcbiAgICAgICAgICBjYXNlICcvPSc6XG4gICAgICAgICAgY2FzZSAnJT0nOlxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG4gIH0sXG5cbiAgYm9vbGVhbjoge1xuICAgIG1hdGNoOiB0b2tlbiA9PlxuICAgICAgKCFUeXBlcy5kZWxpbWl0ZXIubWF0Y2godG9rZW4pICYmIHRva2VuLnR5cGUgPT09IFRva2VuVHlwZS5UUlVFKSB8fFxuICAgICAgdG9rZW4udHlwZSA9PT0gVG9rZW5UeXBlLkZBTFNFLFxuICB9LFxuXG4gIHRlbXBsYXRlOiB7XG4gICAgbWF0Y2g6IHRva2VuID0+XG4gICAgICAhVHlwZXMuZGVsaW1pdGVyLm1hdGNoKHRva2VuKSAmJiB0b2tlbi50eXBlID09PSBUb2tlblR5cGUuVEVNUExBVEUsXG4gIH0sXG5cbiAgZGVsaW1pdGVyOiB7XG4gICAgbWF0Y2g6IHRva2VuID0+IExpc3QuaXNMaXN0KHRva2VuKSxcbiAgfSxcblxuICBzeW50YXhUZW1wbGF0ZToge1xuICAgIG1hdGNoOiB0b2tlbiA9PiBUeXBlcy5kZWxpbWl0ZXIubWF0Y2godG9rZW4pICYmIHRva2VuLmdldCgwKS52YWwoKSA9PT0gJyNgJyxcbiAgfSxcblxuICBlb2Y6IHtcbiAgICBtYXRjaDogdG9rZW4gPT5cbiAgICAgICFUeXBlcy5kZWxpbWl0ZXIubWF0Y2godG9rZW4pICYmIHRva2VuLnR5cGUgPT09IFRva2VuVHlwZS5FT1MsXG4gIH0sXG59O1xuZXhwb3J0IGNvbnN0IEFMTF9QSEFTRVMgPSB7fTtcblxudHlwZSBTY29wZXNldCA9IHtcbiAgYWxsOiBMaXN0PGFueT4sXG4gIHBoYXNlOiBNYXA8bnVtYmVyIHwge30sIGFueT4sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTeW50YXgge1xuICAvLyB0b2tlbjogVG9rZW4gfCBMaXN0PFRva2VuPjtcbiAgdG9rZW46IGFueTtcbiAgYmluZGluZ3M6IEJpbmRpbmdNYXA7XG4gIHNjb3Blc2V0czogU2NvcGVzZXQ7XG5cbiAgY29uc3RydWN0b3IodG9rZW46IGFueSwgb2xkc3R4OiA/eyBiaW5kaW5nczogYW55LCBzY29wZXNldHM6IGFueSB9KSB7XG4gICAgdGhpcy50b2tlbiA9IHRva2VuO1xuICAgIHRoaXMuYmluZGluZ3MgPVxuICAgICAgb2xkc3R4ICYmIG9sZHN0eC5iaW5kaW5ncyAhPSBudWxsID8gb2xkc3R4LmJpbmRpbmdzIDogbmV3IEJpbmRpbmdNYXAoKTtcbiAgICB0aGlzLnNjb3Blc2V0cyA9XG4gICAgICBvbGRzdHggJiYgb2xkc3R4LnNjb3Blc2V0cyAhPSBudWxsXG4gICAgICAgID8gb2xkc3R4LnNjb3Blc2V0c1xuICAgICAgICA6IHtcbiAgICAgICAgICAgIGFsbDogTGlzdCgpLFxuICAgICAgICAgICAgcGhhc2U6IE1hcCgpLFxuICAgICAgICAgIH07XG4gICAgT2JqZWN0LmZyZWV6ZSh0aGlzKTtcbiAgfVxuXG4gIHN0YXRpYyBvZih0b2tlbjogVG9rZW4sIHN0eDogP1N5bnRheCkge1xuICAgIHJldHVybiBuZXcgU3ludGF4KHRva2VuLCBzdHgpO1xuICB9XG5cbiAgc3RhdGljIGZyb20odHlwZSwgdmFsdWUsIHN0eDogP1N5bnRheCkge1xuICAgIGlmICghVHlwZXNbdHlwZV0pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcih0eXBlICsgJyBpcyBub3QgYSB2YWxpZCB0eXBlJyk7XG4gICAgfSBlbHNlIGlmICghVHlwZXNbdHlwZV0uY3JlYXRlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBjcmVhdGUgYSBzeW50YXggZnJvbSB0eXBlICcgKyB0eXBlKTtcbiAgICB9XG4gICAgbGV0IG5ld3N0eCA9IFR5cGVzW3R5cGVdLmNyZWF0ZSh2YWx1ZSwgc3R4KTtcbiAgICBsZXQgc2xpY2UgPSBnZXRGaXJzdFNsaWNlKHN0eCk7XG4gICAgaWYgKHNsaWNlICE9IG51bGwgJiYgbmV3c3R4LnRva2VuICE9IG51bGwpIHtcbiAgICAgIG5ld3N0eC50b2tlbi5zbGljZSA9IHNsaWNlO1xuICAgIH1cbiAgICByZXR1cm4gbmV3c3R4O1xuICB9XG5cbiAgZnJvbSh0eXBlOiBUb2tlblRhZywgdmFsdWU6IGFueSkge1xuICAgIC8vIFRPRE86IHRoaXMgaXMgZ3Jvc3MsIGZpeFxuICAgIGxldCBzID0gU3ludGF4LmZyb20odHlwZSwgdmFsdWUsIHRoaXMpO1xuICAgIGlmIChzIGluc3RhbmNlb2YgU3ludGF4KSB7XG4gICAgICByZXR1cm4gbmV3IFQuUmF3U3ludGF4KHsgdmFsdWU6IHMgfSk7XG4gICAgfVxuICAgIHJldHVybiBzO1xuICB9XG5cbiAgZnJvbU51bGwoKSB7XG4gICAgcmV0dXJuIHRoaXMuZnJvbSgnbnVsbCcsIG51bGwpO1xuICB9XG5cbiAgZnJvbU51bWJlcih2YWx1ZTogbnVtYmVyKSB7XG4gICAgcmV0dXJuIHRoaXMuZnJvbSgnbnVtYmVyJywgdmFsdWUpO1xuICB9XG5cbiAgZnJvbVN0cmluZyh2YWx1ZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHRoaXMuZnJvbSgnc3RyaW5nJywgdmFsdWUpO1xuICB9XG5cbiAgZnJvbVB1bmN0dWF0b3IodmFsdWU6IHN0cmluZykge1xuICAgIHJldHVybiB0aGlzLmZyb20oJ3B1bmN0dWF0b3InLCB2YWx1ZSk7XG4gIH1cblxuICBmcm9tS2V5d29yZCh2YWx1ZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHRoaXMuZnJvbSgna2V5d29yZCcsIHZhbHVlKTtcbiAgfVxuXG4gIGZyb21JZGVudGlmaWVyKHZhbHVlOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5mcm9tKCdpZGVudGlmaWVyJywgdmFsdWUpO1xuICB9XG5cbiAgZnJvbVJlZ3VsYXJFeHByZXNzaW9uKHZhbHVlOiBhbnkpIHtcbiAgICByZXR1cm4gdGhpcy5mcm9tKCdyZWd1bGFyRXhwcmVzc2lvbicsIHZhbHVlKTtcbiAgfVxuXG4gIHN0YXRpYyBmcm9tTnVsbChzdHg6IFN5bnRheCkge1xuICAgIHJldHVybiBTeW50YXguZnJvbSgnbnVsbCcsIG51bGwsIHN0eCk7XG4gIH1cblxuICBzdGF0aWMgZnJvbU51bWJlcih2YWx1ZSwgc3R4KSB7XG4gICAgcmV0dXJuIFN5bnRheC5mcm9tKCdudW1iZXInLCB2YWx1ZSwgc3R4KTtcbiAgfVxuXG4gIHN0YXRpYyBmcm9tU3RyaW5nKHZhbHVlLCBzdHgpIHtcbiAgICByZXR1cm4gU3ludGF4LmZyb20oJ3N0cmluZycsIHZhbHVlLCBzdHgpO1xuICB9XG5cbiAgc3RhdGljIGZyb21QdW5jdHVhdG9yKHZhbHVlLCBzdHgpIHtcbiAgICByZXR1cm4gU3ludGF4LmZyb20oJ3B1bmN0dWF0b3InLCB2YWx1ZSwgc3R4KTtcbiAgfVxuXG4gIHN0YXRpYyBmcm9tS2V5d29yZCh2YWx1ZSwgc3R4KSB7XG4gICAgcmV0dXJuIFN5bnRheC5mcm9tKCdrZXl3b3JkJywgdmFsdWUsIHN0eCk7XG4gIH1cblxuICBzdGF0aWMgZnJvbUlkZW50aWZpZXIodmFsdWUsIHN0eCkge1xuICAgIHJldHVybiBTeW50YXguZnJvbSgnaWRlbnRpZmllcicsIHZhbHVlLCBzdHgpO1xuICB9XG5cbiAgc3RhdGljIGZyb21SZWd1bGFyRXhwcmVzc2lvbih2YWx1ZSwgc3R4KSB7XG4gICAgcmV0dXJuIFN5bnRheC5mcm9tKCdyZWd1bGFyRXhwcmVzc2lvbicsIHZhbHVlLCBzdHgpO1xuICB9XG5cbiAgLy8gKCkgLT4gc3RyaW5nXG4gIHJlc29sdmUocGhhc2U6IGFueSkge1xuICAgIGFzc2VydChwaGFzZSAhPSBudWxsLCAnbXVzdCBwcm92aWRlIGEgcGhhc2UgdG8gcmVzb2x2ZScpO1xuICAgIGxldCBhbGxTY29wZXMgPSB0aGlzLnNjb3Blc2V0cy5hbGw7XG4gICAgbGV0IHN0eFNjb3BlcyA9IHRoaXMuc2NvcGVzZXRzLnBoYXNlLmhhcyhwaGFzZSlcbiAgICAgID8gdGhpcy5zY29wZXNldHMucGhhc2UuZ2V0KHBoYXNlKVxuICAgICAgOiBMaXN0KCk7XG4gICAgc3R4U2NvcGVzID0gYWxsU2NvcGVzLmNvbmNhdChzdHhTY29wZXMpO1xuICAgIGlmIChcbiAgICAgIHN0eFNjb3Blcy5zaXplID09PSAwIHx8XG4gICAgICAhKFxuICAgICAgICB0aGlzLm1hdGNoKCdpZGVudGlmaWVyJykgfHxcbiAgICAgICAgdGhpcy5tYXRjaCgna2V5d29yZCcpIHx8XG4gICAgICAgIHRoaXMubWF0Y2goJ3B1bmN0dWF0b3InKVxuICAgICAgKVxuICAgICkge1xuICAgICAgcmV0dXJuIHRoaXMudG9rZW4udmFsdWU7XG4gICAgfVxuICAgIGxldCBzY29wZSA9IHN0eFNjb3Blcy5sYXN0KCk7XG4gICAgbGV0IGJpbmRpbmdzID0gdGhpcy5iaW5kaW5ncztcbiAgICBpZiAoc2NvcGUpIHtcbiAgICAgIC8vIExpc3Q8eyBzY29wZXM6IExpc3Q8U2NvcGU+LCBiaW5kaW5nOiBTeW1ib2wgfT5cbiAgICAgIGxldCBzY29wZXNldEJpbmRpbmdMaXN0ID0gYmluZGluZ3MuZ2V0KHRoaXMpO1xuXG4gICAgICBpZiAoc2NvcGVzZXRCaW5kaW5nTGlzdCkge1xuICAgICAgICAvLyB7IHNjb3BlczogTGlzdDxTY29wZT4sIGJpbmRpbmc6IFN5bWJvbCB9XG4gICAgICAgIGxldCBiaWdnZXN0QmluZGluZ1BhaXIgPSBzY29wZXNldEJpbmRpbmdMaXN0XG4gICAgICAgICAgLmZpbHRlcigoeyBzY29wZXMgfSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHNjb3Blcy5pc1N1YnNldChzdHhTY29wZXMpO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLnNvcnQoc2l6ZURlY2VuZGluZyk7XG5cbiAgICAgICAgLy8gaWYgKFxuICAgICAgICAvLyAgIGJpZ2dlc3RCaW5kaW5nUGFpci5zaXplID49IDIgJiZcbiAgICAgICAgLy8gICBiaWdnZXN0QmluZGluZ1BhaXIuZ2V0KDApLnNjb3Blcy5zaXplID09PVxuICAgICAgICAvLyAgICAgYmlnZ2VzdEJpbmRpbmdQYWlyLmdldCgxKS5zY29wZXMuc2l6ZVxuICAgICAgICAvLyApIHtcbiAgICAgICAgLy8gICBsZXQgZGVidWdCYXNlID1cbiAgICAgICAgLy8gICAgICd7JyArIHN0eFNjb3Blcy5tYXAocyA9PiBzLnRvU3RyaW5nKCkpLmpvaW4oJywgJykgKyAnfSc7XG4gICAgICAgIC8vICAgbGV0IGRlYnVnQW1iaWdvdXNTY29wZXNldHMgPSBiaWdnZXN0QmluZGluZ1BhaXJcbiAgICAgICAgLy8gICAgIC5tYXAoKHsgc2NvcGVzIH0pID0+IHtcbiAgICAgICAgLy8gICAgICAgcmV0dXJuICd7JyArIHNjb3Blcy5tYXAocyA9PiBzLnRvU3RyaW5nKCkpLmpvaW4oJywgJykgKyAnfSc7XG4gICAgICAgIC8vICAgICB9KVxuICAgICAgICAvLyAgICAgLmpvaW4oJywgJyk7XG4gICAgICAgIC8vICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAvLyAgICAgJ1Njb3Blc2V0ICcgK1xuICAgICAgICAvLyAgICAgICBkZWJ1Z0Jhc2UgK1xuICAgICAgICAvLyAgICAgICAnIGhhcyBhbWJpZ3VvdXMgc3Vic2V0cyAnICtcbiAgICAgICAgLy8gICAgICAgZGVidWdBbWJpZ291c1Njb3Blc2V0cyxcbiAgICAgICAgLy8gICApO1xuICAgICAgICAvLyB9IGVsc2VcbiAgICAgICAgaWYgKGJpZ2dlc3RCaW5kaW5nUGFpci5zaXplICE9PSAwKSB7XG4gICAgICAgICAgbGV0IGJpbmRpbmdTdHIgPSBiaWdnZXN0QmluZGluZ1BhaXIuZ2V0KDApLmJpbmRpbmcudG9TdHJpbmcoKTtcbiAgICAgICAgICBpZiAoTWF5YmUuaXNKdXN0KGJpZ2dlc3RCaW5kaW5nUGFpci5nZXQoMCkuYWxpYXMpKSB7XG4gICAgICAgICAgICAvLyBudWxsIG5ldmVyIGhhcHBlbnMgYmVjYXVzZSB3ZSBqdXN0IGNoZWNrZWQgaWYgaXQgaXMgYSBKdXN0XG4gICAgICAgICAgICByZXR1cm4gYmlnZ2VzdEJpbmRpbmdQYWlyXG4gICAgICAgICAgICAgIC5nZXQoMClcbiAgICAgICAgICAgICAgLmFsaWFzLmdldE9yRWxzZShudWxsKVxuICAgICAgICAgICAgICAucmVzb2x2ZShwaGFzZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBiaW5kaW5nU3RyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnRva2VuLnZhbHVlO1xuICB9XG5cbiAgdmFsKCk6IGFueSB7XG4gICAgYXNzZXJ0KCF0aGlzLm1hdGNoKCdkZWxpbWl0ZXInKSwgJ2Nhbm5vdCBnZXQgdGhlIHZhbCBvZiBhIGRlbGltaXRlcicpO1xuICAgIGlmICh0aGlzLm1hdGNoKCdzdHJpbmcnKSkge1xuICAgICAgcmV0dXJuIHRoaXMudG9rZW4uc3RyO1xuICAgIH1cbiAgICBpZiAodGhpcy5tYXRjaCgndGVtcGxhdGUnKSkge1xuICAgICAgaWYgKCF0aGlzLnRva2VuLml0ZW1zKSByZXR1cm4gdGhpcy50b2tlbi52YWx1ZTtcbiAgICAgIHJldHVybiB0aGlzLnRva2VuLml0ZW1zXG4gICAgICAgIC5tYXAoZWwgPT4ge1xuICAgICAgICAgIGlmICh0eXBlb2YgZWwubWF0Y2ggPT09ICdmdW5jdGlvbicgJiYgZWwubWF0Y2goJ2RlbGltaXRlcicpKSB7XG4gICAgICAgICAgICByZXR1cm4gJyR7Li4ufSc7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBlbC5zbGljZS50ZXh0O1xuICAgICAgICB9KVxuICAgICAgICAuam9pbignJyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnRva2VuLnZhbHVlO1xuICB9XG5cbiAgbGluZU51bWJlcigpIHtcbiAgICBpZiAoIXRoaXMubWF0Y2goJ2RlbGltaXRlcicpKSB7XG4gICAgICByZXR1cm4gdGhpcy50b2tlbi5zbGljZS5zdGFydExvY2F0aW9uLmxpbmU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLnRva2VuLmdldCgwKS5saW5lTnVtYmVyKCk7XG4gICAgfVxuICB9XG5cbiAgc2V0TGluZU51bWJlcihsaW5lOiBudW1iZXIpIHtcbiAgICBsZXQgbmV3VG9rID0ge307XG4gICAgaWYgKHRoaXMuaXNEZWxpbWl0ZXIoKSkge1xuICAgICAgbmV3VG9rID0gdGhpcy50b2tlbi5tYXAocyA9PiBzLnNldExpbmVOdW1iZXIobGluZSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGxldCBrZXkgb2YgT2JqZWN0LmtleXModGhpcy50b2tlbikpIHtcbiAgICAgICAgbmV3VG9rW2tleV0gPSB0aGlzLnRva2VuW2tleV07XG4gICAgICB9XG4gICAgICBhc3NlcnQoXG4gICAgICAgIG5ld1Rvay5zbGljZSAmJiBuZXdUb2suc2xpY2Uuc3RhcnRMb2NhdGlvbixcbiAgICAgICAgJ2FsbCB0b2tlbnMgbXVzdCBoYXZlIGxpbmUgaW5mbycsXG4gICAgICApO1xuICAgICAgbmV3VG9rLnNsaWNlLnN0YXJ0TG9jYXRpb24ubGluZSA9IGxpbmU7XG4gICAgfVxuICAgIHJldHVybiBuZXcgU3ludGF4KG5ld1RvaywgdGhpcyk7XG4gIH1cblxuICAvLyAoKSAtPiBMaXN0PFN5bnRheD5cbiAgLy8gaW5uZXIoKSB7XG4gIC8vICAgYXNzZXJ0KHRoaXMubWF0Y2goXCJkZWxpbWl0ZXJcIiksIFwiY2FuIG9ubHkgZ2V0IHRoZSBpbm5lciBvZiBhIGRlbGltaXRlclwiKTtcbiAgLy8gICByZXR1cm4gdGhpcy50b2tlbi5zbGljZSgxLCB0aGlzLnRva2VuLnNpemUgLSAxKTtcbiAgLy8gfVxuXG4gIGFkZFNjb3BlKFxuICAgIHNjb3BlOiBhbnksXG4gICAgYmluZGluZ3M6IGFueSxcbiAgICBwaGFzZTogbnVtYmVyIHwge30sXG4gICAgb3B0aW9uczogYW55ID0geyBmbGlwOiBmYWxzZSB9LFxuICApIHtcbiAgICBsZXQgdG9rZW4gPSB0aGlzLm1hdGNoKCdkZWxpbWl0ZXInKVxuICAgICAgPyB0aGlzLnRva2VuLm1hcChzID0+IHMuYWRkU2NvcGUoc2NvcGUsIGJpbmRpbmdzLCBwaGFzZSwgb3B0aW9ucykpXG4gICAgICA6IHRoaXMudG9rZW47XG4gICAgaWYgKHRoaXMubWF0Y2goJ3RlbXBsYXRlJykpIHtcbiAgICAgIHRva2VuID0gXy5tZXJnZSh0b2tlbiwge1xuICAgICAgICBpdGVtczogdG9rZW4uaXRlbXMubWFwKGl0ID0+IHtcbiAgICAgICAgICBpZiAoaXQgaW5zdGFuY2VvZiBTeW50YXggJiYgaXQubWF0Y2goJ2RlbGltaXRlcicpKSB7XG4gICAgICAgICAgICByZXR1cm4gaXQuYWRkU2NvcGUoc2NvcGUsIGJpbmRpbmdzLCBwaGFzZSwgb3B0aW9ucyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBpdDtcbiAgICAgICAgfSksXG4gICAgICB9KTtcbiAgICB9XG4gICAgbGV0IG9sZFNjb3Blc2V0O1xuICAgIGlmIChwaGFzZSA9PT0gQUxMX1BIQVNFUykge1xuICAgICAgb2xkU2NvcGVzZXQgPSB0aGlzLnNjb3Blc2V0cy5hbGw7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9sZFNjb3Blc2V0ID0gdGhpcy5zY29wZXNldHMucGhhc2UuaGFzKHBoYXNlKVxuICAgICAgICA/IHRoaXMuc2NvcGVzZXRzLnBoYXNlLmdldChwaGFzZSlcbiAgICAgICAgOiBMaXN0KCk7XG4gICAgfVxuICAgIGxldCBuZXdTY29wZXNldDtcbiAgICBpZiAob3B0aW9ucy5mbGlwKSB7XG4gICAgICBsZXQgaW5kZXggPSBvbGRTY29wZXNldC5pbmRleE9mKHNjb3BlKTtcbiAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgbmV3U2NvcGVzZXQgPSBvbGRTY29wZXNldC5yZW1vdmUoaW5kZXgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV3U2NvcGVzZXQgPSBvbGRTY29wZXNldC5wdXNoKHNjb3BlKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbmV3U2NvcGVzZXQgPSBvbGRTY29wZXNldC5wdXNoKHNjb3BlKTtcbiAgICB9XG4gICAgbGV0IG5ld3N0eCA9IHtcbiAgICAgIGJpbmRpbmdzLFxuICAgICAgc2NvcGVzZXRzOiB7XG4gICAgICAgIGFsbDogdGhpcy5zY29wZXNldHMuYWxsLFxuICAgICAgICBwaGFzZTogdGhpcy5zY29wZXNldHMucGhhc2UsXG4gICAgICB9LFxuICAgIH07XG5cbiAgICBpZiAocGhhc2UgPT09IEFMTF9QSEFTRVMpIHtcbiAgICAgIG5ld3N0eC5zY29wZXNldHMuYWxsID0gbmV3U2NvcGVzZXQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5ld3N0eC5zY29wZXNldHMucGhhc2UgPSBuZXdzdHguc2NvcGVzZXRzLnBoYXNlLnNldChwaGFzZSwgbmV3U2NvcGVzZXQpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFN5bnRheCh0b2tlbiwgbmV3c3R4KTtcbiAgfVxuXG4gIHJlbW92ZVNjb3BlKHNjb3BlOiBhbnksIHBoYXNlOiBudW1iZXIpIHtcbiAgICBsZXQgdG9rZW4gPSB0aGlzLm1hdGNoKCdkZWxpbWl0ZXInKVxuICAgICAgPyB0aGlzLnRva2VuLm1hcChzID0+IHMucmVtb3ZlU2NvcGUoc2NvcGUsIHBoYXNlKSlcbiAgICAgIDogdGhpcy50b2tlbjtcbiAgICBsZXQgcGhhc2VTY29wZXNldCA9IHRoaXMuc2NvcGVzZXRzLnBoYXNlLmhhcyhwaGFzZSlcbiAgICAgID8gdGhpcy5zY29wZXNldHMucGhhc2UuZ2V0KHBoYXNlKVxuICAgICAgOiBMaXN0KCk7XG4gICAgbGV0IGFsbFNjb3Blc2V0ID0gdGhpcy5zY29wZXNldHMuYWxsO1xuICAgIGxldCBuZXdzdHggPSB7XG4gICAgICBiaW5kaW5nczogdGhpcy5iaW5kaW5ncyxcbiAgICAgIHNjb3Blc2V0czoge1xuICAgICAgICBhbGw6IHRoaXMuc2NvcGVzZXRzLmFsbCxcbiAgICAgICAgcGhhc2U6IHRoaXMuc2NvcGVzZXRzLnBoYXNlLFxuICAgICAgfSxcbiAgICB9O1xuXG4gICAgbGV0IHBoYXNlSW5kZXggPSBwaGFzZVNjb3Blc2V0LmluZGV4T2Yoc2NvcGUpO1xuICAgIGxldCBhbGxJbmRleCA9IGFsbFNjb3Blc2V0LmluZGV4T2Yoc2NvcGUpO1xuICAgIGlmIChwaGFzZUluZGV4ICE9PSAtMSkge1xuICAgICAgbmV3c3R4LnNjb3Blc2V0cy5waGFzZSA9IHRoaXMuc2NvcGVzZXRzLnBoYXNlLnNldChcbiAgICAgICAgcGhhc2UsXG4gICAgICAgIHBoYXNlU2NvcGVzZXQucmVtb3ZlKHBoYXNlSW5kZXgpLFxuICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKGFsbEluZGV4ICE9PSAtMSkge1xuICAgICAgbmV3c3R4LnNjb3Blc2V0cy5hbGwgPSBhbGxTY29wZXNldC5yZW1vdmUoYWxsSW5kZXgpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFN5bnRheCh0b2tlbiwgbmV3c3R4KTtcbiAgfVxuXG4gIG1hdGNoKHR5cGU6IFRva2VuVGFnLCB2YWx1ZTogYW55KSB7XG4gICAgaWYgKCFUeXBlc1t0eXBlXSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKHR5cGUgKyAnIGlzIGFuIGludmFsaWQgdHlwZScpO1xuICAgIH1cbiAgICByZXR1cm4gKFxuICAgICAgVHlwZXNbdHlwZV0ubWF0Y2godGhpcy50b2tlbikgJiZcbiAgICAgICh2YWx1ZSA9PSBudWxsIHx8XG4gICAgICAgICh2YWx1ZSBpbnN0YW5jZW9mIFJlZ0V4cFxuICAgICAgICAgID8gdmFsdWUudGVzdCh0aGlzLnZhbCgpKVxuICAgICAgICAgIDogdGhpcy52YWwoKSA9PSB2YWx1ZSkpXG4gICAgKTtcbiAgfVxuXG4gIGlzSWRlbnRpZmllcih2YWx1ZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHRoaXMubWF0Y2goJ2lkZW50aWZpZXInLCB2YWx1ZSk7XG4gIH1cblxuICBpc0Fzc2lnbih2YWx1ZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHRoaXMubWF0Y2goJ2Fzc2lnbicsIHZhbHVlKTtcbiAgfVxuXG4gIGlzQm9vbGVhbkxpdGVyYWwodmFsdWU6IGJvb2xlYW4pIHtcbiAgICByZXR1cm4gdGhpcy5tYXRjaCgnYm9vbGVhbicsIHZhbHVlKTtcbiAgfVxuXG4gIGlzS2V5d29yZCh2YWx1ZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHRoaXMubWF0Y2goJ2tleXdvcmQnLCB2YWx1ZSk7XG4gIH1cblxuICBpc051bGxMaXRlcmFsKHZhbHVlOiBhbnkpIHtcbiAgICByZXR1cm4gdGhpcy5tYXRjaCgnbnVsbCcsIHZhbHVlKTtcbiAgfVxuXG4gIGlzTnVtZXJpY0xpdGVyYWwodmFsdWU6IG51bWJlcikge1xuICAgIHJldHVybiB0aGlzLm1hdGNoKCdudW1iZXInLCB2YWx1ZSk7XG4gIH1cblxuICBpc1B1bmN0dWF0b3IodmFsdWU6IHN0cmluZykge1xuICAgIHJldHVybiB0aGlzLm1hdGNoKCdwdW5jdHVhdG9yJywgdmFsdWUpO1xuICB9XG5cbiAgaXNTdHJpbmdMaXRlcmFsKHZhbHVlOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5tYXRjaCgnc3RyaW5nJywgdmFsdWUpO1xuICB9XG5cbiAgaXNSZWd1bGFyRXhwcmVzc2lvbih2YWx1ZTogYW55KSB7XG4gICAgcmV0dXJuIHRoaXMubWF0Y2goJ3JlZ3VsYXJFeHByZXNzaW9uJywgdmFsdWUpO1xuICB9XG5cbiAgaXNUZW1wbGF0ZSh2YWx1ZTogYW55KSB7XG4gICAgcmV0dXJuIHRoaXMubWF0Y2goJ3RlbXBsYXRlJywgdmFsdWUpO1xuICB9XG5cbiAgaXNEZWxpbWl0ZXIodmFsdWU6IGFueSkge1xuICAgIHJldHVybiB0aGlzLm1hdGNoKCdkZWxpbWl0ZXInLCB2YWx1ZSk7XG4gIH1cblxuICBpc1BhcmVucyh2YWx1ZTogYW55KSB7XG4gICAgcmV0dXJuIHRoaXMubWF0Y2goJ3BhcmVucycsIHZhbHVlKTtcbiAgfVxuXG4gIGlzQnJhY2VzKHZhbHVlOiBhbnkpIHtcbiAgICByZXR1cm4gdGhpcy5tYXRjaCgnYnJhY2VzJywgdmFsdWUpO1xuICB9XG5cbiAgaXNCcmFja2V0cyh2YWx1ZTogYW55KSB7XG4gICAgcmV0dXJuIHRoaXMubWF0Y2goJ2JyYWNrZXRzJywgdmFsdWUpO1xuICB9XG5cbiAgaXNTeW50YXhUZW1wbGF0ZSh2YWx1ZTogYW55KSB7XG4gICAgcmV0dXJuIHRoaXMubWF0Y2goJ3N5bnRheFRlbXBsYXRlJywgdmFsdWUpO1xuICB9XG5cbiAgaXNFT0YodmFsdWU6IGFueSkge1xuICAgIHJldHVybiB0aGlzLm1hdGNoKCdlb2YnLCB2YWx1ZSk7XG4gIH1cblxuICB0b1N0cmluZygpIHtcbiAgICBpZiAodGhpcy5tYXRjaCgnZGVsaW1pdGVyJykpIHtcbiAgICAgIHJldHVybiB0aGlzLnRva2VuLm1hcChzID0+IHMudG9TdHJpbmcoKSkuam9pbignICcpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tYXRjaCgnc3RyaW5nJykpIHtcbiAgICAgIHJldHVybiBgJyR7dGhpcy50b2tlbi5zdHJ9J2A7XG4gICAgfVxuICAgIGlmICh0aGlzLm1hdGNoKCd0ZW1wbGF0ZScpKSB7XG4gICAgICByZXR1cm4gdGhpcy52YWwoKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMudG9rZW4udmFsdWU7XG4gIH1cbn1cbiJdfQ==