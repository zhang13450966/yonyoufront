/*! @ncctag {"project":"hpf","branch":"develop-ncc1.0","provider":"suqch","date":"2023/8/30 10:51:22"} */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"), require("react-dom"), require("nc-lightapp-front"));
	else if(typeof define === 'function' && define.amd)
		define(["react", "react-dom", "nc-lightapp-front"], factory);
	else if(typeof exports === 'object')
		exports["hpf/hpfc/m0z10103/main/index"] = factory(require("react"), require("react-dom"), require("nc-lightapp-front"));
	else
		root["hpf/hpfc/m0z10103/main/index"] = factory(root["React"], root["ReactDOM"], root["nc-lightapp-front"]);
})(self, (__WEBPACK_EXTERNAL_MODULE__6487__, __WEBPACK_EXTERNAL_MODULE__6189__, __WEBPACK_EXTERNAL_MODULE__5118__) => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 4566:
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
___CSS_LOADER_EXPORT___.push([module.id, ".header-button-area-print-btn .nc-card-header-button-btn-print {\n  background: #fff;\n}\n", "",{"version":3,"sources":["webpack://./src/hpf/hpfc/m0z10103/main/index.less"],"names":[],"mappings":"AAAA;EAEA,gBAAA;AAAA","sourcesContent":[".header-button-area-print-btn {\n.nc-card-header-button-btn-print {\nbackground: #fff;\n}\n}"],"sourceRoot":""}]);
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

/***/ 7888:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "gridBeChecked": () => (/* binding */ gridBeChecked),
/* harmony export */   "gridStatusChange": () => (/* binding */ gridStatusChange),
/* harmony export */   "initTemplate": () => (/* binding */ initTemplate),
/* harmony export */   "onClickButton": () => (/* binding */ onClickButton),
/* harmony export */   "onClickPageInfo": () => (/* binding */ onClickPageInfo),
/* harmony export */   "onClickSearchBtn": () => (/* binding */ onClickSearchBtn),
/* harmony export */   "onSelected": () => (/* binding */ onSelected),
/* harmony export */   "onloaddata": () => (/* binding */ onloaddata)
/* harmony export */ });
/* harmony import */ var nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5118);
/* harmony import */ var nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__);

const gridid = 'head';
const searchid = 'search';
const pageId = 'M0Z10103_EntryconfigVO';
const appcode = 'M0Z10103';
const printNodeKey = null;
const keys = [
    'iseucountry'
];
const urls = {
    queryUrl: '/nccloud/hpf/entryconfig/EntryconfigVOQuery.do',
    pageQueryUrl: '/nccloud/hpf/entryconfig/EntryconfigVOQueryPageGridByPks.do',
    saveUrl: '/nccloud/hpf/entryconfig/EntryconfigVOSave.do',
    printUrl: '/nccloud/hpf/entryconfig/EntryconfigVOPrint.do',
    RSCheckUrl: '/nccloud/hpf/entryconfig/EntryconfigVORSCheck.do',
    enableOrDisDataUrl: '/nccloud/hpf/entryconfig/EntryconfigVOEnableOrDisAction.do',
    enableOrDisCuDataUrl: '/nccloud/hpf/entryconfig/EntryconfigVOEnableOrDisCuAction.do'
};
/**
* 初始化页面模板
* @param {*} props
* @param {*} callback
*/ function initTemplate(props, callback) {
    props.createUIDom({
        pagecode: pageId
    }, //,//页面id
    (data)=>{
        if (data) {
            if (data.template) {
                let meta = data.template;
                meta = modifierMeta.call(this, props, meta);
                props.meta.setMeta(meta);
            }
            if (data.button) {
                let button = data.button;
                props.button.setButtons(button);
                props.button.setButtonDisabled({
                    'Delete': true
                });
                props.button.setButtonDisabled([
                    'Enable',
                    'Disable'
                ], true);
                props.button.setButtonDisabled([
                    'CuEnable',
                    'CuDisable'
                ], true);
                //props.button.setButtonDisabled({ 'Edit': true });
                props.button.setPopContent('DelLine', this.state.json['M0Z10103-000019']);
            }
        }
        /*国际化：确认要删除该信息吗？ 设置操作列上删除按钮的弹窗提示 */ callback();
    });
}
/**
* 组织查询条件
*/ function onloaddata() {
    this.props.button.setButtonsVisible({
        'Save': false,
        'Cancel': false
    });
    let paramData = {
        querycondition: {},
        pageInfo: this.props.editTable.getTablePageInfo(gridid),
        pagecode: pageId,
        queryAreaCode: searchid,
        //查询区编码
        oid: this.props.meta.getMeta()[searchid].oid,
        //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
        querytype: 'tree'
    };
    loadGridData.call(this, false, paramData);
}
/**
* 按钮点击事件
* @param {*} props
* @param {*} id 按钮id
*/ function onClickButton(props, id) {
    let _this = this;
    //获取选中行数据
    let rowsdata = props.editTable.getCheckedRows(gridid);
    //获取分页信息
    let pageInfo = props.editTable.getTablePageInfo(gridid);
    //查询区条件
    let searchval = null;
    //(this.state.hasSearched && this.state.hasSearched == true) ? props.search.getAllSearchData(searchid, false) : null;
    //获取查询模板信息
    let OID = this.props.meta.getMeta()[searchid].oid;
    //queryInfo.oid;
    //定义请求参数
    let paramData = {
        pageInfo,
        querycondition: searchval == null ? {} : searchval,
        pagecode: pageId,
        queryAreaCode: searchid,
        //查询区编码
        oid: OID,
        //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
        querytype: 'tree'
    };
    switch(id){
        case 'Add':
            props.editTable.setStatus(gridid, 'edit');
            let num = this.props.editTable.getNumberOfRows(gridid);
            props.editTable.addRow(gridid, num, true);
            props.button.setButtonsVisible('Edit', false);
            props.button.setMainButton('Add', false);
            break;
        case 'Cancel':
            (0,nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.promptBox)({
                color: "warning",
                title: this.state.json['M0Z10103-000006'],
                /* 国际化处理： 确认取消*/ content: this.state.json['M0Z10103-000007'],
                /* 国际化处理： 是否确认要取消!*/ beSureBtnClick: ()=>{
                    props.editTable.cancelEdit(gridid);
                    props.editTable.setStatus(gridid, 'browse');
                    //props.button.setButtonDisabled('Edit', true);
                    props.button.setMainButton('Add', true);
                    props.button.setButtonDisabled('Delete', true);
                    gridStatusChange.call(this);
                }
            });
            break;
        case 'Edit':
            props.editTable.setStatus(gridid, 'edit');
            props.button.setButtonsVisible('Edit', false);
            props.button.setMainButton('Add', false);
            break;
        case 'Save':
            // 必填项校验
            props.editTable.filterEmptyRows(gridid, keys);
            let changedRows = props.editTable.getAllData(gridid);
            //props.editTable.getChangedRows(gridid,true);
            if (!changedRows || changedRows.length === 0) {
                props.editTable.cancelEdit(gridid);
                props.editTable.setStatus(gridid, 'browse');
                //props.button.setButtonsVisible('Edit', true);
                props.button.setMainButton('Add', true);
                gridStatusChange.call(this);
                return;
            }
            if (!props.editTable.checkRequired(gridid, changedRows.rows)) return;
            let changedata = {
                pageid: pageId,
                model: {
                    pageInfo,
                    rows: changedRows.rows,
                    areaType: 'table',
                    areacode: 'head'
                }
            };
            this.props.validateToSave(changedata, ()=>{
                (0,nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.ajax)({
                    url: urls['saveUrl'],
                    data: changedata,
                    async: false,
                    success: (function(res) {
                        //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
                        this.props.editTable.setStatus(gridid, 'browse');
                        if (res.data) {
                            let allD = this.props.editTable.getAllData(gridid);
                            filterResult(allD, res.data[gridid].rows);
                            this.props.editTable.setTableData(gridid, allD);
                            (0,nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.toast)({
                                color: 'success',
                                title: this.state.json['M0Z10103-000008']
                            });
                        }
                        /* 国际化处理： 保存成功*/ //props.button.setButtonDisabled('Edit', true);
                        props.button.setMainButton('Add', true);
                        props.button.setButtonDisabled('Delete', true);
                        gridStatusChange.call(this);
                    }).bind(this),
                    error: function(res) {
                        (0,nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.toast)({
                            color: 'warning',
                            content: res.message
                        });
                        /* 国际化处理： 保存成功*/ props.editTable.setStatus(gridid, 'edit');
                        props.button.setButtonsVisible('Edit', false);
                        props.button.setMainButton('Add', false);
                    }
                });
            }, {
                [gridid]: 'editTable'
            }, 'grid');
            loadGridData.call(this, false, paramData);
            break;
        case 'Delete':
            if (rowsdata.length != 0) {
                if (props.editTable.getStatus(gridid) && props.editTable.getStatus(gridid) == 'edit') {
                    let indexs = rowsdata.map((item)=>item.index);
                    props.editTable.deleteTableRowsByIndex(gridid, indexs);
                } else {
                    let newData2 = rowsdata.map((item)=>({
                            status: '3',
                            values: item.data.values
                        }));
                    let data = {
                        pageid: pageId,
                        model: {
                            areaType: 'table',
                            pageInfo,
                            rows: newData2
                        }
                    };
                    (0,nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.promptBox)({
                        color: "warning",
                        title: this.state.json['M0Z10103-000009'],
                        /* 国际化处理： 确认删除*/ content: this.state.json['M0Z10103-000010'],
                        /* 国际化处理： 确定要删除所选数据吗？*/ beSureBtnClick: deleteOpr.bind(this, data, paramData)
                    });
                }
            } else {
                (0,nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.promptBox)({
                    color: "warning",
                    title: this.state.json['M0Z10103-000011'],
                    /* 国际化处理： 提示*/ content: this.state.json['M0Z10103-000012']
                });
            }
            /* 国际化处理： 请选择数据操作!*/ loadGridData.call(this, false, paramData);
            break;
        case 'PrintGrp':
            onPrint.call(this);
            break;
        case 'Print':
            onPrint.call(this);
            break;
        case 'Output':
            onOutput.call(this);
            break;
        case 'Refresh':
            loadGridData.call(this, false, paramData);
            (0,nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.toast)({
                title: this.state.json['M0Z10103-000020'],
                color: 'success'
            });
        /* 国际化处理： 无可打印数据*/ case 'Enable':
            enableOrDisableData.call(this, id, paramData);
            break;
        case 'Disable':
            enableOrDisableData.call(this, id, paramData);
            break;
        case 'CuEnable':
            enableOrDisableCuData.call(this, id, paramData);
            break;
        case 'CuDisable':
            enableOrDisableCuData.call(this, id, paramData);
            break;
        default:
            break;
    }
}
/**
* 表格复选框选择改变事件
*/ function onSelected() {
    let rows = this.props.editTable.getCheckedRows(gridid);
    let isDisable = !(rows && rows.length > 0);
    this.props.button.setButtonDisabled([
        'Delete'
    ], isDisable);
    //添加对账平台启停用按钮状态
    if (!isDisable) {
        let rsflagYCount = 0;
        let cuflagYCount = 0;
        rows.forEach((element)=>{
            if (element.data.values.rsflag && element.data.values.rsflag.value) {
                rsflagYCount++;
            }
            if (element.data.values.cuflag && element.data.values.cuflag.value) {
                cuflagYCount++;
            }
            //为0,则代表全部都为未启用
            if (rsflagYCount == 0) {
                this.props.button.setButtonDisabled([
                    'Disable'
                ], true);
                this.props.button.setButtonDisabled([
                    'Enable'
                ], false);
            } else //全部为启用
            if (rsflagYCount == rows.length) {
                //
                this.props.button.setButtonDisabled([
                    'Disable'
                ], false);
                this.props.button.setButtonDisabled([
                    'Enable'
                ], true);
            } else //其他情况,两个按钮都可点击
            {
                this.props.button.setButtonDisabled([
                    'Disable'
                ], false);
                this.props.button.setButtonDisabled([
                    'Enable'
                ], false);
            }
            // add by mzq
            //为0,则代表全部都为未启用
            if (cuflagYCount == 0) {
                this.props.button.setButtonDisabled([
                    'CuDisable'
                ], true);
                this.props.button.setButtonDisabled([
                    'CuEnable'
                ], false);
            } else //全部为启用
            if (cuflagYCount == rows.length) {
                //
                this.props.button.setButtonDisabled([
                    'CuDisable'
                ], false);
                this.props.button.setButtonDisabled([
                    'CuEnable'
                ], true);
            } else //其他情况,两个按钮都可点击
            {
                this.props.button.setButtonDisabled([
                    'CuDisable'
                ], false);
                this.props.button.setButtonDisabled([
                    'CuEnable'
                ], false);
            }
        });
    } else // add by mzq
    {
        this.props.button.setButtonDisabled([
            'Disable'
        ], true);
        this.props.button.setButtonDisabled([
            'Enable'
        ], true);
        // add by mzq
        this.props.button.setButtonDisabled([
            'CuDisable'
        ], true);
        this.props.button.setButtonDisabled([
            'CuEnable'
        ], true);
    }
    //this.props.button.setButtonDisabled(['Edit'], isDisable);
    //重新渲染页面
    this.setState(this.state);
}
/**
* 选择改变事件
* @param {*} props
*/ function gridBeChecked(props) {
    //此处控制按钮的隐藏显示及启用状态
    let tableData = props.editTable.getCheckedRows(gridid);
    let length = tableData.length;
    //获取列表页选择数据的行数
    props.button.setDisabled({
        'btnDel': length === 0
    });
}
/**
* 表格状态改变事件
*/ function gridStatusChange() {
    let gridStatus = this.props.editTable.getStatus(gridid);
    this.props.button.setButtonsVisible({
        'Save': gridStatus !== 'browse',
        'Cancel': gridStatus !== 'browse',
        'Add': gridStatus === 'browse',
        'Edit': gridStatus === 'browse',
        'Delete': gridStatus === 'browse',
        'Refresh': gridStatus === 'browse',
        'PrintGrp': gridStatus === 'browse',
        'Output': gridStatus === 'browse',
        'Enable': gridStatus === 'browse',
        'Disable': gridStatus === 'browse',
        'CuEnable': gridStatus === 'browse',
        'CuDisable': gridStatus === 'browse'
    });
    this.props.button.setPopContent('DelLine', gridStatus === 'browse' ? this.state.json['M0Z10103-000000'] : '');
}
/* 国际化处理： 确定要删除吗？*/ /**
* 翻页点击事件
* @param {*} props
* @param {*} config
* @param {*} pks
*/ function onClickPageInfo(props, config, pks) {
    let pageInfo = props.editTable.getTablePageInfo(gridid);
    let searchVal = props.search.getAllSearchData(searchid);
    let paramdata = {
        pks,
        pageInfo,
        querycondition: searchVal
    };
    loadGridData.call(this, false, paramdata, 'pageQueryUrl');
}
/**
* 点击查询按钮事件
* @param {*} props
* @param {*} data
*/ function onClickSearchBtn(props, data) {
    if (props.editTable.getStatus() && props.editTable.getStatus() == 'edit') {
        (0,nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.promptBox)({
            color: "warning",
            title: this.state.json['M0Z10103-000011'],
            /* 国际化处理： 提示*/ content: this.state.json['M0Z10103-000015']
        });
    }
    /* 国际化处理： 编辑态不能查询*/ let OID = this.props.meta.getMeta()[searchid].oid;
    let paramdata = {
        querycondition: data == null ? {} : data,
        pageInfo: props.editTable.getTablePageInfo(gridid),
        pagecode: pageId,
        queryAreaCode: searchid,
        //查询区编码
        oid: OID,
        //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
        querytype: 'tree'
    };
    //校验通过后，条件查询请求
    loadGridData.call(this, true, paramdata);
}
/**
* 删除
* @param {*} data
* @param {*} paramData
*/ function deleteOpr(data, paramData) {
    (0,nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.ajax)({
        url: urls['saveUrl'],
        data,
        success: (res)=>{
            if (res.success) {
                this.props.button.setButtonDisabled([
                    'Delete'
                ], true);
                loadGridData.call(this, false, paramData);
                (0,nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.toast)({
                    color: 'success',
                    title: this.state.json['M0Z10103-000002']
                });
            } else /* 国际化处理： 删除成功*/ {
                alert(res.message);
            }
        }
    });
}
/**
* 打印
*/ function onPrint() {
    let allData = this.props.editTable.getAllData(gridid);
    if (allData.length === 0) {
        (0,nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.toast)({
            content: this.state.json['M0Z10103-000013'],
            color: 'warning'
        });
        /* 国际化处理： 无可打印数据*/ return;
    }
    let pks = [];
    allData.rows.forEach((item, key)=>{
        pks.push(item.values['pk_entryconfig'].value);
    });
    (0,nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.print)('pdf', urls['printUrl'], {
        funcode: appcode,
        //功能节点编码
        nodekey: printNodeKey,
        //模板节点编码
        oids: pks
    });
}
/**
* 输出
*/ function onOutput() {
    let allData = this.props.editTable.getAllData(gridid);
    if (allData.length === 0) {
        (0,nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.toast)({
            content: this.state.json['M0Z10103-000014'],
            color: 'warning'
        });
        /* 国际化处理： 无可输出的数据*/ return;
    }
    let pks = [];
    allData.rows.forEach((item, key)=>{
        pks.push(item.values['pk_entryconfig'].value);
    });
    this.setState({
        ids: pks
    }, this.refs.printOutput.open());
}
/**
* 请求数据
* @param {*} isToast
* @param {*} paramData
* @param {*} queryUrl
*/ function loadGridData(isToast, paramData, queryUrl) {
    let _this = this;
    let qryUrl = queryUrl == undefined ? 'queryUrl' : queryUrl;
    (0,nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.ajax)({
        url: urls[qryUrl],
        data: paramData,
        success: (res)=>{
            let { success , data  } = res;
            if (success) {
                //查询时执行显示公式前端适配
                if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
                    _this.props.dealFormulamsg(res.formulamsg, //参数一：返回的公式对象
                    {
                        //参数二：界面使用的表格类型
                        [gridid]: "table"
                    });
                }
                if (res.hasOwnProperty('data') && data != null) {
                    _this.props.editTable.setTableData(gridid, data[gridid]);
                    _this.props.button.setButtonDisabled({
                        'PrintGrp': false,
                        'Output': false,
                        'Delete': true
                    });
                } else //'Edit': true
                {
                    let nulldata = {
                        rows: []
                    };
                    _this.props.editTable.setTableData(gridid, nulldata);
                    _this.props.button.setButtonDisabled({
                        'PrintGrp': true,
                        'Output': true,
                        'Delete': true
                    });
                }
                //'Edit': true
                _this.props.editTable.setStatus('browse');
                if (isToast === true) {
                    (0,nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.toast)({
                        color: 'success',
                        content: this.state.json['M0Z10103-000003'] + data[gridid].allpks.length + this.state.json['M0Z10103-000004']
                    });
                }
                /* 国际化处理： 查询成功，共,条。*/ this.setState({
                    hasSearched: true
                });
            }
        },
        error: (res)=>{
            if (isToast === true) {
                (0,nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.toast)({
                    color: 'warning',
                    content: this.state.json['M0Z10103-000005']
                });
            }
        }
    });
}
/* 国际化处理： 未查询出符合条件的数据*/ /**
* 加工meta
* @param {*} props
* @param {*} meta
*/ function modifierMeta(props, meta) {
    meta[gridid].showindex = true;
    meta[gridid].status = 'browse';
    //去掉分页效果
    meta[gridid].pagination = false;
    //添加操作列
    meta[gridid].items.push({
        attrcode: 'opr',
        label: this.state.json['M0Z10103-000001'],
        /* 国际化处理： 操作*/ width: 200,
        fixed: 'right',
        className: 'table-opr',
        itemtype: 'customer',
        visible: true,
        render: (text, record, index)=>{
            let btnArray = tableBtnAry(props);
            return props.button.createOprationButton(btnArray, {
                area: "table-opr-area",
                buttonLimit: 3,
                onButtonClick: (props, id)=>tableButtonClick.call(this, props, id, text, record, index)
            });
        }
    });
    //表格区参照过滤
    meta[gridid].items.map((item)=>{
        if (item.attrcode === 'pk_org') {
            //财务组织过滤
            item.isMultiSelectedEnabled = false;
            //财务组织多选
            item.queryCondition = ()=>({
                    funcode: props.getSearchParam('c'),
                    //appcode获取
                    //用户权限过滤
                    TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
                });
        }
    });
    return meta;
}
function tableBtnAry(props) {
    return props.editTable.getStatus(gridid) === 'browse' ? [] : [
        'DelLine'
    ];
}
/**
* 操作列点击事件
* @param {*} props
* @param {*} id
* @param {*} text
* @param {*} record
* @param {*} index
*/ function tableButtonClick(props, id, text, record, index) {
    switch(id){
        case "DelLine":
            //删除行
            let tableStatus = props.editTable.getStatus(gridid);
            if (tableStatus == 'browse' || tableStatus == undefined) {
                let row = {
                    status: '3',
                    values: record.values
                };
                let data = {
                    pageid: pageId,
                    model: {
                        areaType: 'table',
                        rows: [
                            row
                        ]
                    }
                };
                (0,nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.ajax)({
                    url: urls['saveUrl'],
                    data,
                    success: (res)=>{
                        if (res.success) {
                            (0,nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.toast)({
                                color: 'success',
                                title: this.state.json['pk_lang-000002']
                            });
                            /* 国际化处理： 删除成功*/ props.editTable.deleteTableRowsByIndex(gridid, index);
                            let allD = props.editTable.getAllData(gridid);
                            filterDelRows(allD.rows);
                            //过滤清除删除状态的行
                            props.editTable.setTableData(gridid, allD);
                            gridBeChecked.call(this, props);
                        } else {
                            alert(res.message);
                        }
                    }
                });
            } else {
                props.editTable.deleteTableRowsByIndex(gridid, index);
            }
            break;
        case "EditLine":
            //修改
            props.editTable.setStatus(gridid, 'edit');
            props.button.setMainButton('Add', false);
            props.editTable.openModel(gridid, 'edit', record, index);
            break;
        case "Spread":
            //展开
            props.editTable.setStatus(gridid, 'edit');
            props.editTable.openModel(gridid, 'edit', record, index);
            break;
        default:
            console.log(id, index);
            break;
    }
}
function filterDelRows(rows) {
    let length = rows.length - 1;
    for(; length >= 0; length--){
        if (rows[length].status === '3') {
            rows.splice(length, 1);
        }
    }
}
function filterResult(allData, reDataRows) {
    if (!reDataRows) return;
    if (allData.rows) {
        allData.rows.forEach((item, index)=>{
            reDataRows.forEach((it, i)=>{
                if (it.rowid === item.rowid) {
                    allData.rows[index] = it;
                }
            });
        });
    }
}
function enableOrDisableData(btn, queryParamData) {
    let rows = this.props.editTable.getCheckedRows(gridid);
    if (rows && rows.length > 0) {
        //构建请求参数
        let newRows = [];
        rows.forEach((element)=>{
            newRows.push(element.data);
        });
        let pageInfo = this.props.editTable.getTablePageInfo(gridid);
        let paramData = {
            pageid: pageId,
            model: {
                pageInfo,
                rows: newRows,
                areaType: 'table',
                areacode: 'head'
            },
            userjson: btn == 'Enable' ? "1" : "2"
        };
        (0,nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.ajax)({
            url: urls['enableOrDisDataUrl'],
            data: paramData,
            async: false,
            success: (res)=>{
                //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
                this.props.editTable.setStatus(gridid, 'browse');
                if (res.data && res.data.RSCheck) {
                    //引校验引用,提示报错信息
                    (0,nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.toast)({
                        color: 'warning',
                        content: res.data.msg
                    });
                } else {
                    (0,nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.toast)({
                        color: 'success',
                        content: btn == 'Enable' ? '启用成功' : '取消启用成功'
                    });
                    //刷新页面
                    loadGridData.call(this, false, queryParamData);
                }
            },
            error: (res)=>{
                (0,nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.toast)({
                    color: 'warning',
                    content: '操作失败,请刷新数据后重新操作'
                });
            }
        });
    }
}
// add by mzq
function enableOrDisableCuData(btn, queryParamData) {
    let rows = this.props.editTable.getCheckedRows(gridid);
    if (rows && rows.length > 0) {
        //构建请求参数
        let newRows = [];
        rows.forEach((element)=>{
            newRows.push(element.data);
        });
        let pageInfo = this.props.editTable.getTablePageInfo(gridid);
        let paramData = {
            pageid: pageId,
            model: {
                pageInfo,
                rows: newRows,
                areaType: 'table',
                areacode: 'head'
            },
            userjson: btn == 'CuEnable' ? "1" : "2"
        };
        (0,nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.ajax)({
            url: urls['enableOrDisCuDataUrl'],
            data: paramData,
            async: false,
            success: (res)=>{
                //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
                this.props.editTable.setStatus(gridid, 'browse');
                if (res.data && res.data.RSCheck) {
                    //引校验引用,提示报错信息
                    (0,nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.toast)({
                        color: 'warning',
                        content: res.data.msg
                    });
                } else {
                    (0,nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.toast)({
                        color: 'success',
                        content: btn == 'CuEnable' ? '启用成功' : '取消启用成功'
                    });
                    //刷新页面
                    loadGridData.call(this, false, queryParamData);
                }
            },
            error: (res)=>{
                (0,nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.toast)({
                    color: 'warning',
                    content: '操作失败,请刷新数据后重新操作'
                });
            }
        });
    }
}


/***/ }),

/***/ 5920:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "onCloseTableModel": () => (/* binding */ onCloseTableModel),
/* harmony export */   "onTableAfterEdit": () => (/* binding */ onTableAfterEdit)
/* harmony export */ });
function onTableAfterEdit(props, moduleId, key, value, changedrows, record, index) {}
// props, moduleId, key, value（当前值）, changedrows（新旧值集合）, record（行数据）, index（当前index）){
/**
* 模态框取消按钮事件
* @param {*} props
*/ function onCloseTableModel(props) {}


/***/ }),

/***/ 5118:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__5118__;

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

// EXTERNAL MODULE: external {"root":"React","var":"React","commonjs":"react","commonjs2":"react","amd":"react"}
var external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_ = __webpack_require__(6487);
var external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default = /*#__PURE__*/__webpack_require__.n(external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_);
// EXTERNAL MODULE: external {"root":"ReactDOM","var":"ReactDOM","commonjs":"react-dom","commonjs2":"react-dom","amd":"react-dom"}
var external_root_ReactDOM_var_ReactDOM_commonjs_react_dom_commonjs2_react_dom_amd_react_dom_ = __webpack_require__(6189);
var external_root_ReactDOM_var_ReactDOM_commonjs_react_dom_commonjs2_react_dom_amd_react_dom_default = /*#__PURE__*/__webpack_require__.n(external_root_ReactDOM_var_ReactDOM_commonjs_react_dom_commonjs2_react_dom_amd_react_dom_);
// EXTERNAL MODULE: external "nc-lightapp-front"
var external_nc_lightapp_front_ = __webpack_require__(5118);
// EXTERNAL MODULE: ./src/hpf/hpfc/m0z10103/action/index.js
var action = __webpack_require__(7888);
// EXTERNAL MODULE: ./src/hpf/hpfc/m0z10103/event/index.js
var m0z10103_event = __webpack_require__(5920);
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
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/less-loader/dist/cjs.js!./src/hpf/hpfc/m0z10103/main/index.less
var main = __webpack_require__(4566);
;// CONCATENATED MODULE: ./src/hpf/hpfc/m0z10103/main/index.less

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (styleTagTransform_default());
options.setAttributes = (setAttributesWithoutAttributes_default());

      options.insert = insertBySelector_default().bind(null, "head");
    
options.domAPI = (styleDomAPI_default());
options.insertStyleElement = (insertStyleElement_default());

var update = injectStylesIntoStyleTag_default()(main/* default */.Z, options);




       /* harmony default export */ const m0z10103_main = (main/* default */.Z && main/* default.locals */.Z.locals ? main/* default.locals */.Z.locals : undefined);

;// CONCATENATED MODULE: ./src/hpf/hpfc/m0z10103/main/index.js





const { NCDiv  } = external_nc_lightapp_front_.base;
const { PrintOutput  } = external_nc_lightapp_front_.high;

const gridid = 'head';
const searchid = 'search';
//const pageId = 'M0Z1010103_czncc';
//const appcode = 'M0Z1010103';
const pageId = 'M0Z10103_EntryconfigVO';
const appcode = 'M0Z10103';
const printNodeKey = null;
const urls = {
    queryUrl: '/nccloud/hpf/entryconfig/EntryconfigVOQuery.do',
    pageQueryUrl: '/nccloud/hpf/entryconfig/EntryconfigVOQueryPageGridByPks.do',
    saveUrl: '/nccloud/hpf/entryconfig/EntryconfigVOSave.do',
    printUrl: '/nccloud/hpf/entryconfig/EntryconfigVOPrint.do'
};
let EntryconfigVOTable = class EntryconfigVOTable extends external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_.Component {
    componentDidUpdate() {
        let l_formstatus = this.props.editTable.getStatus(gridid);
        if (l_formstatus != 'add' && l_formstatus != "edit") {
            window.onbeforeunload = null;
        } else {
            window.onbeforeunload = ()=>{
                //编辑态关闭页签或浏览器的提示
                return '';
            };
        }
    }
    render() {
        const { editTable , button , search , BillHeadInfo  } = this.props;
        const { createBillHeadInfo  } = BillHeadInfo;
        const { createButtonApp  } = button;
        const { NCCreateSearch  } = search;
        const { createEditTable  } = editTable;
        const tableState = this.props.editTable.getStatus(gridid);
        return /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement("div", {
            className: "nc-single-table",
            __source: {
                fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10103\\main\\index.js",
                lineNumber: 68,
                columnNumber: 13
            },
            __self: this
        }, /* 头部 header */ /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement(NCDiv, {
            className: "nc-singleTable-header-area",
            style: tableState == 'browse' ? {} : {
                border: 'none'
            },
            areaCode: NCDiv.config.HEADER,
            __source: {
                fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10103\\main\\index.js",
                lineNumber: 70,
                columnNumber: 17
            },
            __self: this
        }, /* 标题 title */ /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement("div", {
            className: "header-title-search-area",
            __source: {
                fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10103\\main\\index.js",
                lineNumber: 72,
                columnNumber: 21
            },
            __self: this
        }, createBillHeadInfo({
            title: this.state.json['M0Z10103-000018'],
            /* 国际化处理： 国家地区*/ backBtnClick: ()=>{},
            initShowBackBtn: false
        })), /* 按钮区  btn-group */ /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement("div", {
            className: "header-button-area header-button-area-print-btn",
            __source: {
                fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10103\\main\\index.js",
                lineNumber: 82,
                columnNumber: 21
            },
            __self: this
        }, createButtonApp({
            area: 'header',
            //按钮注册中的按钮区域
            onButtonClick: action.onClickButton.bind(this)
        }))), /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement("div", {
            className: "nc-singleTable-search-area",
            style: {
                display: tableState == 'browse' ? '' : 'none'
            },
            __source: {
                fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10103\\main\\index.js",
                lineNumber: 90,
                columnNumber: 17
            },
            __self: this
        }, NCCreateSearch(searchid, {
            //查询区
            clickSearchBtn: action.onClickSearchBtn.bind(this)
        })), /* 列表区 */ /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement("div", {
            className: "nc-singleTable-table-area",
            __source: {
                fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10103\\main\\index.js",
                lineNumber: 96,
                columnNumber: 17
            },
            __self: this
        }, createEditTable(gridid, {
            handlePageInfoChange: action.onClickPageInfo.bind(this),
            onCloseModel: m0z10103_event.onCloseTableModel.bind(this),
            onAfterEvent: m0z10103_event.onTableAfterEdit.bind(this),
            statusChange: action.gridStatusChange.bind(this),
            selectedChange: action.gridBeChecked.bind(this),
            onSelected: action.onSelected.bind(this),
            onSelectedAll: action.onSelected.bind(this),
            showCheck: true,
            showIndex: true,
            isAddRow: true,
            showPagination: true,
            adaptionHeight: true
        })), /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement(PrintOutput, {
            ref: "printOutput",
            url: urls['printUrl'],
            data: {
                funcode: appcode,
                //功能节点编码
                nodekey: printNodeKey,
                //模板节点编码
                oids: this.state.ids,
                outputType: 'output'
            },
            __source: {
                fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10103\\main\\index.js",
                lineNumber: 112,
                columnNumber: 17
            },
            __self: this
        }));
    }
    constructor(props){
        super(props);
        this.state = {
            OID: '',
            searchValue: '',
            checkValue: 'false',
            json: {}
        };
        let callback = (json, status, inlt)=>{
            if (status) {
                this.setState({
                    json,
                    inlt
                }, ()=>{
                    action.initTemplate.call(this, this.props, action.onloaddata.bind(this));
                });
            }
        };
        this.props.MultiInit.getMultiLang({
            moduleId: 'M0Z10103',
            domainName: 'hpf',
            callback
        });
    }
};
EntryconfigVOTable = (0,external_nc_lightapp_front_.createPage)({
    billinfo: [
        {
            billtype: 'grid',
            pagecode: pageId,
            bodycode: gridid
        }
    ],
    mutiLangCode: appcode
})(EntryconfigVOTable);
external_root_ReactDOM_var_ReactDOM_commonjs_react_dom_commonjs2_react_dom_amd_react_dom_default().render(/*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement(EntryconfigVOTable, {
    __source: {
        fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10103\\main\\index.js",
        lineNumber: 136,
        columnNumber: 17
    },
    __self: undefined
}), document.querySelector('#app'));

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=index.1419f5a3.js.map