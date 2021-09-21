/*
import { print } from 'code-red';
var walk = require('estree-walker').walk;
var acorn = require('acorn');
*/
export default function (content) {
	/*
	let ast = acorn.parse(content);
	walk(ast, {
		enter(node, parent, prop, index) {
		  // some code happens
		},
		leave(node, parent, prop, index) {
		  // some code happens
		}
	});

	return print(ast).code;
	*/
	return content;
}