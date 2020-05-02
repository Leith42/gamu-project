const path = require('path');

module.exports = {
	entry: './src/modules.js',
	output: {
		path: path.resolve(__dirname, 'src/public/js'),
		filename: 'bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader"
				}
			}
		]
	},
	resolve: {
		extensions: ['*', '.js', '.jsx']
	},
};