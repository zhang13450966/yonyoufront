/*! @ncctag {"project":"hpf","branch":"develop-ncc1.0","provider":"suqch","date":"2023/8/30 10:51:22"} */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"), require("react-dom"), require("nc-lightapp-front"), require("uap/common/components/excelImportconfig/index"), require("uap/common/components/ExcelOutput/index"));
	else if(typeof define === 'function' && define.amd)
		define(["react", "react-dom", "nc-lightapp-front", "uap/common/components/excelImportconfig/index", "uap/common/components/ExcelOutput/index"], factory);
	else if(typeof exports === 'object')
		exports["hpf/hpfc/m0z10250/main/index"] = factory(require("react"), require("react-dom"), require("nc-lightapp-front"), require("uap/common/components/excelImportconfig/index"), require("uap/common/components/ExcelOutput/index"));
	else
		root["hpf/hpfc/m0z10250/main/index"] = factory(root["React"], root["ReactDOM"], root["nc-lightapp-front"], root["uap/common/components/excelImportconfig/index"], root["uap/common/components/ExcelOutput/index"]);
})(self, (__WEBPACK_EXTERNAL_MODULE__6487__, __WEBPACK_EXTERNAL_MODULE__6189__, __WEBPACK_EXTERNAL_MODULE__5118__, __WEBPACK_EXTERNAL_MODULE__9845__, __WEBPACK_EXTERNAL_MODULE__9682__) => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 5118:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__5118__;

/***/ }),

/***/ 9682:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__9682__;

/***/ }),

/***/ 9845:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__9845__;

/***/ }),

/***/ 6487:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__6487__;

/***/ }),

/***/ 6189:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__6189__;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: external {"root":"React","var":"React","commonjs":"react","commonjs2":"react","amd":"react"}
var external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_ = __webpack_require__(6487);
var external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default = /*#__PURE__*/__webpack_require__.n(external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_);
// EXTERNAL MODULE: external {"root":"ReactDOM","var":"ReactDOM","commonjs":"react-dom","commonjs2":"react-dom","amd":"react-dom"}
var external_root_ReactDOM_var_ReactDOM_commonjs_react_dom_commonjs2_react_dom_amd_react_dom_ = __webpack_require__(6189);
var external_root_ReactDOM_var_ReactDOM_commonjs_react_dom_commonjs2_react_dom_amd_react_dom_default = /*#__PURE__*/__webpack_require__.n(external_root_ReactDOM_var_ReactDOM_commonjs_react_dom_commonjs2_react_dom_amd_react_dom_);
// EXTERNAL MODULE: external "nc-lightapp-front"
var external_nc_lightapp_front_ = __webpack_require__(5118);
;// CONCATENATED MODULE: ./src/hpf/hpfc/m0z10250/main/Utils.js
//使用参见《NC Cloud最终用户许可协议》，协议内容详见安装目录
function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === 'function') {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _defineProperty(target, key, source[key]);
        });
    }
    return target;
}

const EMPTY_FN = function() {};
/**
 * 对象合并 类似Object.assign();
 * @returns 第一个参数对象
 */ const apply = function() {
    if (!arguments) {
        throw new ReferenceError("该方法执行时至少传递一个参数对象!");
    }
    //参数的长度
    let length = arguments.length;
    //长度是1 直接返回
    if (length == 1) {
        return arguments[0];
    }
    //源
    let target = arguments[0];
    //从第二个元素开始 到 最后一个组成sources
    let sources = [
        ...arguments
    ].slice(1);
    for(let i = 0; i < sources.length; i++){
        //第i个参数
        let param = sources[i];
        Object.keys(param).forEach((key)=>{
            //param原型上有该对象或者属性
            if (Object.prototype.hasOwnProperty.call(param, key)) {
                target[key] = param[key];
            }
        });
    }
    return target;
};
/**
 * 加载单据模板
 * props：
 * cfg:{必输项
 *    pagecode： 必输项 参数模板的参数
 * },
 * callback(fn): 回调
 */ const loadTemplate = function(props, { pagecode , appcode  } = cfg) {
    return new Promise((resolve)=>{
        props.createUIDom({
            pagecode,
            appcode
        }, (data)=>{
            resolve(_objectSpread({}, data));
        });
    });
};
/**
 * 加载多语言
 * @param {*} props 必输项
 * @param {*} cfg:{
 *   moduleId: 必输项  【应用编码： 例如 38211902 @attention 这里是应用编码多语文件的名称也要以应用编码命名】
 *   domainName：必输项 【领域编码：例如 uapbd、fi、gl等等】
 * }
 */ const loadLang = function(props, { moduleId , domainName  } = cfg) {
    return new Promise((resolve)=>{
        //请求多语
        props.MultiInit.getMultiLang({
            moduleId,
            domainName,
            callback: (data, success, inlt)=>{
                if (!success) {
                    (0,external_nc_lightapp_front_.toast)({
                        content: '加载语言包失败',
                        color: 'warning'
                    });
                }
                resolve({
                    lang: data,
                    inlt
                });
            }
        });
    });
};
/**
 * 加载参照  多个参照一块加载
 * @param {*} urls 
 *      示例：[
 *             {
 *                url:'uapbd/refer/supplier/SupplierClassTreeRef/index',
 *               name:'uapbd/refer/supplier/SupplierClassTreeRef/index'
 *             },
 *             {
 *               url:'uapbd/refer/supplier/SupplierClassTreeRef/index',
 *               name:'uapbd/refer/supplier/SupplierClassTreeRef/index'
 *             }
 *            ]
 * @returns 
 */ const loadRefer = function(urls = []) {
    if (!urls || urls.length == 0) {
        return Promise.resolve(true);
    }
    let result = {};
    //构造
    let loads = (urls.filter((refObj, index)=>{
        let { url  } = refObj;
        let jsname = url.includes(".") ? url.substring(0, url.length - 3) : url;
        if (!window[jsname]) {
            return refObj;
        }
    }) || []).map((refObj)=>{
        return new Promise((resolve, reject)=>{
            let { url , name  } = refObj;
            let jsname = url.includes(".") ? url.substring(0, url.length - 3) : url;
            let script = document.createElement('script');
            let suffix = url.includes(".") ? '' : '.js';
            script.src = '../../../../' + url + suffix;
            script.type = 'text/javascript';
            script.onload = ()=>{
                result[name] = window[jsname].default || EMPTY_FN;
                resolve(result);
            };
            script.onerror = ()=>{
                result[name] = undefined;
                reject(result);
            };
            document.body.appendChild(script);
        });
    });
    //Promise 请求全部参照
    return Promise.all(loads);
};
/**
 * 请求资源
 * @param {*} config 
 *           props,  当前应用对象的props
 *           pagecode,  页面编码
 *           appcode,   应用编码
 *           moduleId,  建议使用应用编码
 *           domainName, 领域编码
 *           referObjs = [], 参照请求路径集合 
 *           callback = EMPTY_FN 回调
 */ const loadNCCResource = function(config) {
    let { props , pagecode , appcode , moduleId , domainName , referObjs =[] , callback =EMPTY_FN  } = config;
    //加载参照
    loadRefer(referObjs).then(()=>{
        return Promise.all([
            //加载模板
            loadTemplate(props, {
                pagecode,
                appcode
            }),
            //加载多语
            loadLang(props, {
                moduleId,
                domainName
            })
        ]);
    }).then((res)=>{
        callback(_objectSpread({}, res[0], res[1]));
    });
};
const isArray = function(param) {
    return Object.prototype.toString.call(param).slice(8, -1) === 'Array';
};
const isString = function(param) {
    return Object.prototype.toString.call(param).slice(8, -1) === 'String';
};
const isObject = function(param) {
    return Object.prototype.toString.call(param).slice(8, -1) === 'Object';
};
const transferDataWapper = function(datas) {
    (isObject(datas) ? [
        datas
    ] : datas || []).forEach((data)=>{
        let { head , body , bodys  } = data;
        head['bodys'] = apply({}, bodys || body || {});
        data['body'] = apply({}, bodys || body || {});
        data['bodys'] = apply({}, bodys || body || {});
    });
    return datas;
};
const onTransferItemSelectedWrapper = function(func) {
    const fetchDataUnWapper = function(datas) {
        ([
            datas
        ] || 0).forEach((data)=>{
            let { head , body , bodys  } = data;
            data['body'] = apply({}, body || head['bodys'] || bodys);
            data['bodys'] = apply({}, body || head['bodys'] || bodys);
        });
        return datas;
    };
    return function(record, isComplete, curActiveIndex, status) {
        func(fetchDataUnWapper(record), isComplete, curActiveIndex, status);
    };
};
const onTransferWrapper = function({ props , fetchList  }) {
    let { ncTabs  } = fetchList;
    let { tabPanes  } = ncTabs;
    let tables = (tabPanes || []).map((tabPane)=>{
        let { transferTable , headIdName , bodyIdName  } = tabPane;
        let { headTableId , bodyTableId , billType  } = transferTable;
        return {
            headTableId,
            bodyTableId,
            billType,
            headPkField: headIdName,
            bodyPkField: bodyIdName
        };
    });
    let data = props.transferTable.getTransferTableSelectedValue();
    let records = (tables || []).map((table)=>{
        let { headTableId , bodyTableId , billType , headPkField , bodyPkField  } = table;
        let transData = data[headTableId];
        let records = (transData || []).map((record)=>{
            let pk = record[headPkField] ? record[headPkField].value : record.head[headTableId].rows[0].values[headPkField].value;
            let ts = record["ts"] ? record["ts"].value : record.head[headTableId].rows[0].values["ts"].value;
            let children = record.body && bodyTableId && bodyTableId.length > 0 && record.body[bodyTableId] ? (record.body[bodyTableId].rows || []).map((row)=>{
                return {
                    pk: row.values[bodyPkField].value,
                    ts: row.values["ts"].value
                };
            }) : [];
            return {
                pk,
                ts,
                children
            };
        });
        return {
            billType,
            records
        };
    });
    return records;
};
//float类型数求和
const FloatAdd = function(arg1, arg2) {
    var r1, r2, m, s1 = arg1.toString(), s2 = arg2.toString();
    try {
        r1 = s1.split(".")[1].length;
    } catch (e) {
        r1 = 0;
    }
    try {
        r2 = s2.split(".")[1].length;
    } catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    return (arg1 * m + arg2 * m) / m;
};
//float类型数乘积
const FloatMultiple = function(f1, f2) {
    var m = 0, s1 = f1.toString(), s2 = f2.toString();
    try {
        m += s1.split(".")[1].length;
    } catch (e) {}
    try {
        m += s2.split(".")[1].length;
    } catch (e) {}
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
};
const Utils = {
    loadNCCResource,
    loadTemplate,
    loadLang,
    loadRefer,
    apply,
    transferDataWapper,
    onTransferItemSelectedWrapper,
    onTransferWrapper,
    FloatAdd,
    FloatMultiple
};

// EXTERNAL MODULE: external "uap/common/components/excelImportconfig/index"
var index_ = __webpack_require__(9845);
var index_default = /*#__PURE__*/__webpack_require__.n(index_);
// EXTERNAL MODULE: external "uap/common/components/ExcelOutput/index"
var ExcelOutput_index_ = __webpack_require__(9682);
var ExcelOutput_index_default = /*#__PURE__*/__webpack_require__.n(ExcelOutput_index_);
;// CONCATENATED MODULE: ./src/hpf/refer/hpfrefs/HpfEntryConfigGridRef/index.js
function HpfEntryConfigGridRef_defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function HpfEntryConfigGridRef_objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === 'function') {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            HpfEntryConfigGridRef_defineProperty(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _objectSpreadProps(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}

const { Refer  } = external_nc_lightapp_front_.high;
/* harmony default export */ function HpfEntryConfigGridRef(props = {}) {
    let conf = {
        multiLang: {
            domainName: 'hpf',
            currentLocale: 'zh-CN',
            moduleId: 'M0Z10103'
        },
        isCacheable: false,
        refType: 'grid',
        refName: '数据来源系统设置',
        /* 国际化处理： 参照名*/ placeholder: '数据来源系统设置',
        /* 国际化处理： 参照名*/ refCode: 'hpf/refer/hpfrefs/HpfEntryConfigGridRef/index',
        //不知道是什么意思
        queryGridUrl: '/nccloud/hpf/entryconfig/GridReferQuery.do',
        columnConfig: [
            {
                name: [
                    '来源系统编码',
                    '来源系统名称'
                ],
                code: [
                    'code',
                    'name'
                ]
            }
        ],
        /* 国际化处理： 编码,名称*/ isMultiSelectedEnabled: false,
        isHasDisabledData: false
    };
    return /*#__PURE__*/ React.createElement(Refer, _objectSpreadProps(HpfEntryConfigGridRef_objectSpread({}, Object.assign(conf, props)), {
        __source: {
            fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\refer\\hpfrefs\\HpfEntryConfigGridRef\\index.js",
            lineNumber: 23,
            columnNumber: 12
        },
        __self: this
    }));
}

;// CONCATENATED MODULE: ./src/hpf/hpfc/m0z10250/main/index.js
/****************************************************************************************************
 * 源代码介绍：
 * 1. 介绍
 *     此前端代码采用了单页应用写法，即所有功能在一个页面中，所以我们仅有一个前端文件(index.js) 这个前端文件表现节点
 * 的所有功能。大家可能会认为，代码写在了一起是不是很臃肿，代码很多很乱很长，其实不然，写在一起也是综合了各种因素权衡。
 * 主要权衡指标为：开发者前端基础、改写代码习惯和后端转前端的同学，尽量避免this指针，不用理解call调用，能用一种整齐
 * 划一的方式，让大家理解简单，上手方便。当你了解了代码的基本结构后你一定会觉得简单的不可思议。好处你一定会体会到。
 * 非常不建议在节点应用中使用现在的多页面模式方案。
 * 
 * 2. 必备知识
 * 2.1 react的运作模式
 *    模型模型驱动视图改变，视图被监听修改模型，再次驱动视图改变。这种单向变化解决了节点所有功能。
 *    模型模型驱动视图改变 -> 可以理解为视图在表现模型，在react中state变化了，会调用render方法重新渲染，即根据新模型重新画视图。
 *    视图被监听修改模型 -> 视图可以添加各种监听事件 (click, mourseMove)等事件处理时修改模型，模型变化驱动了视图重新表现。
 *    
 *        ————————>>——————  
 *        |               |
 *       模型(state)     视图(render)
 *        |               | 
 *        --------<<-------
 *        
 * 2.2 平台的高阶组件
 *    平台的高阶组件是 "props.组件.方法" 这种调用形式的组件，高阶组件最终底层还是 react 运作模式。
 *    需要掌握高阶组件API，平台的高阶组件会经常用到。
 * 
 * 3. 代码的基本结构
 *    代码中最核心3方法，分别是构造方法constructor方法，创建模型方法createState方法，渲染方法render方法。
 *    当然还有其他的定义，比如监听事件处理，按钮状态控制方法，但是当你掌握了这3个最核心的方法，你基本及掌握了整个
 *    页面的运作模式了。其他方法就一目了然了。
 * 
 * 3.1 constructor 
 *   	constructor的作用为构造当前页面对象。主要职责为：
 *   		1) 加载NC资源，如单据模板、按钮定义、修正模板的一些属性。
 *   		2) 调用创建模型方法createState方法，构建页面的结构(核心方法)
 *   		3) 保存和定义节点配置项，如节点编码，应用编码等。
 * 
 * 3.2 createState方法，render方法：
 *   createState方法为创建模型方法，了解createState对了解了解页面整体右至关重要的作用的。
 *   createState做了什么？ createState在根据页面的组件布置情况创建对应的结构性的模型，并且模型的结构与页面的结构
 *   保持一致，这样非常方便了理解页面的整体情况，也非常变量的操作模型。
 *   我们举个简单例子[列表卡片]节点：
 *   我们先简单说明下这个节点，这个节点包含了2个部分，一个是列表的部分，一个是卡片的部分，并给他们起名字：列表模式，卡片模式。
 *   显示列表模式时，不显示卡片模式，显示卡片模式时，不显示列表模式。
 *   功能为列表卡片来回切换，列表模式中包含一个查询区、一个列表区，卡片模式中包含一个表单区。
 *   下面我们来构建一个state:
 *    state = {
 *          showmode: 'list',    showmode表示为当前的显示模式，是列表模式，还是卡片模式，他可以有两个值 list,card分表表示
 *          list: {              列表模式的配置，包含查询区配置对象，表格区配置对象
 *             search:{          查询区配置
 *                  area: ''     查询区的区域编码，你在模板中定义的编码是什么它就是什么  
 *                  onSearch: fn 点击查询时候的处理函数
 *             },
 *             table:{           表格区配置
 *                  area: ''     表格区的区域编码，你在模板中定义的编码是什么他就是什么
 *                  onSelect: fn 点击选中时候的处理函数  
 *             }
 *          },
 *          card:{               卡片模式的配置，包含了表单区的配置对象
 *              form:{           表单区
 *                  area:''      表单区的区域编码，你在模板中定义的编码是什么他就是什么
 *                  onBeforeEdit:fn 表单编辑前的处理函数
 *              }
 *          } 
 *    }
 *    以上我们就构建一个state,从这个state中，我们可以看到我们页面的模型全貌。
 *    下面我们来看render方法：
 *    render方法的中，主要是渲染组件到页面，我们根据什么来渲染页面，根据上面构建的state模型来渲染。
 *    render = () =>{
 *          var renderList = () =>{ // 渲染列表模式的是的页面
 *          }
 *          var renderCard = () =>{ // 渲染卡片模式的是的页面
 *          }
 *    }
 *    我们应该怎么判断渲染的是列表 还是卡片呢，我们通过state.showmode来确定
 *    根据showmode的当前值的状态来判断是调用 renderList还是renderCard
 *    这样当我们重新设置模型的值(setState)就能够借助React的机制(见react的运作模式)驱动视图变化了(setState会驱动调用render)
 *    所以我们可以这样写：
 *     render = () =>{
 *          var renderList = () =>{ //渲染列表模式的是的页面，
 *          }
 *          var renderCard = () =>{ //渲染卡片模式的是的页面，
 *          }
 *          return this.state.showmode == 'list' ? renderList() : renderCard();
 *    }
 *    是不是非常简单，当我们要在列表和卡片模式中切换时，我们只需要 setState (showmode:'list'或者'card')
 *    就可以在列表和卡片间来回切换了，非常便利，再也不用什么缓存了，而且切换时也不需要加载什么模板，非常快捷。
 *       
 *    那么renderList方法里面是怎么写的呢，也非常简单，我们再看一下state里面list的定义
 *    我们就可以根据list里面的定义写renderList了，state结构和render结构保持了一致
 *          list: {             列表模式的配置，包含查询区配置对象，表格区配置对象
 *             search:{         查询区配置
 *                  area: ''    查询区的区域编码，你在模板中定义的编码是什么他就是什么  
 *                  onSearch:fn 点击查询时候的处理函数
 *             },
 *             table:{          表格区配置
 *                  area: ''    表格区的区域编码，你在模板中定义的编码是什么他就是什么
 *                  onSelect: fn 点击选中时候的处理函数  
 *             }
 *          },
 *    renderList方法内部写法例子
 *           var renderList = () =>{ //渲染列表模式的是的页面，
 *              var {search, table } = this.state.list; //我们解构list里面的两个模型对象，就是search查询区的配置，table表格配置
 *                 return <div>
 *                  {this.props.search.NCCreateSearch(search.area, search)}
 *                   {this.props.table.createSimpleTable(table.area, table)}
 *                </div>
 *          }
 *    这样我们的列表界面就做完了，很简单卡片模式也是和类似
 *    var renderCard = () =>{ // 渲染卡片模式的是的页面，
 *           var { form } = this.card; // 我们解构card里面的两个模型对象，就是search查询区的配置，table表格配置
 *          return <div>
 *                  {this.props.search.form(form.area, form)}
 *          </div>
 *    }
 * 
 *    现在我们看一下完整的例子代码，并进行一些总结：
 *    createState = () => {
 *      var state = {
 *          showmode: 'list',   showmode表示为当前的显示模式，是列表模式，还是卡片模式，他可以有两个值list,card分表表示
 *          list: {             列表模式的配置，包含查询区配置对象，表格区配置对象
 *             search:{         查询区配置
 *                  area: ''    查询区的区域编码，你在模板中定义的编码是什么他就是什么  
 *                  onSearch:fn 点击查询时候的处理函数
 *             },
 *             table:{          表格区配置
 *                  area: ''    表格区的区域编码，你在模板中定义的编码是什么他就是什么
 *                  onSelect: fn 点击选中时候的处理函数  
 *             }
 *          },
 *          card:{              卡片模式的配置，包含了表单区的配置对象
 *              form:{          表单区
 *                  area:''     表单区的区域编码，你在模板中定义的编码是什么他就是什么
 *                  onBeforeEdit:fn 表单编辑前的处理函数
 *              }
 *          } 
 *      }
 *    }
 *    render = () => {
 *          var renderList = () =>{ 
 *              var {search, table } = this.state.list; // 我们解构list里面的两个模型对象，就是search查询区的配置，table表格配置
 *                 return <div>
 *                  {this.props.search.NCCreateSearch(search.area, search)}
 *                  {this.props.table.createSimpleTable(table.area, table)}
 *                </div>
 *          }
 *          var renderCard = () =>{ 
 *               var { form } = this.card; // 我们解构card里面的两个模型对象，就是search查询区的配置table表格配置
 *                return <div>
 *                  {this.props.search.form(form.area, form)}
 *                </div>
 *          }
 *          return this.state.showmode == 'list' ? renderList() : renderCard();
 *    }
 *    
 *    总结：
 *      代码state和render渲染的模型结构上是一致，这样我们能很快构建我们的页面，并非常容易修改，
 *      我们只需要修改我们的模型，就可以操控我们的页面了， 渲染只是在表现我们的模型。
 ****************************************************************************************************/ function main_defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function main_objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === 'function') {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            main_defineProperty(target, key, source[key]);
        });
    }
    return target;
}
function main_ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function main_objectSpreadProps(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        main_ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}



// ============= 导入高阶组件区 ==============

// 导入导出相关



// 打印输出相关
const { PrintOutput  } = external_nc_lightapp_front_.high;
// ============= 导入基础组件区 ==============
const { NCDiv  } = external_nc_lightapp_front_.base;
// ============= 基本变量定义区 ==============
const main_EMPTY_FN = ()=>{};
// 空函数
const EDITMODE_ADD = 'add';
// 新增态
const EDITMODE_EDIT = 'edit';
// 编辑态
const EDITMODE_BROWSE = 'browse';
// 浏览态
// ============= 自定义常量区 ================
const FIELDS = {
    // 实体关键字段编码
    PRIMARYKEY: 'pk_transway'
};
// 主键
const ACTIONS = {
    // 按钮编码
    ADD: 'Add',
    // 新增
    EDIT: 'Edit',
    // 修改
    DELETE: 'Delete',
    // 删除
    SAVE: 'Save',
    // 保存
    CANCEL: 'Cancel',
    // 取消
    REFRESH: 'Refresh',
    // 刷新
    IMPORT: 'Import',
    // 导入
    EXPORT: 'Export',
    // 导出
    PRINT: 'Print',
    // 打印
    OUTPUT: 'Output',
    // 输出
    DOWN: 'Down'
};
// 下载 add by suqc
const URLS = {
    // 后台请求路径
    AddUrl: '/nccloud/hpf/transway/AddTransWayVOAction.do',
    // 新增时请求默认值 Action
    SaveUrl: '/nccloud/hpf/transway/SaveTransWayVOAction.do',
    // 保存 Action
    QueryUrl: '/nccloud/hpf/transway/ListTransWayVOAction.do',
    // 查询 Action
    printUrl: '/nccloud/hpf/transway/PrintTransWayVOAction.do',
    // 打印输出
    DownUrl: '/nccloud/hpf/transway/DownTranswayAction.do'
};
//下载 add by suqc
/**
 * 来源支付渠道档案节点
 * @author 代码生成工具
 * @version NCC2111
 */ let ApplicationPage = class ApplicationPage extends external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_.Component {
    /** 渲染方法 */ render() {
        if (!this.state.isPageReady) {
            return '';
        }
        // 页面信息未加载完不渲染页面
        /** 渲染单表应用页面 */ let renderList = ()=>{
            let { showmode , editmode , head , headBtn , search , table  } = this.state;
            return /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement("div", {
                className: "nc-single-table",
                __source: {
                    fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10250\\main\\index.js",
                    lineNumber: 507,
                    columnNumber: 17
                },
                __self: this
            }, /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement(NCDiv, {
                className: "nc-singleTable-header-area",
                areaCode: NCDiv.config.HEADER,
                __source: {
                    fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10250\\main\\index.js",
                    lineNumber: 508,
                    columnNumber: 21
                },
                __self: this
            }, /* 表格头部 */ /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement("div", {
                className: "header-title-search-area",
                __source: {
                    fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10250\\main\\index.js",
                    lineNumber: 510,
                    columnNumber: 25
                },
                __self: this
            }, this.props.BillHeadInfo.createBillHeadInfo(main_objectSpread({}, head))), /* 按钮区 */ /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement("div", {
                className: "header-button-area",
                __source: {
                    fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10250\\main\\index.js",
                    lineNumber: 514,
                    columnNumber: 25
                },
                __self: this
            }, this.props.button.createButtonApp(main_objectSpread({}, headBtn)))), /* 查询区 (浏览态显示)*/ editmode == EDITMODE_BROWSE && /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement("div", {
                className: "nc-singleTable-search-area",
                __source: {
                    fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10250\\main\\index.js",
                    lineNumber: 520,
                    columnNumber: 53
                },
                __self: this
            }, this.props.search.NCCreateSearch(search.area, main_objectSpread({}, search))), /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement("div", {
                className: "nc-singleTable-table-area",
                __source: {
                    fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10250\\main\\index.js",
                    lineNumber: 524,
                    columnNumber: 21
                },
                __self: this
            }, " ", /* 列表区 */ this.props.editTable.createEditTable(table.area, main_objectSpread({}, table))));
        };
        /** 渲染打印输出组件 */ let renderPrintOutput = ()=>{
            let { printOutput  } = this.state;
            return /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement("div", {
                __source: {
                    fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10250\\main\\index.js",
                    lineNumber: 535,
                    columnNumber: 17
                },
                __self: this
            }, /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement(PrintOutput, main_objectSpreadProps(main_objectSpread({}, printOutput), {
                __source: {
                    fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10250\\main\\index.js",
                    lineNumber: 536,
                    columnNumber: 21
                },
                __self: this
            })), " ");
        };
        /* 打印输出 */ /** 渲染Excel导出导出组件 */ let renderExcelOutput = ()=>{
            let { excelOutput  } = this.state;
            return /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement("div", {
                __source: {
                    fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10250\\main\\index.js",
                    lineNumber: 545,
                    columnNumber: 17
                },
                __self: this
            }, /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement((ExcelOutput_index_default()), main_objectSpreadProps(main_objectSpread({}, Object.assign(this.props), excelOutput), {
                __source: {
                    fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10250\\main\\index.js",
                    lineNumber: 546,
                    columnNumber: 21
                },
                __self: this
            })), " ");
        };
        /* Excel 导入导出 */ return /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement("div", {
            __source: {
                fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10250\\main\\index.js",
                lineNumber: 552,
                columnNumber: 13
            },
            __self: this
        }, renderList(), renderPrintOutput(), renderExcelOutput(), this.props.modal.createModal('selds', {
            title: '选择来源系统',
            className: 'selds',
            content: /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement("div", {
                __source: {
                    fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10250\\main\\index.js",
                    lineNumber: 560,
                    columnNumber: 25
                },
                __self: this
            }, /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement(HpfEntryConfigGridRef, {
                value: this.state.dbinfo,
                isMultiSelectedEnabled: false,
                queryCondition: (v)=>({
                        pk_org: this.state.pk_org
                    }),
                onChange: (v)=>{
                    this.setState({
                        dbinfo: v
                    });
                },
                __source: {
                    fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10250\\main\\index.js",
                    lineNumber: 561,
                    columnNumber: 29
                },
                __self: this
            })),
            beSureBtnClick: this.beSureBtnClick,
            cancelBtnClick: this.cancelBtnClick,
            size: 'sm'
        }));
    }
    /**
     * 构造方法：js要求的必须方法，构造整个页面对象
     * 此方法构造时，会定义全局配置，this.config,方便其他方法取用
     * 同时，也处理了加载模板，按钮，设置模板按钮功能，最终通过调用
     * pageReady(此方法可以加入你的业务逻辑)完成第一次页面数据加载
     * 此方法中，会调用initButton,initMeta 来初始化模板和按钮
     * initButton,initMeta,pageReady 仅在页面打开时调用一次
     * 其他时候不再调用
     * @param {*} props
     */ constructor(props){
        super(props);
        /**
     * pageReady方法为页面已经完全设置完毕
     * 可以做一些初始的功能，比如：查询列表数据
     */ main_defineProperty(this, "pageReady", ()=>{
            // 加载表格数据  -> 将数据设置到表格上  -> 更新按钮状态
            this.loadTableData((data)=>this.setTableData(data, this.updateBtnStatus));
        });
        /**
     * 初始化平台定义的单据模板
     * 触发时机：执行loadNCCResource,加载完模板、多语、等初始化信息之后触发
     * 功能：对加载完的模板进行个性化调整
     * 可实现举例功能:
     * 1.参照表单联动过滤：参见[Demo1]
     * 2.处理表格操作列：参见[Demo2]
     * @param {*} meta 
     */ main_defineProperty(this, "initMeta", (meta)=>{
            // sagas 开头的字段全部隐藏
            meta[this.state.table.area].items.filter((item)=>{
                if (item.attrcode.startsWith('sagas')) {
                    item.visible = false;
                    item.disabled = true;
                }
            });
            /*
         * Demo[1]参照过滤
         * 场景描述： 表单上同时有部门、组织两个字段，部门受组织过滤，部门选择时，受到选择的组织进行部门参照过滤。
         * 达成效果： 组织不选时，部门加载全部；组织选择，部门加载的数据时该组织下的部门。
         * 写法解释： 见下面代码注释
         * 代码示例:
         */ // 主组织权限过滤 : 加载的是当前登录人有权限的组织
            meta[this.state.table.area].items.find((item)=>{
                if (item.attrcode == "pk_org") {
                    item.queryCondition = ()=>({
                            // 参照过滤条件
                            AppCode: this.config.appcode,
                            TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
                        });
                }
            });
            // 组织权限过滤自定义SqlBuilder类全名
            //add by suqc
            meta[this.state.search.area].items.find((item)=>{
                if (item.attrcode == "pk_org") {
                    item.queryCondition = ()=>({
                            // 参照过滤条件
                            AppCode: this.config.appcode,
                            TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
                        });
                }
                // 组织权限过滤自定义SqlBuilder类全名
                if (item.attrcode === 'syscode') {
                    //来源系统过滤
                    item.queryCondition = ()=>({
                            pk_org: this.state.pk_org
                        });
                }
            });
            /**
         * Demo[2]处理表格操作列
         * 场景描述： 高阶组件simpleTable或者cardTable需要追加操作列
         * 达成效果： simpleTable或者cardTable, 增加操作列，操作列中包含一些定义的按钮
         * 写法解释： 见代码注释
         * 代码示例:
         */ let operation_column = {
                // 表格操作列
                key: 'opr',
                // 操作列 key
                attrcode: 'opr',
                // 操作列编码
                label: '操作',
                // 操作列名称
                visible: true,
                fixed: 'right',
                // 固定到右侧
                itemtype: 'customer',
                render: (text, record, index)=>{
                    let btns = [
                        ACTIONS.DELETE
                    ];
                    // 行按钮
                    // 渲染操作列按钮
                    return this.props.button.createOprationButton(btns, {
                        area: 'table_inner',
                        // 表体行按钮区域编码
                        buttonLimit: 3,
                        onButtonClick: (props, id)=>this.onButtonClick(props, id, record, index)
                    });
                }
            };
            // 表体行按钮点击事件
            let tableid = this.state.table.area;
            //meta[tableid].items.push(operation_column); // 操作列添加到表格中
            return meta;
        });
        /**
     * 初始化平台定义的按钮
     * 功能：对加载完的按钮进行个性化调整
     * @param button
     */ main_defineProperty(this, "initButton", (button)=>{
            // 表头common区注册的按钮复制一份并修改区域编码，当作表体行按钮用。应用注册不用再注册一份。
            let tableBtns = JSON.parse(JSON.stringify(button.filter((btn)=>btn.area == 'common')));
            tableBtns.forEach((btn)=>btn.area = 'table_inner');
            return [
                ...button,
                ...tableBtns
            ];
        });
        /**
     * 创建state模型
     * state的模型结构于页面结构是一致的，请优先阅读开头的说明 3.2 createState方法，render方法
     * state中得必有并且常用得属性
     * isPageReady: 页面是否可以进行渲染，构造函数会异步请求模板，所以构造函数执行完成后
     *              React在构造函数执行完后会立即调用render方法渲染页面，此时可能模板还没有加载完成
     *              所以通过此属来标记模板等初始化数据是否加载完成。加载完成后 isPageReady=true
     *              才开始正式得渲染页面，参考render方法这种对isPageReady的使用。
     * showmode：   页面当前的显示模型，SHOWMODE为前缀的常量定义，你的应用有几个页面的，就有几个SHOWMODE的常量定义
     *              分别对应不同页面，比如：主从页面中(不带插件) 有列表和卡片两个页面，则会使用到SHOWMODE_LIST
     *              SHOWMODE_CARD, render方法的中根据showmode值，来具体渲染页面。
     * editmode:    页面当前编辑模式，有两种状态，EDITMODE为前传的常量定义EDITMODE_BROWSE,EDITMODE_EDIT;
     *              高阶组件的中的编辑状态与它保持一致的。当设置或改变editmode时高阶组件的状态也要随之变化如 form formlist
     * 模型结构定义说明：建议优先阅读开头的说明3.2 createState方法，render方法
     */ main_defineProperty(this, "createState", ()=>{
            let state = {
                //add by suqc
                pk_org: '',
                dbinfo: {},
                isPageReady: false,
                // 页面信息（模板、按钮）是否加载完
                editmode: EDITMODE_BROWSE,
                // 页面状态，默认浏览态
                head: {
                    // 表头区域
                    initShowBackBtn: false,
                    // 是否显示返回按钮
                    title: this.config.title
                },
                // 单据标题
                headBtn: {
                    // 表头按钮区域
                    area: 'common',
                    // 按钮区域编码
                    buttonLimit: 3,
                    onButtonClick: this.onButtonClick
                },
                // 按钮点击事件
                search: {
                    // 查询区
                    area: 'TransWayVO_query',
                    // 查询区域编码
                    showSearchBtn: false,
                    showClearBtn: false,
                    showAdvBtn: false,
                    showAdvSearchPlanBtn: false,
                    //add by suqc
                    onAfterEvent: this.onSearchAfterEvent
                },
                // clickSearchBtn: () => { // 查询按钮事件
                //     this.loadTableData((data) => { // 加载表格数据
                //         this.setTableData(data, this.updateBtnStatus); // 设置表格数据并更新按钮状态
                //         let tableid = this.state.table.area;
                //         let length = data && data[tableid] && data[tableid].rows && data[tableid].rows.length || 0; // 查到单据个数
                //         toast({ // 点击查询按钮提示语
                //             color: length > 0 ? 'success' : 'warning',
                //             content: length > 0 ? ('查询成功，共' + length + '条') : '未查询到符合条件的数据'
                //         });
                //     });
                // }
                table: {
                    // 表格区域
                    area: 'TransWayVO_table',
                    // 表格区域编码
                    useFixedHeader: true,
                    adaptionHeight: true,
                    // 自动托底
                    showIndex: true,
                    // 显示序号
                    showCheck: true,
                    // 显示复选框
                    showPagination: true,
                    // 显示分页器
                    onSelected: this.onSelected,
                    // 选中行事件
                    onSelectedAll: this.onSelectedAll,
                    // 选中所有行事件
                    onBeforeEvent: this.onBeforeEvent,
                    // 编辑前事件
                    onAfterEvent: this.onAfterEvent,
                    // 编辑后事件
                    handlePageInfoChange: ()=>{
                        // 页器操作的回调函数
                        // 加载表格数据  -> 将数据设置到表格上  -> 更新按钮状态
                        this.loadTableData((data)=>this.setTableData(data, this.updateBtnStatus));
                    }
                }
            };
            // 打印输出相关
            Utils.apply(state, {
                printOutput: {
                    ref: 'printOutput',
                    url: URLS.printUrl,
                    data: {
                        funcode: this.config.appcode,
                        // 应用编码
                        oids: [],
                        nodekey: 'M0Z1025001',
                        // 输出模板设置中的应用标识
                        outputType: 'output'
                    }
                }
            });
            // 导入导出相关
            Utils.apply(state, {
                excelOutput: {
                    moduleName: this.config.moduleName,
                    // 模块编码
                    billType: 'TRANSWAYVO_M0Z10250',
                    // Excel导入导出XML文件名
                    selectedPKS: [],
                    // 导出单据的主键
                    appcode: this.config.appcode,
                    // 应用编码
                    pagecode: this.config.pagecode
                }
            });
            // 页面编码
            return state;
        });
        //add by suqc
        main_defineProperty(this, "beSureBtnClick", ()=>{
            let { dbinfo , search , table  } = this.state;
            if (dbinfo == null || Object.keys(dbinfo).length == 0) {
                (0,external_nc_lightapp_front_.toast)({
                    color: 'warning',
                    title: "来源系统不能为空!"
                });
                /* 国际化处理： 下载成功*/ return;
            }
            (0,external_nc_lightapp_front_.ajax)({
                url: URLS.DownUrl,
                data: {
                    ref1: dbinfo
                },
                async: false,
                success: (res)=>{
                    let { success , data  } = res;
                    //填充数据
                    if (success) {
                        (0,external_nc_lightapp_front_.toast)({
                            color: 'success',
                            title: data
                        });
                    } else /* 国际化处理： 下载成功*/ {
                        (0,external_nc_lightapp_front_.toast)({
                            color: 'success',
                            title: "下载失败"
                        });
                    }
                    this.props.modal.close('selds');
                }
            });
            this.loadTableData((data)=>this.setTableData(data, this.updateBtnStatus));
        });
        // 重新加载数据
        //add by suqc
        main_defineProperty(this, "cancelBtnClick", ()=>{
            this.setState({
                pk_entryconfig: ''
            });
        });
        // ============= 功能性方法区 =============
        // 职责单一的方法写在这里。多个功能方法可以组装成流程方法，实现某种业务操作。
        // 如：流程方法【查询表格数据】由【加载表格数据】【填充表格数据】等两个职责单一的方法组装而成。
        // 职责单一的目的：1.更好的复用代码。 2.避免改 BUG 修改代码影响其他业务逻辑，改出其他的 BUG。
        /**
     * 设置页面状态
     * 1. state 中维护当前页面状态  2.设置表格状态
     */ main_defineProperty(this, "setPageStatus", (editmode = EDITMODE_BROWSE, callback = main_EMPTY_FN)=>{
            let tableid = this.state.table.area;
            this.setState({
                editmode
            }, ()=>this.props.editTable.setStatus(tableid, editmode, callback));
        });
        /**
     * 按钮状态控制
     */ main_defineProperty(this, "updateBtnStatus", ()=>{
            let isEdit = this.state.editmode == EDITMODE_EDIT;
            // 编辑态
            let isBrowse = this.state.editmode == EDITMODE_BROWSE;
            // 浏览态
            // 按钮显隐性控制  add by suqc
            this.props.button.setButtonsVisible({
                [ACTIONS.ADD]: false,
                [ACTIONS.DELETE]: false,
                [ACTIONS.EDIT]: false,
                [ACTIONS.SAVE]: false,
                [ACTIONS.CANCEL]: false,
                [ACTIONS.REFRESH]: true,
                [ACTIONS.IMPORT]: false,
                [ACTIONS.EXPORT]: false,
                [ACTIONS.PRINT]: false,
                [ACTIONS.OUTPUT]: false,
                [ACTIONS.DOWN]: true
            });
            let tableid = this.state.table.area;
            let selectedRows = this.props.editTable.getCheckedRows(tableid);
            let selectedCount = selectedRows ? selectedRows.length : 0;
            // 选中单据个数
            // 按钮禁用控制
            // this.props.button.setDisabled({
            // 	[ACTIONS.DELETE]: selectedCount == 0,
            //     [ACTIONS.PRINT]: selectedCount == 0,
            //     [ACTIONS.OUTPUT]: selectedCount == 0,
            // });
            // 主按钮设置
            // this.props.button.setMainButton(ACTIONS.ADD, isBrowse);
            // this.props.button.setMainButton(ACTIONS.SAVE, isEdit);
            this.props.button.setMainButton(ACTIONS.DOWN, true);
        });
        // 表格行内按钮提示语设置
        // let content = isBrowse ? '确定要删除？' : '';
        // this.props.button.setPopContent(ACTIONS.DELETE, content);
        /**
     * 加载表格数据
     * @param callback 回调函数
     */ main_defineProperty(this, "loadTableData", (callback = main_EMPTY_FN)=>{
            let { search , table  } = this.state;
            let queryInfo = this.props.search.getQueryInfo(search.area, false);
            // 查询条件    
            let pageInfo = this.props.editTable.getTablePageInfo(table.area);
            // 页面分页信息
            if (!queryInfo.querycondition || queryInfo.querycondition.conditions.length == 0) {
                callback(undefined);
                return;
            }
            (0,external_nc_lightapp_front_.ajax)({
                url: URLS.QueryUrl,
                data: {
                    appcode: this.config.appcode,
                    pageCode: this.props.pagecode,
                    formId: table.area,
                    queryTreeFormatVO: main_objectSpreadProps(main_objectSpread({}, queryInfo), {
                        pageCode: this.config.pagecode
                    }),
                    pageInfo
                },
                success: (res)=>callback(res.data && res.data.data || undefined)
            });
        });
        // 搜索框编辑后之间 add by suqc
        main_defineProperty(this, "onSearchAfterEvent", (field, val)=>{
            let { search , table  } = this.state;
            let data = this.props.search.getAllSearchData(search.area);
            if (data && data.conditions.length != 0) {
                let pk_org = this.props.search.getSearchValByField(search.area, 'pk_org');
                if (pk_org && pk_org.value && pk_org.value.firstvalue) {
                    let value = pk_org.value.firstvalue;
                    this.setState({
                        dbinfo: {},
                        pk_org: value
                    });
                }
                this.loadTableData((data)=>this.setTableData(data, this.updateBtnStatus));
            } else // 重新加载数据
            {
                this.setState({
                    pk_org: ''
                });
                this.props.editTable.setTableData(table.area, {
                    rows: []
                }, false);
            }
        });
        /**
     * 设置表格数据
     * @param data 表格数据
     * @param callback 回调函数
     */ main_defineProperty(this, "setTableData", (data, callback = main_EMPTY_FN)=>{
            let tableid = this.state.table.area;
            let tableData = data && data[tableid] ? data[tableid] : {
                rows: []
            };
            // 表格数据
            // 只有在显示第一页的时候设置pageInfo，翻页到其他页面时只更新表格行数据，不再更新pageInfo
            let pageIndex = tableData.pageInfo && tableData.pageInfo.pageIndex;
            tableData = pageIndex == 0 ? tableData : {
                rows: tableData.rows
            };
            this.props.editTable.setTableData(tableid, tableData);
            // 设置表格数据
            callback();
        });
        // 执行回调函数
        /**
     * 加载新增行默认值
     * @param callback 回调函数
     */ main_defineProperty(this, "loadAddLineDefaultValue", (callback = main_EMPTY_FN)=>{
            let tableid = this.state.table.area;
            let data = {
                // 获取新增行默认值请求参数
                formId: this.state.table.area,
                pageCode: this.config.pagecode,
                // 工具生成的代码，所有节点保存参数统一按照一主多子的结构处理。单表的数据也要封装成一主多子的结构。
                billCard: {
                    pageid: this.config.pagecode,
                    bodys: {
                        [tableid]: {
                            areaType: "table",
                            areacode: tableid,
                            pageinfo: null,
                            rows: [
                                {
                                    values: {}
                                }
                            ]
                        }
                    }
                }
            };
            (0,external_nc_lightapp_front_.ajax)({
                // 请求后台获取默认值
                url: URLS.AddUrl,
                data,
                success: (res)=>callback(res.data && res.data.data || undefined)
            });
        });
        // =============操作流程方法区=============
        /**
     * 按钮事件
     * @param props 当前组件props
     * @param btncode 当前点击按钮编码
     * @param record 当前行数据（如果点击的是表格行按钮）
     * @param index 当前行下标（如果点击的是表格行按钮）
     */ main_defineProperty(this, "onButtonClick", (props, btncode, record, index)=>{
            switch(btncode){
                case ACTIONS.ADD:
                    // 新增
                    this.onAdd();
                    break;
                case ACTIONS.EDIT:
                    // 编辑
                    this.onEdit();
                    break;
                case ACTIONS.DELETE:
                    // 删除
                    record ? this.onRowDelete(record, index) : this.onDelete();
                    break;
                case ACTIONS.SAVE:
                    // 保存
                    this.onSave();
                    break;
                case ACTIONS.CANCEL:
                    // 取消
                    this.onCancel();
                    break;
                case ACTIONS.REFRESH:
                    // 刷新
                    this.onRefresh();
                    break;
                case ACTIONS.PRINT:
                    // 附件
                    this.onPrint();
                    break;
                case ACTIONS.OUTPUT:
                    // 输出
                    this.onOutPut();
                    break;
                case ACTIONS.IMPORT:
                    break;
                case ACTIONS.EXPORT:
                    // 导出
                    this.onExport();
                    break;
                case ACTIONS.DOWN:
                    // 下载 add by suqc
                    this.onDown();
                    break;
                default:
                    break;
            }
        });
        /**
     * 新增按钮点击事件
     */ main_defineProperty(this, "onAdd", ()=>{
            this.loadAddLineDefaultValue((data)=>{
                // 加载新增行默认值，传到回调函数的参数data中
                this.setPageStatus(EDITMODE_EDIT, ()=>{
                    // 设置页面状态
                    let tableid = this.state.table.area;
                    let num = this.props.editTable.getNumberOfRows(tableid);
                    // 表格当前行数
                    // 后台返回的默认值
                    let rowValues = data.head[tableid].rows.length > 0 && data.head[tableid].rows[0].values || {};
                    // 过滤掉空属性
                    let defaultValue = {};
                    Object.getOwnPropertyNames(rowValues).forEach((attr)=>{
                        rowValues[attr].value && (defaultValue[attr] = rowValues[attr]);
                    });
                    this.props.editTable.addRow(tableid, num, true, defaultValue);
                    // 增一行
                    this.updateBtnStatus();
                });
            });
        });
        // 更新按钮状态
        /**
     * 修改按钮点击事件
     * 功能描述：页面状态设置为编辑态，并更新按钮状态
     */ main_defineProperty(this, "onEdit", ()=>this.setPageStatus(EDITMODE_EDIT, this.updateBtnStatus));
        /**
     * 删除按钮点击事件
     */ main_defineProperty(this, "onDelete", ()=>{
            let tableid = this.state.table.area;
            let selectedData = this.props.editTable.getCheckedRows(tableid);
            // 选中数据
            if (selectedData.length == 0) {
                return;
            }
            // 如果没有选中直接返回
            // 编辑态-删除：只是从页面上移除数据，保存时再调后台接口去删除
            if (this.state.editmode == EDITMODE_EDIT) {
                let indexArray = selectedData.map((d)=>d.index);
                this.props.editTable.deleteTableRowsByIndex(tableid, indexArray);
                // 根据下标index删除表格行
                this.updateBtnStatus();
                // 更新按钮状态
                return;
            }
            let rows = selectedData.map((row)=>// 封装删除行数据
                ({
                    rowId: row.data.rowId,
                    status: '3',
                    values: {
                        ts: {
                            value: row.data.values.ts.value
                        },
                        [FIELDS.PRIMARYKEY]: {
                            value: row.data.values[FIELDS.PRIMARYKEY].value
                        }
                    }
                }));
            let data = {
                // 删除请求提交参数（跟保存一致）
                formId: tableid,
                pageCode: this.config.pagecode,
                // 工具生成的代码，所有节点保存参数统一按照一主多子的结构处理。单表的数据也要封装成一主多子的结构。
                billCard: {
                    pageid: this.config.pagecode,
                    bodys: {
                        [tableid]: {
                            areaType: "table",
                            areacode: tableid,
                            pageinfo: null,
                            rows: rows || []
                        }
                    }
                }
            };
            (0,external_nc_lightapp_front_.promptBox)({
                color: 'warning',
                title: '删除',
                content: '确定要删除吗？',
                noFooter: false,
                noCancelBtn: false,
                beSureBtnName: '确定',
                cancelBtnName: '取消',
                beSureBtnClick: ()=>{
                    // 确认按钮回调事件
                    this.delete(data, (responseData)=>{
                        (0,external_nc_lightapp_front_.toast)({
                            color: 'success',
                            content: '删除成功'
                        });
                        this.loadTableData((data)=>this.setTableData(data, this.updateBtnStatus));
                    });
                }
            });
        });
        // 重新加载数据
        /**
     * 表体行删除
     * @param record 当前删除行数据
     * @param index 当前删除行下标
     */ main_defineProperty(this, "onRowDelete", (record, index)=>{
            let tableid = this.state.table.area;
            if (this.state.editmode == EDITMODE_EDIT) {
                // 编辑态删除
                this.props.editTable.deleteTableRowsByIndex(tableid, index);
                // 根据下标index删除表格行
                return;
            }
            let row = {
                // 删除行数据
                rowId: index,
                status: '3',
                values: {
                    ts: {
                        value: record.values.ts.value
                    },
                    [FIELDS.PRIMARYKEY]: {
                        value: record.values[FIELDS.PRIMARYKEY].value
                    }
                }
            };
            let data = {
                // 删除请求提交参数（跟保存一致）
                formId: tableid,
                pageCode: this.config.pagecode,
                // 工具生成的代码，所有节点保存参数统一按照一主多子的结构处理。单表的数据也要封装成一主多子的结构。
                billCard: {
                    pageid: this.config.pagecode,
                    bodys: {
                        [tableid]: {
                            areaType: "table",
                            areacode: tableid,
                            pageinfo: null,
                            rows: [
                                row
                            ]
                        }
                    }
                }
            };
            this.delete(data, (responseData)=>{
                // 调用后端接口删除数据
                (0,external_nc_lightapp_front_.toast)({
                    color: 'success',
                    content: '删除成功'
                });
                // 删除提示语
                this.loadTableData((data)=>this.setTableData(data, this.updateBtnStatus));
            });
        });
        // 重新加载数据
        /**
     * 删除请求
     * @param data 删除请求参数
     * @param callback 回调函数
     */ main_defineProperty(this, "delete", (data, callback = main_EMPTY_FN)=>{
            (0,external_nc_lightapp_front_.ajax)({
                url: URLS.SaveUrl,
                data,
                success: (res)=>callback(res.data && res.data.data || undefined)
            });
        });
        /**
     * 保存按钮点击事件
     */ main_defineProperty(this, "onSave", ()=>{
            // 自动过滤空行，根据节点业务确定是否过滤
            // this.props.editTable.filterEmptyRows(TABLEID,['字段编码1','字段编码1']);
            // 处理有变动的行数据
            let tableid = this.state.table.area;
            let changedRows = this.props.editTable.getChangedRows(tableid);
            if (!changedRows || changedRows.length == 0) {
                this.setPageStatus(EDITMODE_BROWSE, ()=>{
                    this.loadTableData((data)=>this.setTableData(data, this.updateBtnStatus));
                });
                // 重新加载数据
                return;
            }
            // 必输项校验
            let allRows = this.props.editTable.getAllRows(tableid, true);
            if (!this.props.editTable.checkRequired(tableid, allRows)) {
                return;
            }
            let data = {
                // 保存请求提交参数
                formId: tableid,
                pageCode: this.config.pagecode,
                // 工具生成的代码，所有节点保存参数统一按照一主多子的结构处理。单表的数据也要封装成一主多子的结构。
                billCard: {
                    pageid: this.config.pagecode,
                    bodys: {
                        [tableid]: {
                            areaType: "table",
                            areacode: tableid,
                            pageinfo: null,
                            rows: allRows || []
                        }
                    }
                }
            };
            let save = ()=>{
                // 保存请求
                (0,external_nc_lightapp_front_.ajax)({
                    url: URLS.SaveUrl,
                    data,
                    success: (res)=>{
                        (0,external_nc_lightapp_front_.toast)({
                            color: 'success',
                            content: '保存成功'
                        });
                        this.setPageStatus(EDITMODE_BROWSE, ()=>{
                            this.loadTableData((data)=>this.setTableData(data, this.updateBtnStatus));
                        });
                    }
                });
            };
            // 重新加载数据
            // 执行公式并保存
            this.props.validateToSave(data.billCard.bodys, save, {
                [tableid]: 'table'
            }, 'grid');
        });
        /**
     * 取消
     */ main_defineProperty(this, "onCancel", ()=>{
            (0,external_nc_lightapp_front_.promptBox)({
                // 取消操作提示框
                color: 'warning',
                title: '取消',
                content: '确定要取消吗？',
                noFooter: false,
                noCancelBtn: false,
                beSureBtnName: '确定',
                cancelBtnName: '取消',
                beSureBtnClick: ()=>{
                    this.setPageStatus(EDITMODE_BROWSE, ()=>{
                        // 设置页面状态
                        this.loadTableData((data)=>this.setTableData(data, this.updateBtnStatus));
                    });
                }
            });
        });
        // 重新加载数据
        /**
     * 刷新
     */ main_defineProperty(this, "onRefresh", ()=>{
            this.loadTableData((data)=>this.setTableData(data, this.updateBtnStatus));
            // 重新加载数据
            (0,external_nc_lightapp_front_.toast)({
                color: 'success',
                content: '刷新成功'
            });
        });
        /** 打印 */ main_defineProperty(this, "onPrint", ()=>{
            let selectedRows = this.props.editTable.getCheckedRows(this.state.table.area) || [];
            // 选中行数据
            // 获取选中数据的pk
            let pks = selectedRows.length > 0 && selectedRows.map((row)=>row.data.values[FIELDS.PRIMARYKEY].value);
            // 单据主键
            (0,external_nc_lightapp_front_.print)('pdf', URLS.printUrl, {
                funcode: this.config.appcode,
                nodekey: this.state.printOutput.data.nodekey,
                oids: pks
            });
        });
        /** 输出 */ main_defineProperty(this, "onOutPut", ()=>{
            let selectedRows = this.props.editTable.getCheckedRows(this.state.table.area) || [];
            // 选中行
            let pks = selectedRows.map((row)=>row.data.values[FIELDS.PRIMARYKEY].value);
            // 单据主键
            this.state.printOutput.data.oids = pks;
            this.setState(this.state, ()=>{
                this.refs.printOutput.open();
            });
        });
        /** 导出 */ main_defineProperty(this, "onExport", ()=>{
            let selectedRows = this.props.editTable.getCheckedRows(this.state.table.area) || [];
            // 选中行
            let pks = selectedRows.map((row)=>row.data.values[FIELDS.PRIMARYKEY].value);
            // 导出单据主键
            this.state.excelOutput.selectedPKS = pks;
            this.setState(this.state, ()=>this.props.modal.show('exportFileModal'));
        });
        // 显示Excel导出弹框
        main_defineProperty(this, "onDown", ()=>{
            this.props.modal.show('selds');
        });
        /** 选中行事件 */ main_defineProperty(this, "onSelected", ()=>{
            this.updateBtnStatus();
        });
        // 选中行后重新设置按钮状态
        /** 选中所有行事件 */ main_defineProperty(this, "onSelectedAll", ()=>{
            this.updateBtnStatus();
        });
        // 选中所有行后重新设置按钮状态
        /**
     * 编辑前事件
     * @param props
     * @param moduleId 区域id
     * @param item 模版当前列的项
     * @param index 当前行index
     * @param value 当前值
     * @param record 行数据
     */ main_defineProperty(this, "onBeforeEvent", (props, moduleId, item, index, value, record)=>// 编辑前事件使用案例: 参照过滤。如：交易类型要根据单据类型编码过滤
            // if (item.attrcode == FIELDS.TRANSTYPEPK) { // 交易类型PK
            //     let meta = props.meta.getMeta();
            //     meta[this.state.table.area].items.forEach(item => {
            //         if (item.attrcode == FIELDS.TRANSTYPEPK) {
            //             item.queryCondition = () => {
            //                 return { parentbilltype: this.config.billType }
            //             }
            //         }
            //     });
            //     this.props.meta.setMeta(meta);
            //     return true;
            // }
            true);
        /**
     * 编辑后事件
     * @param props
     * @param moduleId 区域id
     * @param key 操作字段的编码
     * @param value 当前值
     * @param changedrows 新旧值集合
     * @param index 当前行index
     * @param record 行数据
     */ main_defineProperty(this, "onAfterEvent", (props, moduleId, key, value, changedrows, index, record)=>{
            switch(key){
                // 编辑后事件使用案例
                case '编辑字段编码':
                    break;
                default:
                    break;
            }
        });
        /**
         * 节点全局变量定义
         * 包含页面编码、应用编码、标题、模块名等
         */ this.config = {
            domainName: 'hpf',
            // 模块域名
            moduleName: 'hpf',
            // 模块编码
            title: props.getSearchParam('n') || '来源支付渠道档案',
            // 标题
            appcode: props.getSearchParam('c') || 'appcode未定义',
            // 应用编码
            pagecode: props.getSearchParam('p') || 'pagecode未定义'
        };
        // 页面编码
        /**
         * 创建state模型
         * state中定义的数据模型跟render()方法中的组件一一对应
         */ this.state = this.createState();
        /**
         * 适配版本变化：2105及其以后版本需要注册组件，之前版本不需要
         */ this.props.use.search('TransWayVO_query');
        this.props.use.editTable('TransWayVO_table');
        /**
         * 加载NCC资源
         * 1.包含单据模板、按钮等平台定义的资源
         * 2.加载多语资源文件
         * 3.加载需要在代码总用到参照js
         */ Utils.loadNCCResource(main_objectSpreadProps(main_objectSpread({
            props
        }, this.config), {
            moduleId: this.config.appcode,
            // 多语模块
            domainName: this.config.domainName,
            // 多语文件名
            callback: (data)=>{
                let { context , template , button , lang , refer ={}  } = data;
                //把默认得主组织放在state中 add by suqc
                if (context.pk_org) {
                    this.setState({
                        pk_org: context.pk_org
                    });
                }
                let meta = this.initMeta(template);
                // 修改后的模板
                let buttons = this.initButton(button);
                // 修改后的按钮
                Promise.all([
                    new Promise((resolve)=>this.props.meta.setMeta(meta, ()=>resolve(true))),
                    // 设置模板
                    new Promise((resolve)=>this.props.button.setButtons(buttons, ()=>resolve(true)))
                ]).// 设置按钮
                then(()=>{
                    this.setState({
                        isPageReady: true
                    }, ()=>{
                        // 导入按钮适配
                        let { moduleName , appcode , pagecode  } = this.config;
                        let billType = this.state.excelOutput.billType;
                        let excelimportconfig = index_default()(this.props, moduleName, billType, true, '', {
                            appcode,
                            pagecode
                        }, ()=>{
                            this.loadTableData((data)=>this.setTableData(data, this.updateBtnStatus));
                        });
                        // 导入后重新加载数据
                        this.props.button.setUploadConfig(ACTIONS.IMPORT, excelimportconfig);
                        this.updateBtnStatus();
                        // 更新按钮状态
                        this.pageReady();
                    });
                }).// 页面信息加载完后加载表格数据
                catch((e)=>{
                    throw new ReferenceError(e);
                });
            }
        }));
    }
};
ApplicationPage = (0,external_nc_lightapp_front_.createPage)({
    initTemplate: {},
    billinfo: {
        billtype: 'grid',
        pagecode: 'M0Z10250_TransWayVO',
        bodycode: 'TransWayVO_table'
    },
    mutiLangCode: 'M0Z10250'
})(ApplicationPage);
external_root_ReactDOM_var_ReactDOM_commonjs_react_dom_commonjs2_react_dom_amd_react_dom_default().render(/*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement(ApplicationPage, {
    __source: {
        fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10250\\main\\index.js",
        lineNumber: 1117,
        columnNumber: 17
    },
    __self: undefined
}), document.querySelector("#app"));

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=index.19ddbc21.js.map