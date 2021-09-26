//Transform parse5 AST to JSX AST
export function parse5_to_jsx (ast) {
	function convert_parse5 (parse5Ast) {
		if (parse5Ast.nodeName !== undefined) {

			let children = [];

			if (parse5Ast.childNodes) {
				for (let child of parse5Ast.childNodes) {
					children.push(convert_parse5(child));
				}
			}

			//console.log(parse5Ast);
			if (parse5Ast.nodeName == "#text") {
				return {
					type: "JSXText",
					value: parse5Ast.value,
					raw: parse5Ast.value,
				}
			} else {
				return {
					type: "JSXElement",
					openingElement: {
						type: "JSXOpeningElement",
						name: {
							type: "JSXIdentifier",
							name: parse5Ast.nodeName,
						},
						selfClosing: false
					},
					closingElement: {
						type: "JSXClosingElement",
						name: {
							type: "JSXIdentifier",
							name: parse5Ast.nodeName,
						}
					},
					children: children
				}
			}
		}
	}

	return convert_parse5(ast).children;
}

