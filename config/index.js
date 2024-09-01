/*
 * @Author: liyxt
 * @Date: 2018-09-17 11:10:21
 * @LastEditors: liyxt
 * @LastEditTime: 2020-04-08 09:34:15
 * @Description: file content
 */
const configJSON = require('../config.json');
const buildEntry = require('./buildEntry');
const { spawn } = require('child_process');

// buildPath是npm参数
let buildParam,
	paramMap = {};
if (process.env.npm_config_argv) {
	[, , ...buildParam] = JSON.parse(process.env.npm_config_argv).original;
} else {
	[, , , ...buildParam] = process.argv;
}

buildParam.forEach(param => {
	let key = param.split('=')[0],
		value = param.split('=')[1];
	paramMap[key] ? paramMap[key].push(value) : (paramMap[key] = [value]);
});
let buildEntryPath = (paramMap['--env.buildPath'] || []).filter(e => e),
	buildOutputPath = paramMap['--env.buildOutputPath'] || [];

if (!buildEntryPath.length) {
	buildEntryPath = configJSON.buildEntryPath || './src/*/*/*/*/index.js';
}
let buildWithoutHTML = configJSON.buildWithoutHTML;
buildWithoutHTML && typeof buildWithoutHTML === 'string' && (buildWithoutHTML = [buildWithoutHTML]);

// mode是nodeJs参数
let [, , mode, client] = process.argv;

let { entries: hashEntries, independentOutputConfig: hashIndependentOutputConfig } = buildEntry({ buildPath: buildEntryPath, buildWithoutHTML, hash: true, client, mode });
let { entries, independentOutputConfig } = buildEntry({ buildPath: buildEntryPath, buildWithoutHTML, hash: false, client, mode });

// 加载打包二开相关文件
let extendBuildEntryPath = configJSON.extendBuildEntryPath || [];
let { entries: extendEntries, independentOutputConfig: extendIndependentOutputConfig } = buildEntry({
	buildPath: extendBuildEntryPath,
	buildWithoutHTML,
	hash: false,
	client,
	fse: true,
	mode,
});


// 指定在入口的config.json配置独立输出的文件
const allDependentOutputConfig = {
	...hashIndependentOutputConfig,
	...independentOutputConfig,
	...extendIndependentOutputConfig
}

if (Object.keys(hashEntries).length) {
	runSpawn(buildEntryPath, mode, true, false, allDependentOutputConfig);
}
if (Object.keys(entries).length) {
	runSpawn(buildEntryPath, mode, false, false, allDependentOutputConfig);
}

if (Object.keys(extendEntries).length) {
	runSpawn(extendBuildEntryPath, mode, false, true, allDependentOutputConfig);
}


function runSpawn(buildEntryPath, mode, hash, fse, allDependentOutputConfig) {
	const ls = spawn('node', [
		'--max_old_space_size=8192',
		'node_modules/webpack/bin/webpack.js',
		'--progress',
		'--colors',
		'--config',
		'./config/webpack.prod.config.js',
		`--env.mode=${mode}`,
		`--env.hash=${hash}`,
		`--env.client=${client}`,
		`--env.fse=${fse}`,
		`--env.allDependentOutputConfig=${JSON.stringify(allDependentOutputConfig) || ''}`,
		`--env.outputPath=${buildOutputPath.join('/')}`,
		...buildEntryPath.map(e => '--env.buildPath=' + e)
	]);

	ls.stdout.on('data', data => {
		if (data.includes('ERROR')) {
			throw new Error(data);
		} else {
			data && console.log(`${data}`);
		}
	});

	ls.stderr.on('data', data => {
		if (data.includes('ERROR')) {
			throw new Error(data);
		} else {
			data && console.log(`${data}`);
		}
	});
}
