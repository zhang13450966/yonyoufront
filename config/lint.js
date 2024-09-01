/*
 * @Author: your name
 * @Date: 2022-02-10 10:20:44
 * @LastEditTime: 2022-02-10 15:47:03
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /low_code_designer_eslint/config/lint.js
 */
const configJSON = require('../config.json');
const fs = require('fs');
const { resolve } = require('path');
const { spawn } = require('child_process');
const consoleStyles = {
    // 亮色
    'bright': '\x1B[1m',
    // 灰色
    'grey': '\x1B[2m',
    // 斜体
    'italic': '\x1B[3m',
    // 下划线
    'underline': '\x1B[4m',
    // 反向
    'reverse': '\x1B[7m',
    // 隐藏
    'hidden': '\x1B[8m',
    // 黑色
    'black': '\x1B[30m',
    // 红色
    'red': '\x1B[31m',
    // 绿色
    'green': '\x1B[32m',
    // 黄色
    'yellow': '\x1B[33m',
    // 蓝色
    'blue': '\x1B[34m',
    // 品红色
    'magenta': '\x1B[35m',
    // 青色
    'cyan': '\x1B[36m',
    // 白色
    'white': '\x1B[37m',
    // 背景黑色
    'blackBG': '\x1B[40m',
    // 红色
    'redBG': '\x1B[41m',
    // 绿色
    'greenBG': '\x1B[42m',
    // 黄色
    'yellowBG': '\x1B[43m',
    // 蓝色
    'blueBG': '\x1B[44m',
    // 品红色
    'magentaBG': '\x1B[45m',
    // 青色
    'cyanBG': '\x1B[46m',
    // 白色
    'whiteBG': '\x1B[47m'
};
let lintConfig = configJSON.eslint || {};
let cmd = resolve('./node_modules/.bin/eslint');
let lintPaths = getLintPaths(lintConfig);

let lintArgs = [
    '--ext', '.js',
    '--ext', '.jsx',
    ...lintPaths
];
if (lintConfig.autoFix === true) {
    lintArgs.push('--fix');
}
console.log(cmd, lintArgs, lintConfig.autoFix);
function getLintPaths(lintConfig) {
    let paths = lintConfig.path || [];
    let ret = paths.filter((path) => {
        path = resolve(path);
        return hasEsLintFile(path);
    });
    return ret;
}
function hasEsLintFile(path) {
    let files = fs.readdirSync(path);
    let idx = files.findIndex((file) => {
        return file === '.eslintrc.js';
    });
    let sourceRoot = resolve(process.cwd(), 'src');
    let pPath = resolve(path, '../');
    let ret = idx > -1;
    if (!ret && sourceRoot !== pPath) {
        ret = hasEsLintFile(resolve(path, '../'));
    }
    return ret;
}
function begin() {
    if (!lintConfig.enable || lintPaths.length === 0) {
        console.log(`${consoleStyles.bright}`, '----Eslint cancel');
        console.log(`${consoleStyles.bright}`, '请确认是否配置需要lint的项目目录，或项目目录中是否配置.eslintrc')
        return;
    }
    const execProcess = spawn(cmd, lintArgs, {
        shell: process.platform === 'win32'
    });
    const stdCallBack = (data) => {
        if (data.includes('ERROR')) {
            throw new Error(data);
        } else {
            let str = `${data}`;
            let arr = str ? str.split('\n') : [];
            arr.forEach((row) => {
                if (isError(row)) {
                    console.log(consoleStyles.red, `${row}\n`);
                } else if (isWarning(row)) {
                    console.log(consoleStyles.yellow, `${row}\n`);
                } else {
                    console.log(`${consoleStyles.italic}${consoleStyles.blue}`, `${row}\n`);
                }
            })

            // data && console.log(`${data}`);
        }
    };
    execProcess.stdout.on('data', stdCallBack);
    execProcess.stderr.on('data', stdCallBack);
    execProcess.on('close', () => {
        console.log(`${consoleStyles.bright}`, '----Done');
    });
}

function isError(row) {
    let test = row.toLowerCase();
    return test.indexOf('error') > -1 || test.indexOf('err') > -1;
}
function isWarning(row) {
    let test = row.toLowerCase();
    return test.indexOf('warning') > -1 || test.indexOf('warn') > -1;
}

begin();
