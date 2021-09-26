const parse5 = require('parse5');

export function parse (content) {
	return parse5.parseFragment(content);
}