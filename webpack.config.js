const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

const CSSExtract = new ExtractTextPlugin('styles.css');

module.exports = {
	devServer: {
		contentBase: 'public',
		historyApiFallback: true,
	},
	entry:  {
		background: './src/background.js',
		popup: './src/popup.js'
	},
	output: {
		path: path.resolve(__dirname, 'public/'),
		filename: '[name].js',
	},
	mode: 'development',
	module: {
		rules: [
			{
				test: /\.js?$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				options: {
					presets: [
						'flow',
						'react',
						'stage-0',
						['env', { targets: { browsers: ['last 2 versions'] } }]
					],
					plugins: [require('babel-plugin-transform-class-properties')]
				}
			},
			{
				test: /\.s?css$/,
				use: CSSExtract.extract({
					use: [
						{
							loader: 'css-loader',
							options: {
								importLoaders: 2,
								localIdentName: '[name]__[local]___[hash:base64:5]',
								modules: true,
								sourceMap: true
							}
						},
						{
							loader: 'postcss-loader',
							options: {
								sourceMap: true
							}
						},
						{
							loader: 'sass-loader',
							options: {
								sourceMap: true
							}
						}
					]
				})
			}
		],
	},
	plugins: [
		CSSExtract
	],
};