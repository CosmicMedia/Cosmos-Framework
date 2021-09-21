import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import json from '@rollup/plugin-json';
//import pkg from './package.json';

export default [
	{
		input: 'src/runtime/index.js',
		output: [
			{ file: 'dist/runtime/index.js', format: 'umd', name: "cosmos" },
		],
		plugins: [
			resolve(), 
			commonjs(),
			//typescript()
		]
	},
	{
		input: 'src/compiler/index.js',
		output: [
			{ file: 'dist/compiler/index.js', format: 'cjs', name: "cosmos", exports: 'auto' },
		],
		external: ['fs', 'path'],
		plugins: [
			resolve(), 
			commonjs(),
			//typescript()
		]
	}
];