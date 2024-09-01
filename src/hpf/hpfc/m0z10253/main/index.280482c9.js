/*! @ncctag {"project":"hpf","branch":"develop-ncc1.0","provider":"suqch","date":"2023/8/30 10:51:22"} */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"), require("react-dom"), require("nc-lightapp-front"), require("uap/common/components/ExcelOutput/index"), require("uap/common/components/excelImportconfig/index"), require("uap/common/components/NCUploader/index"), require("uap/common/components/ApproveDetail/index"), require("uap/common/components/approvalTrans/index"), require("hpf/refer/hpfrefs/HpfEntryConfigGridRef/index"));
	else if(typeof define === 'function' && define.amd)
		define(["react", "react-dom", "nc-lightapp-front", "uap/common/components/ExcelOutput/index", "uap/common/components/excelImportconfig/index", "uap/common/components/NCUploader/index", "uap/common/components/ApproveDetail/index", "uap/common/components/approvalTrans/index", "hpf/refer/hpfrefs/HpfEntryConfigGridRef/index"], factory);
	else if(typeof exports === 'object')
		exports["hpf/hpfc/m0z10253/main/index"] = factory(require("react"), require("react-dom"), require("nc-lightapp-front"), require("uap/common/components/ExcelOutput/index"), require("uap/common/components/excelImportconfig/index"), require("uap/common/components/NCUploader/index"), require("uap/common/components/ApproveDetail/index"), require("uap/common/components/approvalTrans/index"), require("hpf/refer/hpfrefs/HpfEntryConfigGridRef/index"));
	else
		root["hpf/hpfc/m0z10253/main/index"] = factory(root["React"], root["ReactDOM"], root["nc-lightapp-front"], root["uap/common/components/ExcelOutput/index"], root["uap/common/components/excelImportconfig/index"], root["uap/common/components/NCUploader/index"], root["uap/common/components/ApproveDetail/index"], root["uap/common/components/approvalTrans/index"], root["hpf/refer/hpfrefs/HpfEntryConfigGridRef/index"]);
})(self, (__WEBPACK_EXTERNAL_MODULE__6487__, __WEBPACK_EXTERNAL_MODULE__6189__, __WEBPACK_EXTERNAL_MODULE__5118__, __WEBPACK_EXTERNAL_MODULE__9682__, __WEBPACK_EXTERNAL_MODULE__9845__, __WEBPACK_EXTERNAL_MODULE__1729__, __WEBPACK_EXTERNAL_MODULE__2185__, __WEBPACK_EXTERNAL_MODULE__4808__, __WEBPACK_EXTERNAL_MODULE__3744__) => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 3744:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__3744__;

/***/ }),

/***/ 5118:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__5118__;

/***/ }),

/***/ 2185:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__2185__;

/***/ }),

/***/ 9682:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__9682__;

/***/ }),

/***/ 1729:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__1729__;

/***/ }),

/***/ 4808:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__4808__;

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
;// CONCATENATED MODULE: ./src/hpf/hpfc/m0z10253/main/Utils.js
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
const transferDataWapper = function(datas, grandsonMap) {
    (isObject(datas) ? [
        datas
    ] : datas || []).forEach((data)=>{
        let { head , body , bodys  } = data;
        head['bodys'] = apply({}, bodys || body || {});
        data['body'] = apply({}, bodys || body || {});
        data['bodys'] = apply({}, bodys || body || {});
        grandsonMap && (data['grandsonMap'] = apply({}, grandsonMap));
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

// EXTERNAL MODULE: external "uap/common/components/ExcelOutput/index"
var index_ = __webpack_require__(9682);
// EXTERNAL MODULE: external "uap/common/components/excelImportconfig/index"
var excelImportconfig_index_ = __webpack_require__(9845);
// EXTERNAL MODULE: external "uap/common/components/NCUploader/index"
var NCUploader_index_ = __webpack_require__(1729);
// EXTERNAL MODULE: external "uap/common/components/ApproveDetail/index"
var ApproveDetail_index_ = __webpack_require__(2185);
// EXTERNAL MODULE: external "uap/common/components/approvalTrans/index"
var approvalTrans_index_ = __webpack_require__(4808);
// EXTERNAL MODULE: external "hpf/refer/hpfrefs/HpfEntryConfigGridRef/index"
var HpfEntryConfigGridRef_index_ = __webpack_require__(3744);
var HpfEntryConfigGridRef_index_default = /*#__PURE__*/__webpack_require__.n(HpfEntryConfigGridRef_index_);
;// CONCATENATED MODULE: ./src/hpf/hpfc/m0z10253/main/index.js
/****************************************************************************************************
 *
 * 代码目录:
 *      目录结尾不带L和P的是当前节点的目录
 *      以L结尾的是单据追溯的目录
 *      以P结尾的是审批详情的目录
 *
 * 源代码介绍：
 * 1,介绍
 *     此前端代码采用了单页应用写法, 即所有功能在一个页面中, 所以我们仅有一个前端文件(index.js) 这个前端文件表现节点
 * 的所有功能。大家可能会认为, 代码写在了一起是不是很臃肿,代码很多很乱很长，其实不然, 写在一起也是综合了各种因素权衡,
 * 主要权衡指标为 开发者前端基础, 改写代码习惯，和后端转前端的同学, 尽量避免this指针, 不用理解call调用, 能用一种整齐
 * 划一的方式，让大家理解简单，上手方便. 当你了解了代码的基本结构后, 你一定会觉得简单的不可思议。
 * 非常不建议在节点应用中使用现在的多页面模式方案。好处你一定会体会到.
 *
 * 2, 必备知识。
 * 2.1)react的运作模式.
 *    模型模型驱动视图改变, 视图被监听修改模型，再次驱动视图改变.  这种单向变化解决了节点所有功能。
 *    模型模型驱动视图改变 -> 可以理解为视图在表现模型,  在react中 state变化了, 会调用render方法重新渲染,即根据新模型
 *    重新画视图.
 *    视图被监听修改模型  -> 视图可以添加各种监听事件，(click, mourseMove)等, 事件处理时, 修改模型. 模型变化驱动了视
 *    图重新表现
 *         —————>>————————
 *        |               |
 *       模型(state)     视图(render)
 *        |               |
 *        -----<<----------
 * 2.2)平台的高阶组件
 *    平台的高阶组件是 props.组件.方法 这种调用形式的组件. 高阶组件最终底层还是 react运作模式.
 *    需要掌握高阶组件API. 平台的高阶组件会经常用到.
 *
 * 3,代码的基本结构,
 *    代码中, 最核心3方法，分别是构造方法constructor方法, 创建模型方法createState方法， 渲染方法render方法， 当然还是其
 * 他的定义，比如监听事件处理, 按钮状态控制方法，但是当你掌握了这3个最核心的方法, 你基本及掌握了整个页面的运作模式，结构模
 * 型了. 在介绍其他方法就一目了然了.
 *
 * 3.1 constructor
 *   constructor的作用为构造当前页面对象。主要职责为
 *   1) 加载NC资源，如单据模板, 按钮定义。 修正模板的一些属性。
 *   2) 调用创建模型方法createState方法，构建页面的结构(*), 核心方法。
 *   3) 保存和定义节点配置项，如节点编码，应用编码等。
 *
 * 3.2 createState方法，render方法
 *   createState方法为创建模型方法，了解createState对了解了解页面整体右至关重要的作用的.
 *   createState做了什么? createState在根据页面的组件布置情况创建对应的结构性的模型.并且
 *   模型的结构与页面的结构保持一致，这样非常方便了理解页面的整体情况，也非常变量的操作模型。
 *   我们举个简单例子[列表卡片]节点：
 *   我们先简单说明下这个节点， 这个节点包含了2个部分， 一个是列表的部分，一个是卡片的部分，
 *   并给他们起名字， 列表模式，卡片模式， 显示列表模式时，不显示卡片模式，显示卡片模式时，不显示列表模式，
 *   功能为列表卡片来回切换，列表模式中， 包含一个查询区， 一个列表区， 卡片模式中， 包含一个表单区。
 *   下面我们来构建一个state
 *    state = {
 *          showmode: 'list',   showmode表示为当前的显示模式， 是列表模式，还是卡片模式， 他可以有两个值 list,card分表表示
 *          list: {             列表模式的配置，包含查询区配置对象，表格区配置对象
 *             search:{         查询区配置
 *                  area: ''    查询区的区域编码,你在模板中定义的编码是什么他就是什么
 *                  onSearch:fn 点击查询时候的处理函数
 *             },
 *             table:{          表格区配置
 *                  area: ''    表格区的区域编码,你在模板中定义的编码是什么他就是什么
 *                  onSelect: fn 点击选中时候的处理函数
 *             }
 *          },
 *          card:{              卡片模式的配置，包含了表单区的配置对象
 *              form:{          表单区
 *                  area:''     表单区的区域编码，你在模板中定义的编码是什么他就是什么
 *                  onBeforeEdit:fn  表单编辑前的处理函数
 *              }
 *          }
 *    }
 *    以上我们就构建一个state,从这个state中，我们可以看到我们页面的模型全貌.
 *    下面我们来看render方法，
 *    render方法的中， 主要是渲染组件到页面，我们根据什么来渲染页面，根据上面构建的state模型来渲染，
 *    render = () =>{
 *          var renderList = () =>{ //渲染列表模式的是的页面，
 *          }
 *          var renderCard = () =>{ //渲染卡片模式的是的页面，
 *          }
 *    }
 *    我们应该怎么判断渲染的是列表 还是卡片呢， 我们通过state.showmode来确定，
 *    根据showmode的当前值的状态来判断是调用 renderList还是renderCard，
 *    这样当我们重新设置模型的值(setState),就能够借助React的机制(见react的运作模式)，驱动视图变化了(setState会驱动调用render)
 *    所以我们可以这样写
 *     render = () =>{
 *          var renderList = () =>{ //渲染列表模式的是的页面，
 *          }
 *          var renderCard = () =>{ //渲染卡片模式的是的页面，
 *          }
 *          return this.state.showmode == 'list' ? renderList() : renderCard();
 *    }
 *    是不是非常简单,当我们要在列表和卡片模式中切换时， 我们只需要 setState(showmode:'list'或者'card'),
 *    就可以在列表和卡片间来回切换了， 非常便利，再也不用什么缓存了，而且切换时也不需要加载什么模板.非常快捷。
 *
 *    那么renderList方法里面是怎么写的呢，也非常简单，我们再看一下state里面list的定义
 *    我们就可以根据list里面的定义写renderList了，state结构和render结构保持了一致
 *          list: {             列表模式的配置，包含查询区配置对象，表格区配置对象
 *             search:{         查询区配置
 *                  area: ''    查询区的区域编码,你在模板中定义的编码是什么他就是什么
 *                  onSearch:fn 点击查询时候的处理函数
 *             },
 *             table:{          表格区配置
 *                  area: ''    表格区的区域编码,你在模板中定义的编码是什么他就是什么
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
 *    这样我们的列表界面就做完了，很简单 卡片模式也是和类似
 *    var renderCard = () =>{ //渲染卡片模式的是的页面，
 *           var { form } = this.card; //我们解构card里面的两个模型对象，就是search查询区的配置，table表格配置
 *          return <div>
 *                  {this.props.search.form(form.area, form)}
 *          </div>
 *    }
 *
 *    现在我们看一下完整的例子代码,并进行一些总结
 *    createState = () => {
 *      var state = {
 *          showmode: 'list',   showmode表示为当前的显示模式， 是列表模式，还是卡片模式， 他可以有两个值 list,card分表表示
 *          list: {             列表模式的配置，包含查询区配置对象，表格区配置对象
 *             search:{         查询区配置
 *                  area: ''    查询区的区域编码,你在模板中定义的编码是什么他就是什么
 *                  onSearch:fn 点击查询时候的处理函数
 *             },
 *             table:{          表格区配置
 *                  area: ''    表格区的区域编码,你在模板中定义的编码是什么他就是什么
 *                  onSelect: fn 点击选中时候的处理函数
 *             }
 *          },
 *          card:{              卡片模式的配置，包含了表单区的配置对象
 *              form:{          表单区
 *                  area:''     表单区的区域编码，你在模板中定义的编码是什么他就是什么
 *                  onBeforeEdit:fn  表单编辑前的处理函数
 *              }
 *          }
 *      }
 *    }
 *    render = () => {
 *          var renderList = () =>{
 *              var {search, table } = this.state.list; //我们解构list里面的两个模型对象，就是search查询区的配置，table表格配置
 *                 return <div>
 *                  {this.props.search.NCCreateSearch(search.area, search)}
 *                   {this.props.table.createSimpleTable(table.area, table)}
 *                </div>
 *          }
 *          var renderCard = () =>{
 *               var { form } = this.card; //我们解构card里面的两个模型对象，就是search查询区的配置，table表格配置
 *                return <div>
 *                  {this.props.search.form(form.area, form)}
 *                </div>
 *          }
 *          return this.state.showmode == 'list' ? renderList() : renderCard();
 *    }
 *    总结：
 *      代码state和render渲染的模型结构上是一致，这样我们能很快构建我们的页面，并非常容易修改，
 *      我们只需要修改我们的模型，就可以操控我们的页面了， 渲染只是在表现我们的模型
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


// ============= 导入高阶组件区 =============



// 导出组件

// 导入配置方法

// 附件管理组件

//审批详情

//指派组件

//add by mzq
const main_EMPTY_FN = ()=>{};
// 空函数
const { PrintOutput , BillTrack  } = external_nc_lightapp_front_.high;
// ============= 导入基础组件区 ==============
const { NCDiv , NCAffix , NCTabs , NCScrollElement , NCTooltip , NCToggleViewBtn  } = external_nc_lightapp_front_.base;
// ============= 基本变量定义区 ==============
const URLS = {
    // 请求路径
    addUrl: '/nccloud/hpf/storehome/AddStoreHomeVOAction.do',
    // 新增时请求默认值 Action
    saveUrl: '/nccloud/hpf/storehome/SaveStoreHomeVOAction.do',
    // 保存 Action
    listUrl: '/nccloud/hpf/storehome/ListStoreHomeVOAction.do',
    // 查询 Action
    downUrl: '/nccloud/hpf/storehome/DownloadStoreHomeVOAction.do'
};
//下载 Action  add by mzq
const ACTIONS = {
    // 按钮编码
    DOWNLOAD: 'Download',
    //下载 add by mzq
    ADD: 'Add',
    // 新增
    EDIT: 'Edit',
    // 修改
    DELETE: 'Delete',
    // 删除
    COPY: 'Copy',
    // 复制
    SAVE: 'Save',
    // 保存
    CANCEL: 'Cancel',
    // 取消
    REFRESH: 'Refresh',
    // 刷新
    MORE: "More"
};
// 更多
const FIELDS = {
    // 字段编码
    PK_ORG: 'pk_org',
    PRIMARYKEY: 'pk_storehouse'
};
// 编辑模式变量
const EDITMODE_EDIT = 'edit';
const EDITMODE_BROWSE = 'browse';
let ApplicationPage = class ApplicationPage extends external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_.Component {
    /** 渲染方法 */ render() {
        if (!this.state.isPageReady) {
            return '';
        }
        // 页面信息未加载完不渲染页面
        /** 渲染单表应用页面 */ let renderList = ()=>{
            let { showmode , editmode , head , headBtn , search , table  } = this.state;
            let { createModal  } = this.props.modal;
            return /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement("div", {
                className: "nc-single-table",
                __source: {
                    fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10253\\main\\index.js",
                    lineNumber: 527,
                    columnNumber: 17
                },
                __self: this
            }, /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement(NCDiv, {
                className: "nc-singleTable-header-area",
                areaCode: NCDiv.config.HEADER,
                __source: {
                    fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10253\\main\\index.js",
                    lineNumber: 528,
                    columnNumber: 21
                },
                __self: this
            }, /* 表格头部 */ /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement("div", {
                className: "header-title-search-area",
                __source: {
                    fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10253\\main\\index.js",
                    lineNumber: 530,
                    columnNumber: 25
                },
                __self: this
            }, this.props.BillHeadInfo.createBillHeadInfo(main_objectSpread({}, head))), /* 按钮区 */ /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement("div", {
                className: "header-button-area",
                __source: {
                    fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10253\\main\\index.js",
                    lineNumber: 534,
                    columnNumber: 25
                },
                __self: this
            }, this.props.button.createButtonApp(main_objectSpread({}, headBtn)))), /* 浏览态显示查询区 */ editmode == EDITMODE_BROWSE && /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement("div", {
                className: "nc-singleTable-search-area",
                __source: {
                    fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10253\\main\\index.js",
                    lineNumber: 539,
                    columnNumber: 53
                },
                __self: this
            }, this.props.search.NCCreateSearch(search.area, main_objectSpread({}, search))), /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement("div", {
                className: "nc-singleTable-table-area",
                __source: {
                    fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10253\\main\\index.js",
                    lineNumber: 542,
                    columnNumber: 21
                },
                __self: this
            }, " ", /* 列表区 */ this.props.editTable.createEditTable(table.area, main_objectSpread({}, table))), //add by mzq
            createModal('selds', {
                title: '选择来源系统',
                className: 'selds',
                content: /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement((HpfEntryConfigGridRef_index_default()), {
                    value: this.state.dbinfo,
                    isMultiSelectedEnabled: false,
                    queryCondition: (v)=>({
                            pk_org: this.state.pk_org
                        }),
                    onChange: (v)=>this.setState({
                            dbinfo: v
                        }),
                    __source: {
                        fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10253\\main\\index.js",
                        lineNumber: 551,
                        columnNumber: 38
                    },
                    __self: this
                }),
                beSureBtnClick: this.beSureBtnClick,
                cancelBtnClick: this.cancelBtnClick,
                size: 'sm'
            }));
        };
        return /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement("div", {
            __source: {
                fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10253\\main\\index.js",
                lineNumber: 566,
                columnNumber: 13
            },
            __self: this
        }, renderList());
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
            // // 查询区默认值赋值
            let { context  } = this.state;
            // let searchCondition = [];
            // // 查询区设置当前用户业务设置中的默认业务单元
            if (context && context.pk_org) {
                let { pk_org , org_Name  } = context;
                // 	searchCondition.push({ field: FIELDS.PK_ORG, oprtype: '=', value: { firstvalue: pk_org }, display: org_Name });
                this.setState({
                    pk_org
                });
            }
            // // 交易类型发布的小应用，查询区赋值默认交易类型
            // if (context && context.paramMap && context.paramMap.pk_transtype) {
            // 	let { pk_transtype, transtype_name, transtype } = context.paramMap;
            // 	searchCondition.push({ field: FIELDS.TRANSTYPEPK, oprtype: '=', value: { firstvalue: pk_transtype }, display: transtype_name });
            // 	searchCondition.push({ field: FIELDS.TRANSTYPE, oprtype: '=', value: { firstvalue: transtype }, display: transtype });
            // 	this.props.search.setDisabledByField(this.state.search.area, FIELDS.TRANSTYPEPK, true); // 交易类型不可编辑
            // }
            // this.props.search.setSearchValue(this.state.search.area, searchCondition);
            // 加载表格数据  -> 将数据设置到表格上  -> 更新按钮状态
            this.loadList((data)=>this.fillList(data, this.updateBtnStatus));
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
            // 字段设置
            meta[this.state.table.area].items.filter((item)=>{
                // 隐藏 saga 相关的字段
                if (item.attrcode.startsWith('saga')) {
                    item.visible = false;
                    item.disabled = true;
                }
            });
            // 查询区主组织权限过滤：加载的是当前登录人有权限的组织
            meta[this.state.search.area].items.find((item)=>{
                if (item.attrcode == FIELDS.PK_ORG) {
                    item.queryCondition = ()=>({
                            // 参照过滤条件
                            AppCode: this.config.appcode,
                            TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
                        });
                }
            });
            // 组织权限过滤自定义SqlBuilder类全名
            // 表格区主组织权限过滤
            meta[this.state.table.area].items.find((item)=>{
                if (item.attrcode == FIELDS.PK_ORG) {
                    item.queryCondition = ()=>({
                            // 参照过滤条件
                            AppCode: this.config.appcode,
                            TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
                        });
                }
            });
            // 组织权限过滤自定义SqlBuilder类全名
            /**
         * Demo：处理表格操作列
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
                width: 160,
                fixed: 'right',
                // 固定到右侧
                itemtype: 'customer',
                render: (text, record, index)=>{
                    let isBrowse = this.state.editmode == EDITMODE_BROWSE;
                    let btns = {
                        // 表体行所有按钮
                        [ACTIONS.DELETE]: true
                    };
                    let btnKeys = Object.keys(btns).filter((key)=>btns[key]);
                    // 过滤出显示的按钮
                    btnKeys = btnKeys.map((btn)=>btn + "Opr");
                    // 按钮编码追加"Opr"后缀
                    // 渲染操作列按钮
                    return this.props.button.createOprationButton(btnKeys, {
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
            /** 获取当前按钮下所有子按钮 */ let getChildBtns = (btn)=>{
                if (!btn) return [];
                if (!btn.children || btn.children.length == 0) {
                    return [
                        btn
                    ];
                } else {
                    let btns = [
                        btn
                    ];
                    btn.children.forEach((btn)=>btns = [
                            ...btns,
                            ...getChildBtns(btn)
                        ]);
                    return btns;
                }
            };
            /**
         * 表头按钮和表体行按钮，只注册一份，区域编码为common
         * 复制一份且区域编码改为table_inner，按钮编码追加"Opr"后缀，作为表体行按钮使用
         */ let commonBtns = JSON.parse(JSON.stringify(button.filter((btn)=>btn.area == 'common')));
            let tablebtns = [];
            commonBtns.forEach((btn)=>tablebtns = [
                    ...tablebtns,
                    ...getChildBtns(btn)
                ]);
            tablebtns.forEach((btn)=>{
                btn.area = "table_inner";
                // 区域编码
                btn.key = btn.key + "Opr";
            });
            // 按钮编码 + "Opr"后缀
            return [
                ...button,
                ...tablebtns
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
                isPageReady: false,
                // 页面信息（模板、按钮）是否加载完
                context: undefined,
                // 上下文
                editmode: EDITMODE_BROWSE,
                // 页面状态，默认浏览态
                //add by mzq
                pk_org: '',
                dbinfo: {},
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
                    area: 'StoreHomeVOQuery',
                    // 查询区域编码
                    showSearchBtn: false,
                    showClearBtn: false,
                    showAdvBtn: false,
                    showAdvSearchPlanBtn: false,
                    //add by mzq
                    clickSearchBtn: ()=>{
                        // 查询按钮事件
                        this.loadList((data)=>{
                            // 加载表格数据
                            let tableid = this.state.table.area;
                            this.fillList(data, this.updateBtnStatus);
                            // 设置表格数据并更新按钮状态
                            let length = data && data[tableid] && data[tableid].allpks && data[tableid].allpks.length || 0;
                            // 查到单据个数
                            (0,external_nc_lightapp_front_.toast)({
                                // 点击查询按钮提示语
                                color: length > 0 ? 'success' : 'warning',
                                content: length > 0 ? '查询成功，共' + length + '条。' : '未查询到符合条件的数据'
                            });
                        });
                    },
                    //add by mzq
                    onAfterEvent: this.onSearchAfterEvent
                },
                table: {
                    // 表格区域
                    area: 'StoreHomeVOTable',
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
                        this.loadList((data)=>this.fillList(data, this.updateBtnStatus));
                    }
                }
            };
            return state;
        });
        //add by mzq
        main_defineProperty(this, "onSearchAfterEvent", ()=>{
            let searcharea = this.state.search.area;
            let data = this.props.search.getAllSearchData(searcharea);
            if (data && data.conditions.length != 0) {
                let pk_org = this.props.search.getSearchValByField(searcharea, 'pk_org');
                if (pk_org && pk_org.value && pk_org.value.firstvalue) {
                    let value = pk_org.value.firstvalue;
                    this.setState({
                        dbinfo: null,
                        pk_org: value
                    });
                }
                if (this.props.editTable.getStatus() && this.props.editTable.getStatus() == 'edit') {
                    (0,external_nc_lightapp_front_.promptBox)({
                        color: "warning",
                        title: this.state.json['M0Z10201-000011'],
                        /* 国际化处理： 提示*/ content: this.state.json['M0Z10201-000015']
                    });
                }
                /* 国际化处理： 编辑态不能查询*/ this.loadList((data)=>{
                    let tableid = this.state.table.area;
                    this.fillList(data, this.updateBtnStatus);
                    let length = data && data[tableid] && data[tableid].allpks && data[tableid].allpks.length || 0;
                    // 查到单据个数
                    (0,external_nc_lightapp_front_.toast)({
                        // 点击查询按钮提示语
                        color: length > 0 ? 'success' : 'warning',
                        content: length > 0 ? '查询成功，共' + length + '条。' : '未查询到符合条件的数据'
                    });
                });
            } else {
                this.setState({
                    pk_org: ''
                });
                this.props.editTable.setTableData(this.state.table.area, {
                    rows: []
                }, false);
            }
        });
        //add by mzq
        main_defineProperty(this, "beSureBtnClick", ()=>{
            let dbinfo = this.state.dbinfo;
            if (Object.keys(dbinfo).length == 0) {
                (0,external_nc_lightapp_front_.toast)({
                    color: 'warning',
                    title: "来源系统不能为空!"
                });
                /* 国际化处理： 下载成功*/ return;
            }
            (0,external_nc_lightapp_front_.ajax)({
                url: URLS.downUrl,
                data: {
                    ref1: this.state.dbinfo
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
            this.loadList((data)=>this.fillList(data, this.updateBtnStatus));
        });
        // 重新加载数据
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
            // 按钮显隐性控制
            this.props.button.setButtonsVisible({
                [ACTIONS.EDIT]: isBrowse,
                [ACTIONS.SAVE]: isEdit,
                [ACTIONS.CANCEL]: isEdit,
                [ACTIONS.REFRESH]: isBrowse,
                [ACTIONS.MORE]: isBrowse
            });
            let tableid = this.state.table.area;
            let rows = this.props.editTable.getCheckedRows(tableid);
            // 选中行
            let selectedCount = rows ? rows.length : 0;
            // 选中单据个数
            // 按钮禁用控制
            this.props.button.setDisabled({
                [ACTIONS.COPY]: selectedCount == 0,
                [ACTIONS.DELETE]: selectedCount == 0
            });
            // 主按钮设置
            this.props.button.setMainButton(ACTIONS.ADD, isBrowse);
            this.props.button.setMainButton(ACTIONS.SAVE, isEdit);
            // 表格行内按钮提示语设置
            let content = isBrowse ? '确定要删除？' : '';
            this.props.button.setPopContent(ACTIONS.DELETE + "Opr", content);
        });
        /**
     * 加载表格数据
     * @param callback 回调函数
     */ main_defineProperty(this, "loadList", (callback = main_EMPTY_FN)=>{
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
                url: URLS.listUrl,
                data: {
                    appcode: this.config.appcode,
                    pageCode: this.config.pagecode,
                    formId: table.area,
                    queryTreeFormatVO: _objectSpreadProps(main_objectSpread({}, queryInfo), {
                        pageCode: this.config.pagecode
                    }),
                    pageInfo
                },
                success: (res)=>callback(res.data && res.data.data)
            });
        });
        /**
     * 设置表格数据
     * @param data 表格数据
     * @param callback 回调函数
     */ main_defineProperty(this, "fillList", (data, callback = main_EMPTY_FN)=>{
            let tableid = this.state.table.area;
            let tableData = data && data[tableid] ? data[tableid] : {
                rows: []
            };
            // 表格数据
            this.props.editTable.setTableData(tableid, tableData);
            // 设置表格数据
            callback();
        });
        // 执行回调函数
        /**
     * 加载新增行默认值，包括：
     * 1.新增行默认值
     * 2.编码规则配置
     * @param callback 回调函数
     */ main_defineProperty(this, "add", (callback = main_EMPTY_FN)=>{
            let rows = [
                {
                    values: {}
                }
            ];
            let params = this.buildSaveParam(rows);
            (0,external_nc_lightapp_front_.ajax)({
                url: URLS.addUrl,
                data: params,
                success: (res)=>callback(res.data)
            });
        });
        /**
     * 保存数据
     * 单表的保存和删除都调保存Action，公用此方法
     * @param data 保存参数
     * @param callback 保存后回调函数
     */ main_defineProperty(this, "save", (data, callback = main_EMPTY_FN)=>{
            (0,external_nc_lightapp_front_.ajax)({
                url: URLS.saveUrl,
                data,
                success: (res)=>callback(res.data && res.data.data)
            });
        });
        /**
     * 功能介绍：构建保存参数
     * 工具生成的代码，所有节点保存参数统一按照一主多子的结构处理。单表的数据也要封装成一主多子的结构。
     * @param rows 所有行数据
     */ main_defineProperty(this, "buildSaveParam", (rows = [])=>{
            let tableid = this.state.table.area;
            let params = {
                formId: tableid,
                pageCode: this.config.pagecode,
                billCard: {
                    pageid: this.config.pagecode,
                    bodys: {
                        [tableid]: {
                            areaType: "table",
                            areacode: tableid,
                            pageinfo: null,
                            rows
                        }
                    }
                }
            };
            return params;
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
                    this.onDelete();
                    break;
                case ACTIONS.DELETE + "Opr":
                    // 行删除
                    this.onRowDelete(record, index);
                    break;
                case ACTIONS.COPY:
                    // 复制
                    this.onCopy();
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
                case ACTIONS.DOWNLOAD:
                    //下载 add by mzq
                    this.onDownload();
                    break;
                default:
                    break;
            }
        });
        /**
     * 新增按钮点击事件
     */ main_defineProperty(this, "onAdd", ()=>{
            let { context , table  } = this.state;
            let tableid = table.area;
            this.add((data)=>{
                // 加载新增行默认值，传到回调函数的参数data中
                this.setPageStatus(EDITMODE_EDIT, ()=>{
                    // 设置页面状态
                    // 后台返回的默认值
                    let defValue = data.data && data.data.head[tableid].rows.length > 0 && data.data.head[tableid].rows[0].values || {};
                    // 过滤掉空属性
                    Object.getOwnPropertyNames(defValue).forEach((key)=>{
                        !defValue[key].value && delete defValue[key];
                    });
                    // 设置当前用户业务中的默认业务单元
                    if (context && context.pk_org) {
                        Object.assign(defValue, {
                            [FIELDS.PK_ORG]: {
                                value: context.pk_org,
                                display: context.org_Name
                            }
                        });
                    }
                    let num = this.props.editTable.getNumberOfRows(tableid);
                    // 表格当前行数
                    this.props.editTable.addRow(tableid, num, true, defValue);
                    // 新增一行
                    this.updateBtnStatus();
                });
            });
        });
        // 更新按钮状态
        /**
     * 修改按钮点击事件
     * 功能描述：页面状态设置为编辑态，并更新按钮状态
     */ main_defineProperty(this, "onEdit", ()=>{
            this.setPageStatus(EDITMODE_EDIT, this.updateBtnStatus);
        });
        /**
     * 删除按钮点击事件
     */ main_defineProperty(this, "onDelete", ()=>{
            let tableid = this.state.table.area;
            let selectedData = this.props.editTable.getCheckedRows(tableid);
            // 选中数据
            if (selectedData.length == 0) {
                return;
            }
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
            // 删除单据
            let deleteBill = ()=>{
                let deleteParams = this.buildSaveParam(rows);
                this.save(deleteParams, (res)=>{
                    (0,external_nc_lightapp_front_.toast)({
                        color: 'success',
                        content: '删除成功'
                    });
                    this.loadList((data)=>this.fillList(data, this.updateBtnStatus));
                });
            };
            // 重新加载数据
            (0,external_nc_lightapp_front_.promptBox)({
                color: 'warning',
                title: '删除',
                content: '确定要删除吗？',
                noFooter: false,
                noCancelBtn: false,
                beSureBtnName: '确定',
                cancelBtnName: '取消',
                beSureBtnClick: deleteBill
            });
        });
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
            let deleteParams = this.buildSaveParam([
                row
            ]);
            this.save(deleteParams, (res)=>{
                (0,external_nc_lightapp_front_.toast)({
                    color: 'success',
                    content: '删除成功'
                });
                // 删除提示语
                this.loadList((data)=>this.fillList(data, this.updateBtnStatus));
            });
        });
        // 重新加载数据
        /**
     * 复制
     */ main_defineProperty(this, "onCopy", ()=>{
            let tableid = this.state.table.area;
            let selectedRows = this.props.editTable.getCheckedRows(tableid);
            if (!selectedRows || selectedRows.length == 0) {
                return;
            }
            this.setPageStatus(EDITMODE_EDIT, ()=>{
                // 获取复制数据
                let copyRows = selectedRows.map((row)=>{
                    // 清空基本信息
                    row.data.values[FIELDS.PRIMARYKEY] = {};
                    // 主键
                    row.data.values.code = {};
                    // 单据号
                    row.data.values.name = {};
                    // 名称
                    return {
                        status: 2,
                        isOptimized: row.data.isOptimized,
                        values: row.data.values
                    };
                });
                // 获取表格原来数据，将复制行追加到表格最后
                let rows = this.props.editTable.getAllRows(tableid);
                rows = [
                    ...rows,
                    ...copyRows
                ];
                // 重新设置表格数据
                this.props.editTable.setTableData(tableid, {
                    rows
                });
                this.updateBtnStatus();
            });
        });
        /**
     * 保存按钮点击事件
     */ main_defineProperty(this, "onSave", ()=>{
            let tableid = this.state.table.area;
            // 无变动的行数据则直接返回浏览态
            let changedRows = this.props.editTable.getChangedRows(tableid);
            if (!changedRows || changedRows.length == 0) {
                this.setPageStatus(EDITMODE_BROWSE, ()=>{
                    this.loadList((data)=>this.fillList(data, this.updateBtnStatus));
                });
                // 重新加载数据
                return;
            }
            // 必输项校验
            let allRows = this.props.editTable.getAllRows(tableid, true);
            if (!this.props.editTable.checkRequired(tableid, allRows)) {
                return;
            }
            // 保存单据
            let saveParams = this.buildSaveParam(allRows);
            let saveBill = ()=>{
                this.save(saveParams, (res)=>{
                    (0,external_nc_lightapp_front_.toast)({
                        color: 'success',
                        content: '保存成功'
                    });
                    this.setPageStatus(EDITMODE_BROWSE, ()=>{
                        this.loadList((data)=>this.fillList(data, this.updateBtnStatus));
                    });
                });
            };
            // 重新加载数据
            let validateData = {
                // 验证公式参数
                pageid: saveParams.billCard.pageid,
                model: saveParams.billCard.bodys[tableid]
            };
            this.props.validateToSave(validateData, saveBill, {
                [tableid]: 'table'
            }, 'grid');
        });
        // 执行公式并保存
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
                        this.loadList((data)=>this.fillList(data, this.updateBtnStatus));
                    });
                }
            });
        });
        // 重新加载数据
        /**
     * 刷新
     */ main_defineProperty(this, "onRefresh", ()=>{
            this.loadList((data)=>this.fillList(data, this.updateBtnStatus));
            // 重新加载数据
            (0,external_nc_lightapp_front_.toast)({
                color: 'success',
                content: '刷新成功'
            });
        });
        /**
    *  下载 add by mzq
    */ main_defineProperty(this, "onDownload", ()=>{
            this.props.modal.show('selds');
        });
        /**
     * 选中行事件
     */ main_defineProperty(this, "onSelected", ()=>{
            this.updateBtnStatus();
        });
        // 选中行后重新设置按钮状态
        /**
     * 选中所有行事件
     */ main_defineProperty(this, "onSelectedAll", ()=>{
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
            //                 return { parentbilltype: BILLTYPE }
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
            moduleId: 'M0Z10253',
            // 多语模块
            title: props.getSearchParam('n') || '来源仓库档案',
            // 单据标题
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
         */ this.props.use.search('StoreHomeVOQuery');
        this.props.use.editTable('StoreHomeVOTable');
        /**
         * 加载NCC资源
         * 1.包含单据模板、按钮等平台定义的资源
         * 2.加载多语资源文件
         * 3.加载需要在代码总用到参照js
         */ Utils.loadNCCResource(_objectSpreadProps(main_objectSpread({
            props
        }, this.config), {
            callback: (data)=>{
                let { context , template , button , lang , refer ={}  } = data;
                let meta = this.initMeta(template);
                // 修改后的模板
                let buttons = this.initButton(button);
                // 修改后的按钮
                //过滤按钮仅保留刷新和下载 add by mzq
                buttons = buttons.length && buttons.filter((item)=>{
                    if ([
                        'Download',
                        'Refresh'
                    ].indexOf(item.key) > -1) {
                        return item;
                    }
                });
                Promise.all([
                    new Promise((resolve)=>this.props.meta.setMeta(meta, ()=>resolve(true))),
                    // 设置模板
                    new Promise((resolve)=>this.props.button.setButtons(buttons, ()=>resolve(true))),
                    // 设置按钮
                    new Promise((resolve)=>this.setState(_objectSpreadProps(main_objectSpread({}, this.state), {
                            context
                        }), ()=>resolve(true)))
                ]).// 上下文维护到state
                then(()=>{
                    this.setState({
                        isPageReady: true
                    }, ()=>{
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
/**
 * 应用的入口createPage
 * 前端底层，通过createPage方法，把各个对象插入到当前应用的props中
 * initTemplate：目的是初始化模板，目前已经在constructor中使用Utils.loadNCCResource方法获取模板
 * billInfo：目的是为公式准备，具体可以到nccdev.yonyou.com上搜索公式查看
 */ ApplicationPage = (0,external_nc_lightapp_front_.createPage)({
    initTemplate: {},
    billinfo: {
        billtype: 'grid',
        pagecode: 'M0Z10253_StoreHomeVO',
        bodycode: 'StoreHomeVOTable'
    },
    mutiLangCode: 'M0Z10253'
})(ApplicationPage);
external_root_ReactDOM_var_ReactDOM_commonjs_react_dom_commonjs2_react_dom_amd_react_dom_default().render(/*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement(ApplicationPage, {
    __source: {
        fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10253\\main\\index.js",
        lineNumber: 1068,
        columnNumber: 17
    },
    __self: undefined
}), document.querySelector("#app"));

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=index.280482c9.js.map