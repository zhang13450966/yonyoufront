/*! @ncctag {"project":"hpf","branch":"develop-ncc1.0","provider":"suqch","date":"2023/8/30 10:51:22"} */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("nc-lightapp-front"));
	else if(typeof define === 'function' && define.amd)
		define(["nc-lightapp-front"], factory);
	else if(typeof exports === 'object')
		exports["hpf/hpfc/m0z10221/action/index"] = factory(require("nc-lightapp-front"));
	else
		root["hpf/hpfc/m0z10221/action/index"] = factory(root["nc-lightapp-front"]);
})(self, (__WEBPACK_EXTERNAL_MODULE__5118__) => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 5118:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__5118__;

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
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "beSureBtnClick": () => (/* binding */ beSureBtnClick),
/* harmony export */   "cancelBtnClick": () => (/* binding */ cancelBtnClick),
/* harmony export */   "gridBeChecked": () => (/* binding */ gridBeChecked),
/* harmony export */   "gridStatusChange": () => (/* binding */ gridStatusChange),
/* harmony export */   "initTemplate": () => (/* binding */ initTemplate),
/* harmony export */   "onClickButton": () => (/* binding */ onClickButton),
/* harmony export */   "onClickPageInfo": () => (/* binding */ onClickPageInfo),
/* harmony export */   "onClickSearchBtn": () => (/* binding */ onClickSearchBtn),
/* harmony export */   "onSearchAfterEvent": () => (/* binding */ onSearchAfterEvent),
/* harmony export */   "onSelected": () => (/* binding */ onSelected),
/* harmony export */   "onloaddata": () => (/* binding */ onloaddata),
/* harmony export */   "setDefaultOrg": () => (/* binding */ setDefaultOrg)
/* harmony export */ });
/* harmony import */ var nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5118);
/* harmony import */ var nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__);

const gridid = 'head';
const searchid = 'search';
const pageId = 'M0Z10221_equip';
const appcode = 'M0Z10221';
const printNodeKey = null;
const keys = [
    'iseucountry'
];
const urls = {
    queryUrl: '/nccloud/hpf/equip/EquipQuery.do',
    pageQueryUrl: '/nccloud/hpf/equip/EquipQueryPageGridByPks.do',
    saveUrl: '/nccloud/hpf/equip/EquipSave.do',
    printUrl: '/nccloud/hpf/equip/EquipPrint.do',
    downUrl: '/nccloud/hpf/equip/HpcfEquipVODown.do'
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
                //把默认得主组织放在state中
                if (data.context.pk_org) {
                    this.setState({
                        pk_org: data.context.pk_org
                    });
                    this.setState({
                        org_name: data.context.org_Name
                    });
                }
                setDefaultOrg.call(this);
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
                props.button.setPopContent('DelLine', this.state.json['M0Z10221-000019']);
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
                title: this.state.json['M0Z10221-000006'],
                /* 国际化处理： 确认取消*/ content: this.state.json['M0Z10221-000007'],
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
            props.modal.show('selds');
            break;
        // case 'Edit':
        //     props.editTable.setStatus(gridid, 'edit');
        //     props.button.setButtonsVisible('Edit', false);
        //     props.button.setMainButton('Add', false);
        //     break;
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
                                title: this.state.json['M0Z10221-000008']
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
                        title: this.state.json['M0Z10221-000009'],
                        /* 国际化处理： 确认删除*/ content: this.state.json['M0Z10221-000010'],
                        /* 国际化处理： 确定要删除所选数据吗？*/ beSureBtnClick: deleteOpr.bind(this, data, paramData)
                    });
                }
            } else {
                (0,nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.promptBox)({
                    color: "warning",
                    title: this.state.json['M0Z10221-000011'],
                    /* 国际化处理： 提示*/ content: this.state.json['M0Z10221-000012']
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
                title: this.state.json['M0Z10221-000020'],
                color: 'success'
            });
        /* 国际化处理： 无可打印数据*/ default:
            break;
    }
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
    this.props.button.setPopContent('DelLine', gridStatus === 'browse' ? this.state.json['M0Z10221-000000'] : '');
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
                title: this.state.json['M0Z10221-000011'],
                /* 国际化处理： 提示*/ content: this.state.json['M0Z10221-000015']
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
        (0,nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.promptBox)({
            color: "warning",
            title: this.state.json['M0Z10221-000011'],
            /* 国际化处理： 提示*/ content: this.state.json['M0Z10221-000015']
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
                    title: this.state.json['M0Z10221-000002']
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
            content: this.state.json['M0Z10221-000013'],
            color: 'warning'
        });
        /* 国际化处理： 无可打印数据*/ return;
    }
    let pks = [];
    allData.rows.forEach((item, key)=>{
        pks.push(item.values['pk_country'].value);
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
            content: this.state.json['M0Z10221-000014'],
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
                        content: this.state.json['M0Z10221-000003'] + data[gridid].allpks.length + this.state.json['M0Z10221-000004']
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
                    content: this.state.json['M0Z10221-000005']
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
    // meta[gridid].items.push({
    //     attrcode: 'opr',
    //     label: this.state.json['M0Z10221-000001'],/* 国际化处理： 操作*/
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
    //表格区参照过滤
    meta[searchid].items.map((item)=>{
        if (item.attrcode === 'pk_org') {
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
//设置默认组织
function setDefaultOrg() {
    if (this.state.pk_org && "GLOBLE00000000000000" != this.state.pk_org) {
        this.props.search.setSearchValByField(searchid, 'pk_org', {
            display: this.state.org_name,
            value: this.state.pk_org
        });
        //获取分页信息
        let pageInfo = this.props.editTable.getTablePageInfo(gridid);
        //查询区条件
        let searchval = this.props.search.getAllSearchData(searchid, false);
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
    } else {
        this.props.search.setSearchValByField(searchid, 'pk_org', {
            display: '',
            value: ''
        });
    }
}

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=index.0bafe7cc.js.map