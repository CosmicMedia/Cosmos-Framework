const Compiler = require('../dist/compiler');
const path = require('path');
let compiler = Compiler();

compiler.getCombinedSourcemap  = () => {};
/*compiler.transform(`//This is a concept layout

//Functional syntax
<script component="App">
	import { onMount, onRender } from 'cosmos';

	$props: (prop1, prop2)

	//Reactive by default
	let variable = "test";

	onMount(() => {
		
	})

	onRender(() => {
		return (
				<h1>Test</h1>
		)
	})

	export function test () {

	}
</script>

//External import
<script src="./bruh.js"></script>

<style global>
	.bruh {
		color: --variable
	}
</style>

<template>
	<h1>Test</h1>
</template>

//or 

<h1>Test</h1>
`,  path.resolve('C:\\Users\\blake\\Desktop\\Development\\Cosmos-Framework\\test\\test.cosmos'));

*/

/*

object.test.test.test = "";

//Using value
{object.test.test.test}
{usable(object).objectreference(['test', 'test', 'test'])} //Listens for subscribe when specific path is updated.

//Setting value
object.test.test.test = "value";
usable(object).objectreference(['test', 'test', 'test']).set('value');



*/
(async () => {
	let output = await compiler.transform(`"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.io = exports.Socket = exports.Manager = exports.protocol = void 0;
	const url_1 = require("./url");
	const manager_1 = require("./manager");
	const debug = require("debug")("socket.io-client");

	module.exports = exports = lookup;

	const cache = (exports.managers = {});
	function lookup(uri, opts) {
		if (typeof uri === "object") {
			opts = uri;
			uri = undefined;
		}
		opts = opts || {};
		const parsed = (0, url_1.url)(uri, opts.path || "/socket.io");
		const source = parsed.source;
		const id = parsed.id;
		const path = parsed.path;
		const sameNamespace = cache[id] && path in cache[id]["nsps"];
		const newConnection = opts.forceNew ||
			opts["force new connection"] ||
			false === opts.multiplex ||
			sameNamespace;
		let io;
		if (newConnection) {
			debug("ignoring socket cache for %s", source);
			io = new manager_1.Manager(source, opts);
		}
		else {
			if (!cache[id]) {
				debug("new io instance for %s", source);
				cache[id] = new manager_1.Manager(source, opts);
			}
			io = cache[id];
		}
		if (parsed.query && !opts.query) {
			opts.query = parsed.queryKey;
		}
		return io.socket(parsed.path, opts);
	}
	exports.io = lookup;

	var socket_io_parser_1 = require("socket.io-parser");
	Object.defineProperty(exports, "protocol", { enumerable: true, get: function () { return socket_io_parser_1.protocol; } });

	exports.connect = lookup;

	var manager_2 = require("./manager");
	Object.defineProperty(exports, "Manager", { enumerable: true, get: function () { return manager_2.Manager; } });
	var socket_1 = require("./socket");
	Object.defineProperty(exports, "Socket", { enumerable: true, get: function () { return socket_1.Socket; } });
	exports.default = lookup;
	`,  path.resolve('C:\\Users\\blake\\Desktop\\Development\\Cosmos-Framework\\test\\test.js'));
	console.log(output.code)
})()
// console.log(compiler.transform(`object.test.test.test`,  path.resolve('C:\\Users\\blake\\Desktop\\Development\\Cosmos-Framework\\test\\test.js')).code)