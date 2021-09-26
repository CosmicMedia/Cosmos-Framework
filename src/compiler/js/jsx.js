export default {
	JSXElement: function JSXElement(node, state) {
		state.write(`this.createElement(`);
		if (node.openingElement.name.name.charAt(0) === node.openingElement.name.name.charAt(0).toUpperCase()) state.write(`${node.openingElement.name.name}`);
		else state.write(`'${node.openingElement.name.name}'`);

		if (node.openingElement?.attributes?.length > 0) {
			state.write(', {');
			for (var i = 0; i < node.openingElement.attributes.length; i++) {
				var attribute = node.openingElement.attributes[i];
				this[attribute.type](attribute, state);
				if (i < node.openingElement.attributes.length) state.write(',');
				state.write(' ')
			}
			state.write('}');
		} else {
			state.write(', null');
		}

		for (var i = 0; i < node.children.length; i++) {
			var child = node.children[i];
			if (child.type == "JSXText" && !child.value?.trim().length) continue;

			state.write(', ');
			this[child.type](child, state);
		}

		state.write(')');
	},

	JSXText: function JSXText(node, state) {
		state.write(`"${node.value.replace(/(\r\n|\n|\r)/gm, "")}"`);
	},

	// <div>
	JSXOpeningElement: function JSXOpeningElement(node, state) {},
	// </div>
	JSXClosingElement: function JSXOpeningElement(node, state) {},

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
		state.write(': ');
		this[node.value.type](node.value, state);
	},
	// namespaced:attr="something"
	//TODO look up what this compiles to.
	JSXNamespacedName: function JSXNamespacedName(node, state) {
		this[node.namespace.type](node.namespace, state);
		state.write(':');
		this[node.name.type](node.name, state);
	},
	// {expression}
	JSXExpressionContainer: function JSXExpressionContainer(node, state) {
		this[node.expression.type](node.expression, state);
	}
}