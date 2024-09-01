###
 # @Author: Hugo
 # @Date: 2022-04-12 14:29:15
 # @LastEditTime: 2022-04-22 14:01:01
 # @LastEditors: Please set LastEditors
 # @Description: 为指定项目目录安装lintrc配置文件
 # @FilePath: /low_code_designer_husky/shell/lintrc-init.sh
### 
#!/bin/sh

# 目标项目路径
PROJECTDIR="$1"
ESLINTRCFILE=$1/.eslintrc.js
ESLINTIGNOREFILE=$1/.eslintignore

# 如果目标项目路径根目录没有安装.eslintrc.js文件，直接拷贝样例eslintrc
echo "$PROJECTDIR"
if [ -d "$PROJECTDIR" ]; then

    if [ -f "$ESLINTRCFILE" ]; then
        echo "$ESLINTRCFILE 文件已存在，无需安装"
    else
        echo "$ESLINTRCFILE 文件不存在，开始导入样例文件"
        cp ./shell/modules/.eslintrc.js $PROJECTDIR
        echo ".eslintrc.js 文件导入成功，你可以修改自定义的代码校验规则"
    fi

    if [ -f "$ESLINTIGNOREFILE" ]; then 
        echo "$ESLINTIGNOREFILE 文件已存在，无需安装"
    else
        echo "$ESLINTIGNOREFILE 文件不存在，开始导入样例文件"
        cp ./shell/modules/.eslintignore $PROJECTDIR
        echo ".eslintignore 文件导入成功"
    fi
else
    echo "目标项目目录不存在"
fi