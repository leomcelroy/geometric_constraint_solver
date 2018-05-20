'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _immutable = require('immutable');

class Multimap extends Map {
  add(key, value) {
    let bucket = this.get(key);
    if (bucket != null) {
      this.set(key, bucket.push(value));
    } else {
      this.set(key, _immutable.List.of(value));
    }
  }

  containsAt(key, value) {
    let bucket = this.get(key);
    if (bucket != null) {
      return bucket.contains(value);
    }
    return false;
  }
}
exports.default = Multimap;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tdWx0aW1hcC5qcyJdLCJuYW1lcyI6WyJNdWx0aW1hcCIsIk1hcCIsImFkZCIsImtleSIsInZhbHVlIiwiYnVja2V0IiwiZ2V0Iiwic2V0IiwicHVzaCIsIm9mIiwiY29udGFpbnNBdCIsImNvbnRhaW5zIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQTs7QUFFZSxNQUFNQSxRQUFOLFNBQTZCQyxHQUE3QixDQUE2QztBQUMxREMsTUFBSUMsR0FBSixFQUFZQyxLQUFaLEVBQXNCO0FBQ3BCLFFBQUlDLFNBQVMsS0FBS0MsR0FBTCxDQUFTSCxHQUFULENBQWI7QUFDQSxRQUFJRSxVQUFVLElBQWQsRUFBb0I7QUFDbEIsV0FBS0UsR0FBTCxDQUFTSixHQUFULEVBQWNFLE9BQU9HLElBQVAsQ0FBWUosS0FBWixDQUFkO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsV0FBS0csR0FBTCxDQUFTSixHQUFULEVBQWMsZ0JBQUtNLEVBQUwsQ0FBUUwsS0FBUixDQUFkO0FBQ0Q7QUFDRjs7QUFFRE0sYUFBV1AsR0FBWCxFQUFtQkMsS0FBbkIsRUFBNkI7QUFDM0IsUUFBSUMsU0FBUyxLQUFLQyxHQUFMLENBQVNILEdBQVQsQ0FBYjtBQUNBLFFBQUlFLFVBQVUsSUFBZCxFQUFvQjtBQUNsQixhQUFPQSxPQUFPTSxRQUFQLENBQWdCUCxLQUFoQixDQUFQO0FBQ0Q7QUFDRCxXQUFPLEtBQVA7QUFDRDtBQWhCeUQ7a0JBQXZDSixRIiwiZmlsZSI6Im11bHRpbWFwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcbmltcG9ydCB7IExpc3QgfSBmcm9tICdpbW11dGFibGUnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNdWx0aW1hcDxLLCBWPiBleHRlbmRzIE1hcDxLLCBMaXN0PFY+PiB7XG4gIGFkZChrZXk6IEssIHZhbHVlOiBWKSB7XG4gICAgbGV0IGJ1Y2tldCA9IHRoaXMuZ2V0KGtleSk7XG4gICAgaWYgKGJ1Y2tldCAhPSBudWxsKSB7XG4gICAgICB0aGlzLnNldChrZXksIGJ1Y2tldC5wdXNoKHZhbHVlKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2V0KGtleSwgTGlzdC5vZih2YWx1ZSkpO1xuICAgIH1cbiAgfVxuXG4gIGNvbnRhaW5zQXQoa2V5OiBLLCB2YWx1ZTogVikge1xuICAgIGxldCBidWNrZXQgPSB0aGlzLmdldChrZXkpO1xuICAgIGlmIChidWNrZXQgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGJ1Y2tldC5jb250YWlucyh2YWx1ZSk7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuIl19