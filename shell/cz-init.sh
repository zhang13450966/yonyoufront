###
 # @Author: Hugo
 # @Date: 2022-04-07 13:41:45
 # @LastEditTime: 2022-04-13 16:41:33
 # @LastEditors: Please set LastEditors
 # @Description: 全局安装commitizen工具，并配置初始适配器
 # @FilePath: /low_code_designer_husky/shell/cz-init.sh
### 
#!/bin/sh
# 安装commitizen
# commitizen根据不同的`adapter`配置commit message
npm install commitizen cz-conventional-changelog --save-dev
# 写入cz-conventional-changelog配置路径
# echo '{ "path": "cz-conventional-changelog" }' > ~/.czrc
