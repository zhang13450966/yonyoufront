/**
 * Created by wanghongxiang on 2018/7/7.
 */
import {ajax, toast, appUrlUtils, Cipher, viewModel, getMetaKey, gzip as Gzip} from 'nc-lightapp-front';
import React from 'react'

const {encrypt, decrypt, jsonToEncrypt, opaqueEncrypt, opaqueDecrypt} = Cipher
const {getAppUrl, setAppUrl, getAppReqParam} = appUrlUtils
const {setGlobalStorage, getGlobalStorage, removeGlobalStorage} = viewModel;
import hrAjax from './project-fetch'
import deepCopy from './deep-copy'

const formatDate = (time, separator = '-', type = 'yyyy-MM-dd') => {
    if (!time && typeof (time) !== 'number') {
        return ''
    }
    // 后台返回的时间戳可能是字符串类型的可能是几个时间戳
    let ary = []
    let date
    if (!(time instanceof Date)) {
        time = time && parseInt(time)
    }
    date = new Date(time)
    let year = date.getFullYear()
    let month = date.getMonth() < 9 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
    let day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
    let hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
    let min = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
    let sec = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
    switch (type) {
        case 'YY-MM':
            ary = [year, month]
            break
        case 'YY-MM-DD':
            ary = [year, month, day]
            break
        case 'hh-mm':
            ary = [hour, min]
            break
        case 'hh-mm-ss':
            ary = [hour, min, sec]
            break
        case 'MM-dd':
            ary = [month, day]
            break
        // 假勤单据只显示到分
        case 'Y-M-d-h-m-0':
            let str5 = [year, month, day].join('-')
            let str6 = [hour, min, '00'].join(':')
            ary = [str5, str6]
            break
        case 'Y-M-d-h-m-s':
            let str1 = [year, month, day].join('-')
            let str2 = [hour, min, sec].join(':')
            ary = [str1, str2]
            break
        // 配合导出表格的文件名。。。
        case 'y-m-d-h-m-s':
            let str3 = [year, month, day].join('-')
            let str4 = [hour, min, sec].join('-')
            ary = [str3, str4]
            break
        // 显示到分
        case 'y-m-d-h-m':
            let str7 = [year, month, day].join('/')
            let str8 = [hour, min].join(':')
            ary = [str7, str8]
            break
        // mm-dd hh:mm
        case 'm-d-h-m':
            let str9 = [month, day].join('/')
            let str10 = [hour, min].join(':')
            ary = [str9, str10]
            break
        case 'Y-M-d h-m-s':
            let str11 = [year, month, day].join('-')
            let str12 = ' ' + [hour, min, sec].join(':')
            ary = [str11, str12]
            break
        default:
            ary = [year, month, day]
    }
    return ary.join(separator)
}

/**
 * 更改radio样式
 * @param {*} form 表单数据，或者table中的行数据
 * @param {*} dbdata 后台返回的数据 true/false 或者 'true'/'false'
 * @param {*} dbdata  模板中对应的数据
 * @param {*} keyArrays 需要更改的字符串数组
 */
const transRadio = (form, dbdata, tempdata, keyArrays, tempShowname) => {
    //需要区分form 和table
    let rows;
    if (!form.rows) {
        rows = form;
    } else {
        rows = form.rows;
    }
    keyArrays.map(key => {
        let handleData = (d) => {
            if (!d.values[key]) {
                d.values[key] = {
                    value: false
                }
            }
            if (tempdata[0] === 'Y') {
                //薪资档案 可能为空
                if (d.values[key]) {
                    //已经翻译过的不用再次翻译
                    if (d.values[key].value != tempdata[0] && d.values[key].value != tempdata[1]) {
                        d.values[key].display = d.values[key].value === dbdata ? (d.values[key].value === dbdata ? tempShowname[0] : tempShowname[1]) : tempShowname[1];
                        /* 国际化处理： 是,否,否*/
                        d.values[key].value = d.values[key].value === dbdata ? (d.values[key].value === dbdata ? tempdata[0] : tempdata[1]) : tempdata[1];
                    }
                }
            } else {
                if (d.values[key]) {
                    //已经翻译过的不用再次翻译
                    if (d.values[key].value.toString() != tempdata[0].toString() && d.values[key].value.toString() != tempdata[1].toString()) {
                        d.values[key].display = d.values[key].value === 'true' ? (d.values[key].value === dbdata ? tempShowname[0] : tempShowname[1]) : tempShowname[1];
                        /* 国际化处理： 是,否,否*/
                        d.values[key].value = d.values[key].value === 'true' ? (d.values[key].value === dbdata ? tempdata[0] : tempdata[1]) : tempdata[1];
                    }
                }
            }

        }

        //如果没有这个属性，加进来，并且设置默认值为false
        if (Array.isArray(rows)) {
            for (let i of rows) {
                handleData(i)
            }
        } else {
            handleData(rows)
        }
    })
    if (Array.isArray(rows)) {
        return {rows: rows};
    } else {
        return {rows: [rows]};
    }

}
/**
 * 处理表格变色增加render
 * @param {需要变颜色的字段map} changeColorMap
 * @param {meta名字} metaName
 * @param {框架中的内置Props} props
 * @param {需要处理的模板数据template_data} template_data
 */
/**
 * 后端数据格式 changeColorMap :{f_79: ["1", "3", "0"]}
 * key是field名，数组是列
 * ***/
const handleTableChangeColor = (changeColorMap, metaName, props, template_data) => {
    let metaCurrent = deepCopy(template_data)
    let fields = Object.keys(changeColorMap)
    if (fields.length < 1) {
        props.meta.addMeta({[metaName]: metaCurrent});
        return
    }
    for (let i of metaCurrent.items) {
        if (!(i.children && i.children.length > 0)) { //单表头
            if (fields.indexOf(i.attrcode) > -1) {
                let scale = Number(i.scale)
                // i.itemtype = "customer"
                i.renderStatus = 'browse'
                i.render = (a, b, c) => {
                    let val;
                    let color;
                    if (a) {
                        if (a.values !== undefined) {
                            val = a.values[i.attrcode] && a.values[i.attrcode].value
                        } else {
                            val = a[i.attrcode] ? a[i.attrcode].value : a.value
                        }
                    } else {
                        if (b.values !== undefined) {
                            val = b.values[i.attrcode] && b.values[i.attrcode].value
                        } else {
                            val = b[i.attrcode] ? b[i.attrcode].value : b.value
                        }
                    }

                    if (val && val.toString() === 'true') {
                        val = '是'
                    } else if (val === false || val === 'false') {
                        val = '否'
                    }
                    // else {
                    //     val = val
                    // }
                    let flag;
                    if (changeColorMap[i.attrcode] && changeColorMap[i.attrcode].length > 0
                        && changeColorMap[i.attrcode][0].indexOf("=") > -1) {
                        const key = changeColorMap[i.attrcode][0].split("=")[0];
                        flag = changeColorMap[i.attrcode]
                            .some( item => {
                                let pk_wa_data = b.pk_wa_data&&b.pk_wa_data.value?b.pk_wa_data.value:b.values?b.values[key].value:b.value
                                return item.split("=")[1] === pk_wa_data
                            });
                    } else {
                        flag = changeColorMap[i.attrcode].indexOf(c + "") > -1
                    }
                    if (flag) {
                        return <span
                            style={{color: 'red'}}>{i.itemtype!='number' ? (val !== '' || val !== null || val !== undefined) ? val : '' : Number(val).toFixed(scale)}</span>
                    } else {
                        return <span>{i.itemtype!='number' ? (val !== '' || val !== null || val !== undefined) ? val : '' : Number(val).toFixed(scale)}</span>
                    }
                }
            } 
        } else { //多表头
            for (let j of i.children) {
                if (fields.indexOf(j.attrcode) > -1) {
                    let scale = Number(j.scale)
                    // i.itemtype = "customer"
                    j.renderStatus = 'browse'
                    j.render = (a, b, c) => {
                        let val;
                        let color;
                        if (a) {
                            if (a.values !== undefined) {
                                val = a.values[j.attrcode] && a.values[j.attrcode].value
                            } else {
                                val = a[j.attrcode] ? a[j.attrcode].value : a.value
                            }
                        } else {
                            if (b.values !== undefined) {
                                val = b.values[j.attrcode] && b.values[j.attrcode].value
                            } else {
                                val = b[j.attrcode] ? b[j.attrcode].value : b.value
                            }
                        }

                        if (val && val.toString() === 'true') {
                            val = '是'
                        } else if (val && val.toString() === 'false') {
                            val = '否'
                        }
                        // else {
                        //     val = val
                        // }
                        let flag;
                        if (changeColorMap[i.attrcode] && changeColorMap[i.attrcode].length > 0
                            && changeColorMap[i.attrcode][0].indexOf("=") > -1) {
                            const key = changeColorMap[i.attrcode][0].split("=")[0];
                            flag = changeColorMap[i.attrcode]
                                .some(item => item.split("=")[1] === b.values[key].value);
                        } else {
                            flag = changeColorMap[i.attrcode].indexOf(c + "") > -1
                        }
                        if (flag) {
                            return <span
                                style={{color: 'red'}}>{(Number.isNaN(Number(val)) || (val !== '' || val !== null || val !== undefined)) ? val : Number(val).toFixed(scale)}</span>
                        } else {
                            return <span>{(Number.isNaN(Number(val)) || (val !== '' || val !== null || val !== undefined)) ? val : Number(val).toFixed(scale)}</span>
                        }
                    }
                } else {
                    // let scale = Number(j.scale)
                    // if (j.attrcode !== "opr") {
                    // }
                }
            }
        }

    }
    props.meta.addMeta({[metaName]: metaCurrent});
}
const getRqCodeIsTemplate = (reqData, appcode, pagecode, meta) => {
    reqData.map(obj => {
        let _res_ = JSON.parse(obj.rqJson);
        if (obj.rqCode !== 'button' && obj.rqCode !== 'context') {
            let ts = "";
            if (meta[obj.rqCode] && meta[obj.rqCode].ts) {
                ts = meta[obj.rqCode].ts;
            }
            _res_['compareTs'] = true;
            //查看是否需要更新缓存：
            _res_['ts'] = ts
        }
        obj.rqJson = JSON.stringify(_res_);
        return obj;
    })
    return reqData
}
/**
 * 合并请求
 * @param config
 * @param reqData
 * @param callback
 */
/**
 let reqData = [
 {
     rqUrl: '/platform/templet/querypage.do',
     rqJson: `{\n  \"pagecode\": \"${pagecode}\",\n  \"appcode\": \"${appcode}\"\n}`,
     rqCode: 'template'
 },
 {
     "rqUrl": '/hrwa/paydata/QueryTempleteAction.do',
     "rqJson": `{typeCode: 'table', pk_org: '${this.state.pk_org}', pk_wa_class: '${this.state.pk_wa_class}', cyear: '${this.state.cyear}', cperiod: '${this.state.cperiod}'}`,
     "rqCode": "template_table"
 },
 {
     "rqUrl": '/hrwa/paydata/QueryTempleteAction.do',
     "rqJson": `{typeCode: 'form', pk_org: '${this.state.pk_org}', pk_wa_class: '${this.state.pk_wa_class}', cyear: '${this.state.cyear}', cperiod: '${this.state.cperiod}'}`,
     "rqCode": "template_form"
 },
 {
     "rqUrl": '/hrwa/paydata/WaPaydataSpecialInitAction.do',
     "rqJson": `{ pk_org: '${this.state.pk_org}', pk_wa_class: '${this.state.pk_wa_class}', cyear: '${this.state.cyear}', cperiod: '${this.state.cperiod}'}`,
     "rqCode": "special_template"
 },
 {
     rqUrl: '/platform/appregister/queryallbtns.do',
     rqJson: `{\n  \"pagecode\": \"${pagecode}\",\n  \"appcode\": \"${appcode}\"\n}`,
     rqCode: 'button'
 },
 {
     rqUrl: '/platform/appregister/queryappcontext.do',
     rqJson: `{\n  \"appcode\": \"${appcode}\"}`,
     rqCode: 'context'
 }
 ];
 **/
const snCreateUIDom = (config, reqData = [], callback, isCache = true) => {
    if (config.billtype) {
        //根据billtype查appcode
        let sencetype = "1"
        hrAjax({
            url: '/nccloud/platform/pub/getappurl.do',
            method: 'post',
            data: {
                billpk: null,
                billtypecode: config.billtype,
                pagecode: config.pagecode || null,
                sence: config.sence || sencetype
            },
            success: (result) => { //查询成功后请求模板
                if (result.success && result.data && result.data.appPageVO) {
                    let appcode = result.data.appcode;
                    let pagecode = config.pagecode || result.data.appPageVO.pagecode;
                    this.requestMeta(appcode, pagecode, callback);
                }
            }
        })
    } else {
        let code = '';
        let page = '';
        let appUrl = window.parent.location.hash.split('?');
        if (appUrl && appUrl[1]) {
            let appPrams = appUrl[1].split('&');
            if (appPrams && appPrams instanceof Array) {
                appPrams.forEach((item) => {
                    if (item.indexOf('=') != -1 && item.split('=') && item.split('=') instanceof Array) {
                        if (item.split('=')[0] === 'c') {
                            if (item.split('=')[1]) {
                                code = decodeURIComponent(decodeURIComponent(item.split('=')[1]));
                            }
                        }
                        if (item.split('=')[0] === 'p') {
                            if (item.split('=')[1]) {
                                page = decodeURIComponent(decodeURIComponent(item.split('=')[1]));
                            }
                        }
                    }
                });
            }
        }
        let pagecode = config.pagecode || page;
        let appcode = config.appcode || code;

        //querypage: compareTs: true时,模板改变时，会返回模板数据，否则返回 false
        let storeCipher = localStorage.getItem('storeCipher') != '0';
        let keySessionS = getMetaKey(appcode, pagecode);
        let g = new Gzip();
        let meta = {};

        //先判断有无缓存，有缓存，再查一下模板是不是被改过，改过更新缓存，没改什么也不做；若无缓存，不带走ts发请求查询
        if (isCache) { //业务需要缓存
            meta = getGlobalStorage('localStorage', keySessionS);
            //先解密后 解压
            if (storeCipher) {
                //meta = meta && decrypt(meta, aeskey)
                meta = meta && g.unzip(meta);
            } else {
                meta = meta && JSON.parse(meta);
            }

            if (meta) { //有缓存
                // reqData[0].rqJson = `{\n  \"pagecode\": \"${pagecode}\",\n  \"appcode\": \"${appcode}\"\n, \n  \"compareTs\":true\n, \n  \"ts\":\"${ts}\"\n}`;
                reqData = getRqCodeIsTemplate(reqData, appcode, pagecode, meta)
                // this.refreshMeta(g, meta, reqData, callback, storeCipher, keySessionS);
                snRequestMeta(appcode, pagecode, reqData, callback, storeCipher, meta, keySessionS, isCache);
            }//无缓存，不带ts发请求，查询模板数据
            else {
                snRequestMeta(appcode, pagecode, reqData, callback, storeCipher, meta, keySessionS, isCache);
                // this.refreshMeta(g, {}, reqData, callback, storeCipher, keySessionS);
            }
        } else { //业务不要缓存
            snRequestMeta(appcode, pagecode, reqData, callback, storeCipher, meta, keySessionS, isCache);
            // this.refreshMeta(g, {}, reqData, callback, storeCipher, keySessionS);
        }


        // snRequestMeta(appcode, pagecode, reqData, callback, isCache);
    }
}

const snRequestMeta = (appcode, pagecode, reqData, callback, storeCipher, cacheMeta, keySessionS, isCache = true) => {
    hrAjax({
        url: '/nccloud/platform/pub/mergerequest.do',
        data: reqData,
        success: function (res) {
            // let meta = res.data;
            // if (callback && typeof callback == 'function') {
            //     callback(meta);
            // }
            if (res.data) {
                // this.app_context = res.data.context;
                !cacheMeta && (cacheMeta = {});
                Object.assign(cacheMeta, res.data);
                let allKeys = Object.keys(res.data);
                if (allKeys.length > 2) {
                    let meta = cacheMeta;
                    let jsonMeta = JSON.stringify(meta);

                    //抛给业务组使用
                    if (callback && typeof callback == 'function') {
                        callback(meta);
                    }
                    //先压缩，后加密
                    let newMeta = jsonMeta;
                    if (storeCipher) {
                        let gmeta = jsonMeta && new Gzip().zip(jsonMeta);
                        // newMeta = gmeta && encrypt(gmeta, aeskey);
                        newMeta = gmeta;
                    }
                    try {
                        setGlobalStorage('localStorage', keySessionS, newMeta);
                    } catch (e) {
                        Object.keys(localStorage).forEach((item) => {
                            if (item.includes('appTempletStorage_')) {
                                delete localStorage[item];
                            }
                        });
                        setGlobalStorage('localStorage', keySessionS, newMeta);
                    }
                } else {
                    if (callback && typeof callback == 'function') {
                        callback(cacheMeta);
                    }
                }
            } else {
                if (callback && typeof callback == 'function') {
                    callback(cacheMeta);
                }
            }
        }
    });
}
/**
 *
 * @param template 需要固定列的模版
 * @param colMap 需要固定的列数组
 */
const fixedCol = (template, colMap, json) => {
    let items = template.items
    // items.unshift({
    //     attrcode: "numberindex",
    //     className: "table-index",
    //     dataIndex: "numberindex",
    //     itemtype: "customer",
    //     label: json, /* 国际化处理： 序号*/
    //     title: json, /* 国际化处理： 序号*/
    //     visible: true,
    //     width: "60px",
    //     fixed: 'left'
    // })
    items.forEach((items) => {
        if (colMap.indexOf(items.attrcode) > -1) {
            items.islock = 'left'
        }
    })

}
/**
 *给查询模板赋默认值
 * @param template 需要固定列的模版
 * @param colMap 需要固定的列数组
 */
const handleQueryRefer = (temp, value) => {
    let items = temp.items
    items.map(val => {
        if (val.itemtype === 'refer') {
            val.queryCondition = function () {
                return {
                    "pk_org": value.pk_org
                }
            }
        }
    })
    return temp
}

const languageCreateUIDOM = (props) => {
    return (pageCfg = {}, langCfg = {}, callback) => {

        var count = 0;
        var result = {};

        var hander = () => {
            if (count == 2) {
                callback && callback(result.templateData || {}, result.langData || {}, result.inlt || {});
            }
        }
        // if (langCfg.callback) {
        // }

        var newLangCfg = {
            ...langCfg, callback: (data, success, inlt) => {
                count = count + 1;
                if (!success) {
                    toast({content: 'load muti lang error', color: 'warning'});
                }
                result.langData = data || {};
                result.inlt = inlt || {};
                hander();
            }
        };
        props.MultiInit.getMultiLang(newLangCfg);

        props.createUIDom(pageCfg, (data) => {
            count = count + 1;
            result.templateData = data || {};
            hander();
        });
    };

}

const myBrowser = () => {
    const userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    const isOpera = userAgent.indexOf('Opera') > -1;
    if (isOpera) {
        //判断是否Opera浏览器
        return 'Opera';
    }
    if (userAgent.indexOf('Firefox') > -1) {
        //判断是否Firefox浏览器
        return 'FF';
    }
    if (userAgent.indexOf('Chrome') > -1) {
        return 'Chrome';
    }
    if (userAgent.indexOf('Safari') > -1) {
        //判断是否Safari浏览器
        return 'Safari';
    }
    if (!!window.ActiveXObject || 'ActiveXObject' in window) {
        return 'IE';
    }
};

//判断浏览器类型
const getUserAgent = () => {
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    //判断是否Opera浏览器
    if (userAgent.indexOf("Opera") > -1) {
        return "Opera";
    }
    //判断是否Firefox浏览器
    if (userAgent.indexOf("Firefox") > -1) {
        return "FF";
    }
    //判断是否chorme浏览器
    if (userAgent.indexOf("Chrome") > -1) {
        return "Chrome";
    }
    //判断是否Safari浏览器
    if (userAgent.indexOf("Safari") > -1) {
        return "Safari";
    }
    //判断是否IE浏览器
    if (
        userAgent.indexOf("compatible") > -1 &&
        userAgent.indexOf("MSIE") > -1 &&
        !isOpera
    ) {
        return "IE";
    }
    //判断是否Edge浏览器
    if (userAgent.indexOf("Trident") > -1) {
        return "Edge";
    }
}
/**
 * 函数防抖
 * @param fn  要执行的方法
 * @param delay  最短间隔时间
 * @returns {Function}
 */
const debounce = (fn, delay = 200) => {
    // 维护一个 timer
    let timer = null;

    return function () {
        // 通过 ‘this’ 和 ‘arguments’ 获取函数的作用域和变量
        let context = this;
        let args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
            fn.apply(context, args);
        }, delay);
    }
};

/**
 * 链式获取特定值
 * 用法如下：
 * import {Maybe} from 'src/hrpub/common/utils/utils'
 * Maybe.of(result).getValue(['data', 'paydata', 'wa_data', 'rows[0]'])
 *
 console.log(Maybe.of({
    a: {
        b: {
        c: [{
            d: 4
        }]
        }
    }
    }).getValue(['a', 'b', 'c[0]', 'd']))  // 4 若无值返回undefined
 *
 *
 */
export class Maybe {
    constructor(val) {
        this.__value = val
        this.cacheValue = null
    }

    static of(val) {
        return new Maybe(val)
    }

    setValue(val) {
        let cache = !this.cacheValue ? this.__value : this.cacheValue
        if (new RegExp(/\[\d+\]/g).test(val)) {
            let num = val.match(new RegExp(/(?!\[)(\d+)(?=\])/g))[0]
            let name = val.match(new RegExp(/^\w*(?=\[)/g))[0]
            this.cacheValue = cache[name][num]
            return
        }
        this.cacheValue = cache[val]
    }

    getValue(args) {
        args.map(obj => {
            this.setValue(obj)
        })
        return this.cacheValue
    }
}

/**
 * 跳转到某个节点
 * @param pageUrl {string}  '/nccloud/resources/hrcm/contractmgt/change/main/index.html'
 */
const jumpToNode = (pageUrl) => {
    // 等待第二个页面的参数
    let fixUrl = '/nccloud/resources/workbench/public/common/main/index.html#/ifr?ifr=';
    let tempwindow = window.open();
    tempwindow.location = (fixUrl + pageUrl);
};
/**
 * getAppPageConfig 获取app page code
 */
export const getAppPageConfig = () => {
    let appcode = '';
    let pagecode = '';
    let appUrl = '';
    let config = appUrlUtils.getAppReqParam();

    // 将appcode和pagecode 置为null  方便判断 appcode 或 pagecode不存在时将其设置为 本地默认值
    if (!config.appcode || config.appcode.length < 1) {
        config.appcode = null
    }
    if (!config.pagecode || config.pagecode.length < 1) {
        config.pagecode = null
    }
    return config
    // if (/^localhost|127\.0\.0\.1/.test(window.location.hostname)) {
    //     appUrl = window.location.hash.split('?');
    //     if (appUrl && appUrl[1]) {
    //         let appPrams = appUrl[1].split('&');
    //         if (appPrams && appPrams instanceof Array) {
    //             appPrams.forEach((item) => {
    //                 if (item.indexOf('=') != -1 && item.split('=') && item.split('=') instanceof Array) {
    //                     if (item.split('=')[0] === 'c') {
    //                         if (item.split('=')[1]) {
    //                             appcode = decodeURIComponent(decodeURIComponent(item.split('=')[1]));
    //                         }
    //                     }
    //                     if (item.split('=')[0] === 'p') {
    //                         if (item.split('=')[1]) {
    //                             pagecode = decodeURIComponent(decodeURIComponent(item.split('=')[1]));
    //                         }
    //                     }
    //                 }
    //             });
    //         }
    //     }
    //     return {
    //         appcode,
    //         pagecode
    //     }
    // } else {
    //     return appUrlUtils.getAppReqParam()
    // }
    // let appUrl = window.parent.location.hash.split('?');
    // let appUrl = window.location.hash.split('?');

}
/**
 * 获取默认组织
 */
export const getDefaultOrg = (key = 'cacheGlobalOrg') => {
    const {appcode, apgecode} = getAppPageConfig()
    let cacheGlobalOrg = localStorage.getItem(key)
    if (cacheGlobalOrg) {
        const {refpk, refname} = JSON.parse(cacheGlobalOrg)
        return new Promise((resolve, reject) => {
            hrAjax({
                url: '/nccloud/uapbd/org/HROrgTreeRef.do',
                body: {
                    "pid": "",
                    "pageInfo": {
                        "pageSize": 50,
                        "pageIndex": -1
                    },
                    "keyword": "",
                    "queryCondition": {
                        "AppCode": appcode,
                        "isShowUnit": false,
                        "TreeRefActionExt": "nccloud.web.hr.sqlbuilder.HRPrimaryOrgSQLBuilder"
                    }
                }
            }).then(res => {
                if (res.success && res.data) {
                    if (hasOrgRight(res.data.rows, refpk)) {
                        resolve({
                            data: {
                                pk_org: refpk,
                                org_Name: refname
                            }
                        })
                    }
                }
            })
            /*setTimeout(() => {

            }, 0)*/
        })
    } else {
        return hrAjax({
            url: '/nccloud/platform/appregister/queryappcontext.do',
            body: {
                appcode,
                rqCode: 'context'
            }
        })
    }

}

const hasOrgRight = (orgData = [], refpk) => {
    if (!refpk) return false;
    return orgData.findIndex(org => org.refpk === refpk) > -1;
};

/**
 * 重定向 只改pagecode
 * @param {*} config
 */
export const reWriteFunc = (config) => {
    let path = window.location.hash.split('=')[1]
    setAppUrl(path, `c=${config.appcode}&p=${config.pagecode}`)
    /*let path
    if (new RegExp(/localhost:3006/g).test(window.location.href)) {
        path = window.location.hash
        window.location.hash = path.replace(path.match(/(?![p=])([^&]*)/g)[4], config.pagecode)
    } else {
        path = window.parent.location.hash
        window.parent.location.hash = path.replace(path.match(/(?![p=])([^&]*)/g)[4], config.pagecode)
    }*/
}

/**
 * 获取查询模版的值
 */
export const getQueryCondition = (props, searchId) => {

    let queryParam = props.search.getQueryInfo(searchId)
    //高级查询
    /*if (queryParam && queryParam.querycondition && queryParam.querycondition.conditions[0] && queryParam.querycondition.conditions[0].conditions) {
        queryParam.querycondition.conditions = queryParam.querycondition.conditions[0].conditions
    }*/
    return queryParam

}

// 获取背景色
export const getColor = () => {
    let div = document.createElement('div');
    div.style.height = 0;
    div.className = 'header';

    document.body.appendChild(div);

    let bgColor = window.getComputedStyle(div).backgroundColor;

    document.body.removeChild(div);
    let color = isBlackBg() ? '#aeaeae' : '#000';

    return {
        bgColor: bgColor,
        color: color
    };
}

// 判断是否为暗黑色背景
export const isBlackBg = () => {
    return document.body.className.includes('nc-lightapp-front-black')
}

export const handleHash = (date, content) => (WrappedComponent) => {
    if (/^localhost|127\.0\.0\.1/.test(window.location.hostname)) {
        return class extends React.Component {
            componentWillMount() {
                setAppUrl(date, content)
            }

            render() {
                return <WrappedComponent {...this.props} />
            }
        }
    } else {
        return class extends React.Component {
            render() {
                return <WrappedComponent {...this.props} />
            }
        }
    }
}


/**
 * 校验
 * @param props
 * @param pageid        1、为template模板是template的pageid；  2、非template模板时，为表格/表单ID
 * @param formId        1、一主多子或一主一子时主集的id；  2、单个表格/表单时相应的表格/表单id
 * @param bodys_code    一主多子时 子集的 tableid
 * @param billType      编辑关联项适配中的billinfo中的billType值：'card'/'extcard'/'grid'/'form'
 * @param tableType     值为 "editTable" / "cardTable"
 * @param templetid     非template模板时才用到 template模板同级的相应的模板的pageid
 * @param editCardDataFun  纯函数 修改cardData函数
 * @returns {Promise<any>}
 */
function saveValidate(props, pageid, formId, bodys_code, billType, tableType = 'cardTable', templetid, editCardDataFun) {
    let cardData;
    let tableTypeObj = {};
    if (billType === 'extcard') {
        tableTypeObj = {
            [formId]: 'form'
        };
        bodys_code.forEach(body_code => {
            if (!body_code) return;
            tableTypeObj[body_code] = tableType;
        });
        cardData = props.createExtCardData(pageid, formId, bodys_code);
        if (templetid) {
            cardData.templetid = templetid;
        }
    } else if (billType === 'grid') {
        let tableData = props[tableType].getAllData(formId) || {};
        cardData = {
            pageid,
            gridModel: {
                areacode: formId,
                pageinfo: {},
                rows: tableData.rows
            }
        };
        if (templetid) {
            cardData.templetid = templetid;
        }
        tableTypeObj = {[formId]: tableType}
    } else if (billType === 'form') {
        let formData = props.form.getAllFormValue(formId);//获得表单信息
        //适配校验公式
        formData.areacode = formId;
        cardData = {
            pageid,
            model: formData
        };
        if (templetid) {
            cardData.templetid = templetid;
        }
        tableTypeObj = {'head': 'form'}
    } else if (billType === 'card') {
        cardData = props.createMasterChildData(pageid, formId, bodys_code);
        tableTypeObj = {[bodys_code]: tableType}
    }

    return new Promise(resolve => {
        if (editCardDataFun && typeof editCardDataFun === 'function') {
            cardData = editCardDataFun(cardData);
        }
        props.validateToSave(cardData, resolve, tableTypeObj, billType)
    })
}

/**
 * 给某项赋值
 * @param {*} data 表单数据，或者table中的行数据
 * @param {*} item 要赋值的项
 */
 const idDisplayNull = (data, item) => {
    if (!data.rows) return
    data.rows.forEach((i) => {
        let OneItem = i.values
        if (item) {
            if (!OneItem[item].display || !(OneItem[item].display.trim())) {
                OneItem[item].display = OneItem[item].value
            } else if (!OneItem[item].value) {
                OneItem[item].value = OneItem[item].display
            }
        } else {
            for (let j in OneItem) {
                // debugger
                if (!OneItem[j].display || !(OneItem[j].display.trim())) {
                    OneItem[j].display = OneItem[j].value
                } else if (!OneItem[j].value) {
                    OneItem[j].value = OneItem[j].display
                }
            }
        }
    })

    return data
}

/**
 * 调用平台方法
 * 如果表格是自适应高度adaptionHeight=true
 * 则会有一个window.addEventListener('resize', this.resizeListener)
 * 如果window size改变则会重新计算表格高度
 * 这里手动调用这个方法，适用于一些页面其他部分改动影响表格高度的问题
 * 看平台源码中有如果其他部分高度变动时重新计算的方法，但是测试中发现没有生效
 * 不确定是哪里的问题，所以在这里先手动调用一下
 */
let resizeEvent;
const resizeWin = () => {
    try {
        if(!resizeEvent){
            resizeEvent = document.createEvent("Event");
            resizeEvent.initEvent("resize", true, true);
        }
        window.dispatchEvent(resizeEvent);
    }catch (e) {
        console.log(e)
    }
}

/**
 * 获取模板
 * @param {*} configs  // 多个模板第一个放置基础的，其余的参数中要放置rqCode,值为模板名称 可参考入职登记的写法
 * @param {*} props 
 * @param {*} callback 
 */
const getUIDom = (configs = [], props, callback) => {
    const {createUIDom} = props;
    const getUIDomHandle = (config) => {
        return new Promise((resolve, reject) => {
            createUIDom && createUIDom(config,(res) => {
                resolve(res)
            })
        })
    }
    if(Array.isArray(configs)) {
        Promise.all(configs.map(getUIDomHandle)).then((res)=>{
            let templateData = res[0]
            configs.forEach((item, i) => {
                if(item.rqCode) {
                    templateData[item.rqCode] = res[i].template
                } 
            })
            callback && callback(templateData)
            // return templateData
            // new Promise((resolve,reject)=>{
            //     return resolve(templateData)
            // })
        }).catch(err => {
            console.log('error',err)
        })
        
    } else {
        props.createUIDom(configs, (templateData) => {
            callback && callback(templateData)
        })
    }
}
export {
    formatDate,
    transRadio,
    snCreateUIDom,
    handleTableChangeColor,
    fixedCol,
    handleQueryRefer,
    languageCreateUIDOM,
    getUserAgent,
    debounce,
    myBrowser,
    hrAjax,
    jumpToNode,
    saveValidate,
    idDisplayNull,
    resizeWin,
    getUIDom
}
