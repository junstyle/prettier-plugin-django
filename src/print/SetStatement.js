import { group, concat, line, hardline } from './../util/prettier-doc-builders.js'
import { printChildBlock, isNotExpression, STRING_NEEDS_QUOTES, GROUP_TOP_LEVEL_LOGICAL } from '../util'
import { Node } from 'melody-types'

const shouldAvoidBreakBeforeClosing = valueNode => Node.isObjectExpression(valueNode) || isNotExpression(valueNode) || Node.isArrayExpression(valueNode)

const buildSetStatement = (node, path, print, assignmentIndex) => {
  const varDeclaration = node.assignments[assignmentIndex]
  varDeclaration[GROUP_TOP_LEVEL_LOGICAL] = false
  const avoidBreakBeforeClosing = shouldAvoidBreakBeforeClosing(varDeclaration.value)

  return group(concat([node.trimLeft ? '{%-' : '{%', ' set ', path.call(print, 'assignments', assignmentIndex), avoidBreakBeforeClosing ? ' ' : line, node.trimRight ? '-%}' : '%}']))
}

const isEmbracingSet = node => {
  return Array.isArray(node.assignments) && node.assignments.length === 1 && Array.isArray(node.assignments[0].value)
}

const printRegularSet = (node, path, print) => {
  const parts = []
  const hasAssignments = Array.isArray(node.assignments) && node.assignments.length > 0
  if (hasAssignments) {
    node.assignments.forEach((_, index) => {
      if (parts.length > 0) {
        parts.push(hardline)
      }
      parts.push(buildSetStatement(node, path, print, index))
    })
  }
  return concat(parts)
}

const printEmbracingSet = (node, path, print) => {
  const parts = [node.trimLeft ? '{%-' : '{%', ' set ', path.call(print, 'assignments', '0', 'name'), node.trimRightSet ? ' -%}' : ' %}']
  node[STRING_NEEDS_QUOTES] = false
  const printedContents = printChildBlock(node, path, print, 'assignments', '0', 'value')
  // const printedContents = path.map(print, "assignments", "0", "value");
  parts.push(printedContents)
  parts.push(hardline, node.trimLeftEndset ? '{%-' : '{%', ' endset ', node.trimRight ? '-%}' : '%}')
  return concat(parts)
}

export const printSetStatement = (node, path, print) => {
  node[STRING_NEEDS_QUOTES] = true
  if (isEmbracingSet(node)) {
    return printEmbracingSet(node, path, print)
  }
  return printRegularSet(node, path, print)
}
