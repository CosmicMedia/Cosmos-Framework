import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
//import pkg from './package.json';

export default [
	{
		input: 'src/index.js',
		output: [
			{ file: 'dist/index.js', format: 'umd', name: "cosmos" },
		],
		plugins: [
			resolve(), 
			commonjs()
		]
	}
];