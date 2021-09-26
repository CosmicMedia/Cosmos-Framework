import { Parser } from "acorn";
import { generate, GENERATOR as AstringGenerator } from "astring";
import jsxTypes from './jsx';
import sourceMap from "source-map";

const acorn = Parser.extend(
	require("acorn-jsx")(),
	require("acorn-bigint")
)

//console.log(AstringGenerator);

const generator = Object.assign({} , AstringGenerator, jsxTypes);

export function parse (content) {
	return acorn.parse(content, {ecmaVersion:'latest', sourceType: 'module', locations: true});
}

export function serialize (ast, file = "test.js") {
	//Parses AST to add location data.
	//Generates source map.
	var map = new sourceMap.SourceMapGenerator({file: file});
	return { code: generate(ast, {sourceMap: map, generator: generator}), map: map.toString() };
}