export default class walk_parse5 {

	static should_remove = false;

	static callback = () => {};

	static walk(ast, callback) {
		this.callback = callback;
		this.enter(ast, undefined, 0);
	}

	static enter (node, parent, index) {
		this.should_remove = false;
		this.should_replace = false;

		node.remove = () => {
			this.should_remove = true;
		}

		node.replace = (node) => {
			this.should_replace = node;
		}

		this.callback(node, parent);

		if (this.should_remove) parent.childNodes.splice(index, 1);
		if (this.should_replace) parent.childNodes[index] = this.should_replace;

		if (node.childNodes !== undefined)
			for (let i = 0; i < node.childNodes.length; i += 1)
				this.enter(node.childNodes[i], node, i);
	}
}