const HtmlWebpackPlugin = require("html-webpack-plugin"),
	  { resolve } = require("path");

module.exports = {
	module: {
		rules: [
			{ test: /\.ts$/, use: "ts-loader" },
			{ test: /\.html$/, use: "html-loader" }
		]
	}
}