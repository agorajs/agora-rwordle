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
exports.rWordle = function (graph, options) {
    if (options === void 0) { options = { padding: 0 }; }
    // Sort by Xs
    graph.nodes.sort(function (a, b) { return a.x - b.x; });
    var layedOut = [];
    lodash_1.default.forEach(graph.nodes, function (cur) {
        var t = 3.0;
        var minSide = Math.min(cur.height, cur.width);
        var spiralFactor = minSide / 17;
        var spiralStep = minSide / 10;
        // We copy the current object so we can translate it in peace
        var translatedNode = __assign({}, cur);
        while (true) {
            var tx = Math.sin(t) * t * spiralFactor;
            var ty = Math.cos(t) * t * spiralFactor;
            // applying translation (translatedNode is mutated)
            lodash_1.default.assign(translatedNode, agora_graph_1.sum(cur, { x: tx, y: ty }));
            if (!areOverlapping(layedOut, translatedNode)) {
                // found placement
                layedOut.push(translatedNode);
                break;
            }
            t += spiralStep / t;
        }
    });
    graph.nodes = layedOut;
    return { graph: graph };
};
function areOverlapping(list, current) {
    for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
        var s = list_1[_i];
        if (agora_graph_1.overlap(s, current)) {
            return true;
        }
    }
    return false;
}
