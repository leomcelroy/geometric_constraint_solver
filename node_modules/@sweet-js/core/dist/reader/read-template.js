'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = readTemplateLiteral;

var _immutable = require('immutable');

var _readtable = require('readtable');

var _utils = require('./utils');

var _tokenReader = require('./token-reader');

var _tokens = require('../tokens');

function readTemplateLiteral(stream, prefix) {
  let element,
      items = [];
  stream.readString();

  do {
    element = readTemplateElement.call(this, stream);
    items.push(element);
    if (element.interp) {
      element = this.readToken(stream, (0, _immutable.List)(), false);
      items.push(element);
    }
  } while (!element.tail);

  return new _tokens.TemplateToken({
    items: (0, _immutable.List)(items)
  });
}


function readTemplateElement(stream) {
  let char = stream.peek(),
      idx = 0,
      value = '',
      octal = null;
  const startLocation = Object.assign({}, this.locationInfo, stream.sourceInfo);
  while (!(0, _readtable.isEOS)(char)) {
    switch (char) {
      case '`':
        {
          stream.readString(idx);
          const slice = (0, _tokenReader.getSlice)(stream, startLocation);
          stream.readString();
          return new _tokens.TemplateElementToken({
            tail: true,
            interp: false,
            value,
            slice
          });
        }
      case '$':
        {
          if (stream.peek(idx + 1) === '{') {
            stream.readString(idx);
            const slice = (0, _tokenReader.getSlice)(stream, startLocation);
            stream.readString();

            return new _tokens.TemplateElementToken({
              tail: false,
              interp: true,
              value,
              slice
            });
          }
          break;
        }
      case '\\':
        {
          let newVal;
          [newVal, idx, octal] = _utils.readStringEscape.call(this, '', stream, idx, octal);
          if (octal != null) throw this.createILLEGAL(octal);
          value += newVal;
          --idx;
          break;
        }
      default:
        {
          value += char;
        }
    }
    char = stream.peek(++idx);
  }
  throw this.createILLEGAL(char);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWFkZXIvcmVhZC10ZW1wbGF0ZS5qcyJdLCJuYW1lcyI6WyJyZWFkVGVtcGxhdGVMaXRlcmFsIiwic3RyZWFtIiwicHJlZml4IiwiZWxlbWVudCIsIml0ZW1zIiwicmVhZFN0cmluZyIsInJlYWRUZW1wbGF0ZUVsZW1lbnQiLCJjYWxsIiwicHVzaCIsImludGVycCIsInJlYWRUb2tlbiIsInRhaWwiLCJjaGFyIiwicGVlayIsImlkeCIsInZhbHVlIiwib2N0YWwiLCJzdGFydExvY2F0aW9uIiwiT2JqZWN0IiwiYXNzaWduIiwibG9jYXRpb25JbmZvIiwic291cmNlSW5mbyIsInNsaWNlIiwibmV3VmFsIiwiY3JlYXRlSUxMRUdBTCJdLCJtYXBwaW5ncyI6Ijs7Ozs7a0JBVXdCQSxtQjs7QUFUeEI7O0FBR0E7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBRWUsU0FBU0EsbUJBQVQsQ0FDYkMsTUFEYSxFQUViQyxNQUZhLEVBR0U7QUFDZixNQUFJQyxPQUFKO0FBQUEsTUFDRUMsUUFBUSxFQURWO0FBRUFILFNBQU9JLFVBQVA7O0FBRUEsS0FBRztBQUNERixjQUFVRyxvQkFBb0JDLElBQXBCLENBQXlCLElBQXpCLEVBQStCTixNQUEvQixDQUFWO0FBQ0FHLFVBQU1JLElBQU4sQ0FBV0wsT0FBWDtBQUNBLFFBQUlBLFFBQVFNLE1BQVosRUFBb0I7QUFDbEJOLGdCQUFVLEtBQUtPLFNBQUwsQ0FBZVQsTUFBZixFQUF1QixzQkFBdkIsRUFBK0IsS0FBL0IsQ0FBVjtBQUNBRyxZQUFNSSxJQUFOLENBQVdMLE9BQVg7QUFDRDtBQUNGLEdBUEQsUUFPUyxDQUFDQSxRQUFRUSxJQVBsQjs7QUFTQSxTQUFPLDBCQUFrQjtBQUN2QlAsV0FBTyxxQkFBS0EsS0FBTDtBQURnQixHQUFsQixDQUFQO0FBR0Q7OztBQUVELFNBQVNFLG1CQUFULENBQTZCTCxNQUE3QixFQUF1RTtBQUNyRSxNQUFJVyxPQUFPWCxPQUFPWSxJQUFQLEVBQVg7QUFBQSxNQUNFQyxNQUFNLENBRFI7QUFBQSxNQUVFQyxRQUFRLEVBRlY7QUFBQSxNQUdFQyxRQUFRLElBSFY7QUFJQSxRQUFNQyxnQkFBZ0JDLE9BQU9DLE1BQVAsQ0FBYyxFQUFkLEVBQWtCLEtBQUtDLFlBQXZCLEVBQXFDbkIsT0FBT29CLFVBQTVDLENBQXRCO0FBQ0EsU0FBTyxDQUFDLHNCQUFNVCxJQUFOLENBQVIsRUFBcUI7QUFDbkIsWUFBUUEsSUFBUjtBQUNFLFdBQUssR0FBTDtBQUFVO0FBQ1JYLGlCQUFPSSxVQUFQLENBQWtCUyxHQUFsQjtBQUNBLGdCQUFNUSxRQUFRLDJCQUFTckIsTUFBVCxFQUFpQmdCLGFBQWpCLENBQWQ7QUFDQWhCLGlCQUFPSSxVQUFQO0FBQ0EsaUJBQU8saUNBQXlCO0FBQzlCTSxrQkFBTSxJQUR3QjtBQUU5QkYsb0JBQVEsS0FGc0I7QUFHOUJNLGlCQUg4QjtBQUk5Qk87QUFKOEIsV0FBekIsQ0FBUDtBQU1EO0FBQ0QsV0FBSyxHQUFMO0FBQVU7QUFDUixjQUFJckIsT0FBT1ksSUFBUCxDQUFZQyxNQUFNLENBQWxCLE1BQXlCLEdBQTdCLEVBQWtDO0FBQ2hDYixtQkFBT0ksVUFBUCxDQUFrQlMsR0FBbEI7QUFDQSxrQkFBTVEsUUFBUSwyQkFBU3JCLE1BQVQsRUFBaUJnQixhQUFqQixDQUFkO0FBQ0FoQixtQkFBT0ksVUFBUDs7QUFFQSxtQkFBTyxpQ0FBeUI7QUFDOUJNLG9CQUFNLEtBRHdCO0FBRTlCRixzQkFBUSxJQUZzQjtBQUc5Qk0sbUJBSDhCO0FBSTlCTztBQUo4QixhQUF6QixDQUFQO0FBTUQ7QUFDRDtBQUNEO0FBQ0QsV0FBSyxJQUFMO0FBQVc7QUFDVCxjQUFJQyxNQUFKO0FBQ0EsV0FBQ0EsTUFBRCxFQUFTVCxHQUFULEVBQWNFLEtBQWQsSUFBdUIsd0JBQWlCVCxJQUFqQixDQUNyQixJQURxQixFQUVyQixFQUZxQixFQUdyQk4sTUFIcUIsRUFJckJhLEdBSnFCLEVBS3JCRSxLQUxxQixDQUF2QjtBQU9BLGNBQUlBLFNBQVMsSUFBYixFQUFtQixNQUFNLEtBQUtRLGFBQUwsQ0FBbUJSLEtBQW5CLENBQU47QUFDbkJELG1CQUFTUSxNQUFUO0FBQ0EsWUFBRVQsR0FBRjtBQUNBO0FBQ0Q7QUFDRDtBQUFTO0FBQ1BDLG1CQUFTSCxJQUFUO0FBQ0Q7QUEzQ0g7QUE2Q0FBLFdBQU9YLE9BQU9ZLElBQVAsQ0FBWSxFQUFFQyxHQUFkLENBQVA7QUFDRDtBQUNELFFBQU0sS0FBS1UsYUFBTCxDQUFtQlosSUFBbkIsQ0FBTjtBQUNEIiwiZmlsZSI6InJlYWQtdGVtcGxhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuaW1wb3J0IHsgTGlzdCB9IGZyb20gJ2ltbXV0YWJsZSc7XG5cbmltcG9ydCB0eXBlIHsgQ2hhclN0cmVhbSB9IGZyb20gJ3JlYWR0YWJsZSc7XG5pbXBvcnQgeyBpc0VPUyB9IGZyb20gJ3JlYWR0YWJsZSc7XG5cbmltcG9ydCB7IHJlYWRTdHJpbmdFc2NhcGUgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IGdldFNsaWNlIH0gZnJvbSAnLi90b2tlbi1yZWFkZXInO1xuaW1wb3J0IHsgVGVtcGxhdGVUb2tlbiwgVGVtcGxhdGVFbGVtZW50VG9rZW4gfSBmcm9tICcuLi90b2tlbnMnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByZWFkVGVtcGxhdGVMaXRlcmFsKFxuICBzdHJlYW06IENoYXJTdHJlYW0sXG4gIHByZWZpeDogTGlzdDxhbnk+LFxuKTogVGVtcGxhdGVUb2tlbiB7XG4gIGxldCBlbGVtZW50LFxuICAgIGl0ZW1zID0gW107XG4gIHN0cmVhbS5yZWFkU3RyaW5nKCk7XG5cbiAgZG8ge1xuICAgIGVsZW1lbnQgPSByZWFkVGVtcGxhdGVFbGVtZW50LmNhbGwodGhpcywgc3RyZWFtKTtcbiAgICBpdGVtcy5wdXNoKGVsZW1lbnQpO1xuICAgIGlmIChlbGVtZW50LmludGVycCkge1xuICAgICAgZWxlbWVudCA9IHRoaXMucmVhZFRva2VuKHN0cmVhbSwgTGlzdCgpLCBmYWxzZSk7XG4gICAgICBpdGVtcy5wdXNoKGVsZW1lbnQpO1xuICAgIH1cbiAgfSB3aGlsZSAoIWVsZW1lbnQudGFpbCk7XG5cbiAgcmV0dXJuIG5ldyBUZW1wbGF0ZVRva2VuKHtcbiAgICBpdGVtczogTGlzdChpdGVtcyksXG4gIH0pO1xufVxuXG5mdW5jdGlvbiByZWFkVGVtcGxhdGVFbGVtZW50KHN0cmVhbTogQ2hhclN0cmVhbSk6IFRlbXBsYXRlRWxlbWVudFRva2VuIHtcbiAgbGV0IGNoYXIgPSBzdHJlYW0ucGVlaygpLFxuICAgIGlkeCA9IDAsXG4gICAgdmFsdWUgPSAnJyxcbiAgICBvY3RhbCA9IG51bGw7XG4gIGNvbnN0IHN0YXJ0TG9jYXRpb24gPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmxvY2F0aW9uSW5mbywgc3RyZWFtLnNvdXJjZUluZm8pO1xuICB3aGlsZSAoIWlzRU9TKGNoYXIpKSB7XG4gICAgc3dpdGNoIChjaGFyKSB7XG4gICAgICBjYXNlICdgJzoge1xuICAgICAgICBzdHJlYW0ucmVhZFN0cmluZyhpZHgpO1xuICAgICAgICBjb25zdCBzbGljZSA9IGdldFNsaWNlKHN0cmVhbSwgc3RhcnRMb2NhdGlvbik7XG4gICAgICAgIHN0cmVhbS5yZWFkU3RyaW5nKCk7XG4gICAgICAgIHJldHVybiBuZXcgVGVtcGxhdGVFbGVtZW50VG9rZW4oe1xuICAgICAgICAgIHRhaWw6IHRydWUsXG4gICAgICAgICAgaW50ZXJwOiBmYWxzZSxcbiAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgICBzbGljZSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBjYXNlICckJzoge1xuICAgICAgICBpZiAoc3RyZWFtLnBlZWsoaWR4ICsgMSkgPT09ICd7Jykge1xuICAgICAgICAgIHN0cmVhbS5yZWFkU3RyaW5nKGlkeCk7XG4gICAgICAgICAgY29uc3Qgc2xpY2UgPSBnZXRTbGljZShzdHJlYW0sIHN0YXJ0TG9jYXRpb24pO1xuICAgICAgICAgIHN0cmVhbS5yZWFkU3RyaW5nKCk7XG5cbiAgICAgICAgICByZXR1cm4gbmV3IFRlbXBsYXRlRWxlbWVudFRva2VuKHtcbiAgICAgICAgICAgIHRhaWw6IGZhbHNlLFxuICAgICAgICAgICAgaW50ZXJwOiB0cnVlLFxuICAgICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgICBzbGljZSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgJ1xcXFwnOiB7XG4gICAgICAgIGxldCBuZXdWYWw7XG4gICAgICAgIFtuZXdWYWwsIGlkeCwgb2N0YWxdID0gcmVhZFN0cmluZ0VzY2FwZS5jYWxsKFxuICAgICAgICAgIHRoaXMsXG4gICAgICAgICAgJycsXG4gICAgICAgICAgc3RyZWFtLFxuICAgICAgICAgIGlkeCxcbiAgICAgICAgICBvY3RhbCxcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKG9jdGFsICE9IG51bGwpIHRocm93IHRoaXMuY3JlYXRlSUxMRUdBTChvY3RhbCk7XG4gICAgICAgIHZhbHVlICs9IG5ld1ZhbDtcbiAgICAgICAgLS1pZHg7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgZGVmYXVsdDoge1xuICAgICAgICB2YWx1ZSArPSBjaGFyO1xuICAgICAgfVxuICAgIH1cbiAgICBjaGFyID0gc3RyZWFtLnBlZWsoKytpZHgpO1xuICB9XG4gIHRocm93IHRoaXMuY3JlYXRlSUxMRUdBTChjaGFyKTtcbn1cbiJdfQ==