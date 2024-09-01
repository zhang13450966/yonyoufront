###
 # @Author: Hugo
 # @Date: 2022-04-22 14:12:38
 # @LastEditTime: 2022-04-27 15:31:07
 # @LastEditors: Please set LastEditors
 # @Description: 代码格式校验及提交规范校验工具初始化
 # @FilePath: /low_code_designer_husky/shell/watchdog-prepare.sh
### 
#!/bin/sh

# 目标项目路径
PROJECTDIR=$1
begin=0

PACKAGEFILE=./package.json

COMMIT_MSG_FILE=$1/.husky/commit-msg
COMMIT_MSG_CONTENT='../../node_modules/.bin/commitlint --edit "$1"'

PRE_COMMIT_FILE=$1/.husky/pre-commit
# 这个是全量eslint检查的脚本
# PRE_COMMIT_CONTENT='cd ../../ && npm run lint'
# 这个是只对stag缓存进行检查的脚本
# -d debug
PRE_COMMIT_CONTENT='npx lint-staged --cwd ./ -c ./.lintstagedrc'



watchdogInit() {

    if [ ! -f "$PROJECTDIR/.cz-config.js" ]; then
        echo "开始安装.cz-config.js配置文件..."
        cp ./shell/modules/.cz-config.js $PROJECTDIR
        echo ".cz-config.js配置文件安装完成!"
    fi

    if [ ! -f "$PROJECTDIR/commitlint.config.js" ]; then
        echo "开始安装commitlint.config.js配置文件..."
        cp ./shell/modules/commitlint.config.js $PROJECTDIR
        echo "commitlint.config.js配置文件安装完成!"
    fi

    if [ ! -f "$PROJECTDIR/.lintstagedrc" ]; then
        echo "开始安装.lintstagedrc配置文件..."
        cp ./shell/modules/.lintstagedrc $PROJECTDIR
        echo ".lintstagedrc配置文件安装完成!"
    fi

    if [ ! -f "$PROJECTDIR/.eslintrc.js" ]; then
        echo "开始安装.eslintrc.js配置文件"
        cp ./shell/modules/.eslintrc.js $PROJECTDIR
        echo ".eslintrc.js配置文件安装完成!"
    fi

    if [ ! -f "$PROJECTDIR/.eslintignore" ]; then
        echo "开始安装.eslintignore配置文件"
        cp ./shell/modules/.eslintignore $PROJECTDIR
        echo ".eslintignore配置文件安装完成"
    fi

    if [ ! -d "$PROJECTDIR/.husky/_" ]; then
        echo "开始为指定项目目录安装husky钩子..."
        ./node_modules/.bin/husky install $PROJECTDIR/.husky
        # husky工具默认是在项目根目录设置git config，
        # 我们脚手架现状，各个项目根目录在src目录下，所以需要先取消hooksPath设置
        # 再手动设置在目标项目根目录
        git config --unset core.hooksPath
        rm $PROJECTDIR/.husky/_/.gitignore
        echo "husky钩子目录添加完成"
    fi

    if [ ! -f "$PROJECTDIR/.husky/commit-msg" ]; then
        echo "添加git commit-msg hook..."
        ./node_modules/.bin/husky add "$COMMIT_MSG_FILE" "$COMMIT_MSG_CONTENT"
        echo "添加git commit-msg hook完成"
    fi

    if [ ! -f "$PROJECTDIR/.husky/pre-commit" ]; then
        echo "添加git pre-commit hook..."
        ./node_modules/.bin/husky add "$PRE_COMMIT_FILE" "$PRE_COMMIT_CONTENT"
        echo "添加git pre-commit hook完成"
    fi
    
    if [ ! -f "$PROJECTDIR/.editorconfig" ]; then
        echo "开始添加.editorconfig..."
        cp ./shell/modules/.editorconfig $PROJECTDIR
        echo "添加.editorconfig完成"
    fi
}

setGitHookPath() {
    echo "设置git config core.hooksPath"
    cd $PROJECTDIR
    git config core.hooksPath .husky
    echo "设置git config core.hooksPath完成"
}


if [ ! -f "$PACKAGEFILE" ]; then
    echo '初始化失败!'
    echo '请在脚手架根目录执行命令'
else
    if [ -d "$PROJECTDIR" ]; then 
        echo '开始为项目初始化'
        begin=1
    else
        echo '项目工程目录不存在，请检查项目路径是否正确'
    fi

    if [ $begin == 1 ]; then
        echo "$PROJECTDIR 开始初始化任务..."
        watchdogInit $PROJECTDIR
        setGitHookPath
    else
        echo '初始化失败!'
    fi    
fi
