import { concat, group, indent, join, line } from './../util/prettier-doc-builders.js'

export const printUseStatement = (node, path, print) => {
  const docs = [node.trimLeft ? '{%-' : '{%', ' use "', path.call(print, 'source'), '"']
  const hasAliases = node.aliases && node.aliases.length > 0
  if (hasAliases) {
    docs.push(' with')
    const mappedAliases = path.map(print, 'aliases')
    docs.push(indent(concat([line, join(concat([',', line]), mappedAliases)])))
    docs.push(line)
  } else {
    docs.push(' ')
  }
  docs.push(node.trimRight ? '-%}' : '%}')
  return group(concat(docs))
}
