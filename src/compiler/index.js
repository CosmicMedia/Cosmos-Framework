import path from 'path';

//JS Parsing Imports
import { walk } from 'estree-walker';

import compile_cosmos from './compile_cosmos';
import compile_js from './compile_js';

import {parse, serialize} from './js';

import { parse as parseHtml } from './template';
import { parse5_to_jsx } from './template/template';

import fs from 'fs';

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
			//console.log(path_);
			if (!path_.includes('commonjs') && !path_.includes('runtime') && !path_.includes('node_modules') && !path_.includes('rollupPluginBabelHelpers.js')) {

				//if (id.includes('socket.io')) console.log(content);
				var ast;
				if (id.includes('.cosmos'))  ast = compile_cosmos(content, id); 
				else if (id.includes('.js')|| id.includes('.mjs')) ast = compile_js(content);

				/*
				ast.body.unshift({
					"type": "ImportDeclaration",
					"specifiers": [
						{
							"type": "ImportSpecifier",
							"imported": {
							"type": "Identifier",
							"name": "variable"
						},
							"local": {
								"type": "Identifier",
								"name": "variable"
							}
						}
					],
					"source": {
					  "type": "Literal",
					  "value": "cosmos",
					  "raw": "'cosmos'"
					}
				})
				*/
				/*console.log(serialize(parse5_to_jsx(parseHtml(`
				<h1>Test<p>Test</p></h1>
				`))))*/

				//if (id.includes('socket.io')) console.log(ast);

				let output = serialize(ast);
				return { code: output.code, map: output.map };
				//return { code: content, map: this.getCombinedSourcemap() };

			} else {
				return { code: content, map: this.getCombinedSourcemap() };
			}
		}
	};
}