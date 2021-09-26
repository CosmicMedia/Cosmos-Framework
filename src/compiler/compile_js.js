/*
import { print } from 'code-red';
var walk = require('estree-walker').walk;
var acorn = require('acorn');
*/
import variable from "./js/variable";
import conditional from "./js/conditional";
import { get_imports } from "./js/imports";
import { parse, serialize } from './js';

export default function (content) {
	
	let ast = parse(content);

	let imports = get_imports(ast);

	//ast = conditional(ast);
	ast = variable(ast, imports);

	//console.log(serialize(ast).code);

	return ast;
}