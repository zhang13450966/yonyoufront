###
 # @Author: Hugo
 # @Date: 2022-04-07 13:54:24
 # @LastEditTime: 2022-04-27 14:32:09
 # @LastEditors: Please set LastEditors
 # @Description: Husky初始化工作
 # @FilePath: /low_code_designer_husky/shell/husky-prepare.sh
### 
#!/bin/sh

PROJECTDIR=$1

COMMIT_MSG_FILE=$1/.husky/commit-msg
COMMIT_MSG_CONTENT='../../node_modules/.bin/commitlint --edit "$1"'

PRE_COMMIT_FILE=$1/.husky/pre-commit
# 这个是全量eslint检查的脚本
# PRE_COMMIT_CONTENT='cd ../../ && npm run lint'
# 这个是只对stag缓存进行检查的脚本
PRE_COMMIT_CONTENT='npx lint-staged --cwd ./ -c ./.lintstagedrc'

if [ -d "$PROJECTDIR" ]; then
    echo '开始为指定项目目录安装husky钩子'
    if [ ! -d "$PROJECTDIR/.husky" ]; then
        ./node_modules/.bin/husky install $PROJECTDIR/.husky
        git config --unset core.hooksPath
    fi

    echo '添加git commit-msg hook'
    if [ ! -f "$PROJECTDIR/.husky/commit-msg" ]; then
        ./node_modules/.bin/husky add "$COMMIT_MSG_FILE" "$COMMIT_MSG_CONTENT"
    fi

    echo '添加git pre-commit hook'
    if [ ! -f "$PROJECTDIR/.husky/pre-commit" ]; then
        ./node_modules/.bin/husky add "$PRE_COMMIT_FILE" "$PRE_COMMIT_CONTENT"
    fi

    echo '设置git config core.hooksPath'
    cd $PROJECTDIR
    git config core.hooksPath .husky
    
else
    echo '项目工程目录不存在，请检查项目路径是否正确'
fi