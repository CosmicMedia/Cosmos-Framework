import { walk } from 'estree-walker';

export function get_imports (ast) {
	let imports = new Map();
	walk (ast, {
		enter(node, parent, prop, index) {
			if (node.type == "ImportDeclaration") {
				for (let i in node.specifiers) {
					imports.set(node.specifiers[i].local.name, node.source.value);
				}
			}
		}
	})

	return imports;
}