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

compiler.transform(`import { Component, onMount, onRender, onDestroy, variable } from 'cosmos';
import Test from './test.js'

export default class App extends Component {
	//Register variable to instance

	async instance () {
		let test = variable(1);

		let color = 'color: blue;';
		let test2 = <p>Test2</p>
		let array = ["arraytest", "test2"];

		let interval = setInterval(() => {
			test.value = test.get()+1;
			test.update();
		}, 500)

		
		/*
		setTimeout(() => {
			color.set('color: green;')
		}, 5000)
		*/
		test.subscribe((new_val, old_val) => {
			if (new_val > 10 && color.get() !== color.get_last()) {
				color.set('color: green');
			}
		})

		onDestroy(() => {
			clearInterval(interval);
		});


		onMount(() => {
			console.log('Mounted');
		})

		onRender(() => {
			let styles = \`
				* {
					box-sizing: border-box;
					letter-spacing: -0.05em !important;
				}
				
				#app {
					min-height: 100vh;
					margin:0;
					width:100%;
				}

				body {
					margin: 0;
				}

				blockquote, dd, dl, figure, h1, h2, h3, h4, h5, h6, hr, p, pre {
					margin: 0;
				}
				
				body {
					font-family: 'Inter', sans-serif;
					padding: 0;
					overflow: hidden;
					position: fixed;
					margin: 0;
					min-height: 100vh;
				}

				html, body {
					width:100%;
				}

				.test {
					color: green;
				}
			\`;

			function testFn () {
				alert('Test')
			}

			return (
				<div id="app" style="text-align:center;">
					<style>{styles}</style>
					<div style="width:100%;text-align:center;height:50px;text-align:center;box-shadow: 0px 0px 18px 3px rgba(0,0,0,0.55);margin-bottom:20px;">
						<p style="height:100%;">Header</p>
					</div>
					<h1 onClick={testFn}>Click me!</h1>

					<h2 class="test" style={color}>Test {test}... <span>{test}</span></h2>

					{test} <br/>

					{test >= 10 &&
						<h2>
							bruhxdddd
						</h2>
					}

					{(test >= 10 && test <= 100) && 
						<h1>Reactivity Test {test} 
							{(test >= 30 && test <= 50) || (test >= 70 && test <= 100) && <h1>Conditional 2</h1>}
							{this.foreach(array, (item) => { return <h1>{item}</h1>; })}
							<br/>
						</h1>
					}


					<Test test={test} />
					{test} <br/>
					{test} <br/>
					{test} <br/>
					{test} <br/>
					{test} <br/>
				</div>
			)
		})
	}
}

`,  path.resolve('C:\\Users\\blake\\Desktop\\Development\\Cosmos-Framework\\test\\test.js'))