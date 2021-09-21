import { walk } from 'estree-walker';

export default function (ast) {
	
	walk(ast, {
		enter(node, parent, prop, index) {
			if (node.type == "VariableDeclarator" && node.init.type !== "CallExpression") {
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
			}
		}
	});

	return ast;
}