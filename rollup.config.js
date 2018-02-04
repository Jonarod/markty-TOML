import buble from 'rollup-plugin-buble';
import resolve from 'rollup-plugin-node-resolve';

let pkg = require('./package.json');

export default {
	moduleName: pkg.name.replace(/[-]/, function($1){ return '' }),
	entry: 'src/index.js',
	useStrict: false,
	sourceMap: true,
	plugins: [
		resolve(),
		buble()
	],
	targets: [
		{ format:'cjs', dest: pkg.main },
		{ format:'es', dest: pkg.module },
		{ format:'umd', dest: pkg['umd:main'] }
	]
};
