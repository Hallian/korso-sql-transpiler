var HtmlWebpackPlugin = require("html-webpack-plugin");
var path = require("path");

module.exports = {
	mode: "development",
	entry: "./index.js",
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ["style-loader", "css-loader"]
			}
		]
	},
	output: {
		path: path.resolve(__dirname, "./dist"),
		filename: "index_bundle.js"
	},
	plugins: [new HtmlWebpackPlugin()]
};
