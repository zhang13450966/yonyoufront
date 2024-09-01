/*
 * @Author: Hugo
 * @Date: 2022-04-06 20:08:39
 * @LastEditTime: 2022-04-07 13:33:15
 * @LastEditors: Please set LastEditors
 * @Description: 配置模块公用方法及常量
 * @FilePath: /low_code_designer_husky_demo/config/common.js
 */
const fs = require('fs');
const _ = require('lodash');
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

/**
 * 更新package.json文件配置数据
 * @param {String} jsonFile package.json文件路径
 * @param {String} key 字段路径
 * @param {Any} value 字段值
 */
function setPackageJSONConfig(jsonFile, key, value) {
    fs.readFile(jsonFile, (err, data) => {
        if (err) {
            console.log(err);
        }
        let config = JSON.parse(data.toString());
        _.set(config, key, value);
        let str = JSON.stringify(config, null, '\t');
        fs.writeFile(jsonFile, str, (err) => {
            if (err) {
                console.log(err);
            }
            console.log('Update Success');
        })
    });
}

/**
 * 提取scripts命令行参数
 * @returns {Object}
 */
function getCmdParams() {
    let params;
    let paramMap = {};
    [, , ...params] = process.argv;

    params.forEach(param => {
        let [key, value] = param.split('=');
        paramMap[key] = value;
    });
    return paramMap;
}
module.exports = { consoleStyles, setPackageJSONConfig, getCmdParams };