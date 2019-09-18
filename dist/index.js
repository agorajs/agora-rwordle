"use strict";
/**
 * Implementation of RWordle-L Algorithm
 *
 * Ported from Java, original code owned by :
 * Copyright by Marc Spicker
 * GPL License -- http://www.gnu.org/licenses/gpl.html
 *
 * based on the publication:
 * @article {CGF:CGF3106,
 *  author = {Strobelt, H. and Spicker, M. and Stoffel, A. and Keim, D. and Deussen, O.},
 *  title = {Rolled-out Wordles: A Heuristic Method for Overlap Removal of 2D Data Representatives},
 *  journal = {Computer Graphics Forum},
 *  volume = {31},
 *  number = {3pt3},
 *  publisher = {Blackwell Publishing Ltd},
 *  issn = {1467-8659},
 *  url = {http://dx.doi.org/10.1111/j.1467-8659.2012.03106.x},
 *  doi = {10.1111/j.1467-8659.2012.03106.x},
 *  pages = {1135--1144},
 *  keywords = {I.3.3 [Computer Graphics]: Picture/Image Generation—Line and curve generation},
 *  year = {2012},
 * }
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = __importDefault(require("lodash"));
var agora_graph_1 = require("agora-graph");
exports.rWordleL = agora_graph_1.createFunction(function (graph, options) {
    if (options === void 0) { options = { padding: 0 }; }
    // Sort by Xs
    graph.nodes.sort(function (a, b) { return a.x - b.x; });
    var layouted = [];
    lodash_1.default.forEach(graph.nodes, function (cur) {
        var t = 3.0;
        var minSide = Math.min(cur.width, cur.height);
        // spiral depending on the size of the object
        var spiralFactor = minSide / 17.0;
        var spiralStep = minSide / 10.0;
        while (true) {
            var tx = Math.sin(t) * t * spiralFactor;
            var ty = Math.cos(t) * t * spiralFactor;
            // transformed object
            var transformedArea = __assign(__assign({}, cur), agora_graph_1.sum(cur, { x: tx, y: ty }));
            if (!hasOverlap(layouted, transformedArea)) {
                // found placement
                layouted.push(transformedArea);
                break;
            }
            t += spiralStep / t;
        }
    });
    graph.nodes = layouted;
    return { graph: graph };
});
exports.RWordleLAlgorithm = {
    name: 'RWordleL',
    algorithm: exports.rWordleL
};
exports.default = exports.rWordleL;
function hasOverlap(alreadyLayouted, current) {
    for (var _i = 0, alreadyLayouted_1 = alreadyLayouted; _i < alreadyLayouted_1.length; _i++) {
        var s = alreadyLayouted_1[_i];
        if (agora_graph_1.overlap(s, current)) {
            return true;
        }
    }
    return false;
}
