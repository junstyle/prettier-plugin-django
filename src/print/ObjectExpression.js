import { group, concat, line, hardline, indent, join } from './../util/prettier-doc-builders.js'
import { EXPRESSION_NEEDED, wrapExpressionIfNeeded } from '../util'

export const printObjectExpression = (node, path, print, options) => {
  if (node.properties.length === 0) {
    return '{}'
  }
  node[EXPRESSION_NEEDED] = false
  const mappedElements = path.map(print, 'properties')
  const separator = options.twigAlwaysBreakObjects ? hardline : line
  const indentedContent = concat([line, join(concat([',', separator]), mappedElements)])

  const parts = ['{', indent(indentedContent), separator, '}']
  wrapExpressionIfNeeded(path, parts, node)

  return group(concat(parts))
}
