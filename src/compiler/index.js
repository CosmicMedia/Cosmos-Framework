import { generate } from "astring";
import { parse } from "acorn";
import sourceMap from "source-map";
import path from 'path';
import { walk } from 'estree-walker';

function print(ast) {
	var astLocations = parse(generate(ast), {sourceType: 'module', locations: true});
	var map = new sourceMap.SourceMapGenerator({file: "test.js"});
	return { code: generate(astLocations, {sourceMap: map}), map: map.toString() };
}

export default function compiler (options = {}) {
	return {
	  name: 'cosmos',
  
		async transform(content, id) {
			let path_ = path.resolve(id);
			if (path_.includes(process.cwd()) && path_.includes('.js') && !path_.includes('commonjsHelpers.js')) {
				var ast = parse(content, {sourceType: 'module'})

				walk(ast, {
					enter(node, parent, prop, index) {
					 	if (node.type == "VariableDeclarator" && node.init.type !== "CallExpression") {
							 console.log(path_)
							let old_value = node.init;
							node.init = {
								type: "CallExpression",
								callee: {
									type: "Identifier",
									name: "variable"
								},
								arguments: [old_value]
							}
							this.replace(node);
						} else if (node.type == "LogicalExpression" && node.operator == "&&" && node.right?.callee?.property?.name == "createElement" && parent.type !== "ReturnStatement") {
							let old_node = node;

							var vars = [];

							//console.log(old_node);
							walk(old_node.left, {
								enter (node, parent, prop, index) {
									if (node.type == "Identifier" && node.name !== "_vars") {
										if (!vars.includes(node.name)) vars.push(node.name);
										this.replace({
											type: "MemberExpression",
											object: {
												type: "Identifier",
												name: "_vars"
											},
											property: {
												type: "Literal",
												value: vars.findIndex((e) => { return e == node.name })
											},
											computed: true
										})
									}
								}
							})

							let new_node = {
								"type": "CallExpression",
								"callee": {
									"type": "MemberExpression",
									"object": {
									  "type": "ThisExpression",
									},
									"property": {
										"type": "Identifier",
										"name": "condition"
									},
								},
								"arguments": [
									{
									  	"type": "ArrayExpression",
									  	"elements": vars.map((variable) => {
											return {
												"type": "Identifier",
												"name": variable
											}
										})
									},
									{
										"type": "ArrowFunctionExpression",
										"id": null,
										"params": [
											{type: "Identifier", name: "_vars"}
										],
										"body": {
										  "type": "BlockStatement",
										  "body": [
											{
											  "type": "ReturnStatement",
											  "argument": old_node
											}
										  ]
										}
									}
								]
							}
							
							this.replace(new_node);
						}
					},
					leave(node, parent, prop, index) {
					  // some code happens
					}
				});

				//Output with map
				let output = print(ast);
				return { code: output.code, map: output.map };
			} else {
				return { code: content, map: this.getCombinedSourcemap() };
			}
		}
	};
}