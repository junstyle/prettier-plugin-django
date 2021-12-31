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
var Parser = require('./Parser');
var TokenStream = require('./TokenStream');
var Types = require('./TokenTypes');
var Lexer = require('./Lexer');
var { EOF, CharStream } = require('./CharStream');
var { LEFT, RIGHT } = require('./Associativity.js');
var {
    setStartFromToken,
    setEndFromToken,
    copyStart,
    copyEnd,
    copyLoc,
    getNodeSource,
    createNode,
    hasTagStartTokenTrimLeft,
    hasTagEndTokenTrimRight,
    isMelodyExtension,
} = require('./util');

function parse(code, options, ...extensions) {
    return createExtendedParser(code, options, ...extensions).parse();
}

function createExtendedParser(code, options, ...extensions) {
    let passedOptions = options;
    const passedExtensions = extensions;

    if (isMelodyExtension(options)) {
        // Variant without options parameter: createExtendedParser(code, ...extensions)
        passedOptions = undefined;
        passedExtensions.unshift(options);
    }

    const lexer = createExtendedLexer(code, options, ...passedExtensions);
    const parser = new Parser(new TokenStream(lexer, passedOptions), passedOptions);

    for (const ext of passedExtensions) {
        parser.applyExtension(ext);
    }

    return parser;
}

function createExtendedLexer(code, options, ...extensions) {
    let passedOptions = options;
    const passedExtensions = extensions;

    if (isMelodyExtension(options)) {
        // Variant without options parameter: createExtendedLexer(code, ...extensions)
        passedOptions = undefined;
        passedExtensions.unshift(options);
    }

    const lexer = new Lexer(new CharStream(code), passedOptions);

    for (const ext of passedExtensions) {
        lexer.applyExtension(ext);
    }

    return lexer;
}

module.exports = {
    Parser,
    TokenStream,
    Lexer,
    EOF,
    CharStream,
    LEFT,
    RIGHT,
    parse,
    createExtendedLexer,
    createExtendedParser,
    setStartFromToken,
    setEndFromToken,
    copyStart,
    copyEnd,
    copyLoc,
    getNodeSource,
    createNode,
    hasTagStartTokenTrimLeft,
    hasTagEndTokenTrimRight,
    Types,
};
