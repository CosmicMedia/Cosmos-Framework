import path from 'path';

//JS Parsing Imports
import { generate, GENERATOR as AstringGenerator } from "astring";
import { Parser } from "acorn";
import sourceMap from "source-map";
import { walk } from 'estree-walker';

import compile_cosmos from './compile_cosmos';
import compile_js from './compile_js';

import parse5 from 'parse5';

const parse_js = Parser.extend(
	require("acorn-jsx")(),
	require("acorn-bigint")
)

const generator = Object.assign({}, AstringGenerator, require('astring-jsx').generator);

function print(ast) {
	var astLocations = parse_js(generate(ast, {generator: generator}), {sourceType: 'module', locations: true});
	var map = new sourceMap.SourceMapGenerator({file: "test.js"});
	return { code: generate(astLocations, {sourceMap: map, generator: generator}), map: map.toString() };
}

export default function compiler (options = {}) {
	
	const CLASS_COMPONENT = 'CLASS_COMPONENT';
	const FUNCTIONAL_COMPONENT = 'FUNCTIONAL_COMPONENT';

	return {
	  name: 'cosmos',

	  
	/*

			compile_cosmos -> compile_js
			1) Put scripts into a map
			2) For each key in the map, run compile_js
			3) run compile_html and put JSX output into render method.

			compile_js
			1) If there is a class component defined, set compile state to CLASS_COMPONENT
			2) If no class component is defined, set compile state to FUNCTIONAL_COMPONENT

			compile_css
			1) If css is marked as global, do not scope css.
			2) By default css is scoped to the component.
			3) If css variable is defined, mark it for reactivity.

			compile_html
			1) If template tag is present, prioritize that.
			2) Compile to JSX AST.

			FUNCTIONAL_COMPONENT -> Compiles to class component. Functional component context is this.instance().
			CLASS_COMPONENT -> Directly inserts class into file. Any methods outside the class will be put into this.instance().
	
	*/
	
		async transform(content, id) {
			let path_ = path.resolve(id);
			console.log(process.cwd())
			if (path_.includes(process.cwd()) && !path_.includes('commonjsHelpers.js')) {

				var ast;
				if (id.includes('.cosmos'))  ast = compile_cosmos(content, id); 
				else if (id.includes('.js')) ast = compile_js(content);

				let output = print(ast);
				return { code: output.code, map: output.map };

			} else {
				return { code: content, map: this.getCombinedSourcemap() };
			}
		}
	};
}