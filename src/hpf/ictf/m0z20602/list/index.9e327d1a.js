/*! @ncctag {"project":"hpf","branch":"develop-ncc1.0","provider":"suqch","date":"2023/8/30 10:51:22"} */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"), require("nc-lightapp-front"));
	else if(typeof define === 'function' && define.amd)
		define(["react", "nc-lightapp-front"], factory);
	else if(typeof exports === 'object')
		exports["hpf/ictf/m0z20602/list/index"] = factory(require("react"), require("nc-lightapp-front"));
	else
		root["hpf/ictf/m0z20602/list/index"] = factory(root["React"], root["nc-lightapp-front"]);
})(self, (__WEBPACK_EXTERNAL_MODULE__6487__, __WEBPACK_EXTERNAL_MODULE__5118__) => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 9137:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7537);
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3645);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".item {\n  margin: 10px;\n}\n.item .u-input-group {\n  width: 100%;\n}\n.date-picker-mask {\n  top: 4px;\n}\n.u-modal-body {\n  height: 150px;\n}\n.nc-date-picker {\n  display: flex;\n}\n", "",{"version":3,"sources":["webpack://./src/hpf/ictf/m0z20602/list/index.less"],"names":[],"mappings":"AAAA;EACI,YAAA;AACJ;AAFA;EAGQ,WAAA;AAER;AACA;EACI,QAAA;AACJ;AACA;EACI,aAAA;AACJ;AACA;EACI,aAAA;AACJ","sourcesContent":[".item {\n    margin: 10px;\n    .u-input-group {\n        width: 100%\n    }\n}\n.date-picker-mask {\n    top: 4px;\n}\n.u-modal-body {\n    height: 150px;\n}\n.nc-date-picker{\n    display: flex;\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 3645:
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ 7537:
/***/ ((module) => {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ 3379:
/***/ ((module) => {



var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ 569:
/***/ ((module) => {



var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ 9216:
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ 3565:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ 7795:
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),

/***/ 4589:
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ }),

/***/ 2301:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "APPCODE": () => (/* binding */ APPCODE),
/* harmony export */   "BILL_TYPE_CODE": () => (/* binding */ BILL_TYPE_CODE),
/* harmony export */   "CARD": () => (/* binding */ CARD),
/* harmony export */   "FIELD": () => (/* binding */ FIELD),
/* harmony export */   "LIST": () => (/* binding */ LIST),
/* harmony export */   "LIST_BUTTON": () => (/* binding */ LIST_BUTTON),
/* harmony export */   "LIST_DISABLED_BUTTON": () => (/* binding */ LIST_DISABLED_BUTTON),
/* harmony export */   "MULTILANG": () => (/* binding */ MULTILANG),
/* harmony export */   "PRIMARY_KEY": () => (/* binding */ PRIMARY_KEY),
/* harmony export */   "REQUEST_URL": () => (/* binding */ REQUEST_URL),
/* harmony export */   "SEARCH_CACHE": () => (/* binding */ SEARCH_CACHE),
/* harmony export */   "STATUS": () => (/* binding */ STATUS)
/* harmony export */ });
/* unused harmony exports DATASOURCE, CARD_CACHE, base_path, CARD_BUTTON, CARD_DISABLED_BUTTON, CARD_ADD_DISABLED_BUTTON */
/**
* @description: 常量
*/ //应用编码
const APPCODE = 'M0Z20602';
//单据类型
const BILL_TYPE_CODE = 'HPF2';
/**
* @description: 多语
* @param moduleId: 多语资源名
* @param domainName: 工程名
*/ const MULTILANG = {
    moduleId: 'M0Z20602',
    domainName: 'hpf'
};
/**
 * 列表
 */ const LIST = {
    page_title: 'M0Z20602-000011',
    //页面标题 /* 国际化处理： 投融资费用*/
    page_code: 'M0Z20602_LIST',
    //页面编码
    search_id: 'list_query',
    //查询区 
    table_id: 'list_head',
    //表格区 
    head_btn_code: 'list_head',
    //表头按钮区 
    body_btn_code: 'list_inner'
};
//表体表格按钮区
/**
 * 卡片
 */ const CARD = {
    page_title: 'M0Z20602-000011',
    //页面标题 /* 国际化处理： 投融资费用*/
    page_code: 'M0Z20602_CARD',
    //页面编码
    form_id: 'card_head',
    //表头表单区
    table_code: 'card_body',
    //表体表格区
    table_edit_code: 'card_body_edit',
    //表体表格编辑态侧拉区
    table_browse_code: 'card_body_browse',
    //表体表格浏览态下拉区
    head_btn_code: 'card_head',
    //表头按钮区
    shoulder_btn_code: 'tabs_head',
    //表体肩部按钮区
    body_btn_code: 'tabs_body'
};
//表体表格按钮区
//领域名.模块名.节点名.自定义名
//缓存标示
const DATASOURCE = 'tm.fmc.cost.datasource';
//查询区域缓存 
const SEARCH_CACHE = {
    key: 'tm.fmc.cost.SEARCH_CACHE',
    //查询区域缓存Key
    dataSource: DATASOURCE
};
//查询区域缓存数据的名称空间
//卡片缓存 
const CARD_CACHE = {
    key: 'tm.fmc.cost.CARD_CACHE',
    //卡片区域缓存Key
    dataSource: DATASOURCE
};
//卡片区域缓存数据的名称空间
//请求基础路径
const base_path = '/nccloud/hpf/ictf/';
//url
const REQUEST_URL = {
    save: `/nccloud/hpf/ictf/saveclinic_income.do`,
    //保存
    delete: `/nccloud/hpf/ictf/deleteclinic_income.do`,
    //删除
    queryCard: `/nccloud/hpf/ictf/querycardclinic_income.do`,
    //卡片查询
    queryList: `/nccloud/hpf/ictf/querypageclinic_income.do`,
    //列表查询
    queryListByPks: `/nccloud/hpf/ictf/querypagebypkclinic_income.do`,
    //列表分页查询
    commit: `/nccloud/hpf/ictf/commitclinic_income.do`,
    //提交
    unCommit: `/nccloud/hpf/ictf/uncommitclinic_income.do`,
    //收回
    down: `/nccloud/hpf/ictf/downclinic_income.do`,
    //下载
    toCard: '/card',
    toList: '/list',
    linkquery: '/nccloud/hpf/ictf/linkQueryVoucher.do',
    makebill: '/nccloud/hpf/ictf/makebill.do',
    Print: '/nccloud/hpf/ictf/clinicIncomePrint.do',
    checkOrg: '/nccloud/hpf/pub/checkOrg.do'
};
const LIST_BUTTON = {
    create: 'AddBtn',
    delete: 'DelBtn',
    commit: 'CommitBtn',
    unCommit: 'UnCommitBtn',
    linkGroup: 'JointBtn',
    attachment: 'AttachmentBtn',
    approvalLink: 'DetailBtn',
    billTrack: 'TrackBtn',
    print: 'Print',
    output: 'Output',
    refresh: 'RefreshBtn',
    down: 'Down',
    bodyUpdate: 'edit',
    bodyDelete: 'delete',
    bodyCommit: 'commit',
    bodyUnCommit: 'unCommit',
    copy: 'copy',
    linkquery: 'linkquery',
    makebill: 'makebill'
};
//列表默认禁用按钮
const LIST_DISABLED_BUTTON = [
    LIST_BUTTON.delete,
    LIST_BUTTON.commit,
    LIST_BUTTON.unCommit,
    LIST_BUTTON.linkGroup,
    LIST_BUTTON.approvalLink,
    LIST_BUTTON.billTrack,
    LIST_BUTTON.attachment,
    LIST_BUTTON.print,
    LIST_BUTTON.output
];
const CARD_BUTTON = {
    save: 'SaveBtn',
    saveAdd: 'SaveAddBtn',
    saveCommit: 'SaveCommitBtn',
    cancel: 'CancelBtn',
    create: 'CreateBtn',
    update: 'UpdateBtn',
    delete: 'DeleteBtn',
    copy: 'CopyBtn',
    commit: 'CommitBtn',
    unCommit: 'UnCommitBtn',
    attachment: 'AttachmentBtn',
    approvalLink: 'DetailBtn',
    billTrack: 'TrackBtn',
    print: 'PrintBtn',
    output: 'OutputBtn',
    refresh: 'RefreshBtn',
    back: 'Back',
    addRow: 'addRow',
    deleteRow: 'deleteRow',
    copyRows: 'copyRows',
    pasteTail: 'pasteTail',
    pasteCancel: 'pasteCancel',
    expand: 'expand',
    insertRow: 'insertRow',
    delRow: 'delRow',
    copyRow: 'copyRow',
    fold: 'fold',
    unfold: 'unfold',
    pasteHere: 'pasteHere',
    linkquery: 'linkquery',
    makebill: 'makebill'
};
//卡片默认禁用按钮
const CARD_DISABLED_BUTTON = [
    CARD_BUTTON.deleteRow,
    CARD_BUTTON.copyRows,
    CARD_BUTTON.makebill,
    CARD_BUTTON.commit,
    CARD_BUTTON.unCommit
];
//卡片新增禁用按钮
const CARD_ADD_DISABLED_BUTTON = [
    CARD_BUTTON.addRow,
    CARD_BUTTON.save,
    CARD_BUTTON.saveAdd,
    CARD_BUTTON.saveCommit
];
//字段名
const FIELD = {
    org: 'pk_org',
    //组织
    //orgV: 'pk_org_v',                                              //组织多版本
    billStatus: 'approvestatus',
    //单据状态字段（用以按钮控制）
    ts: 'ts'
};
//时间戳
//主属性字段名
const PRIMARY_KEY = {
    head_id: 'pk_clinic_income',
    //表头主键字段名
    body_id: 'pk_clinic_income_b',
    //表体主键字段名
    bill_no: 'billno',
    //单据编号字段名
    id: 'id'
};
//单据前端缓存标识
//状态
const STATUS = {
    status: 'status',
    //状态
    edit: 'edit',
    //编辑态
    browse: 'browse',
    //浏览态
    add: 'add',
    //新增态
    info: 'info',
    //帮助
    warning: 'warning',
    //警告
    success: 'success',
    //成功
    danger: 'danger',
    //出错
    NOSTATE: '-1',
    //自由 态
    NOPASS: '0',
    //未通过 态
    PASSING: '1',
    //通过 态
    GOINGON: '2',
    //进行中 态
    COMMIT: '3'
}; //提交 态


/***/ }),

/***/ 3581:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "_": () => (/* binding */ madeBill)
/* harmony export */ });
/* harmony import */ var nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5118);
/* harmony import */ var nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__);

/**
 * 制单   
 * @author xiejhk
 * @param {*} madeData 制单条件 
 * @param {*} pk_bill  主键编码   
 * @param {*} appcode 小应用编码
 * @param {*} list 是否列表  批量
 */ function madeBill(props, madeData, pk_bill, appcode, list, url) {
    let madeDatas = [];
    if (list) {
        madeData.forEach((madeBillData)=>{
            madeDatas.push({
                pk_bill: madeBillData.data.values[pk_bill].value
            });
        });
    } else {
        madeDatas = madeData;
    }
    (0,nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.ajax)({
        url: url,
        data: madeDatas,
        success: (res)=>{
            if (res.success) {
                //打开结算制单节点
                nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.cacheTools.set(appcode + res.data.cachekey, res.data.pklist);
                props.openTo(res.data.url, {
                    status: 'edit',
                    n: '凭证生成',
                    appcode: res.data.appcode,
                    pagecode: res.data.pagecode,
                    scene: appcode + res.data.cachekey
                });
            }
        }
    });
}


/***/ }),

/***/ 5118:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__5118__;

/***/ }),

/***/ 6487:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__6487__;

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
/******/ 			id: moduleId,
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
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ ictf_m0z20602_list)
});

// EXTERNAL MODULE: external {"root":"React","var":"React","commonjs":"react","commonjs2":"react","amd":"react"}
var external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_ = __webpack_require__(6487);
var external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default = /*#__PURE__*/__webpack_require__.n(external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_);
// EXTERNAL MODULE: external "nc-lightapp-front"
var external_nc_lightapp_front_ = __webpack_require__(5118);
// EXTERNAL MODULE: ./src/hpf/ictf/m0z20602/constant/index.js
var constant = __webpack_require__(2301);
// EXTERNAL MODULE: ./src/hpf/public/tool/madebill.js
var madebill = __webpack_require__(3581);
;// CONCATENATED MODULE: ./src/hpf/ictf/m0z20602/list/events/listOperator.js
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



//列表新增
function listCreate(props) {
    props.pushTo(constant.REQUEST_URL.toCard, {
        status: constant.STATUS.add,
        pagecode: constant.CARD.page_code
    });
}
//列表刷新
function listRefresh(props) {
    let { getDefData  } = external_nc_lightapp_front_.cardCache;
    let queryInfo = getDefData(constant.SEARCH_CACHE.key, constant.SEARCH_CACHE.dataSource);
    listSearch.call(this, props, queryInfo);
}
//列表修改
function listOperator_listEdit(props, pk) {
    props.pushTo(REQUEST_URL.toCard, {
        status: STATUS.edit,
        id: pk,
        pagecode: CARD.page_code
    });
}
//列表复制
function listOperator_listCopy(props, pk) {
    props.pushTo(REQUEST_URL.toCard, {
        status: STATUS.edit,
        id: pk,
        pagecode: CARD.page_code,
        isCopy: true
    });
}
//列表提交
function listOperator_listCommit(props, data) {
    if (!data) {
        let select = checkSelected(props, false);
        if (!select.valid) {
            return;
        }
        if (select.valid) {
            let selectDatas = select.selectDatas;
            let pks = selectDatas && selectDatas.map((item)=>item.data.values[constant.PRIMARY_KEY.head_id].value);
            let pkMapTs = new Map();
            selectDatas && selectDatas.map((item)=>{
                let pk = item.data.values[constant.PRIMARY_KEY.head_id].value;
                let ts = item.data.values[constant.FIELD.ts] && item.data.values[constant.FIELD.ts].value;
                //主键与tsMap
                if (pk && ts) {
                    pkMapTs.set(pk, ts);
                }
            });
            data = {
                pks,
                pkMapTs
            };
        }
    }
    (0,external_nc_lightapp_front_.ajax)({
        url: constant.REQUEST_URL.commit,
        data: data,
        success: (res)=>{
            if (res.success) {
                //成功
                if (res.data && res.data.workflow && (res.data.workflow == 'approveflow' || res.data.workflow == 'workflow')) {
                    this.setState({
                        compositeData: res.data,
                        compositeDisplay: true,
                        curPk: data.pks
                    });
                    PromptMessage.call(this, res);
                } else {
                    if (res.data.total && res.data.total > 1) {
                        //批量提交
                        PromptMessage.call(this, res);
                        commitRefresh(props);
                    } else {
                        //单个提交
                        listRefresh(props);
                    }
                }
            } else {
                //失败
                PromptMessage.call(this, res);
            }
        }
    });
}
//toast({ color: STATUS.warning, content: props.json['M0Z20602-000015'] });/* 国际化处理： 提交失败*/
//列表收回
function listOperator_listUnCommit(props, data) {
    if (!data) {
        let select = checkSelected(props, false);
        if (select.valid) {
            let selectDatas = select.selectDatas;
            let pks = selectDatas && selectDatas.map((item)=>item.data.values[constant.PRIMARY_KEY.head_id].value);
            let pkMapTs = new Map();
            selectDatas && selectDatas.map((item)=>{
                let pk = item.data.values[constant.PRIMARY_KEY.head_id].value;
                let ts = item.data.values[constant.FIELD.ts] && item.data.values[constant.FIELD.ts].value;
                //主键与tsMap
                if (pk && ts) {
                    pkMapTs.set(pk, ts);
                }
            });
            data = {
                pks,
                pkMapTs
            };
        }
    }
    (0,external_nc_lightapp_front_.ajax)({
        url: constant.REQUEST_URL.unCommit,
        data: data,
        success: (res)=>{
            if (res.success) {
                //成功
                listRefresh(props);
            } else {
                //失败
                (0,external_nc_lightapp_front_.toast)({
                    color: constant.STATUS.warning,
                    content: props.json['M0Z20602-000017']
                });
            }
        },
        /* 国际化处理： 收回失败*/ error: (res)=>{
            commitRefresh(props);
            console.error(res);
            let msgContent = JSON.stringify(res.message);
            (0,external_nc_lightapp_front_.toast)({
                color: constant.STATUS.danger,
                content: msgContent
            });
        }
    });
}
/**
 * 是否选中数据
 * 
 * @param {*} isCheckOne 是否选中一条数据
 * @returns 返回是否校验成功
 */ function checkSelected(props, isCheckOne) {
    let valid = true;
    let selectDatas = props.table && props.table.getCheckedRows(constant.LIST.table_id);
    if (isCheckOne && selectDatas.length > 1) {
        (0,external_nc_lightapp_front_.toast)({
            color: constant.STATUS.warning,
            content: props.json['M0Z20602-000012']
        });
        /* 国际化处理： 请选中一行表体数据!*/ valid = false;
    } else if (selectDatas.length == 0) {
        (0,external_nc_lightapp_front_.toast)({
            color: constant.STATUS.warning,
            content: props.json['M0Z20602-000013']
        });
        /* 国际化处理： 请选择表体数据操作!*/ valid = false;
    }
    return {
        valid,
        selectDatas
    };
}
//列表附件
function listAttachment(props) {
    let select = checkSelected(props, true);
    if (select.valid) {
        let selectDatas = select.selectDatas;
        let billId = selectDatas[0] && selectDatas[0].data.values[constant.PRIMARY_KEY.head_id].value;
        let billNo = selectDatas[0] && selectDatas[0].data.values[constant.PRIMARY_KEY.bill_no].value;
        this.setState({
            showUploader: !this.state.showUploader,
            billInfo: {
                billId,
                billNo
            }
        });
    }
}
//列表单据追溯
function listBillTrack(props) {
    //单据追溯示例
    let select = checkSelected(props, true);
    if (select.valid) {
        let selectDatas = select.selectDatas;
        let billId = selectDatas[0] && selectDatas[0].data.values[constant.PRIMARY_KEY.head_id].value;
        this.setState({
            showBillTrack: true,
            billTrackBillId: billId,
            billTrackBillType: constant.BILL_TYPE_CODE
        });
    }
}
//列表审批详情
function listLinkApprove(props) {
    let select = checkSelected(props, true);
    if (select.valid) {
        let selectDatas = select.selectDatas;
        let billId = selectDatas[0] && selectDatas[0].data.values[constant.PRIMARY_KEY.head_id].value;
        this.setState({
            showApproveDetail: true,
            billId: billId
        });
    }
}
//列表表头删除
function listHeadDelete(props) {
    let data = {};
    let pks = [];
    let select = checkSelected(props, false);
    if (select.valid) {
        let selectDatas = select.selectDatas;
        pks = selectDatas && selectDatas.map((item)=>item.data.values[constant.PRIMARY_KEY.head_id].value);
        let pkMapTs = new Map();
        selectDatas && selectDatas.map((item)=>{
            let pk = item.data.values[constant.PRIMARY_KEY.head_id].value;
            let ts = item.data.values[constant.FIELD.ts] && item.data.values[constant.FIELD.ts].value;
            //主键与tsMap
            if (pk && ts) {
                pkMapTs.set(pk, ts);
            }
        });
        data = {
            pks,
            pkMapTs
        };
    }
    (0,external_nc_lightapp_front_.ajax)({
        url: constant.REQUEST_URL["delete"],
        data: data,
        success: (res)=>{
            if (res.success) {
                //成功
                let allTableData = props.table.getAllTableData(constant.LIST.table_id);
                let allPks = allTableData.rows[0] && allTableData.rows.map((item)=>item.values[constant.PRIMARY_KEY.head_id].value);
                let deleteRowIndexArr = pks.map((item)=>allPks.findIndex((v)=>v == item)).filter((item)=>item != -1);
                props.table.deleteCacheId(constant.LIST.table_id, pks);
                props.table.deleteTableRowsByIndex(constant.LIST.table_id, deleteRowIndexArr);
                (0,external_nc_lightapp_front_.toast)({
                    color: constant.STATUS.success,
                    content: props.json['M0Z20602-000005']
                });
            } else /* 国际化处理： 删除成功*/ {
                //失败
                (0,external_nc_lightapp_front_.toast)({
                    color: constant.STATUS.warning,
                    content: props.json['M0Z20602-000009']
                });
            }
        }
    });
}
/* 国际化处理： 删除失败*/ //列表表体删除
function listOperator_listBodyDelete(props, data, index) {
    ajax({
        url: REQUEST_URL.delete,
        data: data,
        success: (res)=>{
            if (res.success) {
                //成功
                props.table.deleteCacheId(LIST.table_id, data.pks[0]);
                props.table.deleteTableRowsByIndex(LIST.table_id, index);
                toast({
                    color: STATUS.success,
                    content: props.json['M0Z20602-000005']
                });
            } else /* 国际化处理： 删除成功*/ {
                //失败
                toast({
                    color: STATUS.warning,
                    content: props.json['M0Z20602-000009']
                });
            }
        }
    });
}
/* 国际化处理： 删除失败*/ function listDownFromMiddb(props) {
    let pk_org = props.search.getSearchValByField(constant.LIST.search_id, 'pk_org');
    if (pk_org && pk_org.value && pk_org.value.firstvalue) {
        let value = pk_org.value.firstvalue;
        this.setState({
            pk_org: value
        });
    }
    props.modal.show('showDialog');
}
//下载
function beSureBtnClick(props) {
    let dbsource = this.state.dbsource;
    if (Object.keys(dbsource).length == 0) {
        (0,external_nc_lightapp_front_.toast)({
            color: constant.STATUS.warning,
            content: '[来源系统]不能为空,请检查'
        });
        /* 国际化处理： 删除失败*/ return;
    }
    let begdate = this.state.vdate;
    if (!begdate) {
        (0,external_nc_lightapp_front_.toast)({
            color: constant.STATUS.warning,
            content: '[下载区间]不能为空,请检查'
        });
        /* 国际化处理： 删除失败*/ return;
    }
    let transtypepk = this.state.transtypepk;
    if (Object.keys(transtypepk).length == 0) {
        (0,external_nc_lightapp_front_.toast)({
            color: constant.STATUS.warning,
            content: '[业务类型]不能为空,请检查'
        });
        /* 国际化处理： */ return;
    }
    let param = {
        ref1: dbsource,
        daterange: begdate,
        transtype: transtypepk.map((item)=>{
            return item.refcode;
        })
    };
    (0,external_nc_lightapp_front_.ajax)({
        url: constant.REQUEST_URL.down,
        data: param,
        success: (res)=>{
            if (res.success) {
                //成功
                if (res.data) {
                    (0,external_nc_lightapp_front_.promptBox)({
                        color: constant.STATUS.success,
                        title: "提示",
                        content: res.data,
                        beSureBtnClick: ()=>{
                            if (res.data.indexOf("成功生成") != -1) {
                                //设置下载后查询区结算日期
                                let stardate = begdate[0].split(" ")[0];
                                let enddate = begdate[1].split(" ")[0];
                                props.search.setSearchValByField(constant.LIST.search_id, 'dbusdate', {
                                    display: stardate + '~' + enddate,
                                    value: begdate[0] + ',' + begdate[1]
                                });
                                listRefresh(_objectSpreadProps(_objectSpread({}, props), {
                                    json: this.state.json
                                }));
                            }
                        }
                    });
                }
            } else {
                //失败
                (0,external_nc_lightapp_front_.toast)({
                    color: constant.STATUS.warning,
                    content: '下载失败!'
                });
            }
        }
    });
}
function cancelBtnClick(props) {}
//列表查询
function listSearch(props, queryInfo) {
    let pageInfo = props.table.getTablePageInfo(constant.LIST.table_id);
    if (!queryInfo) {
        queryInfo = props.search.getQueryInfo(constant.LIST.search_id);
    }
    queryInfo.pageInfo = pageInfo;
    queryInfo.pageCode = constant.LIST.page_code;
    // 刷新按钮可用
    props.button.setDisabled({
        [constant.LIST_BUTTON.refresh]: false
    });
    //重置默认禁用按钮
    props.button.setButtonDisabled(constant.LIST_DISABLED_BUTTON, true);
    (0,external_nc_lightapp_front_.ajax)({
        url: constant.REQUEST_URL.queryList,
        data: queryInfo,
        success: (res)=>{
            let { success , data  } = res;
            if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
                props.dealFormulamsg(res.formulamsg);
            }
            if (success && data && data[constant.LIST.table_id]) {
                props.table.setAllTableData(constant.LIST.table_id, data[constant.LIST.table_id]);
                (0,external_nc_lightapp_front_.toast)({
                    color: constant.STATUS.success
                });
            } else {
                props.table.setAllTableData(constant.LIST.table_id, {
                    rows: []
                });
                (0,external_nc_lightapp_front_.toast)({
                    color: constant.STATUS.warning,
                    content: props.json['M0Z20602-000010']
                });
            }
            /* 国际化处理： 未查询出符合条件的数据！*/ // 将查询条件缓存
            let { setDefData  } = external_nc_lightapp_front_.cardCache;
            setDefData(constant.SEARCH_CACHE.key, constant.SEARCH_CACHE.dataSource, queryInfo);
        }
    });
}
function listLinkQuery(props, data) {
    let sels = props.table.getCheckedRows(constant.LIST.table_id);
    if (sels.length == 0) {
        (0,external_nc_lightapp_front_.toast)({
            color: constant.STATUS.warning,
            content: "当前没有选中单据！"
        });
        /* 国际化处理：*/ return;
    }
    if (sels.length > 1) {
        (0,external_nc_lightapp_front_.toast)({
            color: constant.STATUS.warning,
            content: "请选择一条单据进行操作！"
        });
        /* 国际化处理：*/ return;
    }
    let param = {
        pk_group: sels[0].data.values.pk_group.value,
        pk_org: sels[0].data.values.pk_group.value,
        cbillid: sels[0].data.values.pk_clinic_income.value,
        vtrantypecode: sels[0].data.values.transtype.value
    };
    (0,external_nc_lightapp_front_.ajax)({
        url: constant.REQUEST_URL.linkquery,
        data: param,
        success: (res)=>{
            let { success , data  } = res;
            if (success && data) {
                let srcCode = res.data.src;
                if ('_LinkVouchar2019' == srcCode) {
                    //走联查
                    if (res.data.des) {
                        //跳转到凭证界面
                        if (res.data.pklist) {
                            if (res.data.pklist.length == 1) {
                                //单笔联查
                                props.openTo(res.data.url, {
                                    status: 'browse',
                                    appcode: res.data.appcode,
                                    pagecode: res.data.pagecode,
                                    id: res.data.pklist[0],
                                    n: '制单',
                                    backflag: 'noback'
                                });
                                return;
                            }
                        }
                    }
                } else {
                    (0,external_nc_lightapp_front_.promptBox)({
                        color: "info",
                        // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                        title: "请注意",
                        // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
                        content: "没有相应的凭证信息!",
                        // 提示内容,非必输
                        noCancelBtn: true
                    });
                }
            }
        }
    });
}
// 是否显示取消按钮,，默认显示(false),非必输
function listMakeBill(props) {
    let madeData = props.table.getCheckedRows(constant.LIST.table_id);
    let pk_bill = constant.PRIMARY_KEY.head_id;
    let appcode = props.getSearchParam('c');
    (0,madebill/* madeBill */._)(props, madeData, pk_bill, appcode, true, constant.REQUEST_URL.makebill);
}
//分页查询
function pageInfoClick(props, config, pks) {
    let data = {
        pks,
        pagecode: constant.LIST.page_code
    };
    (0,external_nc_lightapp_front_.ajax)({
        url: constant.REQUEST_URL.queryListByPks,
        data: data,
        success: (res)=>{
            let { success , data  } = res;
            if (success && data && data[constant.LIST.table_id]) {
                props.table.setAllTableData(constant.LIST.table_id, data[constant.LIST.table_id]);
                (0,external_nc_lightapp_front_.toast)({
                    color: constant.STATUS.success
                });
            } else {
                props.table.setAllTableData(constant.LIST.table_id, {
                    rows: []
                });
                (0,external_nc_lightapp_front_.toast)({
                    color: constant.STATUS.warning,
                    content: props.json['M0Z20602-000010']
                });
            }
        }
    });
}
/* 国际化处理： 未查询出符合条件的数据！*/ /**
 * 列表消息提示
 * @param {*} res           返回的response
 * @param {*} opername      操作名称
 */ function PromptMessage(res) {
    let { status , msg  } = res.data;
    let content;
    let total = res.data.total;
    let successNum = res.data.successNum;
    let failNum = res.data.failNum;
    content = '共' + '提交' + total + '条';
    /* 国际化处理： 共,条，*/ content = content + ',成功' + successNum + '条';
    /* 国际化处理： 成功,条 ,,成功*/ content = content + ',失败' + failNum + '条';
    /* 国际化处理： 失败,条,条*/ let errMsgArr = res.data.errormessages;
    //添加详细信息
    let msgArr = "";
    if (res.data.data && res.data.data.length > 0) {
        let data = res.data.data;
        for(var i = 0; i < data.length; i++){
            msgArr += " \n 单据号=" + data[i].vbillno + ">>" + data[i].msg;
        }
    }
    //全部成功
    if (status == 0) {
        (0,external_nc_lightapp_front_.toast)({
            color: "success",
            title: '提交' + msg,
            content: content + msgArr,
            TextArr: [
                '展开',
                '收起',
                '关闭'
            ],
            /* 国际化处理： 展开,收起,关闭*/ groupOperation: true
        });
    } else //全部失败
    if (status == 1) {
        (0,external_nc_lightapp_front_.toast)({
            duration: "infinity",
            color: "danger",
            title: '提交' + msg,
            content: content + msgArr,
            TextArr: [
                '展开',
                '收起',
                '关闭'
            ],
            /* 国际化处理： 展开,收起,关闭*/ groupOperation: true,
            groupOperationMsg: errMsgArr
        });
    } else //部分成功
    if (status == 2) {
        (0,external_nc_lightapp_front_.toast)({
            duration: "infinity",
            color: "warning",
            title: '提交' + msg,
            content: content + msgArr,
            TextArr: [
                '展开',
                '收起',
                '关闭'
            ],
            /* 国际化处理： 展开,收起,关闭*/ groupOperation: true,
            groupOperationMsg: errMsgArr
        });
    }
}
//列表行双击
function handleDoubleClick(record, index, props) {
    props.pushTo(constant.REQUEST_URL.toCard, {
        status: constant.STATUS.browse,
        id: record[constant.PRIMARY_KEY.head_id].value,
        pagecode: constant.CARD.page_code,
        scene: props.getUrlParam('scene')
    });
}
;
/**
* 打印
*/ function onPrint(props) {
    let selectDatas = props.table.getCheckedRows(constant.LIST.table_id);
    if (selectDatas.length === 0) {
        (0,external_nc_lightapp_front_.toast)({
            color: constant.STATUS.warning,
            content: "无可打印数据"
        });
        /* 国际化处理:*/ return;
    }
    let pks = [];
    selectDatas.forEach((item, key)=>{
        pks.push(item.data.values[constant.PRIMARY_KEY.head_id].value);
    });
    (0,external_nc_lightapp_front_.print)('pdf', constant.REQUEST_URL.Print, {
        funcode: props.appcode,
        //功能节点编码
        nodekey: 'M0Z20602_CARD',
        //模板节点编码
        oids: pks
    });
}
//outputType:'output'
/**
* 输出
*/ function onOutput(props) {
    let selectDatas = props.table.getCheckedRows(constant.LIST.table_id);
    if (selectDatas.length === 0) {
        (0,external_nc_lightapp_front_.toast)({
            color: constant.STATUS.warning,
            content: "无可输出的数据"
        });
        /* 国际化处理:*/ return;
    }
    let pks = [];
    selectDatas.forEach((item, key)=>{
        pks.push(item.data.values[constant.PRIMARY_KEY.head_id].value);
    });
    this.setState({
        ids: pks
    }, this.refs.printOutput.open());
}
/**
* 查询条件编辑后事件
* @param {*} props
* @param {*} data
*/ function onSearchAfterEvent(props) {
    this.setState({
        dbsource: {},
        pk_org: "",
        vdate: [
            '',
            ''
        ],
        transtypepk: ''
    });
    props.button.setButtonDisabled(constant.LIST_BUTTON.down, false);
    let pk_org = props.search.getSearchValByField(constant.LIST.search_id, 'pk_org');
    if (pk_org && pk_org.value && pk_org.value.firstvalue) {
        let value = pk_org.value.firstvalue;
        this.setState({
            pk_org: value
        });
    } else {
        props.button.setButtonDisabled(constant.LIST_BUTTON.down, true);
    }
}
//提交刷新
function commitRefresh(props) {
    let { getDefData  } = external_nc_lightapp_front_.cardCache;
    let queryInfo = getDefData(constant.SEARCH_CACHE.key, constant.SEARCH_CACHE.dataSource);
    let pageInfo = props.table.getTablePageInfo(constant.LIST.table_id);
    if (!queryInfo) {
        queryInfo = props.search.getQueryInfo(constant.LIST.search_id);
    }
    queryInfo.pageInfo = pageInfo;
    queryInfo.pageCode = constant.LIST.page_code;
    // 刷新按钮可用
    props.button.setDisabled({
        [constant.LIST_BUTTON.refresh]: false
    });
    //重置默认禁用按钮
    props.button.setButtonDisabled(constant.LIST_DISABLED_BUTTON, true);
    (0,external_nc_lightapp_front_.ajax)({
        url: constant.REQUEST_URL.queryList,
        data: queryInfo,
        success: (res)=>{
            let { success , data  } = res;
            if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
                props.dealFormulamsg(res.formulamsg);
            }
            if (success && data && data[constant.LIST.table_id]) {
                props.table.setAllTableData(constant.LIST.table_id, data[constant.LIST.table_id]);
            } else //toast({ color: STATUS.success });
            {
                props.table.setAllTableData(constant.LIST.table_id, {
                    rows: []
                });
                (0,external_nc_lightapp_front_.toast)({
                    color: constant.STATUS.warning,
                    content: props.json['M0Z20602-000010']
                });
            }
            /* 国际化处理： 未查询出符合条件的数据！*/ // 将查询条件缓存
            let { setDefData  } = external_nc_lightapp_front_.cardCache;
            setDefData(constant.SEARCH_CACHE.key, constant.SEARCH_CACHE.dataSource, queryInfo);
        }
    });
}
//默认组织校验
function checkOrg(props, data) {
    let pk_org = data.context.pk_org;
    let org_Name = data.context.org_Name;
    (0,external_nc_lightapp_front_.ajax)({
        url: constant.REQUEST_URL.checkOrg,
        data: pk_org,
        success: (res)=>{
            if (res.success) {
                //成功
                if (res.data && res.data == "Y") {
                    props.search.setSearchValByField(constant.LIST.search_id, constant.FIELD.org, {
                        display: org_Name,
                        value: pk_org
                    });
                    this.setState({
                        pk_org: pk_org
                    });
                } else {
                    props.button.setButtonDisabled(constant.LIST_BUTTON.down, true);
                }
            }
        }
    });
}

;// CONCATENATED MODULE: ./src/hpf/ictf/m0z20602/list/events/bodyButtonClick.js
function bodyButtonClick_defineProperty(obj, key, value) {
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
function bodyButtonClick_objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === 'function') {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            bodyButtonClick_defineProperty(target, key, source[key]);
        });
    }
    return target;
}
function bodyButtonClick_ownKeys(object, enumerableOnly) {
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
function bodyButtonClick_objectSpreadProps(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        bodyButtonClick_ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}


//列表操作列按钮操作
function bodyButtonClick(props, key, text, record, index) {
    let pk = record[PRIMARY_KEY.head_id] && record[PRIMARY_KEY.head_id].value;
    let ts = record[FIELD.ts] && record[FIELD.ts].value;
    let pkMapTs = new Map();
    //主键与tsMap
    if (pk && ts) {
        pkMapTs.set(pk, ts);
    }
    switch(key){
        //修改
        case LIST_BUTTON.bodyUpdate:
            listEdit(props, pk);
            break;
        //删除
        case LIST_BUTTON.bodyDelete:
            listBodyDelete(bodyButtonClick_objectSpreadProps(bodyButtonClick_objectSpread({}, props), {
                json: this.state.json
            }), {
                pks: [
                    pk
                ],
                pkMapTs
            }, index);
            break;
        //复制
        case LIST_BUTTON.copy:
            listCopy(props, pk);
            break;
        //提交
        case LIST_BUTTON.bodyCommit:
            listCommit.call(this, bodyButtonClick_objectSpreadProps(bodyButtonClick_objectSpread({}, props), {
                json: this.state.json
            }), {
                pks: [
                    pk
                ],
                pkMapTs
            });
            break;
        //收回
        case LIST_BUTTON.bodyUnCommit:
            listUnCommit(bodyButtonClick_objectSpreadProps(bodyButtonClick_objectSpread({}, props), {
                json: this.state.json
            }), {
                pks: [
                    pk
                ],
                pkMapTs
            });
            break;
    }
}

;// CONCATENATED MODULE: ./src/hpf/ictf/m0z20602/list/events/initTemplate.js



//列表模板渲染
function initTemplate(props) {
    props.createUIDom({
        pagecode: constant.LIST.page_code
    }, //页面code
    (data)=>{
        if (data) {
            if (data.button) {
                //将请求回来的按钮组数据设置到页面的 buttons 属性上
                let button = data.button;
                props.button.setButtons(button);
                props.button.setPopContent(constant.LIST_BUTTON.bodyDelete, this.state.json['M0Z20602-000008']);
                /* 国际化处理： 确认要删除吗?*/ props.button.setButtonDisabled(constant.LIST_DISABLED_BUTTON, true);
            }
            if (data.template) {
                let meta = data.template;
                meta = modifierMeta.call(this, props, meta);
                //高级查询区赋予组织
                if (data.context && data.context.pk_org) {
                    let { pk_org , org_Name  } = data.context;
                    //遍历查询区域字段，将默认业务单元赋值给组织字段
                    meta[constant.LIST.search_id].items.map((item)=>{
                        if (item.attrcode == constant.FIELD.org) {
                            checkOrg.call(this, props, data);
                        }
                    });
                }
                //item.initialvalue = { display: org_Name, value: pk_org }
                //else if (item.attrcode == FIELD.orgV) {
                //                                                              item.initialvalue = { display: org_v_Name, value: pk_org_v }
                //                                                      }
                props.meta.setMeta(meta);
                //查询区赋予组织
                //判断查询区域组织是否有值，如果有则表明快速查询方案已个性化定制。无需加载默认业务单元
                // if (data.context && data.context.pk_org) {
                //         let orgValue = props.search.getSearchValByField(LIST.search_id, FIELD.org);
                //         //let orgVValue = props.search.getSearchValByField(LIST.search_id, FIELD.orgV);
                //         // if (!(orgValue && orgValue.value) && !(orgVValue && orgVValue.value)) {
                //         if (!(orgValue && orgValue.value)) {
                //                 let { pk_org, org_Name } = data.context;
                //                 props.search.setSearchValByField(LIST.search_id, FIELD.org, { display: org_Name, value: pk_org });
                //                 //props.search.setSearchValByField(LIST.search_id, FIELD.orgV, { display: org_v_Name, value: pk_org_v });
                //         }
                //         //查询方案已个性化定制，默认赋值pk_org
                //         this.setState({pk_org: data.context.pk_org});
                // }
                //设置默认单据日期
                props.search.setSearchValByField(constant.LIST.search_id, 'dbusdate', {
                    display: '本月~本月',
                    value: '#month(0)#,#month(0)#'
                });
            }
        }
    });
}
// let pk_org = props.search.getSearchValByField(LIST.search_id, 'pk_org');
// if (pk_org ) {
//         this.setState({ pk_org: pk_org });
// }else{
//         props.button.setButtonDisabled(LIST_BUTTON.down, true);
// }
function modifierMeta(props, meta) {
    //查询区参照过滤
    meta[constant.LIST.search_id].items.map((item)=>{
        if (item.attrcode === constant.FIELD.org) {
            //财务组织过滤
            item.isMultiSelectedEnabled = false;
            //财务组织多选
            item.queryCondition = ()=>{
                return {
                    funcode: props.getSearchParam('c'),
                    //appcode获取
                    //用户权限过滤
                    TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
                };
            };
        }
    });
    //else if (item.attrcode === FIELD.orgV) {
    //      item.isMultiSelectedEnabled = true;
    //      item.queryCondition = () => {
    //              return {
    //                      funcode: props.getSearchParam('c')//appcode获取
    //              };
    //      };
    //}
    //开启分页
    meta[constant.LIST.table_id].pagination = true;
    meta[constant.LIST.table_id].items = meta[constant.LIST.table_id].items.map((item, key)=>{
        if (item.attrcode == constant.PRIMARY_KEY.bill_no) {
            item.render = (text, record, index)=>{
                return /*#__PURE__*/ React.createElement("a", {
                    style: {
                        cursor: 'pointer'
                    },
                    onClick: ()=>{
                        props.pushTo(constant.REQUEST_URL.toCard, {
                            status: constant.STATUS.browse,
                            id: record[constant.PRIMARY_KEY.head_id].value,
                            pagecode: constant.CARD.page_code
                        });
                    },
                    __source: {
                        fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\ictf\\m0z20602\\list\\events\\initTemplate.js",
                        lineNumber: 98,
                        columnNumber: 41
                    },
                    __self: this
                }, record[constant.PRIMARY_KEY.bill_no] && record[constant.PRIMARY_KEY.bill_no].value);
            };
        }
        return item;
    });
    // //添加操作列
    // //示例代码
    // meta[LIST.table_id].items.push({
    //         itemtype: 'customer',
    //         attrcode: 'opr',
    //         label: this.state.json['M0Z20602-000006'],/* 国际化处理： 操作*/
    //         width: '180px',
    //         fixed: 'right',
    //         className: "table-opr",
    //         visible: true,
    //         render: (text, record, index) => {
    //                 let buttonAry = [];
    //                 let billStatus = record[FIELD.billStatus] && record[FIELD.billStatus].value;
    //                 switch (billStatus) {
    //                         case STATUS.NOSTATE:
    //                                 buttonAry = [LIST_BUTTON.bodyCommit, LIST_BUTTON.bodyUpdate, LIST_BUTTON.bodyDelete, LIST_BUTTON.copy];
    //                                 break;
    //                         case STATUS.PASSING:
    //                         case STATUS.COMMIT:
    //                         case STATUS.GOINGON:
    //                                 buttonAry = [LIST_BUTTON.bodyUnCommit, LIST_BUTTON.copy];
    //                                 break;
    //                         default:
    //                                 buttonAry = [LIST_BUTTON.copy];
    //                                 break;
    //                 }
    //                 return props.button.createOprationButton(buttonAry, {
    //                         area: LIST.body_btn_code,
    //                         buttonLimit: 4,
    //                         onButtonClick: (props, key) => bodyButtonClick.call(this, props, key, text, record, index)
    //                 });
    //         }
    // });
    //搜索区业务类型参照过滤
    meta[constant.LIST.search_id].items.map((item)=>{
        if (item.attrcode === 'transtypepk') {
            item.queryCondition = ()=>{
                return {
                    parentbilltype: constant.BILL_TYPE_CODE
                };
            };
        }
    });
    return meta;
}

;// CONCATENATED MODULE: ./src/hpf/ictf/m0z20602/list/events/buttonClick.js
function buttonClick_defineProperty(obj, key, value) {
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
function buttonClick_objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === 'function') {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            buttonClick_defineProperty(target, key, source[key]);
        });
    }
    return target;
}
function buttonClick_ownKeys(object, enumerableOnly) {
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
function buttonClick_objectSpreadProps(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        buttonClick_ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}



//列表头部按钮操作
function buttonClick(props, id, text, record, index) {
    switch(id){
        //新增
        case constant.LIST_BUTTON.create:
            listCreate(props);
            break;
        //删除
        case constant.LIST_BUTTON["delete"]:
            (0,external_nc_lightapp_front_.promptBox)({
                color: constant.STATUS.warning,
                title: this.state.json['M0Z20602-000000'],
                /* 国际化处理： 删除*/ content: this.state.json['M0Z20602-000001'],
                /* 国际化处理： 确定删除吗？*/ beSureBtnClick: ()=>{
                    listHeadDelete(buttonClick_objectSpreadProps(buttonClick_objectSpread({}, props), {
                        json: this.state.json
                    }));
                }
            });
            break;
        //附件
        case constant.LIST_BUTTON.attachment:
            listAttachment.call(this, buttonClick_objectSpreadProps(buttonClick_objectSpread({}, props), {
                json: this.state.json
            }));
            break;
        //单据追溯
        case constant.LIST_BUTTON.billTrack:
            listBillTrack.call(this, buttonClick_objectSpreadProps(buttonClick_objectSpread({}, props), {
                json: this.state.json
            }));
            break;
        //审批详情
        case constant.LIST_BUTTON.approvalLink:
            listLinkApprove.call(this, buttonClick_objectSpreadProps(buttonClick_objectSpread({}, props), {
                json: this.state.json
            }));
            break;
        //提交
        case constant.LIST_BUTTON.commit:
            listOperator_listCommit.call(this, buttonClick_objectSpreadProps(buttonClick_objectSpread({}, props), {
                json: this.state.json
            }));
            break;
        //收回
        case constant.LIST_BUTTON.unCommit:
            listOperator_listUnCommit(buttonClick_objectSpreadProps(buttonClick_objectSpread({}, props), {
                json: this.state.json
            }));
            break;
        //刷新
        case constant.LIST_BUTTON.refresh:
            listRefresh(buttonClick_objectSpreadProps(buttonClick_objectSpread({}, props), {
                json: this.state.json
            }));
            break;
        //下载
        case constant.LIST_BUTTON.down:
            listDownFromMiddb.call(this, buttonClick_objectSpreadProps(buttonClick_objectSpread({}, props), {
                json: this.state.json
            }));
            break;
        //联查凭证
        case constant.LIST_BUTTON.linkquery:
            listLinkQuery(buttonClick_objectSpreadProps(buttonClick_objectSpread({}, props), {
                json: this.state.json
            }));
            break;
        //制单
        case constant.LIST_BUTTON.makebill:
            listMakeBill(buttonClick_objectSpreadProps(buttonClick_objectSpread({}, props), {
                json: this.state.json
            }));
            break;
        //打印
        case constant.LIST_BUTTON.print:
            onPrint.call(this, buttonClick_objectSpreadProps(buttonClick_objectSpread({}, props), {
                json: this.state.json
            }));
            break;
        //输出
        case constant.LIST_BUTTON.output:
            onOutput.call(this, buttonClick_objectSpreadProps(buttonClick_objectSpread({}, props), {
                json: this.state.json
            }));
            break;
    }
}

;// CONCATENATED MODULE: ./src/hpf/ictf/m0z20602/list/events/searchBtnClick.js

//点击查询，获取查询区数据
function searchBtnClick(props) {
    listSearch(props);
}

;// CONCATENATED MODULE: ./src/hpf/ictf/m0z20602/list/events/selectedEvent.js

//选择事件示例
//单选 props, moduleId(区域id), record（行数据）, index（当前index）, status（选框值）
function selectedEvent(props, moduleId, record, index, status) {
    props.button.setButtonDisabled(constant.LIST_DISABLED_BUTTON, true);
    let showBtn = [], deleteFlag = true, isAllNoState = true, isAllPassing = true;
    let selectDatas = props.table.getCheckedRows(constant.LIST.table_id);
    if (selectDatas.length == 0) {
        return;
    } else if (selectDatas.length > 1) {
        //多选
        showBtn = [
            constant.LIST_BUTTON.print,
            constant.LIST_BUTTON.output,
            constant.LIST_BUTTON.commit,
            constant.LIST_BUTTON.unCommit
        ];
        for (let selectData of selectDatas){
            let status = selectData.data.values[constant.FIELD.billStatus].value;
            if (status == constant.STATUS.PASSING || status == constant.STATUS.COMMIT || status == constant.STATUS.GOINGON) {
                isAllNoState = false;
                deleteFlag = false;
            } else if (status == constant.STATUS.NOSTATE) {
                isAllPassing = false;
            }
        }
        if (deleteFlag) {
            showBtn.push(constant.LIST_BUTTON["delete"]);
        }
        // if (isAllNoState) {
        //     showBtn.push(LIST_BUTTON.commit);
        // }
        // if (isAllPassing) {
        //     showBtn.push(LIST_BUTTON.unCommit);
        // }
        props.button.setButtonDisabled(showBtn, false);
    } else {
        //单选
        let busistatus = selectDatas[0].data.values[constant.FIELD.billStatus] && selectDatas[0].data.values[constant.FIELD.billStatus].value;
        if (busistatus == constant.STATUS.NOSTATE) {
            //自由
            showBtn = [
                constant.LIST_BUTTON.commit,
                constant.LIST_BUTTON["delete"]
            ];
        } else if (busistatus == constant.STATUS.PASSING || busistatus == constant.STATUS.COMMIT || busistatus == constant.STATUS.GOINGON) {
            //提交
            showBtn = [
                constant.LIST_BUTTON.unCommit,
                constant.LIST_BUTTON.approvalLink
            ];
        }
        props.button.setButtonDisabled([
            ...showBtn,
            constant.LIST_BUTTON.print,
            constant.LIST_BUTTON.output,
            constant.LIST_BUTTON.attachment,
            constant.LIST_BUTTON.linkGroup,
            constant.LIST_BUTTON.billTrack
        ], false);
    }
}
//全选
function selectedAllEvent(props, moduleId, status, length) {
    props.button.setButtonDisabled(constant.LIST_DISABLED_BUTTON, true);
    let selectDatas = props.table.getCheckedRows(constant.LIST.table_id);
    if (selectDatas.length > 0) {
        let showBtn = [], deleteFlag = true, isAllNoState = true, isAllPassing = true;
        let selectDatas = props.table.getCheckedRows(constant.LIST.table_id);
        showBtn = [
            constant.LIST_BUTTON.print,
            constant.LIST_BUTTON.output,
            constant.LIST_BUTTON.commit,
            constant.LIST_BUTTON.unCommit
        ];
        for (let selectData of selectDatas){
            let status = selectData.data.values[constant.FIELD.billStatus].value;
            if (status == constant.STATUS.PASSING || status == constant.STATUS.COMMIT || status == constant.STATUS.GOINGON) {
                isAllNoState = false;
                deleteFlag = false;
            } else if (status == constant.STATUS.NOSTATE) {
                isAllPassing = false;
            }
        }
        if (deleteFlag) {
            showBtn.push(constant.LIST_BUTTON["delete"]);
        }
        // if (isAllNoState) {
        //     showBtn.push(LIST_BUTTON.commit);
        // }
        // if (isAllPassing) {
        //     showBtn.push(LIST_BUTTON.unCommit);
        // }
        props.button.setButtonDisabled(showBtn, false);
    }
}

;// CONCATENATED MODULE: ./src/hpf/public/tool/queryVocherSrcUtils.js

/**
 * 凭证联查来源单据 add by suqc
 * @param {*} props
 * @param {*} tableId 列表表体编码
 * @param {*} pkField 单据主键字段
 * @param {*} pagecode 应用pagecode
 */ function queryVoucherSrc(props, tableId, pkField, pagecode, customFunc) {
    //凭证联查单据
    let src = props.getUrlParam('scene');
    //获取联查场景
    if (src) {
        if ('fip' == src) {
            //fip代表会计平台
            //执行第2步
            let checkedData = [];
            checkedData = external_nc_lightapp_front_.cacheTools.get('checkedData');
            let data = {
                checkedData,
                pagecode
            };
            (0,external_nc_lightapp_front_.ajax)({
                url: '/nccloud/hpf/pub/queryVoucherSrc.do',
                data: data,
                success: (res)=>{
                    let { success , data  } = res;
                    if (success) {
                        if (data) {
                            //如果只有一行,则在返回到列表界面之后再次跳转到卡片界面
                            if (data[tableId].rows.length == 1) {
                                let pk = data[tableId].rows[0].values[pkField].value;
                                props.table.setAllTableData(tableId, data[tableId]);
                                setTimeout(()=>{
                                    props.pushTo('/card', {
                                        pagecode: pagecode.replace('LIST', 'CARD'),
                                        status: 'browse',
                                        id: pk ? pk : ''
                                    });
                                }, 1500);
                            } else {
                                props.table.setAllTableData(tableId, data[tableId]);
                            }
                        } else {
                            props.table.setAllTableData(tableId, {
                                rows: []
                            });
                            (0,external_nc_lightapp_front_.toast)({
                                color: 'warning',
                                title: "未联查出数据"
                            });
                        }
                    }
                }
            });
        }
    }
} /* 国际化处理： 下载成功*/ 

// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js
var injectStylesIntoStyleTag = __webpack_require__(3379);
var injectStylesIntoStyleTag_default = /*#__PURE__*/__webpack_require__.n(injectStylesIntoStyleTag);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleDomAPI.js
var styleDomAPI = __webpack_require__(7795);
var styleDomAPI_default = /*#__PURE__*/__webpack_require__.n(styleDomAPI);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertBySelector.js
var insertBySelector = __webpack_require__(569);
var insertBySelector_default = /*#__PURE__*/__webpack_require__.n(insertBySelector);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js
var setAttributesWithoutAttributes = __webpack_require__(3565);
var setAttributesWithoutAttributes_default = /*#__PURE__*/__webpack_require__.n(setAttributesWithoutAttributes);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertStyleElement.js
var insertStyleElement = __webpack_require__(9216);
var insertStyleElement_default = /*#__PURE__*/__webpack_require__.n(insertStyleElement);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleTagTransform.js
var styleTagTransform = __webpack_require__(4589);
var styleTagTransform_default = /*#__PURE__*/__webpack_require__.n(styleTagTransform);
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/less-loader/dist/cjs.js!./src/hpf/ictf/m0z20602/list/index.less
var list = __webpack_require__(9137);
;// CONCATENATED MODULE: ./src/hpf/ictf/m0z20602/list/index.less

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (styleTagTransform_default());
options.setAttributes = (setAttributesWithoutAttributes_default());

      options.insert = insertBySelector_default().bind(null, "head");
    
options.domAPI = (styleDomAPI_default());
options.insertStyleElement = (insertStyleElement_default());

var update = injectStylesIntoStyleTag_default()(list/* default */.Z, options);




       /* harmony default export */ const m0z20602_list = (list/* default */.Z && list/* default.locals */.Z.locals ? list/* default.locals */.Z.locals : undefined);

;// CONCATENATED MODULE: ./src/hpf/ictf/m0z20602/list/index.js
function list_defineProperty(obj, key, value) {
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
function list_objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === 'function') {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            list_defineProperty(target, key, source[key]);
        });
    }
    return target;
}
function list_ownKeys(object, enumerableOnly) {
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
function list_objectSpreadProps(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        list_ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}










const { PrintOutput  } = external_nc_lightapp_front_.high;
let List = class List extends external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_.Component {
    //业务类型
    componentWillMount() {
        // json： 多语json格式参数； 
        // status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； 
        // inlt： 可用来进行占位符的一些操作
        let callback = (json, status, inlt)=>{
            if (status) {
                initTemplate.call(this, this.props);
                // 如模板内也有多语处理，平台推荐模板加载操作放于此处， 在取到json多语资源后用传参的方式传入intemplate模板函数中
                // 保存json和inlt到页面state中并刷新页面
                this.setState({
                    json,
                    inlt
                });
            }
        };
        this.props.MultiInit.getMultiLang({
            moduleId: constant.MULTILANG.moduleId,
            domainName: constant.MULTILANG.domainName,
            callback
        });
    }
    componentDidMount() {
        let { getDefData  } = external_nc_lightapp_front_.cardCache;
        if (getDefData(constant.SEARCH_CACHE.key, constant.SEARCH_CACHE.dataSource)) {
            this.props.button.setDisabled({
                [constant.LIST_BUTTON.refresh]: false
            });
        } else {
            this.props.button.setDisabled({
                [constant.LIST_BUTTON.refresh]: true
            });
        }
        queryVoucherSrc(this.props, constant.LIST.table_id, constant.PRIMARY_KEY.head_id, constant.LIST.page_code);
    }
    render() {
        let { table , search , modal  } = this.props;
        const { createModal  } = modal;
        let { createSimpleTable  } = table;
        let { NCCreateSearch  } = search;
        let { NCUploader , BillTrack , ApprovalTrans , ApproveDetail , Refer  } = external_nc_lightapp_front_.high;
        const { NCDatePicker , NCTZDatePickClientTime , NCRangePickerClient  } = external_nc_lightapp_front_.base;
        const { NCYearPicker  } = NCDatePicker;
        return /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement("div", {
            className: "nc-bill-list",
            __source: {
                fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\ictf\\m0z20602\\list\\index.js",
                lineNumber: 115,
                columnNumber: 25
            },
            __self: this
        }, /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement("div", {
            className: "nc-bill-header-area",
            __source: {
                fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\ictf\\m0z20602\\list\\index.js",
                lineNumber: 116,
                columnNumber: 33
            },
            __self: this
        }, /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement("div", {
            className: "header-title-search-area",
            __source: {
                fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\ictf\\m0z20602\\list\\index.js",
                lineNumber: 117,
                columnNumber: 41
            },
            __self: this
        }, (0,external_nc_lightapp_front_.createPageIcon)(), /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement("h2", {
            className: "title-search-detail",
            __source: {
                fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\ictf\\m0z20602\\list\\index.js",
                lineNumber: 119,
                columnNumber: 49
            },
            __self: this
        }, this.state.json[constant.LIST.page_title])), /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement("div", {
            className: "header-button-area",
            __source: {
                fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\ictf\\m0z20602\\list\\index.js",
                lineNumber: 122,
                columnNumber: 41
            },
            __self: this
        }, this.props.button.createButtonApp({
            area: constant.LIST.head_btn_code,
            onButtonClick: buttonClick.bind(this)
        }))), /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement("div", {
            className: "nc-bill-search-area",
            __source: {
                fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\ictf\\m0z20602\\list\\index.js",
                lineNumber: 130,
                columnNumber: 33
            },
            __self: this
        }, NCCreateSearch(constant.LIST.search_id, {
            clickSearchBtn: this.clickSearchBtn,
            onAfterEvent: onSearchAfterEvent.bind(this, this.props)
        })), /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement("div", {
            className: "nc-bill-table-area",
            __source: {
                fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\ictf\\m0z20602\\list\\index.js",
                lineNumber: 137,
                columnNumber: 33
            },
            __self: this
        }, createSimpleTable(constant.LIST.table_id, {
            showCheck: true,
            dataSource: constant.SEARCH_CACHE.dataSource,
            pkname: constant.PRIMARY_KEY.head_id,
            handlePageInfoChange: this.handlePageInfoChange,
            onRowDoubleClick: this.onRowDoubleClick,
            onSelected: this.clickSelectBtn,
            onSelectedAll: this.clickSelectAllBtn
        })), /* 附件 */ this.state.showUploader && /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement(NCUploader, list_objectSpreadProps(list_objectSpread({
            placement: 'bottom'
        }, this.state.billInfo), {
            onHide: ()=>{
                this.setState({
                    showUploader: false
                });
            },
            __source: {
                fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\ictf\\m0z20602\\list\\index.js",
                lineNumber: 151,
                columnNumber: 41
            },
            __self: this
        })), /*联查单据追溯*/ /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement(BillTrack, {
            show: this.state.showBillTrack,
            close: ()=>{
                this.setState({
                    showBillTrack: false
                });
            },
            pk: this.state.billTrackBillId,
            type: this.state.billTrackBillType,
            __source: {
                fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\ictf\\m0z20602\\list\\index.js",
                lineNumber: 164,
                columnNumber: 41
            },
            __self: this
        }), /* 指派 */ this.state.compositeDisplay && /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement(ApprovalTrans, {
            title: this.state.json['M0Z20602-000018'],
            /* 国际化处理： 指派*/ data: this.state.compositeData,
            display: this.state.compositeDisplay,
            getResult: this.getAssignUser,
            cancel: this.compositeTurnOff,
            __source: {
                fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\ictf\\m0z20602\\list\\index.js",
                lineNumber: 176,
                columnNumber: 41
            },
            __self: this
        }), /* 联查审批详情 */ /* {{
                                        <ApproveDetail
                                                show={this.state.showApproveDetail}
                                                billtype={BILL_TYPE_CODE}
                                                billid={this.state.billId}
                                                close={() => {
                                                        this.setState({
                                                                showApproveDetail: false
                                                        });
                                                }}
                                        />
                                }} */ createModal('showDialog', {
            title: '数据下载',
            className: 'showDialog',
            content: /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement("div", {
                className: "box",
                __source: {
                    fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\ictf\\m0z20602\\list\\index.js",
                    lineNumber: 205,
                    columnNumber: 49
                },
                __self: this
            }, /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement("div", {
                className: "item",
                __source: {
                    fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\ictf\\m0z20602\\list\\index.js",
                    lineNumber: 206,
                    columnNumber: 57
                },
                __self: this
            }, /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement(Refer, {
                placeholder: "来源系统",
                refName: "来源系统",
                type: "popover",
                refType: "grid",
                value: this.state.dbsource,
                queryGridUrl: "/nccloud/hpf/entryconfig/GridReferQuery.do",
                queryCondition: (v)=>{
                    return {
                        pk_org: this.state.pk_org
                    };
                },
                onChange: (dbsource, fool)=>{
                    this.setState({
                        dbsource
                    });
                },
                __source: {
                    fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\ictf\\m0z20602\\list\\index.js",
                    lineNumber: 207,
                    columnNumber: 65
                },
                __self: this
            })), /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement("div", {
                className: "item",
                __source: {
                    fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\ictf\\m0z20602\\list\\index.js",
                    lineNumber: 226,
                    columnNumber: 57
                },
                __self: this
            }, /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement(Refer, {
                placeholder: "业务类型",
                refName: "业务类型",
                type: "popover",
                refType: "grid",
                isMultiSelectedEnabled: "true",
                value: this.state.transtypepk,
                queryGridUrl: "/nccloud/riart/ref/transtypeRef.do",
                queryCondition: (v)=>{
                    return {
                        parentbilltype: constant.BILL_TYPE_CODE
                    };
                },
                onChange: (transtypepk, fool)=>{
                    this.setState({
                        transtypepk
                    });
                },
                __source: {
                    fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\ictf\\m0z20602\\list\\index.js",
                    lineNumber: 227,
                    columnNumber: 73
                },
                __self: this
            })), /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement("div", {
                className: "item",
                __source: {
                    fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\ictf\\m0z20602\\list\\index.js",
                    lineNumber: 247,
                    columnNumber: 57
                },
                __self: this
            }, /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement(NCRangePickerClient, {
                style: {
                    width: '100%'
                },
                placeholder: "下载日期区间选择",
                showTimeFunction: false,
                value: this.state.vdate,
                onChange: (a, b, c, d)=>{
                    this.setState({
                        vdate: a
                    });
                },
                showClear: true,
                __source: {
                    fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\ictf\\m0z20602\\list\\index.js",
                    lineNumber: 248,
                    columnNumber: 65
                },
                __self: this
            }))),
            beSureBtnClick: beSureBtnClick.bind(this, this.props),
            cancelBtnClick: cancelBtnClick.bind(this, this.props),
            size: 'sm'
        }), /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement(PrintOutput, {
            ref: "printOutput",
            url: constant.REQUEST_URL.Print,
            data: {
                funcode: constant.APPCODE,
                //功能节点编码
                nodekey: 'M0Z20602_CARD',
                //模板节点编码
                oids: this.state.ids,
                outputType: 'output'
            },
            __source: {
                fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\ictf\\m0z20602\\list\\index.js",
                lineNumber: 268,
                columnNumber: 20
            },
            __self: this
        }));
    }
    constructor(props){
        super(props);
        list_defineProperty(this, "handlePageInfoChange", (props, config, pks)=>{
            pageInfoClick(list_objectSpreadProps(list_objectSpread({}, props), {
                json: this.state.json
            }), config, pks);
        });
        list_defineProperty(this, "onRowDoubleClick", (record, index, props)=>{
            handleDoubleClick(record, index, list_objectSpreadProps(list_objectSpread({}, props), {
                json: this.state.json
            }));
        });
        list_defineProperty(this, "clickSearchBtn", (props)=>{
            searchBtnClick(list_objectSpreadProps(list_objectSpread({}, props), {
                json: this.state.json
            }));
        });
        list_defineProperty(this, "clickSelectBtn", (props, moduleId, record, index, status)=>{
            selectedEvent(props, moduleId, record, index, status);
        });
        list_defineProperty(this, "clickSelectAllBtn", (props, moduleId, status, length)=>{
            selectedAllEvent(props, moduleId, status, length);
        });
        //指派提交
        list_defineProperty(this, "getAssignUser", (value)=>{
            listOperator_listCommit(list_objectSpreadProps(list_objectSpread({}, this.props), {
                json: this.state.json
            }), {
                pks: this.state.curPk,
                userObj: value
            });
            this.compositeTurnOff();
        });
        //关闭指派
        list_defineProperty(this, "compositeTurnOff", ()=>{
            this.setState({
                compositeData: null,
                compositeDisplay: false
            });
        });
        props.use.search(constant.LIST.search_id);
        props.use.table(constant.LIST.table_id, constant.LIST.page_code);
        this.state = {
            json: {},
            showUploader: false,
            billInfo: {},
            compositeData: null,
            //指派信息
            compositeDisplay: false,
            //是否显示指派
            curPk: null,
            //当前选中数据的pk
            showApproveDetail: false,
            //是否显示审批详情
            billId: null,
            dbsource: {},
            vdate: [
                '',
                ''
            ],
            pk_org: '',
            transtypepk: ''
        };
    }
};
List = (0,external_nc_lightapp_front_.createPage)({})(List);
/* harmony default export */ const ictf_m0z20602_list = (List);

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=index.9e327d1a.js.map