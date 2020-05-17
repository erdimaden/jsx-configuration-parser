import Parser from './Parser';
import { NodeType } from './types';

/**
 * Parses value and returns array of nodes
 *
 * ### Example (es module)
 * ```js
 * import { parse } from 'jsx-string-parser'
 * console.log(parse(`<View />`))
 * // => [ { component: 'View', children: [], raw: '<View />' } ]
 * ```
 *
 *
 * @param rawJsxCode    JSX Code
 * @returns             Parsed nodes
 */
export const parse = (rawJsxCode: string): NodeType[] => {
  return new Parser().parse(rawJsxCode);
};

/**
 * Searches nodes with a given filter function
 *
 * ### Example (es module)
 * ```js
 * import { searchByAttr } from 'jsx-string-parser'
 * const nodes = [ { component: 'View', children: [], raw: '<View />' } ]
 * console.log(searchByAttr(nodes, (node) => node.component === 'View')))
 * // => [ { component: 'View', children: [], raw: '<View />' } ]
 * ```
 *
 *
 * @param nodes    Array of Nodes
 * @param searchFunction    Filter Function
 * @param maxDepth    Max-depth
 * @returns             Parsed nodes
 */
export const searchByAttr = (
  nodes: NodeType[],
  searchFunction: (value: NodeType) => {},
  maxDepth = Infinity
): readonly NodeType[] => {
  const results: NodeType[] = [];
  const queue: NodeType[] = [...nodes];
  let childs: NodeType[] = [];
  while (queue.length && maxDepth) {
    const node: NodeType = queue.shift();
    if (node && searchFunction(node)) {
      results.push(node);
    }
    if (Array.isArray(node?.children) && node.children.length) {
      childs.push(...node.children);
    }

    if (!queue.length) {
      queue.push(...childs);
      childs = [];
      maxDepth--;
    }
  }
  return results;
};
export { NodeType };
