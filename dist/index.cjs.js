'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _ = _interopDefault(require('lodash'));
var agoraGraph = require('agora-graph');

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

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
var rWordleL = agoraGraph.createFunction(function (graph) {
  // Sort by Xs
  graph.nodes.sort(function (a, b) {
    return a.x - b.x;
  });
  var layouted = [];

  _.forEach(graph.nodes, function (cur) {
    var t = 3.0;
    var minSide = Math.min(cur.width, cur.height); // spiral depending on the size of the object

    var spiralFactor = minSide / 17.0;
    var spiralStep = minSide / 10.0; // We copy the current object so we can translate it in peace

    while (true) {
      var tx = Math.sin(t) * t * spiralFactor;
      var ty = Math.cos(t) * t * spiralFactor; // transformed object

      var transformedArea = _objectSpread(_objectSpread({}, cur), agoraGraph.sum(cur, {
        x: tx,
        y: ty
      }));

      if (!hasOverlap(layouted, transformedArea)) {
        // found placement
        layouted.push(transformedArea);
        break;
      }

      t += spiralStep / t;
    }
  });

  graph.nodes = layouted;
  return {
    graph: graph
  };
});
var RWordleLAlgorithm = {
  name: 'RWordleL',
  algorithm: rWordleL
};

function hasOverlap(alreadyLayouted, current) {
  var _iterator = _createForOfIteratorHelper(alreadyLayouted),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var s = _step.value;

      if (agoraGraph.overlap(s, current)) {
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

exports.RWordleLAlgorithm = RWordleLAlgorithm;
exports.default = rWordleL;
exports.rWordleL = rWordleL;
