import { walk } from 'estree-walker';

export default function (ast) {
	
	walk(ast, {
		enter(node, parent, prop, index) {
			//Variable declaration
			if (node.type == "LogicalExpression" && node.operator == "&&" && node.right.type == "JSXElement" && parent.type !== "ReturnStatement") {
				let old_node = node;

				var vars = [];

				//console.log(old_node);
				walk(old_node.left, {
					enter (node, parent, prop, index) {
						if (node.type == "Identifier" && node.name !== "_vars" && parent.type == "BinaryExpression") {
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
					"internal": true,
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

				console.log("\n\n\n\nTEST");
				
				this.replace(new_node);
			} 
		},
		leave(node, parent, prop, index) {
		  // some code happens
		}
	});

	return ast;
}