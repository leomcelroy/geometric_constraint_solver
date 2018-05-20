'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.phaseInModulePathRegexp = undefined;

var _tokenReader = require('./reader/token-reader');

var _tokenReader2 = _interopRequireDefault(_tokenReader);

var _scope = require('./scope');

var _env = require('./env');

var _env2 = _interopRequireDefault(_env);

var _immutable = require('immutable');

var _compiler = require('./compiler');

var _compiler2 = _interopRequireDefault(_compiler);

var _syntax = require('./syntax');

var _bindingMap = require('./binding-map.js');

var _bindingMap2 = _interopRequireDefault(_bindingMap);

var _sweetSpec = require('sweet-spec');

var _sweetSpec2 = _interopRequireDefault(_sweetSpec);

var _sweetModule = require('./sweet-module');

var _sweetModule2 = _interopRequireDefault(_sweetModule);

var _ramda = require('ramda');

var _ = _interopRequireWildcard(_ramda);

var _scopeReducer = require('./scope-reducer');

var _scopeReducer2 = _interopRequireDefault(_scopeReducer);

var _macroContext = require('./macro-context');

var _babelCore = require('babel-core');

var _store = require('./store');

var _store2 = _interopRequireDefault(_store);

var _multimap = require('./multimap');

var _multimap2 = _interopRequireDefault(_multimap);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const phaseInModulePathRegexp = exports.phaseInModulePathRegexp = /(.*):(\d+)\s*$/;
class SweetLoader {

  constructor(baseDir, options = {}) {
    this.sourceCache = new Map();
    this.compiledCache = new Map();
    this.baseDir = baseDir;
    this.logging = options.logging || false;

    let bindings = new _bindingMap2.default();
    let templateMap = new Map();
    let tempIdent = 0;
    this.context = {
      phase: 0,
      bindings,
      templateMap,
      getTemplateIdentifier: () => ++tempIdent,
      loader: this,
      invokedRegistry: new _multimap2.default(),
      transform: c => {
        if (options.noBabel) {
          return {
            code: c
          };
        }
        return (0, _babelCore.transform)(c, {
          babelrc: true
        });
      }
    };
  }

  normalize(name, refererName, refererAddress) {
    // takes `..path/to/source.js:<phase>`
    // gives `/abs/path/to/source.js:<phase>`
    // missing phases are turned into 0
    if (!phaseInModulePathRegexp.test(name)) {
      return `${name}:0`;
    }
    return name;
  }

  locate({ name, metadata }) {
    // takes `/abs/path/to/source.js:<phase>`
    // gives { path: '/abs/path/to/source.js', phase: <phase> }
    let match = name.match(phaseInModulePathRegexp);
    if (match && match.length >= 3) {
      return {
        path: match[1],
        phase: parseInt(match[2], 10)
      };
    }
    throw new Error(`Module ${name} is missing phase information`);
  }

  fetch({
    name,
    address,
    metadata
  }) {
    throw new Error('No default fetch defined');
  }

  translate({
    name,
    address,
    source,
    metadata
  }) {
    let src = this.compiledCache.get(address.path);
    if (src != null) {
      return src;
    }
    let compiledModule = this.compileSource(source, address.path, metadata);
    this.compiledCache.set(address.path, compiledModule);
    return compiledModule;
  }

  instantiate({
    name,
    address,
    source,
    metadata
  }) {
    throw new Error('Not implemented yet');
  }

  eval(source) {
    return (0, eval)(source);
  }

  load(entryPath) {
    let metadata = {};
    let name = this.normalize(entryPath);
    let address = this.locate({ name, metadata });
    let source = this.fetch({ name, address, metadata });
    source = this.translate({ name, address, source, metadata });
    return this.instantiate({ name, address, source, metadata });
  }

  // skip instantiate
  compile(entryPath, {
    refererName,
    enforceLangPragma,
    isEntrypoint
  }) {
    let metadata = {
      isEntrypoint,
      enforceLangPragma,
      entryPath
    };
    let name = this.normalize(entryPath, refererName);
    let address = this.locate({ name, metadata });
    let source = this.fetch({ name, address, metadata });
    return this.translate({ name, address, source, metadata });
  }

  get(entryPath, entryPhase, refererName) {
    return this.compile(`${entryPath}:${entryPhase}`, {
      refererName,
      enforceLangPragma: true,
      isEntrypoint: false
    });
  }

  read(source) {
    return (0, _macroContext.wrapInTerms)((0, _tokenReader2.default)(source));
  }

  freshStore() {
    return new _store2.default({});
  }

  compileSource(source, path, metadata) {
    let directive = getLangDirective(source);
    if (directive == null && metadata.enforceLangPragma) {
      // eslint-disable-next-line no-console
      if (this.logging) console.log(`skipping module ${metadata.entryPath}`);
      return new _sweetModule2.default(path, _immutable.List.of());
    }
    let stxl = this.read(source);
    let outScope = (0, _scope.freshScope)('outsideEdge');
    let inScope = (0, _scope.freshScope)('insideEdge0');
    // the compiler starts at phase 0, with an empty environment and store
    let compiler = new _compiler2.default(0, new _env2.default(), this.freshStore(), _.merge(this.context, {
      currentScope: [outScope, inScope],
      cwd: path,
      isEntrypoint: metadata.isEntrypoint
    }));
    return new _sweetModule2.default(path, compiler.compile(stxl.map(s =>
    // $FlowFixMe: flow doesn't know about reduce yet
    s.reduce(new _scopeReducer2.default([{ scope: outScope, phase: _syntax.ALL_PHASES, flip: false }, { scope: inScope, phase: 0, flip: false }], this.context.bindings)))));
  }
}

exports.default = SweetLoader;
const langDirectiveRegexp = /\s*('lang .*')/;
function getLangDirective(source) {
  let match = source.match(langDirectiveRegexp);
  if (match) {
    return match[1];
  }
  return null;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zd2VldC1sb2FkZXIuanMiXSwibmFtZXMiOlsiXyIsInBoYXNlSW5Nb2R1bGVQYXRoUmVnZXhwIiwiU3dlZXRMb2FkZXIiLCJjb25zdHJ1Y3RvciIsImJhc2VEaXIiLCJvcHRpb25zIiwic291cmNlQ2FjaGUiLCJNYXAiLCJjb21waWxlZENhY2hlIiwibG9nZ2luZyIsImJpbmRpbmdzIiwidGVtcGxhdGVNYXAiLCJ0ZW1wSWRlbnQiLCJjb250ZXh0IiwicGhhc2UiLCJnZXRUZW1wbGF0ZUlkZW50aWZpZXIiLCJsb2FkZXIiLCJpbnZva2VkUmVnaXN0cnkiLCJ0cmFuc2Zvcm0iLCJjIiwibm9CYWJlbCIsImNvZGUiLCJiYWJlbHJjIiwibm9ybWFsaXplIiwibmFtZSIsInJlZmVyZXJOYW1lIiwicmVmZXJlckFkZHJlc3MiLCJ0ZXN0IiwibG9jYXRlIiwibWV0YWRhdGEiLCJtYXRjaCIsImxlbmd0aCIsInBhdGgiLCJwYXJzZUludCIsIkVycm9yIiwiZmV0Y2giLCJhZGRyZXNzIiwidHJhbnNsYXRlIiwic291cmNlIiwic3JjIiwiZ2V0IiwiY29tcGlsZWRNb2R1bGUiLCJjb21waWxlU291cmNlIiwic2V0IiwiaW5zdGFudGlhdGUiLCJldmFsIiwibG9hZCIsImVudHJ5UGF0aCIsImNvbXBpbGUiLCJlbmZvcmNlTGFuZ1ByYWdtYSIsImlzRW50cnlwb2ludCIsImVudHJ5UGhhc2UiLCJyZWFkIiwiZnJlc2hTdG9yZSIsImRpcmVjdGl2ZSIsImdldExhbmdEaXJlY3RpdmUiLCJjb25zb2xlIiwibG9nIiwib2YiLCJzdHhsIiwib3V0U2NvcGUiLCJpblNjb3BlIiwiY29tcGlsZXIiLCJtZXJnZSIsImN1cnJlbnRTY29wZSIsImN3ZCIsIm1hcCIsInMiLCJyZWR1Y2UiLCJzY29wZSIsImZsaXAiLCJsYW5nRGlyZWN0aXZlUmVnZXhwIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7O0FB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MkJBQ0UsQ0FDRSxFQUFFQyxPQUFPVCxRQUFULEVBQW1COUMseUJBQW5CLEVBQXNDd0QsTUFBTSxLQUE1QyxFQURGLEVBRUUsRUFBRUQsT0FBT1IsT0FBVCxFQUFrQi9DLE9BQU8sQ0FBekIsRUFBNEJ3RCxNQUFNLEtBQWxDLEVBRkYsQ0FERixFQUtFLEtBQUt6RCxPQUFMLENBQWFILFFBTGYsQ0FERixDQUZGLENBREYsQ0FGSyxDQUFQO0FBaUJEO0FBcE04Qjs7a0JBQVpSLFc7QUF1TXJCLE1BQU1xRSxzQkFBc0IsZ0JBQTVCO0FBQ0EsU0FBU2hCLGdCQUFULENBQTBCakIsTUFBMUIsRUFBMEM7QUFDeEMsTUFBSVIsUUFBUVEsT0FBT1IsS0FBUCxDQUFheUMsbUJBQWIsQ0FBWjtBQUNBLE1BQUl6QyxLQUFKLEVBQVc7QUFDVCxXQUFPQSxNQUFNLENBQU4sQ0FBUDtBQUNEO0FBQ0QsU0FBTyxJQUFQO0FBQ0QiLCJmaWxlIjoic3dlZXQtbG9hZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcbmltcG9ydCByZWFkIGZyb20gJy4vcmVhZGVyL3Rva2VuLXJlYWRlcic7XG5pbXBvcnQgeyBmcmVzaFNjb3BlIH0gZnJvbSAnLi9zY29wZSc7XG5pbXBvcnQgRW52IGZyb20gJy4vZW52JztcbmltcG9ydCB7IExpc3QgfSBmcm9tICdpbW11dGFibGUnO1xuaW1wb3J0IENvbXBpbGVyIGZyb20gJy4vY29tcGlsZXInO1xuaW1wb3J0IHsgQUxMX1BIQVNFUyB9IGZyb20gJy4vc3ludGF4JztcbmltcG9ydCBCaW5kaW5nTWFwIGZyb20gJy4vYmluZGluZy1tYXAuanMnO1xuaW1wb3J0IFRlcm0gZnJvbSAnc3dlZXQtc3BlYyc7XG5pbXBvcnQgU3dlZXRNb2R1bGUgZnJvbSAnLi9zd2VldC1tb2R1bGUnO1xuaW1wb3J0ICogYXMgXyBmcm9tICdyYW1kYSc7XG5pbXBvcnQgU2NvcGVSZWR1Y2VyIGZyb20gJy4vc2NvcGUtcmVkdWNlcic7XG5pbXBvcnQgeyB3cmFwSW5UZXJtcyB9IGZyb20gJy4vbWFjcm8tY29udGV4dCc7XG5pbXBvcnQgeyB0cmFuc2Zvcm0gYXMgYmFiZWwgfSBmcm9tICdiYWJlbC1jb3JlJztcbmltcG9ydCBTdG9yZSBmcm9tICcuL3N0b3JlJztcbmltcG9ydCBNdWx0aW1hcCBmcm9tICcuL211bHRpbWFwJztcblxuZXhwb3J0IGNvbnN0IHBoYXNlSW5Nb2R1bGVQYXRoUmVnZXhwID0gLyguKik6KFxcZCspXFxzKiQvO1xuXG5leHBvcnQgdHlwZSBDb250ZXh0ID0ge1xuICBiaW5kaW5nczogYW55LFxuICB0ZW1wbGF0ZU1hcDogYW55LFxuICBnZXRUZW1wbGF0ZUlkZW50aWZpZXI6IGFueSxcbiAgbG9hZGVyOiBhbnksXG4gIHRyYW5zZm9ybTogYW55LFxuICBwaGFzZTogbnVtYmVyLFxuICBzdG9yZTogU3RvcmUsXG4gIGludm9rZWRSZWdpc3RyeTogTXVsdGltYXA8c3RyaW5nLCBudW1iZXI+LFxufTtcblxuZXhwb3J0IHR5cGUgTG9hZGVyT3B0aW9ucyA9IHtcbiAgbm9CYWJlbD86IGJvb2xlYW4sXG4gIGxvZ2dpbmc/OiBib29sZWFuLFxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3dlZXRMb2FkZXIge1xuICBzb3VyY2VDYWNoZTogTWFwPHN0cmluZywgc3RyaW5nPjtcbiAgY29tcGlsZWRDYWNoZTogTWFwPHN0cmluZywgU3dlZXRNb2R1bGU+O1xuICBjb250ZXh0OiBhbnk7XG4gIGJhc2VEaXI6IHN0cmluZztcbiAgbG9nZ2luZzogYm9vbGVhbjtcblxuICBjb25zdHJ1Y3RvcihiYXNlRGlyOiBzdHJpbmcsIG9wdGlvbnM/OiBMb2FkZXJPcHRpb25zID0ge30pIHtcbiAgICB0aGlzLnNvdXJjZUNhY2hlID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuY29tcGlsZWRDYWNoZSA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLmJhc2VEaXIgPSBiYXNlRGlyO1xuICAgIHRoaXMubG9nZ2luZyA9IG9wdGlvbnMubG9nZ2luZyB8fCBmYWxzZTtcblxuICAgIGxldCBiaW5kaW5ncyA9IG5ldyBCaW5kaW5nTWFwKCk7XG4gICAgbGV0IHRlbXBsYXRlTWFwID0gbmV3IE1hcCgpO1xuICAgIGxldCB0ZW1wSWRlbnQgPSAwO1xuICAgIHRoaXMuY29udGV4dCA9IHtcbiAgICAgIHBoYXNlOiAwLFxuICAgICAgYmluZGluZ3MsXG4gICAgICB0ZW1wbGF0ZU1hcCxcbiAgICAgIGdldFRlbXBsYXRlSWRlbnRpZmllcjogKCkgPT4gKyt0ZW1wSWRlbnQsXG4gICAgICBsb2FkZXI6IHRoaXMsXG4gICAgICBpbnZva2VkUmVnaXN0cnk6IG5ldyBNdWx0aW1hcCgpLFxuICAgICAgdHJhbnNmb3JtOiBjID0+IHtcbiAgICAgICAgaWYgKG9wdGlvbnMubm9CYWJlbCkge1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb2RlOiBjLFxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGJhYmVsKGMsIHtcbiAgICAgICAgICBiYWJlbHJjOiB0cnVlLFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG4gIG5vcm1hbGl6ZShuYW1lOiBzdHJpbmcsIHJlZmVyZXJOYW1lPzogc3RyaW5nLCByZWZlcmVyQWRkcmVzcz86IHN0cmluZykge1xuICAgIC8vIHRha2VzIGAuLnBhdGgvdG8vc291cmNlLmpzOjxwaGFzZT5gXG4gICAgLy8gZ2l2ZXMgYC9hYnMvcGF0aC90by9zb3VyY2UuanM6PHBoYXNlPmBcbiAgICAvLyBtaXNzaW5nIHBoYXNlcyBhcmUgdHVybmVkIGludG8gMFxuICAgIGlmICghcGhhc2VJbk1vZHVsZVBhdGhSZWdleHAudGVzdChuYW1lKSkge1xuICAgICAgcmV0dXJuIGAke25hbWV9OjBgO1xuICAgIH1cbiAgICByZXR1cm4gbmFtZTtcbiAgfVxuXG4gIGxvY2F0ZSh7IG5hbWUsIG1ldGFkYXRhIH06IHsgbmFtZTogc3RyaW5nLCBtZXRhZGF0YToge30gfSkge1xuICAgIC8vIHRha2VzIGAvYWJzL3BhdGgvdG8vc291cmNlLmpzOjxwaGFzZT5gXG4gICAgLy8gZ2l2ZXMgeyBwYXRoOiAnL2Ficy9wYXRoL3RvL3NvdXJjZS5qcycsIHBoYXNlOiA8cGhhc2U+IH1cbiAgICBsZXQgbWF0Y2ggPSBuYW1lLm1hdGNoKHBoYXNlSW5Nb2R1bGVQYXRoUmVnZXhwKTtcbiAgICBpZiAobWF0Y2ggJiYgbWF0Y2gubGVuZ3RoID49IDMpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHBhdGg6IG1hdGNoWzFdLFxuICAgICAgICBwaGFzZTogcGFyc2VJbnQobWF0Y2hbMl0sIDEwKSxcbiAgICAgIH07XG4gICAgfVxuICAgIHRocm93IG5ldyBFcnJvcihgTW9kdWxlICR7bmFtZX0gaXMgbWlzc2luZyBwaGFzZSBpbmZvcm1hdGlvbmApO1xuICB9XG5cbiAgZmV0Y2goe1xuICAgIG5hbWUsXG4gICAgYWRkcmVzcyxcbiAgICBtZXRhZGF0YSxcbiAgfToge1xuICAgIG5hbWU6IHN0cmluZyxcbiAgICBhZGRyZXNzOiB7IHBhdGg6IHN0cmluZywgcGhhc2U6IG51bWJlciB9LFxuICAgIG1ldGFkYXRhOiB7fSxcbiAgfSkge1xuICAgIHRocm93IG5ldyBFcnJvcignTm8gZGVmYXVsdCBmZXRjaCBkZWZpbmVkJyk7XG4gIH1cblxuICB0cmFuc2xhdGUoe1xuICAgIG5hbWUsXG4gICAgYWRkcmVzcyxcbiAgICBzb3VyY2UsXG4gICAgbWV0YWRhdGEsXG4gIH06IHtcbiAgICBuYW1lOiBzdHJpbmcsXG4gICAgYWRkcmVzczogeyBwYXRoOiBzdHJpbmcsIHBoYXNlOiBudW1iZXIgfSxcbiAgICBzb3VyY2U6IHN0cmluZyxcbiAgICBtZXRhZGF0YToge30sXG4gIH0pIHtcbiAgICBsZXQgc3JjID0gdGhpcy5jb21waWxlZENhY2hlLmdldChhZGRyZXNzLnBhdGgpO1xuICAgIGlmIChzcmMgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHNyYztcbiAgICB9XG4gICAgbGV0IGNvbXBpbGVkTW9kdWxlID0gdGhpcy5jb21waWxlU291cmNlKHNvdXJjZSwgYWRkcmVzcy5wYXRoLCBtZXRhZGF0YSk7XG4gICAgdGhpcy5jb21waWxlZENhY2hlLnNldChhZGRyZXNzLnBhdGgsIGNvbXBpbGVkTW9kdWxlKTtcbiAgICByZXR1cm4gY29tcGlsZWRNb2R1bGU7XG4gIH1cblxuICBpbnN0YW50aWF0ZSh7XG4gICAgbmFtZSxcbiAgICBhZGRyZXNzLFxuICAgIHNvdXJjZSxcbiAgICBtZXRhZGF0YSxcbiAgfToge1xuICAgIG5hbWU6IHN0cmluZyxcbiAgICBhZGRyZXNzOiB7IHBhdGg6IHN0cmluZywgcGhhc2U6IG51bWJlciB9LFxuICAgIHNvdXJjZTogU3dlZXRNb2R1bGUsXG4gICAgbWV0YWRhdGE6IHt9LFxuICB9KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdOb3QgaW1wbGVtZW50ZWQgeWV0Jyk7XG4gIH1cblxuICBldmFsKHNvdXJjZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuICgwLCBldmFsKShzb3VyY2UpO1xuICB9XG5cbiAgbG9hZChlbnRyeVBhdGg6IHN0cmluZykge1xuICAgIGxldCBtZXRhZGF0YSA9IHt9O1xuICAgIGxldCBuYW1lID0gdGhpcy5ub3JtYWxpemUoZW50cnlQYXRoKTtcbiAgICBsZXQgYWRkcmVzcyA9IHRoaXMubG9jYXRlKHsgbmFtZSwgbWV0YWRhdGEgfSk7XG4gICAgbGV0IHNvdXJjZSA9IHRoaXMuZmV0Y2goeyBuYW1lLCBhZGRyZXNzLCBtZXRhZGF0YSB9KTtcbiAgICBzb3VyY2UgPSB0aGlzLnRyYW5zbGF0ZSh7IG5hbWUsIGFkZHJlc3MsIHNvdXJjZSwgbWV0YWRhdGEgfSk7XG4gICAgcmV0dXJuIHRoaXMuaW5zdGFudGlhdGUoeyBuYW1lLCBhZGRyZXNzLCBzb3VyY2UsIG1ldGFkYXRhIH0pO1xuICB9XG5cbiAgLy8gc2tpcCBpbnN0YW50aWF0ZVxuICBjb21waWxlKFxuICAgIGVudHJ5UGF0aDogc3RyaW5nLFxuICAgIHtcbiAgICAgIHJlZmVyZXJOYW1lLFxuICAgICAgZW5mb3JjZUxhbmdQcmFnbWEsXG4gICAgICBpc0VudHJ5cG9pbnQsXG4gICAgfToge1xuICAgICAgcmVmZXJlck5hbWU/OiBzdHJpbmcsXG4gICAgICBlbmZvcmNlTGFuZ1ByYWdtYTogYm9vbGVhbixcbiAgICAgIGlzRW50cnlwb2ludDogYm9vbGVhbixcbiAgICB9LFxuICApIHtcbiAgICBsZXQgbWV0YWRhdGEgPSB7XG4gICAgICBpc0VudHJ5cG9pbnQsXG4gICAgICBlbmZvcmNlTGFuZ1ByYWdtYSxcbiAgICAgIGVudHJ5UGF0aCxcbiAgICB9O1xuICAgIGxldCBuYW1lID0gdGhpcy5ub3JtYWxpemUoZW50cnlQYXRoLCByZWZlcmVyTmFtZSk7XG4gICAgbGV0IGFkZHJlc3MgPSB0aGlzLmxvY2F0ZSh7IG5hbWUsIG1ldGFkYXRhIH0pO1xuICAgIGxldCBzb3VyY2UgPSB0aGlzLmZldGNoKHsgbmFtZSwgYWRkcmVzcywgbWV0YWRhdGEgfSk7XG4gICAgcmV0dXJuIHRoaXMudHJhbnNsYXRlKHsgbmFtZSwgYWRkcmVzcywgc291cmNlLCBtZXRhZGF0YSB9KTtcbiAgfVxuXG4gIGdldChlbnRyeVBhdGg6IHN0cmluZywgZW50cnlQaGFzZTogbnVtYmVyLCByZWZlcmVyTmFtZT86IHN0cmluZykge1xuICAgIHJldHVybiB0aGlzLmNvbXBpbGUoYCR7ZW50cnlQYXRofToke2VudHJ5UGhhc2V9YCwge1xuICAgICAgcmVmZXJlck5hbWUsXG4gICAgICBlbmZvcmNlTGFuZ1ByYWdtYTogdHJ1ZSxcbiAgICAgIGlzRW50cnlwb2ludDogZmFsc2UsXG4gICAgfSk7XG4gIH1cblxuICByZWFkKHNvdXJjZTogc3RyaW5nKTogTGlzdDxUZXJtPiB7XG4gICAgcmV0dXJuIHdyYXBJblRlcm1zKHJlYWQoc291cmNlKSk7XG4gIH1cblxuICBmcmVzaFN0b3JlKCkge1xuICAgIHJldHVybiBuZXcgU3RvcmUoe30pO1xuICB9XG5cbiAgY29tcGlsZVNvdXJjZShzb3VyY2U6IHN0cmluZywgcGF0aDogc3RyaW5nLCBtZXRhZGF0YTogYW55KSB7XG4gICAgbGV0IGRpcmVjdGl2ZSA9IGdldExhbmdEaXJlY3RpdmUoc291cmNlKTtcbiAgICBpZiAoZGlyZWN0aXZlID09IG51bGwgJiYgbWV0YWRhdGEuZW5mb3JjZUxhbmdQcmFnbWEpIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICBpZiAodGhpcy5sb2dnaW5nKSBjb25zb2xlLmxvZyhgc2tpcHBpbmcgbW9kdWxlICR7bWV0YWRhdGEuZW50cnlQYXRofWApO1xuICAgICAgcmV0dXJuIG5ldyBTd2VldE1vZHVsZShwYXRoLCBMaXN0Lm9mKCkpO1xuICAgIH1cbiAgICBsZXQgc3R4bCA9IHRoaXMucmVhZChzb3VyY2UpO1xuICAgIGxldCBvdXRTY29wZSA9IGZyZXNoU2NvcGUoJ291dHNpZGVFZGdlJyk7XG4gICAgbGV0IGluU2NvcGUgPSBmcmVzaFNjb3BlKCdpbnNpZGVFZGdlMCcpO1xuICAgIC8vIHRoZSBjb21waWxlciBzdGFydHMgYXQgcGhhc2UgMCwgd2l0aCBhbiBlbXB0eSBlbnZpcm9ubWVudCBhbmQgc3RvcmVcbiAgICBsZXQgY29tcGlsZXIgPSBuZXcgQ29tcGlsZXIoXG4gICAgICAwLFxuICAgICAgbmV3IEVudigpLFxuICAgICAgdGhpcy5mcmVzaFN0b3JlKCksXG4gICAgICBfLm1lcmdlKHRoaXMuY29udGV4dCwge1xuICAgICAgICBjdXJyZW50U2NvcGU6IFtvdXRTY29wZSwgaW5TY29wZV0sXG4gICAgICAgIGN3ZDogcGF0aCxcbiAgICAgICAgaXNFbnRyeXBvaW50OiBtZXRhZGF0YS5pc0VudHJ5cG9pbnQsXG4gICAgICB9KSxcbiAgICApO1xuICAgIHJldHVybiBuZXcgU3dlZXRNb2R1bGUoXG4gICAgICBwYXRoLFxuICAgICAgY29tcGlsZXIuY29tcGlsZShcbiAgICAgICAgc3R4bC5tYXAocyA9PlxuICAgICAgICAgIC8vICRGbG93Rml4TWU6IGZsb3cgZG9lc24ndCBrbm93IGFib3V0IHJlZHVjZSB5ZXRcbiAgICAgICAgICBzLnJlZHVjZShcbiAgICAgICAgICAgIG5ldyBTY29wZVJlZHVjZXIoXG4gICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICB7IHNjb3BlOiBvdXRTY29wZSwgcGhhc2U6IEFMTF9QSEFTRVMsIGZsaXA6IGZhbHNlIH0sXG4gICAgICAgICAgICAgICAgeyBzY29wZTogaW5TY29wZSwgcGhhc2U6IDAsIGZsaXA6IGZhbHNlIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIHRoaXMuY29udGV4dC5iaW5kaW5ncyxcbiAgICAgICAgICAgICksXG4gICAgICAgICAgKSxcbiAgICAgICAgKSxcbiAgICAgICksXG4gICAgKTtcbiAgfVxufVxuXG5jb25zdCBsYW5nRGlyZWN0aXZlUmVnZXhwID0gL1xccyooJ2xhbmcgLionKS87XG5mdW5jdGlvbiBnZXRMYW5nRGlyZWN0aXZlKHNvdXJjZTogc3RyaW5nKSB7XG4gIGxldCBtYXRjaCA9IHNvdXJjZS5tYXRjaChsYW5nRGlyZWN0aXZlUmVnZXhwKTtcbiAgaWYgKG1hdGNoKSB7XG4gICAgcmV0dXJuIG1hdGNoWzFdO1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuIl19