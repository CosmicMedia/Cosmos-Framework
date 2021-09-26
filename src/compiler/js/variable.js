import { walk } from 'estree-walker';
import { resolvePath } from '../utils/path_transformer';
import { literalizeASTNodeTree } from '../utils/ast_node_tree_literalizer';

export default function (ast, imports) {

	walk(ast, {
		enter(node, parent, prop, index) {
			if (node.internal == true) return this.skip();
			//if (node.type == "CallExpression" && node.callee?.property?.name == "subscribe") return this.skip();
			if (node.type == "VariableDeclaration" && (parent.type == "ForOfStatement" || parent.type == "ForInStatement")) return this.skip();
			//console.log(prop);
			if (node.type == "VariableDeclarator" && node.init?.callee?.name !== "variable") {
				let old_value = node.init;
				if (old_value == null || old_value == undefined) { 
					old_value = {
						type: "Literal",
						value: 0,
						raw: "0"
					}
				}

				node.init = {
					type: "CallExpression",
					callee: {
						type: "Identifier",
						name: "variable"
					},
					arguments: [old_value]
				}

				this.replace(node);
			} else if (node.type == "AssignmentExpression" && node.operator == "=" && (node.right.type == "Identifier" || node.right.type == "MemberExpression")) {
				/*
				let old = node.right;
				node.right = {
					type: "CallExpression",
					callee: {
						type: "MemberExpression",
						object: old,
						property: {
							type: "Identifier",
							name: "get"
						}
					}
				}
				this.replace(node);
				console.log(old);
				*/
			}
			/*
			else if (node.type == "Identifier" && parent.type == "MemberExpression") {
				let identifier = node;

				const isImport = imports.has(parent.object.name);
				
*/
				/*
				this.replace({
					type: "CallExpression",
					internal: true,
					callee: {
						type: "MemberExpression",
						object: {
							type: "CallExpression",
							callee: {
								type: "Identifier",
								name: "_usable"
							},
							arguments: [ identifier ]
						},
						property: {
							type: "Identifier",
							name: "get"
						}
					},
					arguments: [],
					optional: false,
				})
				*/
				/*
			}
			else if (node.type == "ExpressionStatement" && node.expression.type == "MemberExpression"){
				//let old_value = node.init;
				
				literalizeASTNodeTree(node);

				// reversedNodeTree[reversedNodeTree.length-1] = {
				// 	type: "CallExpression",
				// 	callee: {
				// 		type: "Identifier",
				// 		name: "_usable"
				// 	},
				// 	arguments: [reversedNodeTree[reversedNodeTree.length-1]]
				// }

				// for(var i = reversedNodeTree.length-2; i != -4; i--){
				// 	if(i-1 == -1){
				// 		reversedNodeTree[i] = {
				// 			type: "MemberExpression",
				// 			object: reversedNodeTree[i+1],
				// 			property: reversedNodeTree[i]
				// 		}
				// 		break;
				// 	}

				// 	if(i != reversedNodeTree.length-2 && reversedNodeTree[i+1].callee.property.name == "get"){
				// 		console.log('PREVIOUS STATE: ', reversedNodeTree[i]);

				// 		reversedNodeTree[i] = {
				// 			type: "CallExpression",
				// 			callee: {
				// 				type: "MemberExpression",
				// 				object: {
				// 					type: "MemberExpression",
				// 					object: reversedNodeTree[i+1],
				// 					property: reversedNodeTree[i]
				// 				},
				// 				property: {
				// 					type: "Identifier",
				// 					name: "get"
				// 				}
				// 			}
				// 		}

				// 		console.log('Property of current nodeInTree: ', reversedNodeTree[i].callee.property);

				// 	} else {
				// 		reversedNodeTree[i] = {
				// 			type: "CallExpression",
				// 			callee: {
				// 				type: "MemberExpression",
				// 				object: reversedNodeTree[i+1],
				// 				property: {
				// 					type: "Identifier",
				// 					name: "get"
				// 				}
				// 			}
				// 		}
				// 	}

				// }

				// console.log('Transform: ', JSON.stringify(reversedNodeTree[0]));

				// this.replace(reversedNodeTree[0]);

			}
			*/
		}
	});

	return ast;
}