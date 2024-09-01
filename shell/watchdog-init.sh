###
 # @Author: your name
 # @Date: 2022-04-07 13:44:02
 # @LastEditTime: 2022-04-20 14:57:50
 # @LastEditors: Please set LastEditors
 # @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 # @FilePath: /low_code_designer_husky/shell/watchdog-init.sh
### 
#!/bin/sh

# 目标项目路径
PROJECTDIR="$1"
HUSKYDIR="./node_modules/husky"
COMMITLINTDIR="./node_modules/@commitlint"
CZCUSTOMIZABLEDIR="./node_modules/cz-customizable"
COMMITLINTCONFIGCZDIR="./node_modules/commitlint-config-cz"
LINTSTAGEDDIR="./node_modules/lint-staged"

# 如果尚未安装所需要的npm包，直接安装依赖包
if [ -d "$HUSKYDIR" -a -d "$COMMITLINTDIR" -a -d "$CZCUSTOMIZABLEDIR" -a -d "$COMMITLINTCONFIGCZDIR" -a -d "$LINTSTAGEDDIR" ]; then
    echo '脚手架看门狗已就位'
else
    echo '脚手架未安装看门狗，开始安装看门狗'
    npm i husky cz-customizable commitlint-config-cz @commitlint/cli @commitlint/config-conventional lint-staged --dev-save
    node ./config/setCZConfig.js
fi

# 将cz、commitlint需要配置样板脚本拷贝到指定工程根目录下

if [ -d "$PROJECTDIR" ]; then
    echo '开始安装cz，commitlint配置样板'
    cp ./shell/modules/.cz-config.js $1
    cp ./shell/modules/commitlint.config.js $1
    echo 'cz, commitlint配置样板安装完成， 你可以自行修改'
    echo '开始安装lintstaged配置样板'
    cp ./shell/modules/.lintstagedrc $1
    echo '.lintstagedrc配置样板安装完成，你可以自行修改'
else
    echo '项目工程目录不存在，请检查项目路径是否正确'
fi


