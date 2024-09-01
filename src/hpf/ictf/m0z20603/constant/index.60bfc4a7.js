/*! @ncctag {"project":"hpf","branch":"develop-ncc1.0","provider":"suqch","date":"2023/8/30 10:51:22"} */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["hpf/ictf/m0z20603/constant/index"] = factory();
	else
		root["hpf/ictf/m0z20603/constant/index"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
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
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "APPCODE": () => (/* binding */ APPCODE),
/* harmony export */   "BILL_TYPE_CODE": () => (/* binding */ BILL_TYPE_CODE),
/* harmony export */   "CARD": () => (/* binding */ CARD),
/* harmony export */   "CARD_ADD_DISABLED_BUTTON": () => (/* binding */ CARD_ADD_DISABLED_BUTTON),
/* harmony export */   "CARD_BUTTON": () => (/* binding */ CARD_BUTTON),
/* harmony export */   "CARD_CACHE": () => (/* binding */ CARD_CACHE),
/* harmony export */   "CARD_DISABLED_BUTTON": () => (/* binding */ CARD_DISABLED_BUTTON),
/* harmony export */   "DATASOURCE": () => (/* binding */ DATASOURCE),
/* harmony export */   "FIELD": () => (/* binding */ FIELD),
/* harmony export */   "LIST": () => (/* binding */ LIST),
/* harmony export */   "LIST_BUTTON": () => (/* binding */ LIST_BUTTON),
/* harmony export */   "LIST_DISABLED_BUTTON": () => (/* binding */ LIST_DISABLED_BUTTON),
/* harmony export */   "MULTILANG": () => (/* binding */ MULTILANG),
/* harmony export */   "PRIMARY_KEY": () => (/* binding */ PRIMARY_KEY),
/* harmony export */   "REQUEST_URL": () => (/* binding */ REQUEST_URL),
/* harmony export */   "SEARCH_CACHE": () => (/* binding */ SEARCH_CACHE),
/* harmony export */   "STATUS": () => (/* binding */ STATUS),
/* harmony export */   "base_path": () => (/* binding */ base_path)
/* harmony export */ });
/**
* @description: 常量
*/ //应用编码
const APPCODE = 'M0Z20603';
//单据类型
const BILL_TYPE_CODE = 'HPF5';
/**
* @description: 多语
* @param moduleId: 多语资源名
* @param domainName: 工程名
*/ const MULTILANG = {
    moduleId: 'M0Z20603',
    domainName: 'hpf'
};
/**
 * 列表
 */ const LIST = {
    page_title: 'M0Z20603-000011',
    //页面标题 /* 国际化处理： 投融资费用*/
    page_code: 'M0Z20603_LIST',
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
    page_title: 'M0Z20603-000011',
    //页面标题 /* 国际化处理： 投融资费用*/
    page_code: 'M0Z20603_CARD',
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
    save: `/nccloud/hpf/ictf/saveHospSettleHeadVO.do`,
    //保存
    delete: `/nccloud/hpf/ictf/deleteHospSettleHeadVO.do`,
    //删除
    queryCard: `/nccloud/hpf/ictf/querycardHospSettleHeadVO.do`,
    //卡片查询
    queryList: `/nccloud/hpf/ictf/querypageHospSettleHeadVO.do`,
    //列表查询
    queryListByPks: `/nccloud/hpf/ictf/querypagebypkHospSettleHeadVO.do`,
    //列表分页查询
    commit: `/nccloud/hpf/ictf/commitHospSettleHeadVO.do`,
    //提交
    unCommit: `/nccloud/hpf/ictf/uncommitHospSettleHeadVO.do`,
    //收回
    down: `/nccloud/hpf/ictf/downHospSettleHeadVO.do`,
    linkquery: '/nccloud/hpf/ictf/HospSettleLinkQueryVoucher.do',
    makebill: '/nccloud/hpf/ictf/HospSettleMakebill.do',
    toCard: '/card',
    toList: '/list',
    Print: '/nccloud/hpf/ictf/HospSettlePrint.do',
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
    bodyUpdate: 'edit',
    bodyDelete: 'delete',
    bodyCommit: 'commit',
    bodyUnCommit: 'unCommit',
    copy: 'copy',
    down: 'Down',
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
    head_id: 'pk_hospsettle',
    //表头主键字段名
    body_id: 'pk_hospsettle_b',
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

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=index.60bfc4a7.js.map