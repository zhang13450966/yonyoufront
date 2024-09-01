#!/bin/sh

NCCCLI_PACKAGE=./ncc-cli

ncccliInit() {
    if [ -f "$NCCCLI_PACKAGE/.gitignore" ]; then
        rm -rf $NCCCLI_PACKAGE
    fi
    echo "安装命令行工程"
    git clone git@git.yonyou.com:nc-pub/ncc-cli.git
    echo "安装命令行依赖包"
    cd ncc-cli
    npm install
    echo "安装命令行工具完毕"
    cd ..
    ./ncc-cli/bin/index.js --help

}

ncccliInit