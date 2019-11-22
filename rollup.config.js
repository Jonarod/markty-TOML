import buble from 'rollup-plugin-buble';
import resolve from 'rollup-plugin-node-resolve';

let pkg = require('./package.json');

export default {
	input: 'src/index.js',
	output: [
		{
			format: 'cjs', 
			file: pkg.main,
			name:pkg.name.replace(/[-]/, function($1){ return '' }),
			sourcemap: true,
			strict: false,
		},
		{
			format: 'es', 
			file: pkg.module,
			name:pkg.name.replace(/[-]/, function($1){ return '' }),
			sourcemap: true,
			strict: false,
		},
		{
			format: 'umd', 
			file: pkg['umd:main'],
			name:pkg.name.replace(/[-]/, function($1){ return '' }),
			sourcemap: true,
			strict: false,
		}
	],
	plugins: [
		resolve(),
		buble()
	]
};
