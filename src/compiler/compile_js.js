/*
import { print } from 'code-red';
var walk = require('estree-walker').walk;
var acorn = require('acorn');
*/
import variable from "./js/variable";
import conditional from "./js/conditional";

import { Parser } from "acorn";
import { generate, GENERATOR as AstringGenerator } from "astring";

const parse_js = Parser.extend(
	require("acorn-jsx")(),
	require("acorn-bigint")
)

const generator = Object.assign({} , AstringGenerator, {
	JSXElement: function JSXElement(node, state) {
		let children = [];
		for (var i = 0; i < node.children.length; i++) {
			var child = node.children[i];
			this[child.type](child, state);
		}
		state.write(`this.createElement('${node.openingElement.name.name}', null, `);


		state.write(')');
		/*
		state.write('<');
		this[node.openingElement.type](node.openingElement, state);
		if (node.closingElement) {
			state.write('>');
		  for (var i = 0; i < node.children.length; i++) {
			var child = node.children[i];
			this[child.type](child, state);
		  }
		  state.write('</');
		  this[node.closingElement.type](node.closingElement, state);
		  state.write('>');
		} else {
			state.write(' />');
		}*/
	  },
	  // <div>
	  JSXOpeningElement: function JSXOpeningElement(node, state) {
		this[node.name.type](node.name, state);
		for (var i = 0; i < node.attributes.length; i++) {
		  var attr = node.attributes[i];
		  this[attr.type](attr, state);
		}
	  },

	  JSXText: function JSXText(node, state) {
		state.write(node.value);
	  },
	  // </div>
	  JSXClosingElement: function JSXOpeningElement(node, state) {
		this[node.name.type](node.name, state);
	  },
	  // div
	  JSXIdentifier: function JSXOpeningElement(node, state) {
		state.write(node.name);
	  },
	  // Member.Expression
	  JSXMemberExpression: function JSXMemberExpression(node, state) {
		this[node.object.type](node.object, state);
		state.write('.');
		this[node.property.type](node.property, state);
	  },
	  // attr="something"
	  JSXAttribute: function JSXAttribute(node, state) {
		state.write(' ');
		this[node.name.type](node.name, state);
		state.write('=');
		this[node.value.type](node.value, state);
	  },
	  // namespaced:attr="something"
	  JSXNamespacedName: function JSXNamespacedName(node, state) {
		this[node.namespace.type](node.namespace, state);
		state.write(':');
		this[node.name.type](node.name, state);
	  },
	  // {expression}
	  JSXExpressionContainer: function JSXExpressionContainer(node, state) {
		state.write('{');
		this[node.expression.type](node.expression, state);
		state.write('}');
	  }
});

export default function (content) {
	
	let ast = parse_js.parse(content, {ecmaVersion:'latest', sourceType: 'module'});
	
	ast = variable(ast);
	ast = conditional(ast);

	console.log(generate(ast, {generator: generator}))

	//return ast;
}