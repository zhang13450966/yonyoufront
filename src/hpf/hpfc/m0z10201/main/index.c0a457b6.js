/*! @ncctag {"project":"hpf","branch":"develop-ncc1.0","provider":"suqch","date":"2023/8/30 10:51:22"} */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"), require("react-dom"), require("nc-lightapp-front"));
	else if(typeof define === 'function' && define.amd)
		define(["react", "react-dom", "nc-lightapp-front"], factory);
	else if(typeof exports === 'object')
		exports["hpf/hpfc/m0z10201/main/index"] = factory(require("react"), require("react-dom"), require("nc-lightapp-front"));
	else
		root["hpf/hpfc/m0z10201/main/index"] = factory(root["React"], root["ReactDOM"], root["nc-lightapp-front"]);
})(self, (__WEBPACK_EXTERNAL_MODULE__6487__, __WEBPACK_EXTERNAL_MODULE__6189__, __WEBPACK_EXTERNAL_MODULE__5118__) => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 3940:
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
___CSS_LOADER_EXPORT___.push([module.id, ".header-button-area-print-btn .nc-card-header-button-btn-print {\n  background: #fff;\n}\n", "",{"version":3,"sources":["webpack://./src/hpf/hpfc/m0z10201/main/index.less"],"names":[],"mappings":"AAAA;EAEA,gBAAA;AAAA","sourcesContent":[".header-button-area-print-btn {\n.nc-card-header-button-btn-print {\nbackground: #fff;\n}\n}"],"sourceRoot":""}]);
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

/***/ 8799:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "beSureBtnClick": () => (/* binding */ beSureBtnClick),
/* harmony export */   "cancelBtnClick": () => (/* binding */ cancelBtnClick),
/* harmony export */   "gridStatusChange": () => (/* binding */ gridStatusChange),
/* harmony export */   "initTemplate": () => (/* binding */ initTemplate),
/* harmony export */   "onClickButton": () => (/* binding */ onClickButton),
/* harmony export */   "onClickPageInfo": () => (/* binding */ onClickPageInfo),
/* harmony export */   "onSearchAfterEvent": () => (/* binding */ onSearchAfterEvent),
/* harmony export */   "onloaddata": () => (/* binding */ onloaddata)
/* harmony export */ });
/* unused harmony exports onSelected, gridBeChecked, onClickSearchBtn */
/* harmony import */ var nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5118);
/* harmony import */ var nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__);

const gridid = 'head';
const searchid = 'search';
const pageId = 'M0Z10201_HpcfDeptVO';
const appcode = 'M0Z10201';
const printNodeKey = null;
const keys = [
    'iseucountry'
];
const urls = {
    queryUrl: '/nccloud/hpf/HpcfDeptVO/HpcfDeptVOQuery.do',
    pageQueryUrl: '/nccloud/hpf/HpcfDeptVO/HpcfDeptVOQueryPageGridByPks.do',
    saveUrl: '/nccloud/hpf/HpcfDeptVO/HpcfDeptVOSave.do',
    printUrl: '/nccloud/hpf/HpcfDeptVO/HpcfDeptVOPrint.do',
    downUrl: '/nccloud/hpf/HpcfDeptVO/HpcfDeptVODown.do'
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
                //把默认得主组织放在state中
                if (data.context.pk_org) {
                    this.setState({
                        pk_org: data.context.pk_org
                    });
                }
                meta = modifierMeta.call(this, props, meta);
                props.meta.setMeta(meta);
            }
            if (data.button) {
                let button = data.button;
                props.button.setButtons(button);
                props.button.setButtonDisabled({
                    'Delete': true
                });
                props.button.setButtonDisabled({
                    'Edit': true
                });
                props.button.setPopContent('DelLine', this.state.json['M0Z10201-000019']);
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
    let data = this.props.search.getAllSearchData(searchid, false);
    let querycondition = {};
    if (data && data.conditions.length != 0) {
        querycondition = data;
    }
    let paramData = {
        querycondition: querycondition,
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
    let searchval = this.state.hasSearched && this.state.hasSearched == true ? props.search.getAllSearchData(searchid, false) : null;
    //获取查询模板信息
    let OID = this.props.meta.getMeta()[searchid].oid;
    //queryInfo.oid;
    //定义请求参数
    let paramData = {
        pageInfo: pageInfo,
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
                title: this.state.json['M0Z10201-000006'],
                /* 国际化处理： 确认取消*/ content: this.state.json['M0Z10201-000007'],
                /* 国际化处理： 是否确认要取消!*/ beSureBtnClick: ()=>{
                    props.editTable.cancelEdit(gridid);
                    props.editTable.setStatus(gridid, 'browse');
                    props.button.setButtonDisabled('Edit', true);
                    props.button.setMainButton('Add', true);
                    props.button.setButtonDisabled('Delete', true);
                    gridStatusChange.call(this);
                }
            });
            break;
        case 'Down':
            //原编辑按钮
            props.modal.show('selds');
            break;
        case 'Save':
            // 必填项校验
            props.editTable.filterEmptyRows(gridid, keys);
            let changedRows = props.editTable.getAllData(gridid);
            //props.editTable.getChangedRows(gridid,true);
            if (!changedRows || changedRows.length === 0) {
                props.editTable.cancelEdit(gridid);
                props.editTable.setStatus(gridid, 'browse');
                props.button.setButtonsVisible('Edit', true);
                props.button.setMainButton('Add', true);
                gridStatusChange.call(this);
                return;
            }
            if (!props.editTable.checkRequired(gridid, changedRows.rows)) return;
            props.editTable.setStatus(gridid, 'browse');
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
                    success: (function(res) {
                        //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
                        this.props.editTable.setStatus(gridid, 'browse');
                        if (res.data) {
                            let allD = this.props.editTable.getAllData(gridid);
                            filterResult(allD, res.data[gridid].rows);
                            this.props.editTable.setTableData(gridid, allD);
                            (0,nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.toast)({
                                color: 'success',
                                title: this.state.json['M0Z10201-000008']
                            });
                        }
                        /* 国际化处理： 保存成功*/ props.button.setButtonDisabled('Edit', true);
                        props.button.setMainButton('Add', true);
                        props.button.setButtonDisabled('Delete', true);
                        gridStatusChange.call(this);
                    }).bind(this)
                });
            }, {
                [gridid]: 'editTable'
            }, 'grid');
            break;
        case 'Delete':
            if (rowsdata.length != 0) {
                if (props.editTable.getStatus(gridid) && props.editTable.getStatus(gridid) == 'edit') {
                    let indexs = rowsdata.map((item)=>{
                        return item.index;
                    });
                    props.editTable.deleteTableRowsByIndex(gridid, indexs);
                } else {
                    let newData2 = rowsdata.map((item)=>{
                        return {
                            status: '3',
                            values: item.data.values
                        };
                    });
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
                        title: this.state.json['M0Z10201-000009'],
                        /* 国际化处理： 确认删除*/ content: this.state.json['M0Z10201-000010'],
                        /* 国际化处理： 确定要删除所选数据吗？*/ beSureBtnClick: deleteOpr.bind(this, data, paramData)
                    });
                }
            } else {
                (0,nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.promptBox)({
                    color: "warning",
                    title: this.state.json['M0Z10201-000011'],
                    /* 国际化处理： 提示*/ content: this.state.json['M0Z10201-000012']
                });
            }
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
                title: this.state.json['M0Z10201-000020'],
                color: 'success'
            });
        /* 国际化处理： 刷新成功*/ default:
            break;
    }
}
function beSureBtnClick(props) {
    let dbinfo = this.state.dbinfo;
    if (Object.keys(dbinfo).length == 0) {
        (0,nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.toast)({
            color: 'warning',
            title: "来源系统不能为空!"
        });
        /* 国际化处理： 下载成功*/ return;
    }
    (0,nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.ajax)({
        url: urls.downUrl,
        data: {
            ref1: this.state.dbinfo
        },
        async: false,
        success: (res)=>{
            let { success , data  } = res;
            //填充数据
            if (success) {
                (0,nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.toast)({
                    color: 'success',
                    title: data
                });
            } else /* 国际化处理： 下载成功*/ {
                (0,nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.toast)({
                    color: 'success',
                    title: "下载失败"
                });
            }
            props.modal.close('selds');
        }
    });
    let rowsdata = props.editTable.getCheckedRows(gridid);
    //获取分页信息
    let pageInfo = props.editTable.getTablePageInfo(gridid);
    //查询区条件
    let searchval = props.search.getAllSearchData(searchid, false);
    //获取查询模板信息
    let OID = this.props.meta.getMeta()[searchid].oid;
    //queryInfo.oid;
    //定义请求参数
    let paramData = {
        pageInfo: pageInfo,
        querycondition: searchval == null ? {} : searchval,
        pagecode: pageId,
        queryAreaCode: searchid,
        //查询区编码
        oid: OID,
        //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
        querytype: 'tree'
    };
    loadGridData.call(this, false, paramData);
}
function cancelBtnClick() {
    this.setState({
        pk_entryconfig: ''
    });
}
/**
* 表格复选框选择改变事件
*/ function onSelected() {
    let rows = this.props.editTable.getCheckedRows(gridid);
    let isDisable = rows && rows.length > 0 ? false : true;
    this.props.button.setButtonDisabled([
        'Delete'
    ], isDisable);
    this.props.button.setButtonDisabled([
        'Edit'
    ], isDisable);
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
        'Output': gridStatus === 'browse'
    });
    this.props.button.setPopContent('DelLine', gridStatus === 'browse' ? this.state.json['M0Z10201-000000'] : '');
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
        pageInfo: pageInfo,
        querycondition: searchVal
    };
    loadGridData.call(this, false, paramdata, 'pageQueryUrl');
}
/**
* 查询条件编辑后事件
* @param {*} props
* @param {*} data
*/ function onSearchAfterEvent(props) {
    let data = props.search.getAllSearchData(searchid);
    if (data && data.conditions.length != 0) {
        let pk_org = props.search.getSearchValByField(searchid, 'pk_org');
        if (pk_org && pk_org.value && pk_org.value.firstvalue) {
            let value = pk_org.value.firstvalue;
            this.setState({
                dbinfo: null,
                pk_org: value
            });
        }
        if (props.editTable.getStatus() && props.editTable.getStatus() == 'edit') {
            (0,nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.promptBox)({
                color: "warning",
                title: this.state.json['M0Z10201-000011'],
                /* 国际化处理： 提示*/ content: this.state.json['M0Z10201-000015']
            });
        }
        /* 国际化处理： 编辑态不能查询*/ ;
        let OID = this.props.meta.getMeta()[searchid].oid;
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
    } else {
        this.setState({
            pk_org: ""
        });
        props.editTable.setTableData(gridid, {
            rows: []
        }, false);
    }
}
/**
* 点击查询按钮事件
* @param {*} props
* @param {*} data
*/ function onClickSearchBtn(props, data) {
    if (props.editTable.getStatus() && props.editTable.getStatus() == 'edit') {
        promptBox({
            color: "warning",
            title: this.state.json['M0Z10201-000011'],
            /* 国际化处理： 提示*/ content: this.state.json['M0Z10201-000015']
        });
    }
    /* 国际化处理： 编辑态不能查询*/ ;
    let OID = this.props.meta.getMeta()[searchid].oid;
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
        data: data,
        success: (res)=>{
            if (res.success) {
                this.props.button.setButtonDisabled([
                    'Delete'
                ], true);
                loadGridData.call(this, false, paramData);
                (0,nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.toast)({
                    color: 'success',
                    title: this.state.json['M0Z10201-000002']
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
            content: this.state.json['M0Z10201-000013'],
            color: 'warning'
        });
        /* 国际化处理： 无可打印数据*/ return;
    }
    let pks = [];
    allData.rows.forEach((item, key)=>{
        pks.push(item.values['pk_dept'].value);
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
            content: this.state.json['M0Z10201-000014'],
            color: 'warning'
        });
        /* 国际化处理： 无可输出的数据*/ return;
    }
    let pks = [];
    allData.rows.forEach((item, key)=>{
        pks.push(item.values['true'].value);
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
    //清空组织条件,刷新不查询
    if (typeof paramData.querycondition.conditions === 'undefined') {
        return;
    }
    if (paramData.querycondition.conditions && paramData.querycondition.conditions.length == 0) {
        return;
    }
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
                        'Delete': true,
                        'Edit': true
                    });
                } else {
                    let nulldata = {
                        rows: []
                    };
                    _this.props.editTable.setTableData(gridid, nulldata);
                    _this.props.button.setButtonDisabled({
                        'PrintGrp': true,
                        'Output': true,
                        'Delete': true,
                        'Edit': true
                    });
                }
                _this.props.editTable.setStatus('browse');
                if (isToast === true) {
                    (0,nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.toast)({
                        color: 'success',
                        content: this.state.json['M0Z10201-000003'] + data[gridid].allpks.length + this.state.json['M0Z10201-000004']
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
                    content: this.state.json['M0Z10201-000005']
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
    //查询区参照过滤
    meta[searchid].items.map((item)=>{
        if (item.attrcode === 'pk_org') {
            //财务组织过滤
            //item.isMultiSelectedEnabled = true; //财务组织多选
            item.queryCondition = ()=>{
                return {
                    funcode: props.getSearchParam('c'),
                    //appcode获取
                    //用户权限过滤
                    TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
                };
            };
        }
        if (item.attrcode === 'syscode') {
            //来源系统过滤
            item.queryCondition = ()=>{
                return {
                    pk_org: this.state.pk_org
                };
            };
        }
    });
    //添加操作列
    // meta[gridid].items.push({
    //     attrcode: 'opr',
    //     label: this.state.json['M0Z10201-000001'],/* 国际化处理： 操作*/
    //     width: 200,
    //     fixed: 'right',
    //     className: 'table-opr',
    //     itemtype: 'customer',
    //     visible: true,
    //     render: (text, record, index) => {
    //         let btnArray = tableBtnAry(props);
    //         return props.button.createOprationButton(
    //             btnArray,
    //             {
    //                 area: "table-opr-area",
    //                 buttonLimit: 3,
    //                 onButtonClick: (props, id) => tableButtonClick.call(this, props, id, text, record, index)
    //             }
    //         )
    //     }
    // });
    return meta;
}
function tableBtnAry(props) {
    return props.editTable.getStatus(gridid) === 'browse' ? [
        'EditLine',
        'DelLine'
    ] : [
        'Spread',
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
                ajax({
                    url: urls['saveUrl'],
                    data: data,
                    success: (res)=>{
                        if (res.success) {
                            toast({
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


/***/ }),

/***/ 4497:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "onCloseTableModel": () => (/* binding */ onCloseTableModel)
/* harmony export */ });
/* unused harmony export onTableAfterEdit */
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
// EXTERNAL MODULE: ./src/hpf/hpfc/m0z10201/action/index.js
var action = __webpack_require__(8799);
// EXTERNAL MODULE: ./src/hpf/hpfc/m0z10201/event/index.js
var m0z10201_event = __webpack_require__(4497);
;// CONCATENATED MODULE: ./src/hpf/refer/hpfrefs/HpfEntryConfigGridRef/index.js
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
    return /*#__PURE__*/ React.createElement(Refer, _objectSpreadProps(_objectSpread({}, Object.assign(conf, props)), {
        __source: {
            fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\refer\\hpfrefs\\HpfEntryConfigGridRef\\index.js",
            lineNumber: 23,
            columnNumber: 12
        },
        __self: this
    }));
}

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
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/less-loader/dist/cjs.js!./src/hpf/hpfc/m0z10201/main/index.less
var main = __webpack_require__(3940);
;// CONCATENATED MODULE: ./src/hpf/hpfc/m0z10201/main/index.less

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (styleTagTransform_default());
options.setAttributes = (setAttributesWithoutAttributes_default());

      options.insert = insertBySelector_default().bind(null, "head");
    
options.domAPI = (styleDomAPI_default());
options.insertStyleElement = (insertStyleElement_default());

var update = injectStylesIntoStyleTag_default()(main/* default */.Z, options);




       /* harmony default export */ const m0z10201_main = (main/* default */.Z && main/* default.locals */.Z.locals ? main/* default.locals */.Z.locals : undefined);

;// CONCATENATED MODULE: ./src/hpf/hpfc/m0z10201/main/index.js






const { NCDiv  } = external_nc_lightapp_front_.base;
const { PrintOutput  } = external_nc_lightapp_front_.high;

const gridid = 'head';
const searchid = 'search';
const pageId = 'M0Z10201_czncc';
const appcode = 'M0Z10201';
const printNodeKey = null;
const urls = {
    queryUrl: '/nccloud/hpf/HpcfDeptVO/HpcfDeptVOQuery.do',
    pageQueryUrl: '/nccloud/hpf/HpcfDeptVO/HpcfDeptVOQueryPageGridByPks.do',
    saveUrl: '/nccloud/hpf/HpcfDeptVO/HpcfDeptVOSave.do',
    printUrl: '/nccloud/hpf/HpcfDeptVO/HpcfDeptVOPrint.do'
};
let HpcfDeptVOTable = class HpcfDeptVOTable extends external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_.Component {
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
        const { modal  } = this.props;
        let { createModal  } = modal;
        return /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement("div", {
            className: "nc-single-table",
            __source: {
                fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10201\\main\\index.js",
                lineNumber: 69,
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
                fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10201\\main\\index.js",
                lineNumber: 71,
                columnNumber: 17
            },
            __self: this
        }, /* 标题 title */ /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement("div", {
            className: "header-title-search-area",
            __source: {
                fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10201\\main\\index.js",
                lineNumber: 73,
                columnNumber: 21
            },
            __self: this
        }, createBillHeadInfo({
            title: this.state.json['M0Z10201-000018'],
            /* 国际化处理： 国家地区*/ backBtnClick: ()=>{},
            initShowBackBtn: false
        })), /* 按钮区  btn-group */ /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement("div", {
            className: "header-button-area header-button-area-print-btn",
            __source: {
                fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10201\\main\\index.js",
                lineNumber: 83,
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
                fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10201\\main\\index.js",
                lineNumber: 91,
                columnNumber: 17
            },
            __self: this
        }, NCCreateSearch(searchid, {
            //查询区
            // clickSearchBtn: actions['onClickSearchBtn'].bind(this),
            showSearchBtn: false,
            showClearBtn: false,
            showAdvBtn: false,
            showAdvSearchPlanBtn: false,
            showAdvSearchPlanBtn: false,
            onAfterEvent: action.onSearchAfterEvent.bind(this, this.props)
        })), /* 列表区 */ /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement("div", {
            className: "nc-singleTable-table-area",
            __source: {
                fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10201\\main\\index.js",
                lineNumber: 103,
                columnNumber: 17
            },
            __self: this
        }, createEditTable(gridid, {
            handlePageInfoChange: action.onClickPageInfo.bind(this),
            onCloseModel: m0z10201_event.onCloseTableModel.bind(this),
            statusChange: action.gridStatusChange.bind(this),
            showIndex: true,
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
                fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10201\\main\\index.js",
                lineNumber: 113,
                columnNumber: 17
            },
            __self: this
        }), createModal('selds', {
            title: '选择来源系统',
            className: 'selds',
            content: /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement("div", {
                __source: {
                    fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10201\\main\\index.js",
                    lineNumber: 128,
                    columnNumber: 29
                },
                __self: this
            }, /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement(HpfEntryConfigGridRef, {
                value: this.state.dbinfo,
                isMultiSelectedEnabled: false,
                queryCondition: (v)=>{
                    return {
                        pk_org: this.state.pk_org
                    };
                },
                onChange: (v)=>{
                    this.setState({
                        dbinfo: v
                    });
                },
                __source: {
                    fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10201\\main\\index.js",
                    lineNumber: 129,
                    columnNumber: 34
                },
                __self: this
            })),
            beSureBtnClick: action.beSureBtnClick.bind(this, this.props),
            cancelBtnClick: action.cancelBtnClick.bind(this),
            size: 'sm'
        }));
    }
    constructor(props){
        super(props);
        this.state = {
            OID: '',
            searchValue: '',
            checkValue: 'false',
            json: {},
            dbinfo: {},
            pk_org: ''
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
            moduleId: 'M0Z10201',
            domainName: 'hpf',
            callback
        });
    }
};
HpcfDeptVOTable = (0,external_nc_lightapp_front_.createPage)({
    billinfo: [
        {
            billtype: 'grid',
            pagecode: pageId,
            bodycode: gridid
        }
    ],
    mutiLangCode: appcode
})(HpcfDeptVOTable);
external_root_ReactDOM_var_ReactDOM_commonjs_react_dom_commonjs2_react_dom_amd_react_dom_default().render(/*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement(HpcfDeptVOTable, {
    __source: {
        fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10201\\main\\index.js",
        lineNumber: 165,
        columnNumber: 17
    },
    __self: undefined
}), document.querySelector('#app'));

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=index.c0a457b6.js.map