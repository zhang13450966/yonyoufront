/*
 * @Author: Hugo
 * @Date: 2022-04-07 13:36:45
 * @LastEditTime: 2022-04-13 16:42:45
 * @LastEditors: Please set LastEditors
 * @Description: 在package.json中添加config，设置commitizen path
 * @FilePath: /low_code_designer_husky/config/setCZConfig.js
 */
const { setPackageJSONConfig } = require('./common.js');
setPackageJSONConfig('./package.json', 'config.commitizen.path', 'cz-conventional-changelog');
