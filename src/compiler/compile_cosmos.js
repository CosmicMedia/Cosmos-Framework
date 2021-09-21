/*
import { print } from 'code-red';
var walk = require('estree-walker').walk;
var acorn = require('acorn');
*/
import walk_parse5 from "./utils/walk_parse5";
import parse5 from "parse5";
import { resolvePath } from './utils/path_transformer';
import fs from 'fs';
import compile_js from './compile_js';


function set_map (map, key, append_value) {
	if (map.get(key) == undefined) map.set(key, [append_value]);
	else map.set(key, [...map.get(key), append_value ])	
}

export default function (content, id) {
	let instances = {};
	let scripts = new Map();

	let htmlAst = parse5.parseFragment(content);
	walk_parse5.walk(htmlAst, (node, parent, index) => {
		if(node.nodeName == "script") {
			const srcAttr = node.attrs.find(at => at.name === "src");
			if(srcAttr !== undefined && srcAttr !== null){
				//External import stuff

				const path = resolvePath(id, srcAttr.value);
				let data = fs.readFileSync(path);

				console.log(`External script content: \n\n\n${data}\n\n\n`)

			} else {
				const componentName = node.attrs.find(at => at.name === "component").name;
				if (componentName === undefined) set_map(scripts, 'default', node.childNodes[0].value);
				if (componentName !== undefined) set_map(scripts, componentName, node.childNodes[0].value)
			}
			node.remove();
		}
	});

	for (let [key, script] of scripts) {
		console.log(script);
		instances[key] = compile_js(script);
	}

	console.log(instances);

	//return content;
}