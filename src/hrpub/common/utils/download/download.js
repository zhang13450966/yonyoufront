/*
*
* created by ling yun on 2018/10/19
*
* 功能: 同域下载方法
* 原理: 通过form表单提交到一个iframe里，通过iframe的onload判断下载结果
* 参数:
*   url: 下载连接
*   body: 下载参数
*   onResult: 当iframe加载完毕时，返回iframe内的body对象，内容可能为空，自行判断内容是否是下载成功还是失败
*   onError: 当跨域，获取不到body的时候，会触发该函数
*   method: form表单提交的方式，默认是post
*   enctype: form表单的enctype 1 2 3 三个值，看代码便知
*
* */

import {viewModel} from 'nc-lightapp-front';

const {getGlobalStorage} = viewModel;

function getSysParamJson() {
    let app = '', appcode = '', AppStr = '', isAppro = false;
    let appN = window.parent.location.hash.split("?");
    if (appN && appN[1]) {
        console.log(appN[1])
        if (appN[1].indexOf('&') !== -1) {
            isAppro = true
        }
        let appKey = appN[1].split('=')
        if (appKey && appKey[1]) {
            let AppStrObj = getGlobalStorage('sessionStorage', 'NCCAPPURL');
            let AppOBJ = (new Function("return " + AppStrObj))(); 
       
                
            if (!isAppro&&AppOBJ) {
                AppStr = AppOBJ[appKey[1]]
            } else {
                AppStr = appN[1]
            }
            let appArray = AppStr.split('&')
            if (appArray && appArray instanceof Array) {
                appArray.forEach((item) => {
                    if (item.indexOf('=') != -1 && item.split('=') && item.split('=') instanceof Array) {
                        if (item.split('=')[0] === 'n') {
                            if (item.split('=')[1]) {
                                app = decodeURIComponent(decodeURIComponent(item.split('=')[1]));
                            }
                        }
                        if (item.split('=')[0] === 'c') {
                            if (item.split('=')[1]) {
                                appcode = decodeURIComponent(decodeURIComponent(item.split('=')[1]));
                            }
                        }
                    }
                });
            }
        }
        // if()
        // let appPrams = appN[1].split('&');
        // if (appPrams && appPrams instanceof Array) {
        //     appPrams.forEach((item) => {
        //         if (item.indexOf('=') != -1 && item.split('=') && item.split('=') instanceof Array) {
        //             if (item.split('=')[0] === 'n') {
        //                 if (item.split('=')[1]) {
        //                     app = decodeURIComponent(decodeURIComponent(item.split('=')[1]));
        //                 }
        //             }
        //             if (item.split('=')[0] === 'c') {
        //                 if (item.split('=')[1]) {
        //                     appcode = decodeURIComponent(decodeURIComponent(item.split('=')[1]));
        //                 }
        //             }
        //         }
        //     });
        // }
    }

    let busiaction = `${app || null}-${window.actionName || null}`;
    return {
        sys_busiaction: busiaction,
        sys_appcode: appcode,
        sys_ts: new Date().getTime()
    };
}


export default function downLoad({url, body, onResult, onError, method = 'post', enctype, options}) {

    const frameName = 'downLoadFrame';

    let oForm = document.createElement('form');
    let oIframe = document.createElement('iframe');
    let sysParamJson = getSysParamJson()
    if (options && options.appcode) {
        sysParamJson.sys_appcode = options.appcode;
    }
    let queryOpt = Object.assign({}, body, sysParamJson);

    method = method.toUpperCase();

    enctype = ((type) => {
        switch (type) {
            case 1:
                return 'multipart/form-data';
            case 2:
                return 'application/x-www-form-urlencoded';
            case 3:
                return 'text/plain';
            default:
                return 'multipart/form-data';
        }
    })(enctype);

    oForm.action = url;
    oForm.method = method;
    oForm.target = options && options.target? options.target: 'downLoadFrame'; // 默认
    oForm.enctype = enctype;
    oForm.style.display = 'none';

    oIframe.name = frameName;
    oIframe.height = '0';
    oIframe.width = '0';
    oIframe.style.display = 'none';

    Object.keys(queryOpt).forEach((key) => {
        if (queryOpt[key] instanceof Array) {
            queryOpt[key].forEach((item) => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = item;
                oForm.appendChild(input);
            })
        } else {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = queryOpt[key];
            oForm.appendChild(input);
        }
    });
    setTimeout(() => {
        oIframe.onload = function (e) {
            try {
                let body = oIframe.contentWindow.document.body;
                if (body) {
                    onResult && onResult.call(this, body)
                } else {
                    throw new Error();
                }
            } catch (e) {
                onError && onError.call(this, e);
            }

            document.body.removeChild(oForm);
            document.body.removeChild(oIframe);
            oForm = null;
            oIframe = null;
        };
    }, 0)


    document.body.appendChild(oIframe);
    document.body.appendChild(oForm);
    oForm.submit();
}
