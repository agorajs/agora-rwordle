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

import _ from 'lodash';

import { Node, sum, overlap, createFunction } from 'agora-graph';

export const rWordle = createFunction(function (
  graph,
  options: { padding: number } = { padding: 0 }
) {
  // Sort by Xs
  graph.nodes.sort((a, b) => a.x - b.x);

  const layedOut: Node[] = [];

  _.forEach(graph.nodes, function (cur) {
    let t = 3.0;
    const minSide = Math.min(cur.height, cur.width);
    const spiralFactor = minSide / 17;
    const spiralStep = minSide / 10;

    // We copy the current object so we can translate it in peace
    const translatedNode: Node = {
      ...cur,
    };
    while (true) {
      const tx = Math.sin(t) * t * spiralFactor;
      const ty = Math.cos(t) * t * spiralFactor;

      // applying translation (translatedNode is mutated)
      _.assign(translatedNode, sum(cur, { x: tx, y: ty }));

      if (!areOverlapping(layedOut, translatedNode)) {
        // found placement
        layedOut.push(translatedNode);
        break;
      }
      t += spiralStep / t;
    }
  });

  graph.nodes = layedOut;
  return { graph };
});

export default rWordle;

function areOverlapping(list: Node[], current: Node) {
  for (const s of list) {
    if (overlap(s, current)) {
      return true;
    }
  }

  return false;
}
