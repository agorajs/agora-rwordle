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

import {  sum, overlap, createFunction , } from 'agora-graph';
import type {Node, Algorithm} from "agora-graph"
export const rWordleL = createFunction(function (
  graph,
  options: { padding: number } = { padding: 0 }
) {
  // Sort by Xs
  graph.nodes.sort((a, b) => a.x - b.x);

  const layouted: Node[] = [];

  _.forEach(graph.nodes, function (cur) {
    let t = 3.0;
    const minSide = Math.min(cur.width, cur.height);
    // spiral depending on the size of the object
    const spiralFactor = minSide / 17.0;
    const spiralStep = minSide / 10.0;

    // We copy the current object so we can translate it in peace
    while (true) {
      const tx = Math.sin(t) * t * spiralFactor;
      const ty = Math.cos(t) * t * spiralFactor;

      // transformed object
      const transformedArea = {
        ...cur,
        ...sum(cur, { x: tx, y: ty })
      };
      if (!hasOverlap(layouted, transformedArea)) {
        // found placement
        layouted.push(transformedArea);
        break;
      }
      t += spiralStep / t;
    }
  });

  graph.nodes = layouted;
  return { graph };
});

export const RWordleLAlgorithm: Algorithm<{ padding: number }> = {
  name: 'RWordleL',
  algorithm: rWordleL
};

export default rWordleL;

function hasOverlap(alreadyLayouted: Node[], current: Node) {
  for (const s of alreadyLayouted) {
    if (overlap(s, current)) {
      return true;
    }
  }

  return false;
}
