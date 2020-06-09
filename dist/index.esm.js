import _ from 'lodash';
import 'delaunator';

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

var defineProperty = _defineProperty;

function createFunction(f) {
  return f;
}
/**
 * @param {Point} p1
 * @param {Point} p2
 *
 * @returns {number} the Δ (x axis) between two points
 */

function deltaX(p1, p2) {
  return p2.x - p1.x;
}
/**
 * @param {Point} p1
 * @param {Point} p2
 *
 * @returns {number} the Δ (y axis) between two points
 */

function deltaY(p1, p2) {
  return p2.y - p1.y;
}
/**
 * @param {Point} p1
 * @param {Point} p2
 *
 * @returns {number} the norm (x axis) between two points
 */

function normX(p1, p2) {
  return Math.abs(deltaX(p1, p2));
}
/**
 * @param {Point} p1
 * @param {Point} p2
 *
 * @returns {number} the norm (y axis) between two points
 */

function normY(p1, p2) {
  return Math.abs(deltaY(p1, p2));
}
/**
 * Sums two vectors
 * @param v1
 * @param v2
 */

function sum(v1, v2) {
  return {
    x: v1.x + v2.x,
    y: v1.y + v2.y
  };
}

var EPSILON = Math.pow(10, -12);
var PADDING = 0;
var defaultOptions = {
  padding: PADDING,
  epsilon: EPSILON
};
/**
 * @param n1
 * @param n2
 * @param options.padding
 * @param options.epsilon accepted overlap value, really small, used for float imprecisions
 *
 * @returns true if the nodes overlap
 */

function overlap(n1, n2) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultOptions;
  return overlapX(n1, n2, options) && overlapY(n1, n2, options);
}
/**
 * @param n1
 * @param n2
 * @param options.padding
 * @param options.epsilon accepted overlap value, really small, used for float imprecisions
 *
 * @returns true if the nodes overlap on x
 */

function overlapX(n1, n2) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultOptions,
      _ref$padding = _ref.padding,
      padding = _ref$padding === void 0 ? PADDING : _ref$padding,
      _ref$epsilon = _ref.epsilon,
      epsilon = _ref$epsilon === void 0 ? EPSILON : _ref$epsilon;

  return normX(n1, n2) - ((n1.width + n2.width) / 2 + +padding) < epsilon;
}
/**
 * @param n1
 * @param n2
 * @param options.padding
 * @param options.epsilon accepted overlap value, really small, used for float imprecisions
 *
 * @returns true if the nodes overlap on y
 */

function overlapY(n1, n2) {
  var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultOptions,
      _ref2$padding = _ref2.padding,
      padding = _ref2$padding === void 0 ? PADDING : _ref2$padding,
      _ref2$epsilon = _ref2.epsilon,
      epsilon = _ref2$epsilon === void 0 ? EPSILON : _ref2$epsilon;

  return normY(n1, n2) - ((n1.height + n2.height) / 2 + +padding) < epsilon;
}

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
var rWordle = createFunction(function (graph) {
  // Sort by Xs
  graph.nodes.sort(function (a, b) {
    return a.x - b.x;
  });
  var layedOut = [];

  _.forEach(graph.nodes, function (cur) {
    var t = 3.0;
    var minSide = Math.min(cur.height, cur.width);
    var spiralFactor = minSide / 17;
    var spiralStep = minSide / 10; // We copy the current object so we can translate it in peace

    var translatedNode = _objectSpread({}, cur);

    while (true) {
      var tx = Math.sin(t) * t * spiralFactor;
      var ty = Math.cos(t) * t * spiralFactor; // applying translation (translatedNode is mutated)

      _.assign(translatedNode, sum(cur, {
        x: tx,
        y: ty
      }));

      if (!areOverlapping(layedOut, translatedNode)) {
        // found placement
        layedOut.push(translatedNode);
        break;
      }

      t += spiralStep / t;
    }
  });

  graph.nodes = layedOut;
  return {
    graph: graph
  };
});

function areOverlapping(list, current) {
  var _iterator = _createForOfIteratorHelper(list),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var s = _step.value;

      if (overlap(s, current)) {
        return true;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return false;
}

export default rWordle;
export { rWordle };
