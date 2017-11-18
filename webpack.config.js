var path = require('path');
var autoprefixer = require('autoprefixer');

// the plugin needs to know what it will extract which is defined in the rules before used and what to name it in the use rule for scss
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var extractPlugin = new ExtractTextPlugin({
	filename: 'css/main.css',
	// disable: process.env.NODE_ENV === "development"
});

var CopyWebpackPlugin = require('copy-webpack-plugin');

// Create/Recreate HTML file from the old index.html template with html-loader 
var HtmlWebpackPlugin = require('html-webpack-plugin');

// clean folders each build (update dist folder)
var CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
	entry: './src/js/index.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'js/bundle.js', 
		// publicPath: '/dist' // (dont need now with HtmlWebpackPlugin)
	},
	devtool: 'source-map',
	module: {
		rules: [
			{
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
			{
				test: /\.css$|\.scss$/,
				use: extractPlugin.extract({  
					fallback: "style-loader",
					use: [
						{ loader: 'css-loader', options: { importLoaders: 1, sourceMap: true }},
						{ loader: 'postcss-loader', options: { sourceMap: true, plugins: () => [autoprefixer] }},
						{ loader: 'sass-loader', options: { sourceMap: true }},
					],
				}) 
			},
			{
				test: /\.html$/,
				use: ['html-loader']
			},
			{
				test: /\.(jpe?g|png|gif)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 1000,
							name: 'img/[name].[ext]',
						}
					}
				]
			}
		]
	},
	plugins: [
		extractPlugin,
		new HtmlWebpackPlugin({ // adding this option will fill the template with your index.html file:
			template: './src/index.html'
		}),
		new CleanWebpackPlugin(['dist']),
		new CopyWebpackPlugin([
			{from:'src/img',to:'img'} 
	]), 
	]
};

// sass-loader - loader to connect to webpack
// node-sass will do the translation
// css-loader to do something with the css as we can't handle it alone in JS
// extract-text-webpack-plugin which will allow us to get our compiled css code and place it into it's own file to import - which decouples it.
// babel-core - will do the translating (like node-sass)
// babel-loader - loader to connect to webpack
// babel-preset-env 
// html-loader 
// html-webpack-plugin - create/recreate file based on one we use as a source/template
// template option: with no config, creates new file with dummy title and auto inject bundles.
// with template config. still creates index.html, injects bundles BUT will take our html template and use that as our source, which is parsed by HTML-loader
// and sets the HTML for the page.
// --save-dev