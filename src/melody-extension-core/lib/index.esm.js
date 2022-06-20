import { Node, BinaryExpression, BinaryConcatExpression, UnaryExpression, type, alias, visitor, Identifier, PrintExpressionStatement } from 'melody-types'
import { Types, setStartFromToken, setEndFromToken, copyStart, copyEnd, copyLoc, LEFT, hasTagStartTokenTrimLeft, hasTagEndTokenTrimRight, createNode } from '../../melody-parser/src'
import _filter from 'lodash/filter'
import { traverse } from 'melody-traverse'
import { identifier, expressionStatement, assignmentExpression, booleanLiteral, blockStatement, variableDeclaration, variableDeclarator, ifStatement, unaryExpression, binaryExpression, numericLiteral, stringLiteral, callExpression, nullLiteral, memberExpression, importDeclaration, importDefaultSpecifier } from 'babel-types'
import babelTemplate from 'babel-template'

var classCallCheck = function(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function')
  }
}

var inherits = function(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass)
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  })
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : (subClass.__proto__ = superClass)
}

var possibleConstructorReturn = function(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
  }

  return call && (typeof call === 'object' || typeof call === 'function') ? call : self
}

/**
 * Copyright 2017 trivago N.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var unaryOperators = []
var binaryOperators = []
var tests = []

//region Unary Expressions
var UnaryNotExpression = createUnaryOperator('not', 'UnaryNotExpression', 50)
var UnaryNeqExpression = createUnaryOperator('-', 'UnaryNeqExpression', 500)
var UnaryPosExpression = createUnaryOperator('+', 'UnaryPosExpression', 500)
//endregion

//region Binary Expressions
var BinaryOrExpression = createBinaryOperatorNode({
  text: 'or',
  type: 'BinaryOrExpression',
  precedence: 10,
  associativity: LEFT
})
var BinaryAndExpression = createBinaryOperatorNode({
  text: 'and',
  type: 'BinaryAndExpression',
  precedence: 15,
  associativity: LEFT
})

var BitwiseOrExpression = createBinaryOperatorNode({
  text: 'b-or',
  type: 'BitwiseOrExpression',
  precedence: 16,
  associativity: LEFT
})
var BitwiseXorExpression = createBinaryOperatorNode({
  text: 'b-xor',
  type: 'BitwiseXOrExpression',
  precedence: 17,
  associativity: LEFT
})
var BitwiseAndExpression = createBinaryOperatorNode({
  text: 'b-and',
  type: 'BitwiseAndExpression',
  precedence: 18,
  associativity: LEFT
})

var BinaryEqualsExpression = createBinaryOperatorNode({
  text: '==',
  type: 'BinaryEqualsExpression',
  precedence: 20,
  associativity: LEFT
})
var BinaryNotEqualsExpression = createBinaryOperatorNode({
  text: '!=',
  type: 'BinaryNotEqualsExpression',
  precedence: 20,
  associativity: LEFT
})
var BinaryLessThanExpression = createBinaryOperatorNode({
  text: '<',
  type: 'BinaryLessThanExpression',
  precedence: 20,
  associativity: LEFT
})
var BinaryGreaterThanExpression = createBinaryOperatorNode({
  text: '>',
  type: 'BinaryGreaterThanExpression',
  precedence: 20,
  associativity: LEFT
})
var BinaryLessThanOrEqualExpression = createBinaryOperatorNode({
  text: '<=',
  type: 'BinaryLessThanOrEqualExpression',
  precedence: 20,
  associativity: LEFT
})
var BinaryGreaterThanOrEqualExpression = createBinaryOperatorNode({
  text: '>=',
  type: 'BinaryGreaterThanOrEqualExpression',
  precedence: 20,
  associativity: LEFT
})

var BinaryNotInExpression = createBinaryOperatorNode({
  text: 'not in',
  type: 'BinaryNotInExpression',
  precedence: 20,
  associativity: LEFT
})
var BinaryInExpression = createBinaryOperatorNode({
  text: 'in',
  type: 'BinaryInExpression',
  precedence: 20,
  associativity: LEFT
})
var BinaryMatchesExpression = createBinaryOperatorNode({
  text: 'matches',
  type: 'BinaryMatchesExpression',
  precedence: 20,
  associativity: LEFT
})
var BinaryStartsWithExpression = createBinaryOperatorNode({
  text: 'starts with',
  type: 'BinaryStartsWithExpression',
  precedence: 20,
  associativity: LEFT
})
var BinaryEndsWithExpression = createBinaryOperatorNode({
  text: 'ends with',
  type: 'BinaryEndsWithExpression',
  precedence: 20,
  associativity: LEFT
})

var BinaryRangeExpression = createBinaryOperatorNode({
  text: '..',
  type: 'BinaryRangeExpression',
  precedence: 25,
  associativity: LEFT
})

var BinaryAddExpression = createBinaryOperatorNode({
  text: '+',
  type: 'BinaryAddExpression',
  precedence: 30,
  associativity: LEFT
})
var BinarySubExpression = createBinaryOperatorNode({
  text: '-',
  type: 'BinarySubExpression',
  precedence: 30,
  associativity: LEFT
})
binaryOperators.push({
  text: '~',
  precedence: 40,
  associativity: LEFT,
  createNode: function createNode$$1(token, lhs, rhs) {
    var op = new BinaryConcatExpression(lhs, rhs)
    copyStart(op, lhs)
    copyEnd(op, rhs)
    return op
  }
})
var BinaryMulExpression = createBinaryOperatorNode({
  text: '*',
  type: 'BinaryMulExpression',
  precedence: 60,
  associativity: LEFT
})
var BinaryDivExpression = createBinaryOperatorNode({
  text: '/',
  type: 'BinaryDivExpression',
  precedence: 60,
  associativity: LEFT
})
var BinaryFloorDivExpression = createBinaryOperatorNode({
  text: '//',
  type: 'BinaryFloorDivExpression',
  precedence: 60,
  associativity: LEFT
})
var BinaryModExpression = createBinaryOperatorNode({
  text: '%',
  type: 'BinaryModExpression',
  precedence: 60,
  associativity: LEFT
})

binaryOperators.push({
  text: 'is',
  precedence: 100,
  associativity: LEFT,
  parse: function parse(parser, token, expr) {
    var tokens = parser.tokens

    var not = false
    if (tokens.nextIf(Types.OPERATOR, 'not')) {
      not = true
    }

    var test = getTest(parser)
    var args = null
    if (tokens.test(Types.LPAREN)) {
      args = parser.matchArguments()
    }
    var testExpression = test.createNode(expr, args)
    setStartFromToken(testExpression, token)
    setEndFromToken(testExpression, tokens.la(-1))
    if (not) {
      return copyLoc(new UnaryNotExpression(testExpression), testExpression)
    }
    return testExpression
  }
})

function getTest(parser) {
  var tokens = parser.tokens
  var nameToken = tokens.la(0)
  if (nameToken.type !== Types.NULL) {
    tokens.expect(Types.SYMBOL)
  } else {
    tokens.next()
  }
  var testName = nameToken.text
  if (!parser.hasTest(testName)) {
    // try 2-words tests
    var continuedNameToken = tokens.expect(Types.SYMBOL)
    testName += ' ' + continuedNameToken.text
    if (!parser.hasTest(testName)) {
      parser.error({
        title: 'Unknown test "' + testName + '"',
        pos: nameToken.pos
      })
    }
  }

  return parser.getTest(testName)
}

var BinaryPowerExpression = createBinaryOperatorNode({
  text: '**',
  type: 'BinaryPowerExpression',
  precedence: 200,
  associativity: LEFT
})
var BinaryNullCoalesceExpression = createBinaryOperatorNode({
  text: '??',
  type: 'BinaryNullCoalesceExpression',
  precedence: 300,
  associativity: LEFT
})
//endregion

//region Test Expressions
var TestEvenExpression = createTest('even', 'TestEvenExpression')
var TestOddExpression = createTest('odd', 'TestOddExpression')
var TestDefinedExpression = createTest('defined', 'TestDefinedExpression')
var TestSameAsExpression = createTest('same as', 'TestSameAsExpression')
tests.push({
  text: 'sameas',
  createNode: function createNode$$1(expr, args) {
    // todo: add deprecation warning
    return new TestSameAsExpression(expr, args)
  }
})
var TestNullExpression = createTest('null', 'TestNullExpression')
tests.push({
  text: 'none',
  createNode: function createNode$$1(expr, args) {
    return new TestNullExpression(expr, args)
  }
})
var TestDivisibleByExpression = createTest('divisible by', 'TestDivisibleByExpression')
tests.push({
  text: 'divisibleby',
  createNode: function createNode$$1(expr, args) {
    // todo: add deprecation warning
    return new TestDivisibleByExpression(expr, args)
  }
})
var TestConstantExpression = createTest('constant', 'TestConstantExpression')
var TestEmptyExpression = createTest('empty', 'TestEmptyExpression')
var TestIterableExpression = createTest('iterable', 'TestIterableExpression')
//endregion

//region Utilities
function createTest(text, typeName) {
  var TestExpression = (function(_Node) {
    inherits(TestExpression, _Node)

    function TestExpression(expr, args) {
      classCallCheck(this, TestExpression)

      var _this = possibleConstructorReturn(this, _Node.call(this))

      _this.expression = expr
      _this.arguments = args
      return _this
    }

    return TestExpression
  })(Node)
  type(TestExpression, typeName)
  alias(TestExpression, 'Expression', 'TestExpression')
  visitor(TestExpression, 'expression', 'arguments')

  tests.push({
    text: text,
    createNode: function createNode$$1(expr, args) {
      return new TestExpression(expr, args)
    }
  })

  return TestExpression
}

function createBinaryOperatorNode(options) {
  var text = options.text,
    precedence = options.precedence,
    associativity = options.associativity

  var BinarySubclass = (function(_BinaryExpression) {
    inherits(BinarySubclass, _BinaryExpression)

    function BinarySubclass(left, right) {
      classCallCheck(this, BinarySubclass)
      return possibleConstructorReturn(this, _BinaryExpression.call(this, text, left, right))
    }

    return BinarySubclass
  })(BinaryExpression)
  type(BinarySubclass, options.type)
  alias(BinarySubclass, 'BinaryExpression', 'Binary', 'Expression')
  visitor(BinarySubclass, 'left', 'right')

  var operator = {
    text: text,
    precedence: precedence,
    associativity: associativity
  }
  if (options.parse) {
    operator.parse = options.parse
  } else if (options.createNode) {
    operator.createNode = options.createNode
  } else {
    operator.createNode = function(token, lhs, rhs) {
      return new BinarySubclass(lhs, rhs)
    }
  }
  binaryOperators.push(operator)

  return BinarySubclass
}

function createUnaryOperator(operator, typeName, precedence) {
  var UnarySubclass = (function(_UnaryExpression) {
    inherits(UnarySubclass, _UnaryExpression)

    function UnarySubclass(argument) {
      classCallCheck(this, UnarySubclass)
      return possibleConstructorReturn(this, _UnaryExpression.call(this, operator, argument))
    }

    return UnarySubclass
  })(UnaryExpression)
  type(UnarySubclass, typeName)
  alias(UnarySubclass, 'Expression', 'UnaryLike')
  visitor(UnarySubclass, 'argument')

  unaryOperators.push({
    text: operator,
    precedence: precedence,
    createNode: function createNode$$1(token, expr) {
      var op = new UnarySubclass(expr)
      setStartFromToken(op, token)
      copyEnd(op, expr)
      return op
    }
  })

  return UnarySubclass
}

/**
 * Copyright 2017 trivago N.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var AutoescapeBlock = (function(_Node) {
  inherits(AutoescapeBlock, _Node)

  function AutoescapeBlock(type$$1, expressions) {
    classCallCheck(this, AutoescapeBlock)

    var _this = possibleConstructorReturn(this, _Node.call(this))

    _this.escapeType = type$$1
    _this.expressions = expressions
    return _this
  }

  return AutoescapeBlock
})(Node)
type(AutoescapeBlock, 'AutoescapeBlock')
alias(AutoescapeBlock, 'Block', 'Escape')
visitor(AutoescapeBlock, 'expressions')

var BlockStatement = (function(_Node2) {
  inherits(BlockStatement, _Node2)

  function BlockStatement(name, body) {
    classCallCheck(this, BlockStatement)

    var _this2 = possibleConstructorReturn(this, _Node2.call(this))

    _this2.name = name
    _this2.body = body
    return _this2
  }

  return BlockStatement
})(Node)
type(BlockStatement, 'BlockStatement')
alias(BlockStatement, 'Statement', 'Scope', 'RootScope')
visitor(BlockStatement, 'body')

var BlockCallExpression = (function(_Node3) {
  inherits(BlockCallExpression, _Node3)

  function BlockCallExpression(callee) {
    var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : []
    classCallCheck(this, BlockCallExpression)

    var _this3 = possibleConstructorReturn(this, _Node3.call(this))

    _this3.callee = callee
    _this3.arguments = args
    return _this3
  }

  return BlockCallExpression
})(Node)
type(BlockCallExpression, 'BlockCallExpression')
alias(BlockCallExpression, 'Expression', 'FunctionInvocation')
visitor(BlockCallExpression, 'arguments')

var MountStatement = (function(_Node4) {
  inherits(MountStatement, _Node4)

  function MountStatement(name, source, key, argument, async, delayBy) {
    classCallCheck(this, MountStatement)

    var _this4 = possibleConstructorReturn(this, _Node4.call(this))

    _this4.name = name
    _this4.source = source
    _this4.key = key
    _this4.argument = argument
    _this4.async = async
    _this4.delayBy = delayBy
    _this4.errorVariableName = null
    _this4.body = null
    _this4.otherwise = null
    return _this4
  }

  return MountStatement
})(Node)
type(MountStatement, 'MountStatement')
alias(MountStatement, 'Statement', 'Scope')
visitor(MountStatement, 'name', 'source', 'key', 'argument', 'body', 'otherwise')

var DoStatement = (function(_Node5) {
  inherits(DoStatement, _Node5)

  function DoStatement(expression) {
    classCallCheck(this, DoStatement)

    var _this5 = possibleConstructorReturn(this, _Node5.call(this))

    _this5.value = expression
    return _this5
  }

  return DoStatement
})(Node)
type(DoStatement, 'DoStatement')
alias(DoStatement, 'Statement')
visitor(DoStatement, 'value')

var EmbedStatement = (function(_Node6) {
  inherits(EmbedStatement, _Node6)

  function EmbedStatement(parent) {
    classCallCheck(this, EmbedStatement)

    var _this6 = possibleConstructorReturn(this, _Node6.call(this))

    _this6.parent = parent
    _this6.argument = null
    _this6.contextFree = false
    // when `true`, missing templates will be ignored
    _this6.ignoreMissing = false
    _this6.blocks = null
    return _this6
  }

  return EmbedStatement
})(Node)
type(EmbedStatement, 'EmbedStatement')
alias(EmbedStatement, 'Statement', 'Include')
visitor(EmbedStatement, 'argument', 'blocks')

var ExtendsStatement = (function(_Node7) {
  inherits(ExtendsStatement, _Node7)

  function ExtendsStatement(parentName) {
    classCallCheck(this, ExtendsStatement)

    var _this7 = possibleConstructorReturn(this, _Node7.call(this))

    _this7.parentName = parentName
    return _this7
  }

  return ExtendsStatement
})(Node)
type(ExtendsStatement, 'ExtendsStatement')
alias(ExtendsStatement, 'Statement', 'Include')
visitor(ExtendsStatement, 'parentName')

var FilterBlockStatement = (function(_Node8) {
  inherits(FilterBlockStatement, _Node8)

  function FilterBlockStatement(filterExpression, body) {
    classCallCheck(this, FilterBlockStatement)

    var _this8 = possibleConstructorReturn(this, _Node8.call(this))

    _this8.filterExpression = filterExpression
    _this8.body = body
    return _this8
  }

  return FilterBlockStatement
})(Node)
type(FilterBlockStatement, 'FilterBlockStatement')
alias(FilterBlockStatement, 'Statement', 'Block')
visitor(FilterBlockStatement, 'filterExpression', 'body')

var FlushStatement = (function(_Node9) {
  inherits(FlushStatement, _Node9)

  function FlushStatement() {
    classCallCheck(this, FlushStatement)
    return possibleConstructorReturn(this, _Node9.call(this))
  }

  return FlushStatement
})(Node)
type(FlushStatement, 'FlushStatement')
alias(FlushStatement, 'Statement')

var ForStatement = (function(_Node10) {
  inherits(ForStatement, _Node10)

  function ForStatement() {
    var keyTarget = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null
    var valueTarget = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null
    var sequence = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null
    var condition = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null
    var body = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null
    var otherwise = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null
    classCallCheck(this, ForStatement)

    var _this10 = possibleConstructorReturn(this, _Node10.call(this))

    _this10.keyTarget = keyTarget
    _this10.valueTarget = valueTarget
    _this10.sequence = sequence
    _this10.condition = condition
    _this10.body = body
    _this10.otherwise = otherwise
    return _this10
  }

  return ForStatement
})(Node)
type(ForStatement, 'ForStatement')
alias(ForStatement, 'Statement', 'Scope', 'Loop')
visitor(ForStatement, 'keyTarget', 'valueTarget', 'sequence', 'condition', 'body', 'otherwise')

var ImportDeclaration = (function(_Node11) {
  inherits(ImportDeclaration, _Node11)

  function ImportDeclaration(key, alias$$1) {
    classCallCheck(this, ImportDeclaration)

    var _this11 = possibleConstructorReturn(this, _Node11.call(this))

    _this11.key = key
    _this11.alias = alias$$1
    return _this11
  }

  return ImportDeclaration
})(Node)
type(ImportDeclaration, 'ImportDeclaration')
alias(ImportDeclaration, 'VariableDeclaration')
visitor(ImportDeclaration, 'key', 'value')

var FromStatement = (function(_Node12) {
  inherits(FromStatement, _Node12)

  function FromStatement(source, imports) {
    classCallCheck(this, FromStatement)

    var _this12 = possibleConstructorReturn(this, _Node12.call(this))

    _this12.source = source
    _this12.imports = imports
    return _this12
  }

  return FromStatement
})(Node)
type(FromStatement, 'FromStatement')
alias(FromStatement, 'Statement')
visitor(FromStatement, 'source', 'imports')

var IfStatement = (function(_Node13) {
  inherits(IfStatement, _Node13)

  function IfStatement(test) {
    var consequent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null
    var alternate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null
    classCallCheck(this, IfStatement)

    var _this13 = possibleConstructorReturn(this, _Node13.call(this))

    _this13.test = test
    _this13.consequent = consequent
    _this13.alternate = alternate
    return _this13
  }

  return IfStatement
})(Node)
type(IfStatement, 'IfStatement')
alias(IfStatement, 'Statement', 'Conditional')
visitor(IfStatement, 'test', 'consequent', 'alternate')

var IncludeStatement = (function(_Node14) {
  inherits(IncludeStatement, _Node14)

  function IncludeStatement(source) {
    classCallCheck(this, IncludeStatement)

    var _this14 = possibleConstructorReturn(this, _Node14.call(this))

    _this14.source = source
    _this14.argument = null
    _this14.contextFree = false
    // when `true`, missing templates will be ignored
    _this14.ignoreMissing = false
    return _this14
  }

  return IncludeStatement
})(Node)
type(IncludeStatement, 'IncludeStatement')
alias(IncludeStatement, 'Statement', 'Include')
visitor(IncludeStatement, 'source', 'argument')

var MacroDeclarationStatement = (function(_Node15) {
  inherits(MacroDeclarationStatement, _Node15)

  function MacroDeclarationStatement(name, args, body) {
    classCallCheck(this, MacroDeclarationStatement)

    var _this15 = possibleConstructorReturn(this, _Node15.call(this))

    _this15.name = name
    _this15.arguments = args
    _this15.body = body
    return _this15
  }

  return MacroDeclarationStatement
})(Node)
type(MacroDeclarationStatement, 'MacroDeclarationStatement')
alias(MacroDeclarationStatement, 'Statement', 'Scope', 'RootScope')
visitor(MacroDeclarationStatement, 'name', 'arguments', 'body')

var VariableDeclarationStatement = (function(_Node16) {
  inherits(VariableDeclarationStatement, _Node16)

  function VariableDeclarationStatement(name, value) {
    classCallCheck(this, VariableDeclarationStatement)

    var _this16 = possibleConstructorReturn(this, _Node16.call(this))

    _this16.name = name
    _this16.value = value
    return _this16
  }

  return VariableDeclarationStatement
})(Node)
type(VariableDeclarationStatement, 'VariableDeclarationStatement')
alias(VariableDeclarationStatement, 'Statement')
visitor(VariableDeclarationStatement, 'name', 'value')

var SetStatement = (function(_Node17) {
  inherits(SetStatement, _Node17)

  function SetStatement(assignments) {
    classCallCheck(this, SetStatement)

    var _this17 = possibleConstructorReturn(this, _Node17.call(this))

    _this17.assignments = assignments
    return _this17
  }

  return SetStatement
})(Node)
type(SetStatement, 'SetStatement')
alias(SetStatement, 'Statement', 'ContextMutation')
visitor(SetStatement, 'assignments')

var SpacelessBlock = (function(_Node18) {
  inherits(SpacelessBlock, _Node18)

  function SpacelessBlock() {
    var body = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null
    classCallCheck(this, SpacelessBlock)

    var _this18 = possibleConstructorReturn(this, _Node18.call(this))

    _this18.body = body
    return _this18
  }

  return SpacelessBlock
})(Node)
type(SpacelessBlock, 'SpacelessBlock')
alias(SpacelessBlock, 'Statement', 'Block')
visitor(SpacelessBlock, 'body')

var AliasExpression = (function(_Node19) {
  inherits(AliasExpression, _Node19)

  function AliasExpression(name, alias$$1) {
    classCallCheck(this, AliasExpression)

    var _this19 = possibleConstructorReturn(this, _Node19.call(this))

    _this19.name = name
    _this19.alias = alias$$1
    return _this19
  }

  return AliasExpression
})(Node)
type(AliasExpression, 'AliasExpression')
alias(AliasExpression, 'Expression')
visitor(AliasExpression, 'name', 'alias')

var UseStatement = (function(_Node20) {
  inherits(UseStatement, _Node20)

  function UseStatement(source, aliases) {
    classCallCheck(this, UseStatement)

    var _this20 = possibleConstructorReturn(this, _Node20.call(this))

    _this20.source = source
    _this20.aliases = aliases
    return _this20
  }

  return UseStatement
})(Node)
type(UseStatement, 'UseStatement')
alias(UseStatement, 'Statement', 'Include')
visitor(UseStatement, 'source', 'aliases')

/**
 * Copyright 2017 trivago N.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var AutoescapeParser = {
  name: 'autoescape',
  parse: function parse(parser, token) {
    var tokens = parser.tokens

    var escapeType = null,
      stringStartToken = void 0,
      openingTagEndToken = void 0,
      closingTagStartToken = void 0
    if (tokens.nextIf(Types.TAG_END)) {
      openingTagEndToken = tokens.la(-1)
      escapeType = null
    } else if ((stringStartToken = tokens.nextIf(Types.STRING_START))) {
      escapeType = tokens.expect(Types.STRING).text
      if (!tokens.nextIf(Types.STRING_END)) {
        parser.error({
          title: 'autoescape type declaration must be a simple string',
          pos: tokens.la(0).pos,
          advice: "The type declaration for autoescape must be a simple string such as 'html' or 'js'.\nI expected the current string to end with a " + stringStartToken.text + ' but instead found ' + (Types.ERROR_TABLE[tokens.lat(0)] || tokens.lat(0)) + '.'
        })
      }
      openingTagEndToken = tokens.la(0)
    } else if (tokens.nextIf(Types.FALSE)) {
      escapeType = false
      openingTagEndToken = tokens.la(0)
    } else if (tokens.nextIf(Types.TRUE)) {
      escapeType = true
      openingTagEndToken = tokens.la(0)
    } else {
      parser.error({
        title: 'Invalid autoescape type declaration',
        pos: tokens.la(0).pos,
        advice: 'Expected type of autoescape to be a string, boolean or not specified. Found ' + tokens.la(0).type + ' instead.'
      })
    }

    var autoescape = new AutoescapeBlock(escapeType)
    setStartFromToken(autoescape, token)
    var tagEndToken = void 0
    autoescape.expressions = parser.parse(function(_, token, tokens) {
      if (token.type === Types.TAG_START && tokens.nextIf(Types.SYMBOL, 'endautoescape')) {
        closingTagStartToken = token
        tagEndToken = tokens.expect(Types.TAG_END)
        return true
      }
      return false
    }).expressions
    setEndFromToken(autoescape, tagEndToken)

    autoescape.trimRightAutoescape = hasTagEndTokenTrimRight(openingTagEndToken)
    autoescape.trimLeftEndautoescape = hasTagStartTokenTrimLeft(closingTagStartToken)

    return autoescape
  }
}

/**
 * Copyright 2017 trivago N.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var BlockParser = {
  name: 'block',
  parse: function parse(parser, token) {
    var tokens = parser.tokens,
      nameToken = tokens.expect(Types.SYMBOL)

    var blockStatement$$1 = void 0,
      openingTagEndToken = void 0,
      closingTagStartToken = void 0
    if ((openingTagEndToken = tokens.nextIf(Types.TAG_END))) {
      blockStatement$$1 = new BlockStatement(
        createNode(Identifier, nameToken, nameToken.text),
        parser.parse(function(tokenText, token, tokens) {
          var result = !!(token.type === Types.TAG_START && tokens.nextIf(Types.SYMBOL, 'endblock'))
          if (result) {
            closingTagStartToken = token
          }
          return result
        }).expressions
      )

      if (tokens.nextIf(Types.SYMBOL, nameToken.text)) {
        if (tokens.lat(0) !== Types.TAG_END) {
          var unexpectedToken = tokens.next()
          parser.error({
            title: 'Block name mismatch',
            pos: unexpectedToken.pos,
            advice: unexpectedToken.type == Types.SYMBOL ? 'Expected end of block ' + nameToken.text + ' but instead found end of block ' + tokens.la(0).text + '.' : "endblock must be followed by either '%}' or the name of the open block. Found a token of type " + (Types.ERROR_TABLE[unexpectedToken.type] || unexpectedToken.type) + ' instead.'
          })
        }
      }
    } else {
      blockStatement$$1 = new BlockStatement(createNode(Identifier, nameToken, nameToken.text), new PrintExpressionStatement(parser.matchExpression()))
    }

    setStartFromToken(blockStatement$$1, token)
    setEndFromToken(blockStatement$$1, tokens.expect(Types.TAG_END))

    blockStatement$$1.trimRightBlock = openingTagEndToken && hasTagEndTokenTrimRight(openingTagEndToken)
    blockStatement$$1.trimLeftEndblock = !!(closingTagStartToken && hasTagStartTokenTrimLeft(closingTagStartToken))

    return blockStatement$$1
  }
}

/**
 * Copyright 2017 trivago N.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var DoParser = {
  name: 'do',
  parse: function parse(parser, token) {
    var tokens = parser.tokens,
      doStatement = new DoStatement(parser.matchExpression())
    setStartFromToken(doStatement, token)
    setEndFromToken(doStatement, tokens.expect(Types.TAG_END))
    return doStatement
  }
}

var EmbedParser = {
  name: 'embed',
  parse: function parse(parser, token) {
    var tokens = parser.tokens

    var embedStatement = new EmbedStatement(parser.matchExpression())

    if (tokens.nextIf(Types.SYMBOL, 'ignore')) {
      tokens.expect(Types.SYMBOL, 'missing')
      embedStatement.ignoreMissing = true
    }

    if (tokens.nextIf(Types.SYMBOL, 'with')) {
      embedStatement.argument = parser.matchExpression()
    }

    if (tokens.nextIf(Types.SYMBOL, 'only')) {
      embedStatement.contextFree = true
    }

    tokens.expect(Types.TAG_END)
    var openingTagEndToken = tokens.la(-1)
    var closingTagStartToken = void 0

    embedStatement.blocks = _filter(
      parser.parse(function(tokenText, token, tokens) {
        var result = !!(token.type === Types.TAG_START && tokens.nextIf(Types.SYMBOL, 'endembed'))
        if (result) {
          closingTagStartToken = token
        }
        return result
      }).expressions,
      Node.isBlockStatement
    )

    setStartFromToken(embedStatement, token)
    setEndFromToken(embedStatement, tokens.expect(Types.TAG_END))

    embedStatement.trimRightEmbed = hasTagEndTokenTrimRight(openingTagEndToken)
    embedStatement.trimLeftEndembed = closingTagStartToken && hasTagStartTokenTrimLeft(closingTagStartToken)

    return embedStatement
  }
}

/**
 * Copyright 2017 trivago N.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var ExtendsParser = {
  name: 'extends',
  parse: function parse(parser, token) {
    var tokens = parser.tokens

    var extendsStatement = new ExtendsStatement(parser.matchExpression())

    setStartFromToken(extendsStatement, token)
    setEndFromToken(extendsStatement, tokens.expect(Types.TAG_END))

    return extendsStatement
  }
}

/**
 * Copyright 2017 trivago N.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var FilterParser = {
  name: 'filter',
  parse: function parse(parser, token) {
    var tokens = parser.tokens,
      ref = createNode(Identifier, token, 'filter'),
      filterExpression = parser.matchFilterExpression(ref)
    tokens.expect(Types.TAG_END)
    var openingTagEndToken = tokens.la(-1)
    var closingTagStartToken = void 0

    var body = parser.parse(function(text, token, tokens) {
      var result = token.type === Types.TAG_START && tokens.nextIf(Types.SYMBOL, 'endfilter')

      if (result) {
        closingTagStartToken = token
      }
      return result
    }).expressions

    var filterBlockStatement = new FilterBlockStatement(filterExpression, body)
    setStartFromToken(filterBlockStatement, token)
    setEndFromToken(filterBlockStatement, tokens.expect(Types.TAG_END))

    filterBlockStatement.trimRightFilter = hasTagEndTokenTrimRight(openingTagEndToken)
    filterBlockStatement.trimLeftEndfilter = closingTagStartToken && hasTagStartTokenTrimLeft(closingTagStartToken)

    return filterBlockStatement
  }
}

/**
 * Copyright 2017 trivago N.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var FlushParser = {
  name: 'flush',
  parse: function parse(parser, token) {
    var tokens = parser.tokens,
      flushStatement = new FlushStatement()

    setStartFromToken(flushStatement, token)
    setEndFromToken(flushStatement, tokens.expect(Types.TAG_END))
    return flushStatement
  }
}

/**
 * Copyright 2017 trivago N.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var ForParser = {
  name: 'for',
  parse: function parse(parser, token) {
    var tokens = parser.tokens,
      forStatement = new ForStatement()

    var keyTarget = tokens.expect(Types.SYMBOL)
    if (tokens.nextIf(Types.COMMA)) {
      forStatement.keyTarget = createNode(Identifier, keyTarget, keyTarget.text)
      var valueTarget = tokens.expect(Types.SYMBOL)
      forStatement.valueTarget = createNode(Identifier, valueTarget, valueTarget.text)
    } else {
      forStatement.keyTarget = null
      forStatement.valueTarget = createNode(Identifier, keyTarget, keyTarget.text)
    }

    tokens.expect(Types.OPERATOR, 'in')

    forStatement.sequence = parser.matchExpression()

    if (tokens.nextIf(Types.SYMBOL, 'if')) {
      forStatement.condition = parser.matchExpression()
    }

    tokens.expect(Types.TAG_END)

    var openingTagEndToken = tokens.la(-1)
    var elseTagStartToken = void 0,
      elseTagEndToken = void 0

    forStatement.body = parser.parse(function(tokenText, token, tokens) {
      var result = token.type === Types.TAG_START && (tokens.test(Types.SYMBOL, 'else') || tokens.test(Types.SYMBOL, 'endfor'))
      if (result && tokens.test(Types.SYMBOL, 'else')) {
        elseTagStartToken = token
      }
      return result
    })

    if (tokens.nextIf(Types.SYMBOL, 'else')) {
      tokens.expect(Types.TAG_END)
      elseTagEndToken = tokens.la(-1)
      forStatement.otherwise = parser.parse(function(tokenText, token, tokens) {
        return token.type === Types.TAG_START && tokens.test(Types.SYMBOL, 'endfor')
      })
    }
    var endforTagStartToken = tokens.la(-1)
    tokens.expect(Types.SYMBOL, 'endfor')

    setStartFromToken(forStatement, token)
    setEndFromToken(forStatement, tokens.expect(Types.TAG_END))

    forStatement.trimRightFor = hasTagEndTokenTrimRight(openingTagEndToken)
    forStatement.trimLeftElse = !!(elseTagStartToken && hasTagStartTokenTrimLeft(elseTagStartToken))
    forStatement.trimRightElse = !!(elseTagEndToken && hasTagEndTokenTrimRight(elseTagEndToken))
    forStatement.trimLeftEndfor = hasTagStartTokenTrimLeft(endforTagStartToken)

    return forStatement
  }
}

/**
 * Copyright 2017 trivago N.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var FromParser = {
  name: 'from',
  parse: function parse(parser, token) {
    var tokens = parser.tokens,
      source = parser.matchExpression(),
      imports = []

    tokens.expect(Types.SYMBOL, 'import')

    do {
      var name = tokens.expect(Types.SYMBOL)

      var alias$$1 = name
      if (tokens.nextIf(Types.SYMBOL, 'as')) {
        alias$$1 = tokens.expect(Types.SYMBOL)
      }

      var importDeclaration$$1 = new ImportDeclaration(createNode(Identifier, name, name.text), createNode(Identifier, alias$$1, alias$$1.text))
      setStartFromToken(importDeclaration$$1, name)
      setEndFromToken(importDeclaration$$1, alias$$1)

      imports.push(importDeclaration$$1)

      if (!tokens.nextIf(Types.COMMA)) {
        break
      }
    } while (!tokens.test(Types.EOF))

    var fromStatement = new FromStatement(source, imports)

    setStartFromToken(fromStatement, token)
    setEndFromToken(fromStatement, tokens.expect(Types.TAG_END))

    return fromStatement
  }
}

/**
 * Copyright 2017 trivago N.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var IfParser = {
  name: 'if',
  parse: function parse(parser, token) {
    var tokens = parser.tokens
    var test = parser.matchExpression(),
      alternate = null

    tokens.expect(Types.TAG_END)
    var ifTagEndToken = tokens.la(-1)

    var ifStatement$$1 = new IfStatement(test, parser.parse(matchConsequent).expressions)

    var elseTagStartToken = void 0,
      elseTagEndToken = void 0,
      elseifTagStartToken = void 0,
      elseifTagEndToken = void 0

    do {
      if (tokens.nextIf(Types.SYMBOL, 'else')) {
        elseTagStartToken = tokens.la(-2)
        tokens.expect(Types.TAG_END)
        elseTagEndToken = tokens.la(-1)
        ;(alternate || ifStatement$$1).alternate = parser.parse(matchAlternate).expressions
      } else if (tokens.nextIf(Types.SYMBOL, 'elseif')) {
        elseifTagStartToken = tokens.la(-2)
        test = parser.matchExpression()
        tokens.expect(Types.TAG_END)
        elseifTagEndToken = tokens.la(-1)
        var consequent = parser.parse(matchConsequent).expressions
        alternate = (alternate || ifStatement$$1).alternate = new IfStatement(test, consequent)
        alternate.trimLeft = hasTagStartTokenTrimLeft(elseifTagStartToken)
        alternate.trimRightIf = hasTagEndTokenTrimRight(elseifTagEndToken)
      }

      if (tokens.nextIf(Types.SYMBOL, 'endif')) {
        break
      }
    } while (!tokens.test(Types.EOF))

    var endifTagStartToken = tokens.la(-2)

    setStartFromToken(ifStatement$$1, token)
    setEndFromToken(ifStatement$$1, tokens.expect(Types.TAG_END))

    ifStatement$$1.trimRightIf = hasTagEndTokenTrimRight(ifTagEndToken)
    ifStatement$$1.trimLeftElse = !!(elseTagStartToken && hasTagStartTokenTrimLeft(elseTagStartToken))
    ifStatement$$1.trimRightElse = !!(elseTagEndToken && hasTagEndTokenTrimRight(elseTagEndToken))
    ifStatement$$1.trimLeftEndif = hasTagStartTokenTrimLeft(endifTagStartToken)

    return ifStatement$$1
  }
}

function matchConsequent(tokenText, token, tokens) {
  if (token.type === Types.TAG_START) {
    var next = tokens.la(0).text
    return next === 'else' || next === 'endif' || next === 'elseif'
  }
  return false
}

function matchAlternate(tokenText, token, tokens) {
  return token.type === Types.TAG_START && tokens.test(Types.SYMBOL, 'endif')
}

/**
 * Copyright 2017 trivago N.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var ImportParser = {
  name: 'import',
  parse: function parse(parser, token) {
    var tokens = parser.tokens,
      source = parser.matchExpression()

    tokens.expect(Types.SYMBOL, 'as')
    var alias$$1 = tokens.expect(Types.SYMBOL)

    var importStatement = new ImportDeclaration(source, createNode(Identifier, alias$$1, alias$$1.text))

    setStartFromToken(importStatement, token)
    setEndFromToken(importStatement, tokens.expect(Types.TAG_END))

    return importStatement
  }
}

/**
 * Copyright 2017 trivago N.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var IncludeParser = {
  name: 'include',
  parse: function parse(parser, token) {
    var tokens = parser.tokens

    var includeStatement = new IncludeStatement(parser.matchExpression())

    if (tokens.nextIf(Types.SYMBOL, 'ignore')) {
      tokens.expect(Types.SYMBOL, 'missing')
      includeStatement.ignoreMissing = true
    }

    if (tokens.nextIf(Types.SYMBOL, 'with')) {
      includeStatement.argument = parser.matchExpression()
    }

    if (tokens.nextIf(Types.SYMBOL, 'only')) {
      includeStatement.contextFree = true
    }

    setStartFromToken(includeStatement, token)
    setEndFromToken(includeStatement, tokens.expect(Types.TAG_END))

    return includeStatement
  }
}

/**
 * Copyright 2017 trivago N.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var MacroParser = {
  name: 'macro',
  parse: function parse(parser, token) {
    var tokens = parser.tokens

    var nameToken = tokens.expect(Types.SYMBOL)
    var args = []

    tokens.expect(Types.LPAREN)
    while (!tokens.test(Types.RPAREN) && !tokens.test(Types.EOF)) {
      var arg = tokens.expect(Types.SYMBOL)
      args.push(createNode(Identifier, arg, arg.text))

      if (!tokens.nextIf(Types.COMMA) && !tokens.test(Types.RPAREN)) {
        // not followed by comma or rparen
        parser.error({
          title: 'Expected comma or ")"',
          pos: tokens.la(0).pos,
          advice: 'The argument list of a macro can only consist of parameter names separated by commas.'
        })
      }
    }
    tokens.expect(Types.RPAREN)

    var openingTagEndToken = tokens.la(0)
    var closingTagStartToken = void 0

    var body = parser.parse(function(tokenText, token, tokens) {
      var result = !!(token.type === Types.TAG_START && tokens.nextIf(Types.SYMBOL, 'endmacro'))
      if (result) {
        closingTagStartToken = token
      }
      return result
    })

    if (tokens.test(Types.SYMBOL)) {
      var nameEndToken = tokens.next()
      if (nameToken.text !== nameEndToken.text) {
        parser.error({
          title: 'Macro name mismatch, expected "' + nameToken.text + '" but found "' + nameEndToken.text + '"',
          pos: nameEndToken.pos
        })
      }
    }

    var macroDeclarationStatement = new MacroDeclarationStatement(createNode(Identifier, nameToken, nameToken.text), args, body)

    setStartFromToken(macroDeclarationStatement, token)
    setEndFromToken(macroDeclarationStatement, tokens.expect(Types.TAG_END))

    macroDeclarationStatement.trimRightMacro = hasTagEndTokenTrimRight(openingTagEndToken)
    macroDeclarationStatement.trimLeftEndmacro = hasTagStartTokenTrimLeft(closingTagStartToken)

    return macroDeclarationStatement
  }
}

/**
 * Copyright 2017 trivago N.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var SetParser = {
  name: 'set',
  parse: function parse(parser, token) {
    var tokens = parser.tokens,
      names = [],
      values = []

    var openingTagEndToken = void 0,
      closingTagStartToken = void 0

    do {
      var name = tokens.expect(Types.SYMBOL)
      names.push(createNode(Identifier, name, name.text))
    } while (tokens.nextIf(Types.COMMA))

    if (tokens.nextIf(Types.ASSIGNMENT)) {
      do {
        values.push(parser.matchExpression())
      } while (tokens.nextIf(Types.COMMA))
    } else {
      if (names.length !== 1) {
        parser.error({
          title: 'Illegal multi-set',
          pos: tokens.la(0).pos,
          advice: 'When using set with a block, you cannot have multiple targets.'
        })
      }
      tokens.expect(Types.TAG_END)
      openingTagEndToken = tokens.la(-1)

      values[0] = parser.parse(function(tokenText, token, tokens) {
        var result = !!(token.type === Types.TAG_START && tokens.nextIf(Types.SYMBOL, 'endset'))
        if (result) {
          closingTagStartToken = token
        }
        return result
      }).expressions
    }

    if (names.length !== values.length) {
      parser.error({
        title: 'Mismatch of set names and values',
        pos: token.pos,
        advice: "When using set, you must ensure that the number of\nassigned variable names is identical to the supplied values. However, here I've found\n" + names.length + ' variable names and ' + values.length + ' values.'
      })
    }

    // now join names and values
    var assignments = []
    for (var i = 0, len = names.length; i < len; i++) {
      assignments[i] = new VariableDeclarationStatement(names[i], values[i])
    }

    var setStatement = new SetStatement(assignments)

    setStartFromToken(setStatement, token)
    setEndFromToken(setStatement, tokens.expect(Types.TAG_END))

    setStatement.trimRightSet = !!(openingTagEndToken && hasTagEndTokenTrimRight(openingTagEndToken))
    setStatement.trimLeftEndset = !!(closingTagStartToken && hasTagStartTokenTrimLeft(closingTagStartToken))

    return setStatement
  }
}

/**
 * Copyright 2017 trivago N.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var SpacelessParser = {
  name: 'spaceless',
  parse: function parse(parser, token) {
    var tokens = parser.tokens

    tokens.expect(Types.TAG_END)
    var openingTagEndToken = tokens.la(-1)
    var closingTagStartToken = void 0

    var body = parser.parse(function(tokenText, token, tokens) {
      var result = !!(token.type === Types.TAG_START && tokens.nextIf(Types.SYMBOL, 'endspaceless'))
      closingTagStartToken = token
      return result
    }).expressions

    var spacelessBlock = new SpacelessBlock(body)
    setStartFromToken(spacelessBlock, token)
    setEndFromToken(spacelessBlock, tokens.expect(Types.TAG_END))

    spacelessBlock.trimRightSpaceless = hasTagEndTokenTrimRight(openingTagEndToken)
    spacelessBlock.trimLeftEndspaceless = !!(closingTagStartToken && hasTagStartTokenTrimLeft(closingTagStartToken))

    return spacelessBlock
  }
}

/**
 * Copyright 2017 trivago N.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var UseParser = {
  name: 'use',
  parse: function parse(parser, token) {
    var tokens = parser.tokens

    var source = parser.matchExpression(),
      aliases = []

    if (tokens.nextIf(Types.SYMBOL, 'with')) {
      do {
        var nameToken = tokens.expect(Types.SYMBOL),
          name = createNode(Identifier, nameToken, nameToken.text)
        var alias$$1 = name
        if (tokens.nextIf(Types.SYMBOL, 'as')) {
          var aliasToken = tokens.expect(Types.SYMBOL)
          alias$$1 = createNode(Identifier, aliasToken, aliasToken.text)
        }
        var aliasExpression = new AliasExpression(name, alias$$1)
        copyStart(aliasExpression, name)
        copyEnd(aliasExpression, alias$$1)
        aliases.push(aliasExpression)
      } while (tokens.nextIf(Types.COMMA))
    }

    var useStatement = new UseStatement(source, aliases)

    setStartFromToken(useStatement, token)
    setEndFromToken(useStatement, tokens.expect(Types.TAG_END))

    return useStatement
  }
}

/**
 * Copyright 2017 trivago N.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var MountParser = {
  name: 'mount',
  parse: function parse(parser, token) {
    var tokens = parser.tokens

    var name = null,
      source = null,
      key = null,
      async = false,
      delayBy = 0,
      argument = null

    if (tokens.test(Types.SYMBOL, 'async')) {
      // we might be looking at an async mount
      var nextToken = tokens.la(1)
      if (nextToken.type === Types.STRING_START) {
        async = true
        tokens.next()
      }
    }

    if (tokens.test(Types.STRING_START)) {
      source = parser.matchStringExpression()
    } else {
      var nameToken = tokens.expect(Types.SYMBOL)
      name = createNode(Identifier, nameToken, nameToken.text)
      if (tokens.nextIf(Types.SYMBOL, 'from')) {
        source = parser.matchStringExpression()
      }
    }

    if (tokens.nextIf(Types.SYMBOL, 'as')) {
      key = parser.matchExpression()
    }

    if (tokens.nextIf(Types.SYMBOL, 'with')) {
      argument = parser.matchExpression()
    }

    if (async) {
      if (tokens.nextIf(Types.SYMBOL, 'delay')) {
        tokens.expect(Types.SYMBOL, 'placeholder')
        tokens.expect(Types.SYMBOL, 'by')
        delayBy = Number.parseInt(tokens.expect(Types.NUMBER).text, 10)
        if (tokens.nextIf(Types.SYMBOL, 's')) {
          delayBy *= 1000
        } else {
          tokens.expect(Types.SYMBOL, 'ms')
        }
      }
    }

    var mountStatement = new MountStatement(name, source, key, argument, async, delayBy)

    var openingTagEndToken = void 0,
      catchTagStartToken = void 0,
      catchTagEndToken = void 0,
      endmountTagStartToken = void 0

    if (async) {
      tokens.expect(Types.TAG_END)
      openingTagEndToken = tokens.la(-1)

      mountStatement.body = parser.parse(function(tokenText, token, tokens) {
        return token.type === Types.TAG_START && (tokens.test(Types.SYMBOL, 'catch') || tokens.test(Types.SYMBOL, 'endmount'))
      })

      if (tokens.nextIf(Types.SYMBOL, 'catch')) {
        catchTagStartToken = tokens.la(-2)
        var errorVariableName = tokens.expect(Types.SYMBOL)
        mountStatement.errorVariableName = createNode(Identifier, errorVariableName, errorVariableName.text)
        tokens.expect(Types.TAG_END)
        catchTagEndToken = tokens.la(-1)
        mountStatement.otherwise = parser.parse(function(tokenText, token, tokens) {
          return token.type === Types.TAG_START && tokens.test(Types.SYMBOL, 'endmount')
        })
      }
      tokens.expect(Types.SYMBOL, 'endmount')
      endmountTagStartToken = tokens.la(-2)
    }

    setStartFromToken(mountStatement, token)
    setEndFromToken(mountStatement, tokens.expect(Types.TAG_END))

    mountStatement.trimRightMount = !!(openingTagEndToken && hasTagEndTokenTrimRight(openingTagEndToken))
    mountStatement.trimLeftCatch = !!(catchTagStartToken && hasTagStartTokenTrimLeft(catchTagStartToken))
    mountStatement.trimRightCatch = !!(catchTagEndToken && hasTagEndTokenTrimRight(catchTagEndToken))
    mountStatement.trimLeftEndmount = !!(endmountTagStartToken && hasTagStartTokenTrimLeft(endmountTagStartToken))

    return mountStatement
  }
}

/**
 * Copyright 2017 trivago N.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// @param template
// @returns function
//     @param context context bindings
//     @returns {exprStmt, initDecl, forStmt}
var template = function template(tpl) {
  return function(ctx) {
    return parseExpr(babelTemplate(tpl)(ctx))
  }
}

var forWithContext = template('\n{\nlet SEQUENCE = SOURCE,\nKEY_TARGET = 0,\nLENGTH = SEQUENCE.length,\nSUB_CONTEXT = CREATE_SUB_CONTEXT(CONTEXT, {\n    VALUE_TARGET: SEQUENCE[0],\n    loop: {\n        index: 1,\n        index0: 0,\n        length: LENGTH,\n        revindex: LENGTH,\n        revindex0: LENGTH - 1,\n        first: true,\n        last: 1 === LENGTH\n    }\n});\nfor (;\n    KEY_TARGET < LENGTH;\n    KEY_TARGET++\n) {\n    SUB_CONTEXT.loop.index0++;\n    SUB_CONTEXT.loop.index++;\n    SUB_CONTEXT.loop.revindex--;\n    SUB_CONTEXT.loop.revindex0--;\n    SUB_CONTEXT.loop.first = false;\n    SUB_CONTEXT.loop.last = SUB_CONTEXT.loop.revindex === 0;\n    SUB_CONTEXT.VALUE_TARGET = _sequence[KEY_TARGET + 1];\n}\n}\n')

var basicFor = template('\n{\nlet SEQUENCE = SOURCE,\nKEY_TARGET = 0,\nLENGTH = SEQUENCE.length,\nVALUE_TARGET = SEQUENCE[0];\nfor (;\n    KEY_TARGET < LENGTH;\n    KEY_TARGET++,\n    VALUE_TARGET = SEQUENCE[_index]\n) {\n}\n}\n')

var localFor = template('\n{\nlet SEQUENCE = SOURCE,\nKEY_TARGET = 0,\nLENGTH = SEQUENCE.length,\nVALUE_TARGET = SEQUENCE[0],\nINDEX_BY_1 = 1,\nREVERSE_INDEX_BY_1 = LENGTH,\nREVERSE_INDEX = LENGTH - 1,\nFIRST = true,\nLAST = 1 === LENGTH;\nfor (;\n    KEY_TARGET < LENGTH;\n    KEY_TARGET++,\n    VALUE_TARGET = SEQUENCE[_index]\n) {\n    INDEX_BY_1++;\n    REVERSE_INDEX_BY_1--;\n    REVERSE_INDEX--;\n    FIRST = false;\n    LAST = REVERSE_INDEX === 0;\n}\n}\n')

// returns an object that has the whole expression, init declarations, for loop
// statement in respective properties.
function parseExpr(exprStmt) {
  return {
    exprStmt: exprStmt,
    initDecl: exprStmt.body[0].declarations,
    forStmt: exprStmt.body[1]
  }
}

var forVisitor = {
  analyse: {
    ForStatement: {
      enter: function enter(path) {
        var forStmt = path.node,
          scope = path.scope
        if (forStmt.keyTarget) {
          scope.registerBinding(forStmt.keyTarget.name, path.get('keyTarget'), 'var')
        }
        if (forStmt.valueTarget) {
          scope.registerBinding(forStmt.valueTarget.name, path.get('valueTarget'), 'var')
        }
        scope.registerBinding('loop', path, 'var')
      },
      exit: function exit(path) {
        var sequenceName = path.scope.generateUid('sequence'),
          lenName = path.scope.generateUid('length')
        path.scope.registerBinding(sequenceName, path, 'var')
        path.scope.registerBinding(lenName, path, 'var')
        var iName = void 0
        if (path.node.keyTarget) {
          iName = path.node.keyTarget.name
        } else {
          iName = path.scope.generateUid('index0')
          path.scope.registerBinding(iName, path, 'var')
        }
        path.setData('forStatement.variableLookup', {
          sequenceName: sequenceName,
          lenName: lenName,
          iName: iName
        })

        if (path.scope.escapesContext) {
          var contextName = path.scope.generateUid('context')
          path.scope.registerBinding(contextName, path, 'const')
          path.scope.contextName = contextName
          path.scope.getBinding('loop').kind = 'context'
          if (path.node.valueTarget) {
            path.scope.getBinding(path.node.valueTarget.name).kind = 'context'
          }
        } else if (path.scope.getBinding('loop').references) {
          var indexName = path.scope.generateUid('index')
          path.scope.registerBinding(indexName, path, 'var')
          var revindexName = path.scope.generateUid('revindex')
          path.scope.registerBinding(revindexName, path, 'var')
          var revindex0Name = path.scope.generateUid('revindex0')
          path.scope.registerBinding(revindex0Name, path, 'var')
          var firstName = path.scope.generateUid('first')
          path.scope.registerBinding(firstName, path, 'var')
          var lastName = path.scope.generateUid('last')
          path.scope.registerBinding(lastName, path, 'var')

          var lookupTable = {
            index: indexName,
            index0: iName,
            length: lenName,
            revindex: revindexName,
            revindex0: revindex0Name,
            first: firstName,
            last: lastName
          }
          path.setData('forStatement.loopLookup', lookupTable)

          var loopBinding = path.scope.getBinding('loop')
          for (var _iterator = loopBinding.referencePaths, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator](); ; ) {
            var _ref

            if (_isArray) {
              if (_i >= _iterator.length) break
              _ref = _iterator[_i++]
            } else {
              _i = _iterator.next()
              if (_i.done) break
              _ref = _i.value
            }

            var loopPath = _ref

            var memExpr = loopPath.parentPath

            if (memExpr.is('MemberExpression')) {
              var typeName = memExpr.node.property.name
              if (typeName === 'index0') {
                memExpr.replaceWithJS({
                  type: 'BinaryExpression',
                  operator: '-',
                  left: {
                    type: 'Identifier',
                    name: indexName
                  },
                  right: { type: 'NumericLiteral', value: 1 },
                  extra: {
                    parenthesized: true
                  }
                })
              } else {
                memExpr.replaceWithJS({
                  type: 'Identifier',
                  name: lookupTable[typeName]
                })
              }
            }
          }
        }
      }
    }
  },
  convert: {
    ForStatement: {
      enter: function enter(path) {
        if (path.scope.escapesContext) {
          var parentContextName = path.scope.parent.contextName
          if (path.node.otherwise) {
            var alternate = path.get('otherwise')
            if (alternate.is('Scope')) {
              alternate.scope.contextName = parentContextName
            }
          }

          var sequence = path.get('sequence')

          if (sequence.is('Identifier')) {
            sequence.setData('Identifier.contextName', parentContextName)
          } else {
            traverse(path.node.sequence, {
              Identifier: function Identifier$$1(id) {
                id.setData('Identifier.contextName', parentContextName)
              }
            })
          }
        }
      },
      exit: function exit(path) {
        var _expr$forStmt$body$bo

        var node = path.node

        var _path$getData = path.getData('forStatement.variableLookup'),
          sequenceName = _path$getData.sequenceName,
          lenName = _path$getData.lenName,
          iName = _path$getData.iName

        var expr = void 0
        if (path.scope.escapesContext) {
          var contextName = path.scope.contextName
          expr = forWithContext({
            CONTEXT: identifier(path.scope.parent.contextName),
            SUB_CONTEXT: identifier(contextName),
            CREATE_SUB_CONTEXT: identifier(this.addImportFrom('melody-runtime', 'createSubContext')),
            KEY_TARGET: identifier(iName),
            SOURCE: path.get('sequence').node,
            SEQUENCE: identifier(sequenceName),
            LENGTH: identifier(lenName),
            VALUE_TARGET: node.valueTarget
          })
          if (node.keyTarget) {
            expr.forStmt.body.body.push({
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                operator: '=',
                left: {
                  type: 'MemberExpression',
                  object: {
                    type: 'Identifier',
                    name: contextName
                  },
                  property: {
                    type: 'Identifier',
                    name: node.keyTarget.name
                  },
                  computed: false
                },
                right: {
                  type: 'Identifier',
                  name: iName
                }
              }
            })
            expr.initDecl[expr.initDecl.length - 1].init.arguments[1].properties.push({
              type: 'ObjectProperty',
              method: false,
              shorthand: false,
              computed: false,
              key: {
                type: 'Identifier',
                name: node.keyTarget.name
              },
              value: {
                type: 'Identifier',
                name: iName
              }
            })
          }
        } else if (path.scope.getBinding('loop').references) {
          var _path$getData2 = path.getData('forStatement.loopLookup'),
            indexName = _path$getData2.index,
            revindexName = _path$getData2.revindex,
            revindex0Name = _path$getData2.revindex0,
            firstName = _path$getData2.first,
            lastName = _path$getData2.last

          expr = localFor({
            KEY_TARGET: identifier(iName),
            SOURCE: path.get('sequence').node,
            SEQUENCE: identifier(sequenceName),
            LENGTH: identifier(lenName),
            VALUE_TARGET: node.valueTarget,
            INDEX_BY_1: identifier(indexName),
            REVERSE_INDEX: identifier(revindex0Name),
            REVERSE_INDEX_BY_1: identifier(revindexName),
            FIRST: identifier(firstName),
            LAST: identifier(lastName)
          })
        } else {
          expr = basicFor({
            SEQUENCE: identifier(sequenceName),
            SOURCE: path.get('sequence').node,
            KEY_TARGET: identifier(iName),
            LENGTH: identifier(lenName),
            VALUE_TARGET: node.valueTarget
          })
        }

        ;(_expr$forStmt$body$bo = expr.forStmt.body.body).unshift.apply(_expr$forStmt$body$bo, path.get('body').node.body)

        var uniteratedName = void 0
        if (node.otherwise) {
          uniteratedName = path.scope.generateUid('uniterated')
          path.scope.parent.registerBinding(uniteratedName, path, 'var')
          expr.forStmt.body.body.push(expressionStatement(assignmentExpression('=', identifier(uniteratedName), booleanLiteral(false))))
        }

        if (node.condition) {
          expr.forStmt.body = blockStatement([
            {
              type: 'IfStatement',
              test: node.condition,
              consequent: blockStatement(expr.forStmt.body.body)
            }
          ])
        }

        if (uniteratedName) {
          path.replaceWithMultipleJS(variableDeclaration('let', [variableDeclarator(identifier(uniteratedName), booleanLiteral(true))]), expr.exprStmt, ifStatement(identifier(uniteratedName), node.otherwise))
        } else {
          path.replaceWithJS(expr.exprStmt)
        }
      }
    }
  }
}

/**
 * Copyright 2017 trivago N.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var testVisitor = {
  convert: {
    TestEvenExpression: {
      exit: function exit(path) {
        var expr = unaryExpression('!', binaryExpression('%', path.get('expression').node, numericLiteral(2)))
        expr.extra = { parenthesizedArgument: true }
        path.replaceWithJS(expr)
      }
    },
    TestOddExpression: {
      exit: function exit(path) {
        var expr = unaryExpression('!', unaryExpression('!', binaryExpression('%', path.get('expression').node, numericLiteral(2))))
        expr.extra = { parenthesizedArgument: true }
        path.replaceWithJS(expr)
      }
    },
    TestDefinedExpression: {
      exit: function exit(path) {
        path.replaceWithJS(binaryExpression('!==', unaryExpression('typeof', path.get('expression').node), stringLiteral('undefined')))
      }
    },
    TestEmptyExpression: {
      exit: function exit(path) {
        path.replaceWithJS(callExpression(identifier(this.addImportFrom('melody-runtime', 'isEmpty')), [path.get('expression').node]))
      }
    },
    TestSameAsExpression: {
      exit: function exit(path) {
        path.replaceWithJS(binaryExpression('===', path.get('expression').node, path.get('arguments')[0].node))
      }
    },
    TestNullExpression: {
      exit: function exit(path) {
        path.replaceWithJS(binaryExpression('===', path.get('expression').node, nullLiteral()))
      }
    },
    TestDivisibleByExpression: {
      exit: function exit(path) {
        path.replaceWithJS(unaryExpression('!', binaryExpression('%', path.get('expression').node, path.node.arguments[0])))
      }
    },
    TestIterableExpression: {
      exit: function exit(path) {
        path.replaceWithJS(callExpression(memberExpression(identifier('Array'), identifier('isArray')), [path.node.expression]))
      }
    }
  }
}

/**
 * Copyright 2017 trivago N.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// use default value if var is null, undefined or an empty string
// but use var if value is 0, false, an empty array or an empty object
var defaultFilter = babelTemplate("VAR != null && VAR !== '' ? VAR : DEFAULT")

var filters = {
  capitalize: 'lodash',
  first: 'lodash',
  last: 'lodash',
  keys: 'lodash',
  default: function _default(path) {
    // babel-template transforms it to an expression statement
    // but we really need an expression here, so unwrap it
    path.replaceWithJS(
      defaultFilter({
        VAR: path.node.target,
        DEFAULT: path.node.arguments[0] || stringLiteral('')
      }).expression
    )
  },
  abs: function abs(path) {
    // todo throw error if arguments exist
    path.replaceWithJS(callExpression(memberExpression(identifier('Math'), identifier('abs')), [path.node.target]))
  },
  join: function join(path) {
    path.replaceWithJS(callExpression(memberExpression(path.node.target, identifier('join')), path.node.arguments))
  },
  json_encode: function json_encode(path) {
    // todo: handle arguments
    path.replaceWithJS(callExpression(memberExpression(identifier('JSON'), identifier('stringify')), [path.node.target]))
  },
  length: function length(path) {
    path.replaceWithJS(memberExpression(path.node.target, identifier('length')))
  },
  lower: function lower(path) {
    path.replaceWithJS(callExpression(memberExpression(path.node.target, identifier('toLowerCase')), []))
  },
  upper: function upper(path) {
    path.replaceWithJS(callExpression(memberExpression(path.node.target, identifier('toUpperCase')), []))
  },
  slice: function slice(path) {
    path.replaceWithJS(callExpression(memberExpression(path.node.target, identifier('slice')), path.node.arguments))
  },
  sort: function sort(path) {
    path.replaceWithJS(callExpression(memberExpression(path.node.target, identifier('sort')), path.node.arguments))
  },
  split: function split(path) {
    path.replaceWithJS(callExpression(memberExpression(path.node.target, identifier('split')), path.node.arguments))
  },
  convert_encoding: function convert_encoding(path) {
    // encoding conversion is not supported
    path.replaceWith(path.node.target)
  },
  date_modify: function date_modify(path) {
    path.replaceWithJS(callExpression(identifier(path.state.addImportFrom('melody-runtime', 'strtotime')), [path.node.arguments[0], path.node.target]))
  },
  date: function date(path) {
    // Not really happy about this since moment.js could well be incompatible with
    // the default twig behaviour
    // might need to switch to an actual strftime implementation
    path.replaceWithJS(callExpression(callExpression(identifier(path.state.addDefaultImportFrom('moment')), [path.node.target]), [path.node.arguments[0]]))
  }
}

/**
 * Copyright 2017 trivago N.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function addOne(expr) {
  return binaryExpression('+', expr, numericLiteral(1))
}

var functions = {
  range: function range(path) {
    var args = path.node.arguments
    var callArgs = []
    if (args.length === 1) {
      callArgs.push(addOne(args[0]))
    } else if (args.length === 3) {
      callArgs.push(args[0])
      callArgs.push(addOne(args[1]))
      callArgs.push(args[2])
    } else if (args.length === 2) {
      callArgs.push(args[0], addOne(args[1]))
    } else {
      path.state.error('Invalid range call', path.node.pos, 'The range function accepts 1 to 3 arguments but you have specified ' + args.length + ' arguments instead.')
    }

    path.replaceWithJS(callExpression(identifier(path.state.addImportFrom('lodash', 'range')), callArgs))
  },

  // range: 'lodash',
  dump: function dump(path) {
    if (!path.parentPath.is('PrintExpressionStatement')) {
      path.state.error('dump must be used in a lone expression', path.node.pos, 'The dump function does not have a return value. Thus it must be used as the only expression.')
    }
    path.parentPath.replaceWithJS(expressionStatement(callExpression(memberExpression(identifier('console'), identifier('log')), path.node.arguments)))
  },
  include: function include(path) {
    if (!path.parentPath.is('PrintExpressionStatement')) {
      path.state.error({
        title: 'Include function does not return value',
        pos: path.node.loc.start,
        advice: 'The include function currently does not return a value.\n                Thus you must use it like a regular include tag.'
      })
    }
    var includeName = path.scope.generateUid('include')
    var importDecl = importDeclaration([importDefaultSpecifier(identifier(includeName))], path.node.arguments[0])
    path.state.program.body.splice(0, 0, importDecl)
    path.scope.registerBinding(includeName)

    var argument = path.node.arguments[1]

    var includeCall = expressionStatement(callExpression(memberExpression(identifier(includeName), identifier('render')), argument ? [argument] : []))
    path.replaceWithJS(includeCall)
  }
}

/**
 * Copyright 2017 trivago N.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var filterMap = ['attrs', 'classes', 'styles', 'batch', 'escape', 'format', 'merge', 'nl2br', 'number_format', 'raw', 'replace', 'reverse', 'round', 'striptags', 'title', 'url_encode', 'trim'].reduce(function(map, filterName) {
  map[filterName] = 'melody-runtime'
  return map
}, Object.create(null))

Object.assign(filterMap, filters)

var functionMap = ['attribute', 'constant', 'cycle', 'date', 'max', 'min', 'random', 'range', 'source', 'template_from_string'].reduce(function(map, functionName) {
  map[functionName] = 'melody-runtime'
  return map
}, Object.create(null))
Object.assign(functionMap, functions)

var extension = {
  tags: [AutoescapeParser, BlockParser, DoParser, EmbedParser, ExtendsParser, FilterParser, FlushParser, ForParser, FromParser, IfParser, ImportParser, IncludeParser, MacroParser, SetParser, SpacelessParser, UseParser, MountParser],
  unaryOperators: unaryOperators,
  binaryOperators: binaryOperators,
  tests: tests,
  visitors: [forVisitor, testVisitor],
  filterMap: filterMap,
  functionMap: functionMap
}

export { extension, AutoescapeBlock, BlockStatement, BlockCallExpression, MountStatement, DoStatement, EmbedStatement, ExtendsStatement, FilterBlockStatement, FlushStatement, ForStatement, ImportDeclaration, FromStatement, IfStatement, IncludeStatement, MacroDeclarationStatement, VariableDeclarationStatement, SetStatement, SpacelessBlock, AliasExpression, UseStatement, UnaryNotExpression, UnaryNeqExpression, UnaryPosExpression, BinaryOrExpression, BinaryAndExpression, BitwiseOrExpression, BitwiseXorExpression, BitwiseAndExpression, BinaryEqualsExpression, BinaryNotEqualsExpression, BinaryLessThanExpression, BinaryGreaterThanExpression, BinaryLessThanOrEqualExpression, BinaryGreaterThanOrEqualExpression, BinaryNotInExpression, BinaryInExpression, BinaryMatchesExpression, BinaryStartsWithExpression, BinaryEndsWithExpression, BinaryRangeExpression, BinaryAddExpression, BinaryMulExpression, BinaryDivExpression, BinaryFloorDivExpression, BinaryModExpression, BinaryPowerExpression, BinaryNullCoalesceExpression, TestEvenExpression, TestOddExpression, TestDefinedExpression, TestSameAsExpression, TestNullExpression, TestDivisibleByExpression, TestConstantExpression, TestEmptyExpression, TestIterableExpression }
