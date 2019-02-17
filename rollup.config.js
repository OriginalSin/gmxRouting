import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import css from 'rollup-plugin-css-porter';
import pkg from './package.json';
import { terser } from 'rollup-plugin-terser';

const production = !process.env.ROLLUP_WATCH;

export default [
	{
		input: 'index.js',
		// external: ['leaflet'],
		output: {
			sourcemap: true,
			format: 'iife',
			name: 'RoutingControl',
			file: pkg.browser,
		},
		plugins: [			
			resolve({ jsnext: true, main: true, module: false, browser: false }),
			commonjs({
				ignoreGlobal: true,  // Default: false
			}),
			css({minified: false, dest: 'public/gmxRouting.css'}),
			babel(),
			production && terser(),
		]
	}
];
