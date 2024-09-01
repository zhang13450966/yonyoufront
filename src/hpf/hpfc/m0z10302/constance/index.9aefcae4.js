/*! @ncctag {"project":"hpf","branch":"develop-ncc1.0","provider":"suqch","date":"2023/8/30 10:51:22"} */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["hpf/hpfc/m0z10302/constance/index"] = factory();
	else
		root["hpf/hpfc/m0z10302/constance/index"] = factory();
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
/* harmony export */   "AREA": () => (/* binding */ AREA),
/* harmony export */   "BUTTONID": () => (/* binding */ BUTTONID),
/* harmony export */   "CARDTABLEAREAIDS": () => (/* binding */ CARDTABLEAREAIDS),
/* harmony export */   "CARDTABLEAREANAMES": () => (/* binding */ CARDTABLEAREANAMES),
/* harmony export */   "COPYPASTEBTNS": () => (/* binding */ COPYPASTEBTNS),
/* harmony export */   "DATASOURCECACHE": () => (/* binding */ DATASOURCECACHE),
/* harmony export */   "DEFCACHEKEY": () => (/* binding */ DEFCACHEKEY),
/* harmony export */   "DELETELINEBTNS": () => (/* binding */ DELETELINEBTNS),
/* harmony export */   "DisSysEnum": () => (/* binding */ DisSysEnum),
/* harmony export */   "FIELDS": () => (/* binding */ FIELDS),
/* harmony export */   "IVo2VoItf": () => (/* binding */ IVo2VoItf),
/* harmony export */   "MULTILANG": () => (/* binding */ MULTILANG),
/* harmony export */   "PAGECODE": () => (/* binding */ PAGECODE),
/* harmony export */   "PASTECLEARFIELDS": () => (/* binding */ PASTECLEARFIELDS),
/* harmony export */   "UISTATUS": () => (/* binding */ UISTATUS),
/* harmony export */   "URL": () => (/* binding */ URL),
/* harmony export */   "base_path": () => (/* binding */ base_path)
/* harmony export */ });
const IVo2VoItf = {
    KEY_MPK: "mpk",
    KEY_MCODE: "mcode",
    KEY_MSYSCODE: "msyscode",
    KEY_MNAME: "mname",
    KEY_HPK: "hpk",
    KEY_HCODE: "hcode",
    KEY_HNAME: "hname",
    HPFC_DEPT: "来源科室档案",
    HPFC_CHARGEPERSON: "来源收费人员档案",
    HPFC_PAYWAY: "来源支付方式",
    HPFC_CUST: "来源客户档案",
    HPFC_PAYORG: "来源支付机构档案",
    HPFC_CHARGETYPE: "来源收费项目档案",
    HPFC_DOCTOR: "来源医生信息",
    HPFC_INCOMETYPE: "来源收入项目档案",
    HPFC_DISEASEDIAGNOSIS: "来源疾病诊断档案",
    HPFC_OPERATION: "来源手术操作档案",
    HPFC_ENTITY: "来源病种档案",
    HPFC_PATIENTINFO: "来源病人信息档案",
    HPFC_WORKLOAD: "来源工作量档案",
    HPFC_INSURANCETYPE: "来源医保类型",
    HPFC_DRUG: "来源药品档案",
    HPFC_FUNDSOURCE: "来源资金来源",
    HPFC_MEASDOC: "来源计量单位",
    HPFC_WAITEM: "来源薪资项目",
    HPFC_EQUIP: "来源设备档案",
    HPFC_MATERIAL: "来源物资档案",
    HPFC_COSTPRO: "57成本项目档案",
    HPFC_SPGRADE: "57分摊级次",
    HPFC_PJTYPLEDOC: "来源票据类型档案",
    HPFC_SUPPLIER: "来源供应商档案",
    HPFC_LOCATION: "来源货位档案",
    HPFC_ORG: "来源院区档案",
    HRP_LOCATION: "0001Z010000000000ZL1"
};
//系统类型
const DisSysEnum = {
    ZONGZHANG: "1",
    JIANGJIN: "2",
    COST_MANAGER: "8",
    GAOZHIHAOCAI: "7",
    PJ_MANAGE: "9"
};
// 页面模板编码
const PAGECODE = {
    listPagecode: 'M0Z10302_list',
    cardPagecode: 'M0Z10302_card'
};
/**
* @description: 多语
* @param moduleId: 多语资源名
* @param domainName: 工程名
*/ const MULTILANG = {
    langfileId: [
        '4001pubmessage'
    ],
    domainName: 'hpf'
};
// 区域编码
const AREA = {
    searchId: 'search',
    // 列表查询区
    listTableId: 'list_table',
    // 列表表头区
    listBodyId: 'list_body',
    //列表表体
    cardFormId: 'card_head',
    // 卡片表头区
    cardBody_1: 'cardBody_1',
    //卡片表体
    /** 按钮区域 */ listHead: 'listBtn_head',
    // 列表表头按钮区
    listInner: 'listBtn_inner',
    // 列表表体操作区
    cardHead: 'card_head',
    // 卡片表头按钮区
    cardBody_1_shoulder: 'cardBody_1_shoulder',
    cardBody_1_inner: 'cardBody_1_inner'
};
// 卡片表格区域ID
const CARDTABLEAREAIDS = [
    AREA.cardBody_1
];
// 卡片表格区域名称
const CARDTABLEAREANAMES = [
    '4001PUBMESSAGE-0000007',
    '4001PUBMESSAGE-0000008'
];
// '4001PUBMESSAGE-0000009',
// '4001PUBMESSAGE-0000010'
/* 国际化处理： 折扣梯度,单品折扣,组合折扣,适用组织*/ // 按钮ID
const BUTTONID = {
    Add: 'Add',
    // 新增
    Delete: 'Delete',
    // 删除
    Refresh: 'Refresh',
    // 刷新
    Edit: 'Edit',
    // 修改
    Copy: 'Copy',
    // 复制
    Save: 'Save',
    // 保存
    Cancel: 'Cancel',
    // 取消
    AutomaticControl: 'AutomaticControl',
    //自动对照
    EditExport: 'EditExport',
    //编辑态导出模板
    EditImport: 'EditImport',
    //编辑态导入
    Import: 'Import',
    //导入
    Export: 'Export',
    //导出
    cardBody_1_AddLine: 'AddLineGra',
    // 增行
    cardBody_1_DeleteLine: 'DeleteLineGra',
    // 删行
    cardBody_1_CopyLine: 'CopyLineGra',
    // 复制行
    cardBody_1_PasteLineToTail: 'PasteLineToTailGra',
    // 粘贴至末行
    cardBody_1_CancelB: 'CancelBGra',
    // 取消(粘贴)
    cardBody_1_PasteLine: 'PasteLineGra',
    // 粘贴至此
    cardBody_1_InsertLine: 'InsertLineGra',
    // 插行
    Back: 'Back'
};
// 返回
//请求基础路径
const base_path = '/nccloud/vo2vo/common';
// URL
const URL = {
    list: '/list',
    card: '/card',
    query: `/nccloud/vo2vo/common/query.do`,
    queryCard: `/nccloud/vo2vo/common/queryCard.do`,
    delete: `/nccloud/vo2vo/common/delete.do`,
    copy: `/nccloud/vo2vo/common/copy.do`,
    print: `/nccloud/vo2vo/common/print.do`,
    save: `/nccloud/vo2vo/common/save.do`,
    beforeSaveCheck: `/nccloud/vo2vo/common/beforeSaveCheck.do`,
    headBeforeEdit: `/nccloud/vo2vo/common/headBeforeEdit.do`,
    queryBodyRows: `/nccloud/vo2vo/common/queryBodyRows.do`,
    bodyBeforeEdit: `/nccloud/vo2vo/common/bodyBeforeEdit.do`,
    bodyAfterEdit: `/nccloud/vo2vo/common/bodyAfterEdit.do`,
    queryShowCol: `/nccloud/vo2vo/common/queryShowCol.do`,
    dynamicRefHandle: `/nccloud/vo2vo/common/DynamicRefHandle.do`,
    autoFillValue: '/nccloud/vo2vo/common/autoFillValue.do',
    initColsShow: '/nccloud/vo2vo/common/initColsShow.do',
    automaticControl: '/nccloud/vo2vo/common/automaticControl.do',
    //自动对照
    editImport: '/nccloud/vo2vo/common/EditImportAction.do',
    //编辑态导入
    editExport: '/nccloud/vo2vo/common/EditExportAction.do',
    //编辑态导出
    vdefcol: '/nccloud/vo2vo/common/vdefcol.do'
};
// 字段
const FIELDS = {
    /** 表头字段 */ pk_head_fields: 'pk_interdocref',
    // 表头字段
    pk_org: 'pk_org',
    // 所属组织
    pk_group: 'pk_group',
    // 所属集团
    ts: 'ts',
    // 时间戳
    pk_body_b1: 'pk_interdocref_b',
    pk_mid_ref: 'pk_mid_ref',
    //来源档案类型
    pk_hrp_ref: 'pk_hrp_ref',
    //目的档案类型
    idissys: 'idissys',
    //来源系统
    /**表体字段 */ hpk: 'hpk',
    srcbillitempk: 'srcbillitempk'
};
// 页面状态
const UISTATUS = {
    add: 'add',
    // 新增态
    copy: 'copy',
    // 复制态
    browse: 'browse',
    // 浏览态
    edit: 'edit'
};
// 编辑态
// 单页缓存
const DATASOURCECACHE = {
    dataSourceListCacheKey: 'hpf.hpfc.nccloud.data_source_list',
    // 列表缓存ID
    dataSourceBodyCacheKey: 'hpf.hpfc.nccloud.data_source_body'
};
// 列表缓存ID
// 自定义缓存
const DEFCACHEKEY = {
    queryCacheKey: 'queryCacheKey'
};
// 查询条件缓存
// 复制行操作
const COPYPASTEBTNS = {
    [AREA.cardBody_1]: {
        initBtns: [
            BUTTONID.cardBody_1_AddLine,
            BUTTONID.cardBody_1_DeleteLine,
            BUTTONID.cardBody_1_CopyLine
        ],
        pasteBtns: [
            BUTTONID.cardBody_1_PasteLineToTail,
            BUTTONID.cardBody_1_CancelB
        ]
    }
};
// 删除行、复制行显隐性
const DELETELINEBTNS = {
    [AREA.cardBody_1]: [
        BUTTONID.cardBody_1_DeleteLine,
        BUTTONID.cardBody_1_CopyLine
    ]
};
// 粘贴时需清空的字段
const PASTECLEARFIELDS = {
    [AREA.cardBody_1]: [
        FIELDS.pk_body_b1,
        FIELDS.ts
    ]
};
const MATERIAL_TO_MATERIAL = (/* unused pure expression or super */ null && ([
    "rowno",
    "mname1",
    "mname",
    "msyscode",
    "hname1",
    "hname",
    //通常必有的字段
    "srcFormat",
    "srcUnitCode",
    "srcUnitName",
    //来源档案字段
    "materialspec",
    "materialtype",
    "factory",
    "pk_measdoc"
]));
//目的档案字段
const LOCATION_TO_RACK = (/* unused pure expression or super */ null && ([
    "rowno",
    "mname1",
    "mname",
    "msyscode",
    "hname1",
    "hname",
    //通常必有的字段
    "rackDeptName",
    "rackDeptCode",
    //来源档案字段
    "stordoccode",
    "stordocname"
]));
//目的档案字段
const COMMON = (/* unused pure expression or super */ null && ([
    "rowno",
    "mname1",
    "mname",
    "msyscode",
    "hname1",
    "hname"
]));
//通常必有的字段
const NO_SHOW = (/* unused pure expression or super */ null && ([
    "srcFormat",
    "srcUnitCode",
    "srcUnitName",
    "stordoccode",
    "stordocname",
    "def_unit",
    "pk_measdoc",
    //医疗耗材新加字段不显示
    "unitprice",
    "chargeunit",
    "format",
    "property",
    "rackDeptName",
    "rackDeptCode",
    //来源档案字段
    "materialspec",
    "materialtype",
    "factory",
    "psndeptcode",
    "psndeptname"
]));
//目的档案字段
const CHARGET_TO_MATERIAL = (/* unused pure expression or super */ null && ([
    "rowno",
    "mname1",
    "mname",
    "msyscode",
    "hname1",
    "hname",
    //通常必有的字段
    "unitprice",
    "chargeunit",
    "format",
    "property",
    //来源档案字段
    "materialspec",
    "materialtype",
    "factory"
]));
//目的档案字段
const DOCTOR_TO_PSN = (/* unused pure expression or super */ null && ([
    "rowno",
    "mname1",
    "mname",
    "msyscode",
    "hname1",
    "hname",
    //通常必有的字段
    "rackDeptName",
    "rackDeptCode",
    "psndeptcode",
    "psndeptname"
]));


/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=index.9aefcae4.js.map