/*
 * @Author: liyxt
 * @Date: 2019-09-12 10:17:44
 * @LastEditors: liyxt
 * @LastEditTime: 2020-03-25 13:52:00
 * @Description: file content
 */
/**
 * 公共配置
 */
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

//优化配置，对于使用CDN作为包资源的引用从外到内的配置
const externals = {
	'@platform/api': '@platform/api/index',
	'@platform/base': '@platform/base/index',
	'@platform/template': '@platform/template/index',
	'@platform/form': '@platform/form/index',
	'@platform/search': '@platform/search/index',
	'@platform/table-core': '@platform/table-core/index',
	'@platform/card-table': '@platform/card-table/index',
	'@platform/edit-table': '@platform/edit-table/index',
	'@platform/simple-table': '@platform/simple-table/index',
	'@platform/transfer-table': '@platform/transfer-table/index',
	'@platform/tree-table': '@platform/tree-table/index',
	'@platform/components': '@platform/components/index',
	'runtime':'runtime',
	'nc-lightapp-mobile': 'nc-lightapp-mobile',
	'nc-lightapp-front': 'nc-lightapp-front',
	'platform-workbench': 'platform-workbench',
	'platform-report': 'platform-report',
	'platform-login': 'platform-login',
	'nc-report': 'nc-report',
	'babel-polyfill': 'babel-polyfill',
	'nc-graphic-report': 'nc-graphic-report',
	axios: {
		root: 'axios',
		var: 'axios',
		commonjs: 'axios',
		commonjs2: 'axios',
		amd: 'axios'
	},
	react: {
		root: 'React',
		var: 'React',
		commonjs: 'react',
		commonjs2: 'react',
		amd: 'react'
	},
	// redux: {
	// 	root: 'Redux',
	// 	var: 'Redux',
	// 	commonjs: 'redux',
	// 	commonjs2: 'redux',
	// 	amd: 'redux'
	// },
	// 'react-redux': {
	// 	root: 'ReactRedux',
	// 	var: 'ReactRedux',
	// 	commonjs: 'react-redux',
	// 	commonjs2: 'react-redux',
	// 	amd: 'react-redux'
	// },
	'react-router': {
		root: 'ReactRouter',
		var: 'ReactRouter',
		commonjs: 'react-router',
		commonjs2: 'react-router',
		amd: 'react-router'
	},
	'react-dom': {
		root: 'ReactDOM',
		var: 'ReactDOM',
		commonjs: 'react-dom',
		commonjs2: 'react-dom',
		amd: 'react-dom'
	},
	'react-dom/server': { //braft-editor 用到
		root: 'ReactDOMServer',
		var: 'ReactDOMServer',
		commonjs: 'react-dom/server',
		commonjs2: 'react-dom/server',
		amd: 'react-dom/server'
	}
};

//默认加载扩展名、相对JS路径模块的配置
const resolve = {
	extensions: ['.jsx', '.js', '.less', '.css', '.json'],
	alias: {
		ssccommon: path.resolve(process.cwd(), './src/sscrp/public/common/'),
		sscplatformcomponents: path.resolve(process.cwd(), './src/sscrp/public/common/platformcomponents/v2207'),
		src: path.resolve(__dirname, '../src/')
	}
};

//Loader
const rules = [
	{
		test: /\.js[x]?$/,
		exclude: /node_modules/,
		use: [
			{
				loader: 'babel-loader'
			}
		]
	},
	{
		test: /\.css$/,
		// use: ExtractTextPlugin.extract({
		use: ['style-loader', 'css-loader', 'postcss-loader']
		// 	fallback: 'style-loader'
		// })
	},
	{
		test: /\.less$/,
		// use: ExtractTextPlugin.extract({
		use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader']
		// fallback: 'style-loader'
		// })
	},
	{
		test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz|ico)(\?.+)?$/,
		exclude: /favicon\.png$/,
		use: [
			{
				loader: 'url-loader'
			}
		]
	}
];

//webpack通用配置
const commonConfig = {
	// 打包时排除
	externals,
	// loaders
	module: {
		rules
	},
	plugins: [
		// new ExtractTextPlugin({
		// 	filename: '[name].css',
		// 	allChunks: true
		// })
	],
	resolve
};

module.exports = commonConfig;
