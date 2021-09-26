import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import json from '@rollup/plugin-json';
//import pkg from './package.json';
import babel from '@rollup/plugin-babel';
const babel_ = babel.babel;

export default [
	{
		input: 'src/runtime/index.js',
		output: [
			{ file: 'dist/runtime/index.js', format: 'umd', name: "cosmos" },
		],
		plugins: [
			resolve(), 
			commonjs(),
			babel_({
				exclude: 'node_modules/**',
				"presets": [
					['@babel/preset-env',
					{
						targets: {
						  browsers: "> 0.5%, ie >= 11"
						},
						modules: false,
						spec: true,
						useBuiltIns: "usage",
						forceAllTransforms: true,
						corejs: {
						  version: 3,
						  proposals: false
						}
					  }]
				],
			}),
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