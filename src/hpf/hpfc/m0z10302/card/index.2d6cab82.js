/*! @ncctag {"project":"hpf","branch":"develop-ncc1.0","provider":"suqch","date":"2023/8/30 10:51:22"} */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"), require("nc-lightapp-front"));
	else if(typeof define === 'function' && define.amd)
		define(["react", "nc-lightapp-front"], factory);
	else if(typeof exports === 'object')
		exports["hpf/hpfc/m0z10302/card/index"] = factory(require("react"), require("nc-lightapp-front"));
	else
		root["hpf/hpfc/m0z10302/card/index"] = factory(root["React"], root["nc-lightapp-front"]);
})(self, (__WEBPACK_EXTERNAL_MODULE__6487__, __WEBPACK_EXTERNAL_MODULE__5118__) => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 2683:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AREA": () => (/* binding */ AREA),
/* harmony export */   "BUTTONID": () => (/* binding */ BUTTONID),
/* harmony export */   "CARDTABLEAREAIDS": () => (/* binding */ CARDTABLEAREAIDS),
/* harmony export */   "COPYPASTEBTNS": () => (/* binding */ COPYPASTEBTNS),
/* harmony export */   "DATASOURCECACHE": () => (/* binding */ DATASOURCECACHE),
/* harmony export */   "DELETELINEBTNS": () => (/* binding */ DELETELINEBTNS),
/* harmony export */   "FIELDS": () => (/* binding */ FIELDS),
/* harmony export */   "IVo2VoItf": () => (/* binding */ IVo2VoItf),
/* harmony export */   "MULTILANG": () => (/* binding */ MULTILANG),
/* harmony export */   "PAGECODE": () => (/* binding */ PAGECODE),
/* harmony export */   "PASTECLEARFIELDS": () => (/* binding */ PASTECLEARFIELDS),
/* harmony export */   "UISTATUS": () => (/* binding */ UISTATUS),
/* harmony export */   "URL": () => (/* binding */ URL)
/* harmony export */ });
/* unused harmony exports base_path, CARDTABLEAREANAMES, DEFCACHEKEY, DisSysEnum */
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
const CARDTABLEAREANAMES = (/* unused pure expression or super */ null && ([
    '4001PUBMESSAGE-0000007',
    '4001PUBMESSAGE-0000008'
]));
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



/***/ }),

/***/ 3354:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "$$": () => (/* binding */ getCurrentLastId),
/* harmony export */   "Xw": () => (/* binding */ addCacheData),
/* harmony export */   "YN": () => (/* binding */ getNextId),
/* harmony export */   "g1": () => (/* binding */ deleteCacheData),
/* harmony export */   "hE": () => (/* binding */ updateCacheData),
/* harmony export */   "ic": () => (/* binding */ getCacheDataByPk)
/* harmony export */ });
/* unused harmony exports setDefData, getDefData, deleteCacheDataForList, updateCacheDataForList */
/* harmony import */ var nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5118);
/* harmony import */ var nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__);

/**
 * 卡片下更新缓存数据使用
 * @param {*} props
 * @param {主键字段code} pk_field
 * @param {主键值} pkvalue
 * @param {单据数据} cacheData
 * @param {区域ID} moduleId
 * @param {缓存标识key} datasource
 */ function updateCacheData(pk_field, pkvalue, cacheData, moduleId, datasource) {
    let { updateCache  } = nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.cardCache;
    updateCache(pk_field, pkvalue, cacheData, moduleId, datasource);
}
/**
 * 卡片下新增保存使用
 * @param {*} props
 * @param {主键字段code} pk_field
 * @param {主键值} pkvalue
 * @param {单据数据} cacheData
 * @param {区域ID} moduleId
 * @param {缓存标识key} datasource
 */ function addCacheData(pkvalue, cacheData, moduleId, datasource) {
    let { addCache  } = nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.cardCache;
    addCache(pkvalue, cacheData, moduleId, datasource);
}
/**
 * 卡片下删除更新缓存
 * @param {*} props
 * @param {主键字段code} pk_field
 * @param {主键值} pkvalue
 * @param {缓存标识key} datasource
 */ function deleteCacheData(pk_field, pkvalue, datasource) {
    let { deleteCacheById  } = nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.cardCache;
    deleteCacheById(pk_field, pkvalue, datasource);
}
/**
 * 卡片下删除自动翻到下一页使用
 * @param {*} props
 * @param {主键字段code} pk_field
 * @param {主键值} pkvalue
 * @param {单据数据} cacheData
 * @param {区域ID} moduleId
 * @param {缓存标识key} datasource
 */ function getNextId(pkvalue, datasource) {
    let { getNextId  } = nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.cardCache;
    let nextId = getNextId(pkvalue, datasource);
    return nextId;
}
/**
 * 列表下删除使用
 * @param {*} props
 * @param {区域ID} tableId
 * @param {主键值} pkvalue
 */ function deleteCacheDataForList(props, tableId, pkvalue) {
    if (pkvalue instanceof Array) {
        pkvalue.forEach((element)=>{
            props.table.deleteCacheId(tableId, element);
        });
    } else {
        props.table.deleteCacheId(tableId, pkvalue);
    }
}
/**
 *
 * @param {*} props
 * @param {区域ID} tableId
 * @param {主键字段code} pk_field
 * @param {批量处理后台返回的数据结构} messageInfo
 */ function updateCacheDataForList(props, tableId, pk_field, messageInfo, index) {
    let sucessrows = messageInfo.sucessVOs;
    if (sucessrows == null || sucessrows.length == 0) {
        return;
    }
    // 组装更新数据
    let updateDatas = [];
    // 列表表头按钮
    if (index == undefined) {
        // 更新成功的数据
        //1. 构建界面选择的信息 主键和index的对应关系
        let selMap = {};
        let selrows = props.table.getCheckedRows(tableId);
        selrows.forEach((row)=>{
            let selpk = row.data.values[pk_field].value;
            selMap[selpk] = row.index;
        });
        sucessrows[tableId].rows.forEach((sucessrow)=>{
            let pkvalue = sucessrow.values[pk_field].value;
            let updateData = {
                index: selMap[pkvalue],
                data: {
                    values: sucessrow.values
                }
            };
            updateDatas.push(updateData);
        });
    } else {
        let updateData = {
            index: index,
            data: {
                values: sucessrows[tableId].rows[0].values
            }
        };
        updateDatas.push(updateData);
    }
    props.table.updateDataByIndexs(tableId, updateDatas);
}
/**
 * 卡片下获取缓存数据
 * @param {} props
 * @param {缓存标识key} dataSource
 * @param {主键值} pk
 */ function getCacheDataByPk(dataSource, pk) {
    let { getCacheById  } = nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.cardCache;
    return getCacheById(pk, dataSource);
}
/**
 * 自定义缓存处理
 * @param {缓存标识key} dataSource
 * @param {自定义缓存标识} key
 * @param {自定义缓存数据} data
 */ function setDefData(dataSource, key, data) {
    let { setDefData  } = cardCache;
    setDefData(key, dataSource, data);
}
/**
 * 自定义缓存处理
 * @param {缓存标识key} dataSource
 * @param {自定义缓存标识} key
 */ function getDefData(dataSource, key) {
    let { getDefData  } = cardCache;
    return getDefData(key, dataSource);
}
/**
 * 卡片下获取列表当前页的最后一条pk
 * @param {缓存标识key} dataSource
 * @param {自定义缓存标识} key
 */ function getCurrentLastId(dataSource) {
    let { getCurrentLastId  } = nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.cardCache;
    return getCurrentLastId(dataSource);
}



/***/ }),

/***/ 8165:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "E": () => (/* binding */ getCardDisableHotKeyBtn)
/* harmony export */ });
/* unused harmony export getListDisableHotKeyBtn */
/**
  * 列表态操作列不需要快捷键的按钮 
  * 例：
  * props.button.createOprationButton({
  *     ...其它
  *     ignoreHotkeyCode:getListDisableHotKeyBtn()
  * })
  */ function getListDisableHotKeyBtn() {
    return [
        'Commit',
        'Delete'
    ];
}
/** 目前是仅有提交和删除 */ /**
 * 卡片态表格肩部不需要快捷键的按钮
 * 例：
 * props.button.createButtonApp({
 *      ...其它
 *      ignoreHotkeyCode:getCardDisableHotKeyBtn()
 * })
 */ function getCardDisableHotKeyBtn() {
    return [
        'DeleteLine'
    ];
}
/** 目前是仅有删除行 */ 


/***/ }),

/***/ 9068:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BY": () => (/* binding */ showRefreshInfo),
/* harmony export */   "Us": () => (/* binding */ showCancelDialog),
/* harmony export */   "WD": () => (/* binding */ showConfirmDialog),
/* harmony export */   "c2": () => (/* binding */ showSuccessInfo),
/* harmony export */   "hE": () => (/* binding */ showInfoDialog),
/* harmony export */   "hP": () => (/* binding */ showWarningInfo),
/* harmony export */   "rD": () => (/* binding */ showSingleDeleteDialog)
/* harmony export */ });
/* unused harmony exports showErrorInfo, showInfoInfo, showSuccessDialog, showErrorDialog, showWarningDialog, showBatchOprMessage, showBatchOperateInfo, showDeleteDialog, showChangeOrgDialog, showHasQueryResultInfo, showNoQueryResultInfo, showSaveInfo, showErrorMessageByRes, showSaveAndCommitInfo, showQuerySuccess */
/* harmony import */ var nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5118);
/* harmony import */ var nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _constance_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2683);


/**
 *  处理消息提示的多语问题，定义的提示多语容器（ES6语法支持面向对象类）
 */ let LangContainer = class LangContainer {
    init(lang, status, inlt) {
        if (status) {
            this.lang = lang;
            this.inlt = inlt;
        }
    }
    getLangByResId(resid, param) {
        let str = resid;
        if (param) {
            str = this.inlt.get(resid, param);
            return str ? str : resid;
        } else {
            // 如果还没有加载回来，则返回空，避免页面显示多语字符串
            if (this.lang) {
                str = this.lang[resid];
                return str ? str : resid;
            } else {
                return resid;
            }
        }
    }
    constructor(){
        this.lang = null;
        this.inlt = null;
        console.log('LangContainer初始化');
        // 初始化提示多语信息
        (0,nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.getMultiLang)({
            moduleId: _constance_index__WEBPACK_IMPORTED_MODULE_1__.MULTILANG.langfileId,
            domainName: _constance_index__WEBPACK_IMPORTED_MODULE_1__.MULTILANG.domainName,
            callback: this.init.bind(this),
            needInlt: true
        });
    }
};
/**
 * 实例化多语容器
 */ const lang = new LangContainer();
/**
 * 显示操作成功信息
 * @param {*} title 非必输 默认：已成功
 * @param {*} content 非必输
 * @param {*} duration 非必输 默认3秒 值为infinity 不消失
 */ function showSuccessInfo(title, content, duration) {
    showInfo(title, content, duration);
}
/**
 * 显示警告信息
 * @param {*} title 非必输 默认：请注意
 * @param {*} content 非必输
 * @param {*} duration 非必输 默认3秒 值为infinity 不消失
 */ function showWarningInfo(title, content, duration) {
    showInfo(title, content, duration, 'warning');
}
/**
 * 显示显示帮助信息信息
 * @param {*} title 非必输 默认：帮助信息
 * @param {*} content 非必输
 * @param {*} duration 非必输 默认3秒 值为infinity 不消失
 */ function showInfoInfo(title, content, duration) {
    showInfo(title, content, duration, 'info');
}
/**
 * 显示失败信息
 * @param {*} title 非必输 默认：出错啦
 * @param {*} content 非必输
 * @param {*} duration 非必输 默认3秒 值为infinity 不消失
 */ function showErrorInfo(title, content, duration = 'infinity') {
    showInfo(title, content, duration, 'danger');
}
/**
 * 批量操作错误提示(修改成红框,之前是黄框)
 * @param {*} title
 * @param {*} content
 * @param {*} detailMsg
 * @param {*} param
 */ function showBatchOperateInfo(title, content, detailMsg, param = {}) {
    showInfo(title, content, 'infinity', 'danger', true, [
        lang.getLangByResId('4001PUBMESSAGE-000000'),
        lang.getLangByResId('4001PUBMESSAGE-000001'),
        lang.getLangByResId('4001PUBMESSAGE-000002')
    ], /* 国际化处理： 展开,收起,我知道了*/ detailMsg, param.onExpand, param.onClose);
}
function showInfo(title, content, duration, color, groupOperation, TextArr, groupOperationMsg, onExpand, onClose) {
    (0,nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.toast)({
        duration: duration,
        // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
        color: color,
        // 提示类别，默认是 "success",非必输
        title: title,
        // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
        content: content,
        // 提示内容,非必输
        groupOperation: groupOperation,
        //批量操作，默认值是false，批量操作是true，非批量操作是false,非必输
        TextArr: TextArr,
        //提示框按钮文字，第一个值是展按钮未展开时，第二个值是展开按钮展开时，第三个值是关闭，批量操作必输
        groupOperationMsg: groupOperationMsg,
        //数组的每一项，是批量操作之后数据处理结果的描述，非必输
        onExpand: onExpand,
        // 点击展开按钮的回调函数,非必输
        onClose: onClose
    });
}
// 关闭按钮的回调函数,非必输
/**
 * 显示成功Dialog
 * @param {*} title 标题  非必输 默认：已成功
 * @param {*} content 内容  非必输
 * @param {*} param 参数 非必输 参数列表：noFooter noCancelBtn beSureBtnName cancelBtnName beSureBtnClick cancelBtnClick closeBtnClick closeByClickBackDrop
 */ function showSuccessDialog(title, content, param = {}) {
    showMessageDialog(title, content, param);
}
/**
 * 显示警告Dialog
 * @param {*} title 标题  非必输 默认：请注意
 * @param {*} content 内容  非必输
 * @param {*} param 参数 非必输 参数列表：noFooter noCancelBtn beSureBtnName cancelBtnName beSureBtnClick cancelBtnClick closeBtnClick closeByClickBackDrop
 */ function showWarningDialog(title, content, param = {}) {
    showMessageDialog(title, content, param, 'warning');
}
/**
 * 显示帮助Dialog
 * @param {*} title 标题  非必输 默认：帮助信息
 * @param {*} content 内容  非必输
 * @param {*} param 参数 非必输 参数列表：noFooter noCancelBtn beSureBtnName cancelBtnName beSureBtnClick cancelBtnClick closeBtnClick closeByClickBackDrop
 */ function showInfoDialog(title, content, param = {}) {
    showMessageDialog(title, content, param, 'info');
}
/**
 * 显示错误Dialog
 * @param {*} title 标题  非必输 默认：出错啦 请注意 帮助信息 已成功
 * @param {*} content 内容  非必输
 * @param {*} param 参数 非必输 参数列表：noFooter noCancelBtn beSureBtnName cancelBtnName beSureBtnClick cancelBtnClick closeBtnClick closeByClickBackDrop
 */ function showErrorDialog(title, content, param = {}) {
    showMessageDialog(title, content, param, 'danger');
}
function showMessageDialog(title, content, param = {}, color) {
    (0,nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.promptBox)({
        color: color,
        // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
        title: title,
        // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
        content: content,
        // 提示内容,非必输
        noFooter: param.noFooter,
        // 是否显示底部按钮(确定、取消),默认显示(false),非必输
        noCancelBtn: param.noCancelBtn,
        // 是否显示取消按钮,，默认显示(false),非必输
        beSureBtnName: param.beSureBtnName,
        // 确定按钮名称, 默认为"确定",非必输
        cancelBtnName: param.cancelBtnName,
        // 取消按钮名称, 默认为"取消",非必输
        beSureBtnClick: param.beSureBtnClick,
        // 确定按钮点击调用函数,非必输
        cancelBtnClick: param.cancelBtnClick,
        // 取消按钮点击调用函数,非必输
        closeBtnClick: param.closeBtnClick,
        //关闭按钮点击调用函数，非必输
        closeByClickBackDrop: param.closeByClickBackDrop
    });
}
//点击遮罩关闭提示框，默认是true点击关闭，阻止关闭是false
// add by wangceb 批量消息提示框
function showBatchOprMessage(title = lang.getLangByResId('4001PUBMESSAGE-000003'), messageInfo, param = {}, btnname = '') {
    /* 国际化处理： 提示*/ let failedNum = messageInfo.failedNum;
    let sucessNum = messageInfo.sucessNum;
    // 全部成功，提示即可
    if (failedNum == 0) {
        showSuccessInfo(lang.getLangByResId('4001PUBMESSAGE-000018', {
            0: btnname
        }), lang.getLangByResId('4001PUBMESSAGE-000022', {
            0: messageInfo.sucessNum
        }));
    } else /* 国际化处理： 处理成功{0}条！*/ if (sucessNum == 0) {
        title = lang.getLangByResId('4001PUBMESSAGE-000019', {
            0: btnname
        });
        let content = lang.getLangByResId('4001PUBMESSAGE-000020', {
            0: messageInfo.failedNum,
            1: messageInfo.failedNum
        });
        /* 国际化处理：共处理{0}条，失败{1}条！*/ toast({
            duration: 'infinity',
            // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
            color: 'danger',
            // 提示类别，默认是 "success",非必输
            title: title,
            // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
            content: content,
            // 提示内容,非必输
            groupOperation: true,
            //批量操作，默认值是false，批量操作是true，非批量操作是false,非必输
            TextArr: [
                lang.getLangByResId('4001PUBMESSAGE-000000'),
                lang.getLangByResId('4001PUBMESSAGE-000001'),
                lang.getLangByResId('4001PUBMESSAGE-000002')
            ],
            //提示框按钮文字，第一个值是展按钮未展开时，第二个值是展开按钮展开时，第三个值是关闭，批量操作必输/* 国际化处理： 展开,收起,我知道了*/
            groupOperationMsg: messageInfo.errorMessages,
            //数组的每一项，是批量操作之后数据处理结果的描述，非必输
            onExpand: param.onExpand,
            // 点击展开按钮的回调函数,非必输
            onClose: param.onClose
        });
    } else // 关闭按钮的回调函数,非必输
    {
        title = lang.getLangByResId('4001PUBMESSAGE-000019', {
            0: btnname
        });
        let content = lang.getLangByResId('4001PUBMESSAGE-000021', {
            0: Number(messageInfo.sucessNum) + Number(messageInfo.failedNum),
            1: messageInfo.sucessNum,
            2: messageInfo.failedNum
        });
        /* 国际化处理： 共处理{0}条，成功{1}条，失败{2}条！*/ toast({
            duration: 'infinity',
            // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
            color: 'danger',
            // 提示类别，默认是 "success",非必输
            title: title,
            // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
            content: content,
            // 提示内容,非必输
            groupOperation: true,
            //批量操作，默认值是false，批量操作是true，非批量操作是false,非必输
            TextArr: [
                lang.getLangByResId('4001PUBMESSAGE-000000'),
                lang.getLangByResId('4001PUBMESSAGE-000001'),
                lang.getLangByResId('4001PUBMESSAGE-000002')
            ],
            //提示框按钮文字，第一个值是展按钮未展开时，第二个值是展开按钮展开时，第三个值是关闭，批量操作必输/* 国际化处理： 展开,收起,我知道了*/
            groupOperationMsg: messageInfo.errorMessages,
            //数组的每一项，是批量操作之后数据处理结果的描述，非必输
            onExpand: param.onExpand,
            // 点击展开按钮的回调函数,非必输
            onClose: param.onClose
        });
    }
}
// 关闭按钮的回调函数,非必输
/**
 * 显示提示取消对话框
 * @param {*} param 参数(对象) 必输 参数列表：noFooter noCancelBtn beSureBtnName cancelBtnName beSureBtnClick cancelBtnClick  closeBtnClick closeByClickBackDrop
 */ function showCancelDialog(param = {}) {
    showWarningDialog(lang.getLangByResId('4001PUBMESSAGE-000007'), lang.getLangByResId('4001PUBMESSAGE-000008'), param);
}
/* 国际化处理： 取消,确定要取消吗?*/ /**
 * 显示提示卡片单个删除对话框
 * @param {*} param 参数(对象) 必输 参数列表：noFooter noCancelBtn beSureBtnName cancelBtnName beSureBtnClick cancelBtnClick  closeBtnClick closeByClickBackDrop
 */ function showSingleDeleteDialog(param = {}) {
    showWarningDialog(lang.getLangByResId('4001PUBMESSAGE-000009'), lang.getLangByResId('4001PUBMESSAGE-000010'), param);
}
/* 国际化处理： 删除,确定要删除吗?*/ /**
 * 显示提示卡片单个删除对话框
 * @param {*} param 参数(对象) 必输 参数列表：noFooter noCancelBtn beSureBtnName cancelBtnName beSureBtnClick cancelBtnClick  closeBtnClick closeByClickBackDrop
 */ function showConfirmDialog(title = "提示", content = "确认?", param = {}) {
    showWarningDialog(title, content, param);
}
/* 国际化处理： 提示,将清空表体所有行,是否继续？*/ /**
 * 显示提示列表多个删除对话框
 * @param {*} param 参数(对象) 必输 参数列表：noFooter noCancelBtn beSureBtnName cancelBtnName beSureBtnClick cancelBtnClick  closeBtnClick closeByClickBackDrop
 */ function showDeleteDialog(param = {}) {
    showWarningDialog(lang.getLangByResId('4001PUBMESSAGE-000009'), lang.getLangByResId('4001PUBMESSAGE-000011'), param);
}
/* 国际化处理： 删除,确定要删除所选数据吗?*/ /**
 * 显示提示修改主组织对话框
 * @param {*} param 参数(对象) 必输 参数列表：noFooter noCancelBtn beSureBtnName cancelBtnName beSureBtnClick cancelBtnClick  closeBtnClick closeByClickBackDrop
 */ function showChangeOrgDialog(param = {}) {
    showWarningDialog(lang.getLangByResId('4001PUBMESSAGE-000012'), lang.getLangByResId('4001PUBMESSAGE-000013'), param);
}
/* 国际化处理： 确认修改,是否修改组织，这样会清空您录入的信息?*/ /**
 * 查询结果提示消息
 * @param {*} successNum 可不传
 */ function showHasQueryResultInfo(successNum) {
    if (successNum) {
        showSuccessInfo(null, lang.getLangByResId('4001PUBMESSAGE-000015', {
            1: successNum
        }));
    } else /**国际化处理：查询成功，共{0}条 */ {
        showSuccessInfo(null, lang.getLangByResId('4001PUBMESSAGE-000014'));
    }
}
/**查询成功 */ /**
 * 没有查询结果提示消息
 */ function showNoQueryResultInfo() {
    showWarningInfo(null, lang.getLangByResId('4001PUBMESSAGE-000016'));
}
/**国际化处理：未查询出符合条件的数据 */ /**
 * 刷新成功提示消息
 */ function showRefreshInfo() {
    showSuccessInfo(lang.getLangByResId('4001PUBMESSAGE-000017'));
}
/**国际化处理：刷新成功 */ /**
 * 保存成功提示消息
 */ function showSaveInfo() {
    showSuccessInfo(lang.getLangByResId('4001PUBMESSAGE-000023'));
}
/**国际化处理：保存成功 */ /**
 * 保存提交成功-多语提示
 */ function showSaveAndCommitInfo() {
    showSuccessInfo(lang.getLangByResId('4001PUBMESSAGE-000028'));
}
/**国际化处理：保存提交成功 */ /**
 * 查询成功
 */ function showQuerySuccess() {
    showSuccessInfo(null, lang.getLangByResId('4001PUBMESSAGE-000014'));
}
/**查询成功 */ /**
 * ajax失败时根据返回值异常类型进行消息提示
 * @param {*} props 
 * @param {*} config 
 */ function showErrorMessageByRes(props, res) {
    if (res && res.message) {
        const colors = [
            'danger',
            'warning',
            'info',
            'success'
        ];
        let color = colors.indexOf(res.type) != -1 ? res.type : 'danger';
        toast({
            color,
            content: res.message
        });
    }
}



/***/ }),

/***/ 3899:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "k": () => (/* binding */ getLangByResId),
/* harmony export */   "v": () => (/* binding */ initLang)
/* harmony export */ });
/* harmony import */ var nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5118);
/* harmony import */ var nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__);

/**
 * 初始化多语文件到组件内
 * @param {*} _this 
 * @param {*} resPath 数组
 * @param {*} moduleCode 
 * @param {*} callback 初始化模板回调
 */ function initLang(_this, resPath, moduleCode, callback) {
    // 初始化集合
    _this.lang = null;
    _this.inlt = null;
    let success = (lang, status, inlt)=>{
        if (status) {
            _this.lang = lang;
            _this.inlt = inlt;
        }
        // 模板初始化
        callback && callback();
    };
    (0,nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.getMultiLang)({
        moduleId: resPath,
        domainName: moduleCode,
        callback: success,
        needInlt: true
    });
}
/**
 * 获取多语
 * @param {*} _this 
 * @param {*} resid 
 * @param {*} param 
 */ function getLangByResId(_this, resid, param) {
    check(_this, resid);
    let str = resid;
    if (param) {
        if (_this.inlt) {
            str = _this.inlt.get(resid, param);
            return str ? str : resid;
        } else // str = _this.state.inlt.get(resid, param);
        {
            return '';
        }
    } else {
        // 如果还没有加载回来，则返回空，避免页面显示多语字符串
        if (_this.lang) {
            // if (_this.state.lang){
            // str = _this.state.lang[resid];
            str = _this.lang[resid];
            return str ? str : resid;
        } else {
            return '';
        }
    }
}
/**
 * 检查
 * @param {*} _this 
 * @param {*} resid 
 */ function check(_this, resid) {
    if (!_this) {
        (0,nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.toast)({
            color: 'danger',
            content: '请检查代码中this是否能够取到！当前为undifined,位置：' + resid
        });
        throw new Error('请检查代码中this是否能够取到！当前为undifined,位置：' + resid);
    }
}



/***/ }),

/***/ 2591:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "e": () => (/* binding */ createCardTitle)
/* harmony export */ });
/* unused harmony export createListTitle */
/**
 * 创建列表标题 （默认不带返回按钮）（基于BillHeadInfo）
 * @param {*} _this this
 * @param {*} params 参数对象 默认为 {} ，title 不传默认取应用菜单名称
 */ function _defineProperty(obj, key, value) {
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
function createListTitle(_this, params = {}) {
    let { BillHeadInfo  } = _this.props;
    const { createBillHeadInfo  } = BillHeadInfo;
    return createBillHeadInfo(_objectSpreadProps(_objectSpread({}, params), {
        title: getAPPTitle(_this, params.title),
        initShowBackBtn: false
    }));
}
/**
 * 创建卡片标题（基于BillHeadInfo）
 * @param {*} _this this
 * @param {*} params 参数对象 默认为 {} ，title 不传默认取应用菜单名称
 */ function createCardTitle(_this, params = {}) {
    let { BillHeadInfo  } = _this.props;
    const { createBillHeadInfo  } = BillHeadInfo;
    return createBillHeadInfo(_objectSpreadProps(_objectSpread({}, params), {
        title: getAPPTitle(_this, params.title)
    }));
}
function getAPPTitle(_this, title) {
    if (title) {
        return title;
    } else {
        // 取菜单标题
        return _this.props.getSearchParam('n');
    }
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

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ card)
});

// EXTERNAL MODULE: external {"root":"React","var":"React","commonjs":"react","commonjs2":"react","amd":"react"}
var external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_ = __webpack_require__(6487);
var external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default = /*#__PURE__*/__webpack_require__.n(external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_);
// EXTERNAL MODULE: external "nc-lightapp-front"
var external_nc_lightapp_front_ = __webpack_require__(5118);
// EXTERNAL MODULE: ./src/hpf/hpfc/m0z10302/constance/index.js
var constance = __webpack_require__(2683);
// EXTERNAL MODULE: ./src/hpf/hpfc/m0z10302/tool/cacheDataManager.js
var cacheDataManager = __webpack_require__(3354);
// EXTERNAL MODULE: ./src/hpf/hpfc/m0z10302/tool/messageUtil.js
var messageUtil = __webpack_require__(9068);
;// CONCATENATED MODULE: ./src/hpf/hpfc/m0z10302/card/afterEvents/headAfterEvent.js



/* harmony default export */ function headAfterEvent(props, moduleId, key, value, oldValue) {
    if (key === constance.FIELDS.pk_org) {
        if (value.value) {
            props.resMetaAfterPkorgEdit();
            //选择主组织以后，恢复其他字段的编辑性
            props.button.setDisabled({
                [constance.BUTTONID.cardBody_1_AddLine]: false
            });
            let irows = props.cardTable.getNumberOfRows(constance.AREA.cardBody_1);
            if (irows > 0) {
                messageUtil/* showConfirmDialog */.WD("提示", "将清空表头及表体所有行？", {
                    beSureBtnClick: ()=>{
                        props.form.setFormItemsValue(moduleId, {
                            'pk_mid_ref': {
                                value: null,
                                display: null
                            },
                            'pk_hrp_ref': {
                                value: null,
                                display: null
                            },
                            'idissys': {
                                value: null,
                                display: null
                            },
                            'srcbilltype': {
                                value: null,
                                display: null
                            },
                            'srcbillitempk': {
                                value: null,
                                display: null
                            }
                        });
                        for(let i = irows; i >= 0; i--){
                            props.cardTable.delRowsByIndex(constance.AREA.cardBody_1, i);
                        }
                    },
                    cancelBtnClick: ()=>{
                        props.form.setFormItemsValue(moduleId, {
                            'pk_org': {
                                value: oldValue.value,
                                display: oldValue.display
                            }
                        });
                    }
                });
            } else {
                //没有表体数据的时候，直接清空 目标系统单据类型
                props.form.setFormItemsValue(moduleId, {
                    'pk_mid_ref': {
                        value: null,
                        display: null
                    },
                    'pk_hrp_ref': {
                        value: null,
                        display: null
                    },
                    'idissys': {
                        value: null,
                        display: null
                    },
                    'srcbilltype': {
                        value: null,
                        display: null
                    },
                    'srcbillitempk': {
                        value: null,
                        display: null
                    }
                });
            }
        } else {
            props.initMetaByPkorg();
            props.button.setDisabled({
                [constance.BUTTONID.cardBody_1_AddLine]: true
            });
            let irows = props.cardTable.getNumberOfRows(constance.AREA.cardBody_1);
            props.form.setFormItemsValue(moduleId, {
                'pk_mid_ref': {
                    value: null,
                    display: null
                },
                'pk_hrp_ref': {
                    value: null,
                    display: null
                },
                'idissys': {
                    value: null,
                    display: null
                },
                'srcbilltype': {
                    value: null,
                    display: null
                },
                'srcbillitempk': {
                    value: null,
                    display: null
                }
            });
            for(let i = irows; i >= 0; i--){
                props.cardTable.delRowsByIndex(constance.AREA.cardBody_1, i);
            }
        }
    }
    //保存hrp——ref的旧值，以免清空后还原旧值找不到
    let pk_hrp_ref_old = props.form.getFormItemsValue(moduleId, 'pk_hrp_ref');
    cleanPk_hrp_refItem.call(this, props, moduleId, key, value, oldValue);
    if (key == constance.FIELDS.pk_mid_ref) {
        let pk_mid_ref = props.form.getFormItemsValue(moduleId, 'pk_mid_ref').display;
        let idissys = props.form.getFormItemsValue(moduleId, 'idissys').value;
        if (pk_mid_ref == '来源科室档案' && (idissys == '1' || idissys == '8')) {
            props.form.setFormItemsVisible(constance.AREA.cardFormId, {
                'srcbilltype': true,
                'srcbillitempk': true
            });
        } else //'srcbillitemtxt': true
        {
            props.form.setFormItemsVisible(constance.AREA.cardFormId, {
                'srcbilltype': false,
                'srcbillitempk': false,
                'srcbillitemtxt': false
            });
        }
        pk_mid_refAfterEdit.call(this, props, moduleId, oldValue);
    }
    if (key == constance.FIELDS.idissys) {
        //目标系统
        let idissys = props.form.getFormItemsValue(moduleId, 'idissys').value;
        //if(idissys == '1' || idissys == '8'){  add by mzq目的系统为成本时先不显示
        //         if(idissys == '1'){
        //                 props.form.setFormItemsVisible(AREA.cardFormId,  {
        //                         'srcbilltype': true,
        //                         'srcbillitempk': true,
        //                         //'srcbillitemtxt': true
        //                     });
        //        }else{
        //                 props.form.setFormItemsVisible(AREA.cardFormId,  {
        //                         'srcbilltype': false,
        //                         'srcbillitempk': false,
        //                         'srcbillitemtxt': false
        //                 });
        //        }
        let irows = props.cardTable.getNumberOfRows(constance.AREA.cardBody_1);
        if (irows > 0) {
            messageUtil/* showConfirmDialog */.WD("提示", "将清空来源档案类型及表体所有行？", {
                beSureBtnClick: ()=>{
                    props.form.setFormItemsValue(moduleId, {
                        'pk_mid_ref': {
                            value: null,
                            display: null
                        },
                        'pk_hrp_ref': {
                            value: null,
                            display: null
                        },
                        'srcbilltype': {
                            value: null,
                            display: null
                        },
                        'srcbillitempk': {
                            value: null,
                            display: null
                        }
                    });
                    for(let i = irows; i >= 0; i--){
                        props.cardTable.delRowsByIndex(constance.AREA.cardBody_1, i);
                    }
                },
                cancelBtnClick: ()=>{
                    props.form.setFormItemsValue(moduleId, {
                        'idissys': {
                            value: oldValue.value,
                            display: oldValue.display
                        }
                    });
                }
            });
        } else {
            //没有表体数据的时候，直接清空 目标系统单据类型
            props.form.setFormItemsValue(moduleId, {
                'pk_mid_ref': {
                    value: null,
                    display: null
                },
                'srcbilltype': {
                    value: null,
                    display: null
                },
                'srcbillitempk': {
                    value: null,
                    display: null
                }
            });
        }
        //add by mzq查询动态列
        let srcbillitempk = props.form.getFormItemsValue(moduleId, 'srcbillitempk').value;
        srcbillitempkAfterEvent.call(this, props, moduleId, srcbillitempk, oldValue);
    }
    if (key == "pk_hrp_ref") {
        // 目的类型档案
        clean_hrp_refAfterEdit.call(this, props, moduleId, oldValue);
    }
    if (key == "srcbilltype") {
        let irows = props.cardTable.getNumberOfRows(constance.AREA.cardBody_1);
        let srcbillitempk = props.form.getFormItemsValue(moduleId, 'srcbillitempk');
        let srcbillitemtxt = props.form.getFormItemsValue(moduleId, 'srcbillitemtxt');
        if (irows > 0) {
            messageUtil/* showConfirmDialog */.WD("提示", "根据来源单据类型配置指定字段对照关系，将清空单据项目及表体所有行？", {
                beSureBtnClick: ()=>{
                    props.form.setFormItemsValue(moduleId, {
                        'srcbillitempk': {
                            value: null,
                            display: null
                        }
                    });
                    for(let i = irows; i >= 0; i--){
                        props.cardTable.delRowsByIndex(constance.AREA.cardBody_1, i);
                    }
                },
                cancelBtnClick: ()=>{
                    props.form.setFormItemsValue(moduleId, {
                        'srcbilltype': {
                            value: oldValue.value,
                            display: oldValue.display
                        },
                        srcbillitempk,
                        srcbillitemtxt
                    });
                }
            });
            let meta = this.props.meta.getMeta();
            meta[constance.AREA.cardBody_1].items.forEach((item)=>{
                // add by mzq 隐藏动态列
                if (item.attrcode.slice(0, 4) == "vdef") {
                    item.visible = false;
                }
            });
            this.props.meta.setMeta(meta);
            props.form.setFormItemsValue(moduleId, {
                'srcbillitempk': {
                    value: null,
                    display: null
                }
            });
        } else {
            let meta = this.props.meta.getMeta();
            meta[constance.AREA.cardBody_1].items.forEach((item)=>{
                // add by mzq 隐藏动态列
                if (item.attrcode.slice(0, 4) == "vdef") {
                    item.visible = false;
                }
            });
            this.props.meta.setMeta(meta);
            props.form.setFormItemsValue(moduleId, {
                'srcbillitempk': {
                    value: null,
                    display: null
                }
            });
        }
    }
    if (key == "srcbillitempk") {
        billitempkAfterEdit.call(this, props, moduleId, value, oldValue);
    }
    let [{ value: pk_org  }, { value: idissys  }, { value: pk_mid_ref  }, { value: pk_hrp_ref  }] = props.form.getFormItemsValue('card_head', [
        'pk_org',
        'idissys',
        'pk_mid_ref',
        'pk_hrp_ref'
    ]);
    if (pk_org && idissys && pk_mid_ref && pk_hrp_ref) {
        props.button.setButtonDisabled(constance.BUTTONID.EditImport, false);
    } else {
        props.button.setButtonDisabled(constance.BUTTONID.EditImport, true);
    }
}
function srcbillitempkAfterEvent(props, moduleId, value, oldValue) {
    let param = {};
    //add by mzq查询动态列
    param = {
        idissys: props.form.getFormItemsValue(moduleId, 'idissys').value,
        srcbilltyperefcode: props.form.getFormItemsValue(moduleId, 'srcbilltype').refcode,
        srcbillitempk: value == null ? null : value.value
    };
    let meta = this.props.meta.getMeta();
    (0,external_nc_lightapp_front_.ajax)({
        url: constance.URL.vdefcol,
        data: param,
        async: false,
        success: (res)=>{
            let { success , data  } = res;
            //填充数据
            if (success) {
                if (data.hidecols) {
                    props.cardTable.hideColByKey(constance.AREA.cardBody_1, data.hidecols);
                }
                if (data.showlist) {
                    let map = new Map();
                    let fieldcodes = data.showlist.map((item)=>{
                        map.set(item.fieldcode, item.attrcode);
                        return item.fieldcode;
                    });
                    meta = this.props.meta.getMeta();
                    meta[constance.AREA.cardBody_1].items.forEach((item)=>{
                        if (fieldcodes.indexOf(item.attrcode) > -1) {
                            item.attrname = data.namemap[map.get(item.attrcode)];
                            item.label = data.namemap[map.get(item.attrcode)];
                            //add by mzq业务类型下拉框
                            if (item.attrname === "业务类型") {
                                item.itemtype = "select";
                                let selectoptions = [
                                    {
                                        display: '门诊',
                                        value: '1'
                                    },
                                    {
                                        display: '住院',
                                        value: '2'
                                    }
                                ];
                                item.options = selectoptions;
                            }
                        }
                        // add by mzq 隐藏动态列
                        if (fieldcodes.length == 0) {
                            if (item.attrcode.slice(0, 4) == "vdef") {
                                item.visible = false;
                            }
                        }
                    });
                    this.props.meta.setMeta(meta);
                    props.cardTable.showColByKey(constance.AREA.cardBody_1, fieldcodes);
                } else {
                    meta[constance.AREA.cardBody_1].items.forEach((item)=>{
                        // add by mzq 隐藏动态列
                        if (item.attrcode.slice(0, 4) == "vdef") {
                            item.visible = false;
                        }
                    });
                    this.props.meta.setMeta(meta);
                }
                if (data.srcbillitemtxt) {
                    props.form.setFormItemsValue(moduleId, {
                        'srcbillitemtxt': {
                            value: data.srcbillitemtxt,
                            display: data.srcbillitemtxt
                        }
                    });
                } else {
                    props.form.setFormItemsValue(moduleId, {
                        'srcbillitemtxt': {
                            value: null,
                            display: null
                        }
                    });
                }
            }
        }
    });
}
function clean_hrp_refAfterEdit(props, moduleId, oldValue) {
    let irows = props.cardTable.getNumberOfRows(constance.AREA.cardBody_1);
    if (irows != 0) {
        for(let i = 0; i < irows; i++){
            props.cardTable.setValByKeyAndIndex(constance.AREA.cardBody_1, i, 'hcode', {
                value: null,
                display: null
            });
            props.cardTable.setValByKeyAndIndex(constance.AREA.cardBody_1, i, 'hname', {
                value: null,
                display: null
            });
            props.cardTable.setValByKeyAndIndex(constance.AREA.cardBody_1, i, 'hname1', {
                value: null,
                display: null
            });
        }
    }
}
function pk_mid_refAfterEdit(props, moduleId, oldValue) {
    let tableId = constance.AREA.cardBody_1;
    let [pk_org, pk_interdocref, idissys, pk_mid_ref, srcbilltype, srcbillitempk] = props.form.getFormItemsValue(moduleId, [
        "pk_org",
        "pk_interdocref",
        "idissys",
        "pk_mid_ref",
        "srcbilltype",
        "srcbillitempk"
    ]);
    //目标系统
    if (pk_mid_ref.value) {
        //1、清空表体数据
        // props.cardTable.setStatus(tableId, 'browse');
        let irows = props.cardTable.getNumberOfRows(tableId);
        //2、根据不同参照设置不同的值
        let param = {
            pk_org: pk_org.value,
            pk_group: (0,external_nc_lightapp_front_.getBusinessInfo)().groupId,
            idissys: idissys.value,
            midpk: pk_mid_ref.value,
            midname: pk_mid_ref.display,
            srcbilltyperefcode: srcbilltype.value,
            srcbillitempk: srcbillitempk.value
        };
        if (pk_interdocref.value) {
            param.pk_interdocref = pk_interdocref.value;
        }
        if (irows > 0) {
            messageUtil/* showConfirmDialog */.WD("提示", "将清空表体所有行,是否继续？", {
                beSureBtnClick: ()=>{
                    props.form.setFormItemsValue(moduleId, {
                        'pk_hrp_ref': {
                            value: null,
                            display: null
                        }
                    });
                    for(let i = irows; i >= 0; i--){
                        props.cardTable.delRowsByIndex(tableId, i);
                    }
                    addLine.call(this, props, param);
                },
                cancelBtnClick: ()=>{
                    props.form.setFormItemsValue(moduleId, {
                        'pk_mid_ref': {
                            value: oldValue.value,
                            display: oldValue.display
                        }
                    });
                    let pk_mid_ref = props.form.getFormItemsValue(moduleId, 'pk_mid_ref').display;
                    let idissys = props.form.getFormItemsValue(moduleId, 'idissys').value;
                    if (pk_mid_ref == '来源科室档案' && (idissys == '1' || idissys == '8')) {
                        props.form.setFormItemsVisible(constance.AREA.cardFormId, {
                            'srcbilltype': true,
                            'srcbillitempk': true
                        });
                        //'srcbillitemtxt': true
                        props.form.setFormItemsValue(constance.AREA.cardFormId, {
                            srcbilltype,
                            srcbillitempk
                        });
                        props.form.setFormItemsDisabled(constance.AREA.cardFormId, {
                            'srcbilltype': false,
                            'srcbillitempk': false,
                            'srcbillitemtxt': false
                        });
                    } else {
                        props.form.setFormItemsVisible(constance.AREA.cardFormId, {
                            'srcbilltype': false,
                            'srcbillitempk': false,
                            'srcbillitemtxt': false
                        });
                    }
                }
            });
        } else {
            addLine.call(this, props, param);
        }
        //3、来源档案类型选择非来源科室档案时，来源单据和单据项目不能编辑
        if (param.midname) {
            props.form.setFormItemsValue(moduleId, {
                'srcbilltype': {
                    value: null,
                    display: null
                },
                'srcbillitempk': {
                    value: null,
                    display: null
                },
                'srcbillitemtxt': {
                    value: null,
                    display: null
                }
            });
            if (param.midname == constance.IVo2VoItf.HPFC_DEPT) {
                props.form.setFormItemsDisabled(constance.AREA.cardFormId, {
                    'srcbilltype': false,
                    'srcbillitempk': false,
                    'srcbillitemtxt': false
                });
            } else {
                props.form.setFormItemsDisabled(constance.AREA.cardFormId, {
                    'srcbilltype': true,
                    'srcbillitempk': true,
                    'srcbillitemtxt': true
                });
            }
        }
    } else {
        let irows = props.cardTable.getNumberOfRows(tableId);
        for(let i = irows; i >= 0; i--){
            props.cardTable.delRowsByIndex(tableId, i);
        }
    }
    //==
    chargeDetailShowCol.call(this, props, constance.AREA.cardBody_1, pk_mid_ref.value, idissys.value);
}
function billitempkAfterEdit(props, moduleId, value, oldValue) {
    let tableId = constance.AREA.cardBody_1;
    let [pk_org, idissys, pk_mid_ref, srcbilltype, srcbillitempk] = props.form.getFormItemsValue(moduleId, [
        "pk_org",
        "idissys",
        "pk_mid_ref",
        "srcbilltype",
        "srcbillitempk"
    ]);
    //目标系统
    if (pk_mid_ref.value) {
        //1、清空表体数据
        // props.cardTable.setStatus(tableId, 'browse');
        //2、根据不同参照设置不同的值
        let param = {
            pk_org: pk_org.value,
            pk_group: (0,external_nc_lightapp_front_.getBusinessInfo)().groupId,
            idissys: idissys.value,
            midpk: pk_mid_ref.value,
            midname: pk_mid_ref.display,
            srcbilltyperefcode: srcbilltype.value,
            srcbillitempk: srcbillitempk.value
        };
        let irows = props.cardTable.getNumberOfRows(tableId);
        if (irows > 0) {
            messageUtil/* showConfirmDialog */.WD("提示", "变更单据项目将清空表体所有行,是否继续？", {
                beSureBtnClick: ()=>{
                    for(let i = irows; i >= 0; i--){
                        props.cardTable.delRowsByIndex(tableId, i);
                    }
                    let delrows = props.cardTable.getAllData(tableId).rows;
                    addLine.call(this, props, param, delrows);
                    srcbillitempkAfterEvent.call(this, props, moduleId, value, oldValue);
                },
                cancelBtnClick: ()=>{
                    props.form.setFormItemsValue(moduleId, {
                        'srcbillitempk': {
                            value: oldValue.value,
                            display: oldValue.display
                        }
                    });
                }
            });
        } else {
            let delrows = props.cardTable.getAllData(tableId).rows;
            addLine.call(this, props, param, delrows);
            srcbillitempkAfterEvent.call(this, props, moduleId, value, oldValue);
        }
    }
}
function addLine(props, param, delrows) {
    //2、根据不同参照设置不同的值
    (0,external_nc_lightapp_front_.ajax)({
        url: constance.URL.queryBodyRows,
        data: param,
        async: false,
        success: (res)=>{
            //填充数据
            if (res.success) {
                let newrow = res.data.bodys[constance.AREA.cardBody_1] ? res.data.bodys[constance.AREA.cardBody_1].rows : [];
                //需要把statue=3的数据拿过来放在表体行里面，不然后端不维护删除状态
                if (delrows && delrows.length > 0) {
                    newrow = newrow.concat(delrows);
                }
                props.cardTable.setTableData(constance.AREA.cardBody_1, {
                    rows: newrow
                });
            }
        }
    });
    let allrows = props.cardTable.getNumberOfRows(constance.AREA.cardBody_1);
    let rownos = [];
    for(let i = 0; i < allrows; i++){
        rownos.push(i);
    }
    props.cardTable.setStatus(constance.AREA.cardBody_1, 'edit');
    props.cardTable.setEditableByIndex(constance.AREA.cardBody_1, rownos, [
        'mcode',
        'mname',
        'mname1',
        'msyscode'
    ], false);
}
function cleanPk_hrp_refItem(props, moduleId, key, value, oldValue) {
    if (key == constance.FIELDS.idissys && !value.value) {
        //目标系统
        props.form.setFormItemsValue(moduleId, {
            'pk_hrp_ref': {
                value: '',
                display: ''
            }
        });
    }
    if (key == constance.FIELDS.pk_mid_ref && !value.value) {
        //来源档案类型
        props.form.setFormItemsValue(moduleId, {
            'pk_hrp_ref': {
                value: '',
                display: ''
            }
        });
    }
}
function chargeDetailShowCol(props, tableId, pk_mid_ref, idissys) {
    let param = {
        pk_mid_ref,
        idissys
    };
    (0,external_nc_lightapp_front_.ajax)({
        url: constance.URL.queryShowCol,
        data: param,
        async: false,
        success: (res)=>{
            let { success , data  } = res;
            //填充数据
            if (success) {
                if (data.isShow) {
                    props.cardTable.showColByKey(tableId, data.cols);
                } else {
                    props.cardTable.hideColByKey(tableId, data.cols);
                }
                if (data.appshowcols) {
                    props.cardTable.showColByKey(tableId, data.appshowcols);
                }
            }
        }
    });
}

;// CONCATENATED MODULE: ./src/hpf/hpfc/m0z10302/tool/cardTableTools/RownoUtil.js

// 行号开始
const START_VALUE = 10;
// 行号步长
const STEP_VALUE = 10;
// 最小行号
const MIN_VALUE = 0.00000001;
// 零
const ZERO_VALUE = 0;
// 精度
const DIGIT_POWER = 8;
// 行号默认的key
const ROWNO_KEY = 'crowno';
/**
 *
 * 为cardtable 提供的重置行号方法
 * @param {*} props
 * @param {区域编码} moduleId
 * @param {行号字段的编码，默认为crowno} rownoKey
 */ function resetRowNo(props, moduleId, rownoKey) {
    if (rownoKey == undefined) {
        rownoKey = ROWNO_KEY;
    }
    // 所有行数
    let rowcount = props.cardTable.getNumberOfRows(moduleId);
    for(let i = 0; i < rowcount; i++){
        let crowno = i * 10 + 10;
        props.cardTable.setValByKeyAndIndex(moduleId, i, rownoKey, {
            value: crowno.toString(),
            display: crowno.toString()
        });
    }
}
/**
 * 将cardtable表体所有行号为空的行补充上行号
 * @param {*} props
 * @param {区域编码} moduleId
 * @param {行号字段的编码} rownoKey
 */ function setRowNo(props, moduleId, rownoKey) {
    if (rownoKey == undefined) {
        rownoKey = ROWNO_KEY;
    }
    // 所有行数
    let rowcount = props.cardTable.getNumberOfRows(moduleId);
    let newrowno = [];
    let isContinue = true;
    while(rowcount > 0 && isContinue){
        // 先统计所有行号为空的行，若空行后存在行号有值的行，按照插入到该行处理
        // 否则按照新增行的行号处理
        let nullRowIndexs = [];
        let tagRowIndex = -1;
        // 根据空行决定在哪一行前面增加了多少空行
        for(let index = 0; index < rowcount; index++){
            // 所有行遍历后，中止循环
            if (index == rowcount - 1) {
                isContinue = false;
            }
            let crowno = (props.cardTable.getValByKeyAndIndex(moduleId, index, rownoKey) || {}).value;
            // if (crowno == null || crowno == '') {
            if (!crowno) {
                nullRowIndexs.push(index);
                tagRowIndex = -1;
            } else if (nullRowIndexs.length == 0) {
                continue;
            } else {
                tagRowIndex = index;
                break;
            }
        }
        let uaRowNo = null;
        // 插入目标行不等于-1时 按照插入行处理
        if (tagRowIndex != -1) {
            uaRowNo = insertLinesByIndex(props, moduleId, rownoKey, tagRowIndex, nullRowIndexs);
            uaRowNo = adjustRowNoForInsert(props, moduleId, rownoKey, tagRowIndex, uaRowNo);
        } else {
            uaRowNo = addLinesByIndex(props, moduleId, rownoKey, nullRowIndexs);
        }
        // 得到开始行、结束行行号
        // 开始行号：比粘贴行行号略小的行，结束行号：粘贴行
        // 设值到界面上
        for(let index = 0; index < nullRowIndexs.length; index++){
            let row = nullRowIndexs[index];
            props.cardTable.setValByKeyAndIndex(moduleId, row, rownoKey, {
                value: uaRowNo[index].toString(),
                display: uaRowNo[index].toString()
            });
        }
    }
}
/**
 * 将cardtable表体所有行号为空的行补充上行号
 * @param {*} props
 * @param {区域编码} moduleId
 * @param {行号字段的编码} rownoKey
  * @param {特殊号（物料分组用）} vspecialcode
 */ function setRowMaterilNo(props, moduleId, rownoKey, vspecialcode) {
    if (rownoKey == undefined) {
        rownoKey = ROWNO_KEY;
    }
    // 所有行数
    let rowcount = props.cardTable.getNumberOfRows(moduleId);
    let isContinue = true;
    while(rowcount > 0 && isContinue){
        // 先统计所有行号为空的行，若空行后存在行号有值的行，按照插入到该行处理
        // 否则按照新增行的行号处理
        let nullRowIndexs = [];
        let tagRowIndex = -1;
        // 根据空行决定在哪一行前面增加了多少空行
        for(let index = 0; index < rowcount; index++){
            // 所有行遍历后，中止循环
            if (index == rowcount - 1) {
                isContinue = false;
            }
            let crowno = (props.cardTable.getValByKeyAndIndex(moduleId, index, rownoKey) || {}).value;
            let groupcode = (props.cardTable.getValByKeyAndIndex(moduleId, index, vspecialcode) || {}).value;
            // if (crowno == null || crowno == '') {
            if (!crowno && !groupcode) {
                nullRowIndexs.push(index);
                tagRowIndex = -1;
            } else if (nullRowIndexs.length == 0) {
                continue;
            } else {
                tagRowIndex = index;
                break;
            }
        }
        let uaRowNo = null;
        // 插入目标行不等于-1时 按照插入行处理
        if (tagRowIndex != -1) {
            uaRowNo = insertLinesByIndex(props, moduleId, rownoKey, tagRowIndex, nullRowIndexs);
            uaRowNo = adjustRowNoForInsert(props, moduleId, rownoKey, tagRowIndex, uaRowNo);
        } else {
            uaRowNo = addLinesByIndex(props, moduleId, rownoKey, nullRowIndexs);
        }
        // 得到开始行、结束行行号
        // 开始行号：比粘贴行行号略小的行，结束行号：粘贴行
        // 设值到界面上
        for(let index = 0; index < nullRowIndexs.length; index++){
            let row = nullRowIndexs[index];
            props.cardTable.setValByKeyAndIndex(moduleId, row, rownoKey, {
                value: uaRowNo[index].toString(),
                display: uaRowNo[index].toString()
            });
        }
    }
}
/**
 * 插入的处理，对于插入行生成的行号进行靴位处理
 * 所有元素比较，如果不重复，则可以削位
 * @param {} iStart
 * @param {*} iEnd
 * @param {*} uaRowNo
 */ function adjustRowNoForInsert(props, moduleId, rownoKey, iEnd, uaRowNo) {
    let iStart = iEnd - uaRowNo.length - 1;
    let dPreviousRowNO = (props.cardTable.getValByKeyAndIndex(moduleId, iStart, rownoKey) || {}).value;
    dPreviousRowNO = dPreviousRowNO ? dPreviousRowNO : ZERO_VALUE;
    let dNextRowNO = (props.cardTable.getValByKeyAndIndex(moduleId, iEnd, rownoKey) || {}).value;
    let iSetLen = uaRowNo.length;
    let uaRowNoDgt = [];
    uaRowNo.forEach((row)=>{
        uaRowNoDgt.push(row);
    });
    let iStepDgt = DIGIT_POWER;
    let isContinue = true;
    while(isContinue){
        let rowNoMap = {};
        rowNoMap[dPreviousRowNO] = true;
        rowNoMap[dNextRowNO] = true;
        for(let index = 0; index < iSetLen; index++){
            let curRow = uaRowNoDgt[index];
            if (new Number(dPreviousRowNO) - new Number(curRow) >= 0 || new Number(dNextRowNO) - new Number(curRow) <= 0) {
                break;
            }
            rowNoMap[curRow] = true;
        }
        if (Object.getOwnPropertyNames(rowNoMap).length !== iSetLen + 2) {
            break;
        }
        for(let i = 0; i < iSetLen; i++){
            uaRowNo[i] = uaRowNoDgt[i];
        }
        if (iStepDgt <= 0) {
            break;
        }
        // 给新插入的元素削位
        --iStepDgt;
        for(let i = 0; i < iSetLen; i++){
            let temp = removeThousands((0,external_nc_lightapp_front_.formatAcuracy)(uaRowNoDgt[i], iStepDgt));
            uaRowNoDgt[i] = temp == '0.00000000' ? '0.00000001' : temp;
        }
    }
    return uaRowNo;
}
/**
 * 新增到最后行的行号处理
 * @param {*} props
 * @param {*} moduleId
 * @param {*} rownoKey
 * @param {*} nullRowIndexs
 */ function addLinesByIndex(props, moduleId, rownoKey, nullRowIndexs) {
    let rowcount = props.cardTable.getNumberOfRows(moduleId);
    let dPreviousRowNO = getRowNoUFDoubleMax(props, moduleId, rownoKey, rowcount);
    let uaRowNo = new Array(nullRowIndexs.length);
    for(let i = 0; i < nullRowIndexs.length; i++){
        uaRowNo[i] = (i + 1) * 10 + Number(dPreviousRowNO);
    }
    return uaRowNo;
}
function getRowNoUFDoubleMax(props, moduleId, rownoKey, nRow) {
    if (nRow === 1) {
        return ZERO_VALUE;
    }
    let dMaxValue = ZERO_VALUE;
    let dEveryValue = null;
    for(let i = 0; i < nRow; i++){
        dEveryValue = props.cardTable.getValByKeyAndIndex(moduleId, i, rownoKey).value;
        if (dEveryValue && Number(dMaxValue) < Number(dEveryValue)) {
            dMaxValue = Number(dEveryValue);
        }
    }
    return dMaxValue;
}
function insertLinesByIndex(props, moduleId, rownoKey, tagRowIndex, nullRowIndexs) {
    let dPreviousRowNO = getNotNullRowBefore(props, moduleId, rownoKey, tagRowIndex);
    let dNextRowNO = props.cardTable.getValByKeyAndIndex(moduleId, tagRowIndex, rownoKey).value;
    let uaRowNo = new Array(nullRowIndexs.length);
    // 避免首末行号相等的情况
    if (dPreviousRowNO === dNextRowNO) {
        for(let i = 0; i < nullRowIndexs.length; i++){
            uaRowNo[i] = dPreviousRowNO;
        }
    } else if (dNextRowNO == null || dNextRowNO == '') {
        for(let i = 0; i < nullRowIndexs.length; i++){
            uaRowNo[i] = (i + 1) * 10 + Number(dPreviousRowNO);
        }
    } else {
        // 计算步长
        let dStep = (dNextRowNO - dPreviousRowNO) / (nullRowIndexs.length + 1);
        let tempRowNo = dPreviousRowNO;
        for(let i = 0; i < nullRowIndexs.length; i++){
            // 限制生成的行号不能大于粘贴行的行号
            tempRowNo = Number(tempRowNo) + Number(dStep);
            let temp = removeThousands((0,external_nc_lightapp_front_.formatAcuracy)(tempRowNo, DIGIT_POWER));
            uaRowNo[i] = temp == '0.00000000' ? '0.00000001' : temp;
        }
    }
    return uaRowNo;
}
/**
 * 取目标行前面不为空的行号值
 * @param {*} props
 * @param {*} moduleId
 * @param {*} rownoKey
 * @param {目标行index} iRow
 */ function getNotNullRowBefore(props, moduleId, rownoKey, iRow) {
    let rowcount = props.cardTable.getNumberOfRows(moduleId);
    if (rowcount == 1) {
        return ZERO_VALUE;
    }
    for(let index = iRow - 1; index >= 0; index--){
        let crowno = (props.cardTable.getValByKeyAndIndex(moduleId, index, rownoKey) || {}).value;
        if (crowno != '' && crowno != undefined) {
            return crowno;
        }
    }
    return ZERO_VALUE;
}
//移除千分位
function removeThousands(val) {
    // 这里要区分 0 ‘’ null
    return val ? val.toString().replace(/\,/gi, '') : val;
}
const RownoUtils = {
    setRowMaterilNo,
    setRowNo,
    resetRowNo
};


;// CONCATENATED MODULE: ./src/hpf/hpfc/m0z10302/card/afterEvents/bodyAfterEvent.js



const { setRowNo: bodyAfterEvent_setRowNo  } = RownoUtils;
function setBodyValue(props, moduleId, index, obj) {
    props.cardTable.setValByKeyAndIndex(moduleId, index, 'mname1', {
        value: obj.refpk,
        display: obj.refcode
    });
    props.cardTable.setValByKeyAndIndex(moduleId, index, constance.IVo2VoItf.KEY_MPK, {
        display: obj.refpk,
        value: obj.refpk
    });
    props.cardTable.setValByKeyAndIndex(moduleId, index, constance.IVo2VoItf.KEY_MCODE, {
        display: obj.refcode,
        value: obj.refcode
    });
    props.cardTable.setValByKeyAndIndex(moduleId, index, constance.IVo2VoItf.KEY_MNAME, {
        display: obj.refname,
        value: obj.refname
    });
    let msyscode = obj.values.pk_entryconfig.value ? obj.values.pk_entryconfig.value : obj.values.syscode.value;
    props.cardTable.setValByKeyAndIndex(moduleId, index, constance.IVo2VoItf.KEY_MSYSCODE, {
        value: msyscode,
        display: obj.values.sysname.value
    });
}
/* harmony default export */ function bodyAfterEvent(props, moduleId, key, value, changedrows, index, record) {
    let [pk_org, pk_interdocref, idissys, pk_mid_ref, pk_hrp_ref] = props.form.getFormItemsValue(constance.AREA.cardHead, [
        "pk_org",
        "pk_interdocref",
        "idissys",
        "pk_mid_ref",
        "pk_hrp_ref"
    ]);
    //目标系统
    if (pk_interdocref) {
        props.form.setFormItemsValue(constance.AREA.cardHead, {
            'modifier': {
                value: (0,external_nc_lightapp_front_.getBusinessInfo)().userId
            },
            '': {
                value: (0,external_nc_lightapp_front_.getBusinessInfo)().businessData
            }
        });
    }
    if (key === "mname1") {
        //来源档案参照没选
        if (!value.value) {
            props.cardTable.setValByKeyAndIndex(moduleId, index, constance.IVo2VoItf.KEY_MCODE, {
                display: null,
                value: null
            });
            props.cardTable.setValByKeyAndIndex(moduleId, index, constance.IVo2VoItf.KEY_MNAME, {
                display: null,
                value: null
            });
            props.cardTable.setValByKeyAndIndex(moduleId, index, constance.IVo2VoItf.KEY_MPK, {
                display: null,
                value: null
            });
            props.cardTable.setValByKeyAndIndex(moduleId, index, constance.IVo2VoItf.KEY_MSYSCODE, {
                display: null,
                value: null
            });
        } else {
            if (Array.isArray(value)) {
                let len = value.length;
                let row = index;
                if (len >= 2) {
                    if (!value[0].values) {
                        for(let i = 0; i < len; i++){
                            if (i == len - 1) {
                                bodyAfterEvent_setRowNo(props, moduleId, 'rowno');
                                break;
                            }
                            props.cardTable.setValByKeyAndIndex(moduleId, row, 'mname1', {
                                value: value[i + 1].refpk,
                                display: value[i + 1].refcode
                            });
                            props.cardTable.setValByKeyAndIndex(moduleId, row, constance.IVo2VoItf.KEY_MCODE, {
                                value: value[i + 1].refcode,
                                display: value[i + 1].refcode
                            });
                            props.cardTable.setValByKeyAndIndex(moduleId, row, constance.IVo2VoItf.KEY_MNAME, {
                                value: value[i + 1].refname,
                                display: value[i + 1].refname
                            });
                            props.cardTable.setValByKeyAndIndex(moduleId, row, constance.IVo2VoItf.KEY_MPK, {
                                value: value[i + 1].refpk,
                                display: value[i + 1].refpk
                            });
                            let msyscode = record.values.msyscode.value;
                            let msysdisplay = record.values.msyscode.display;
                            props.cardTable.setValByKeyAndIndex(moduleId, row, constance.IVo2VoItf.KEY_MSYSCODE, {
                                value: msyscode,
                                display: msysdisplay
                            });
                            if (i < len - 2) //如果是最后一行，则不再增行，否则会多出来一行
                            props.cardTable.addRow(moduleId, row + 1, null, false);
                            row++;
                            bodyAfterEvent_setRowNo(props, moduleId, 'rowno');
                        }
                    } else {
                        for(let i = 0; i < len; i++){
                            props.cardTable.setValByKeyAndIndex(moduleId, row, 'mname1', {
                                value: value[i].refpk,
                                display: value[i].refcode
                            });
                            props.cardTable.setValByKeyAndIndex(moduleId, row, constance.IVo2VoItf.KEY_MCODE, {
                                value: value[i].refcode,
                                display: value[i].refcode
                            });
                            props.cardTable.setValByKeyAndIndex(moduleId, row, constance.IVo2VoItf.KEY_MNAME, {
                                value: value[i].refname,
                                display: value[i].refname
                            });
                            props.cardTable.setValByKeyAndIndex(moduleId, row, constance.IVo2VoItf.KEY_MPK, {
                                value: value[i].refpk,
                                display: value[i].refpk
                            });
                            props.cardTable.setValByKeyAndIndex(moduleId, row, constance.IVo2VoItf.KEY_MSYSCODE, {
                                value: value[i].values.pk_entryconfig.value,
                                display: value[i].values.sysname.value
                            });
                            if (i < len - 1) //如果是最后一行，则不再增行，否则会多出来一行
                            props.cardTable.addRow(moduleId, row + 1, null, false);
                            row++;
                            bodyAfterEvent_setRowNo(props, moduleId, 'rowno');
                        }
                    }
                } else if (len == 1) {
                    props.cardTable.setValByKeyAndIndex(moduleId, row, 'mname1', {
                        value: value[0].refpk,
                        display: value[0].refcode
                    });
                    props.cardTable.setValByKeyAndIndex(moduleId, row, constance.IVo2VoItf.KEY_MCODE, {
                        value: value[0].refcode,
                        display: value[0].refcode
                    });
                    props.cardTable.setValByKeyAndIndex(moduleId, row, constance.IVo2VoItf.KEY_MNAME, {
                        value: value[0].refname,
                        display: value[0].refname
                    });
                    props.cardTable.setValByKeyAndIndex(moduleId, row, constance.IVo2VoItf.KEY_MPK, {
                        value: value[0].refpk,
                        display: value[0].refpk
                    });
                    props.cardTable.setValByKeyAndIndex(moduleId, row, constance.IVo2VoItf.KEY_MSYSCODE, {
                        value: value[0].values.pk_entryconfig.value,
                        display: value[0].values.sysname.value
                    });
                }
            } else // 如果上段代码有问题的话，就用下面代码替换。<上段代码测试测过没问题，下面这段自己测过没问题> add by suqc
            // if (Array.isArray(value)) {
            //     //修改->在原有基础上改，此时mocode是有值的   modify by suqc
            //     if (record.values.mcode.value) {
            //         //第一次修改界面上原有值 value[0].values 没有值，这时 原来的值和新勾选的值会一并传进来 value[0] 就是原来值
            //         if (!value[0].values) {
            //             if (value.length > 0 && value.length >= 2) {
            //                 setBodyValue(props, moduleId, index, value[1]);
            //                 if (value.length > 2) {
            //                     let row = props.cardTable.getNumberOfRows(moduleId);
            //                     let index = row;
            //                     for (let i = 2; i < value.length; i++) {
            //                         //增行
            //                         props.cardTable.addRow(moduleId, -1, null, false);
            //                         //表体赋值
            //                         setBodyValue(props, moduleId, index, value[i]);
            //                         index++;
            //                     }
            //                     setRowNo(props, moduleId, 'rowno');
            //                 }
            //             }
            //         }
            //         //第二次修改界面上本次新增的记录，这时原来的值不会传进来，新勾选几个就传进来几个
            //         else {
            //             setBodyValue(props, moduleId, index, value[0]);
            //             if (value.length > 1) {
            //                 let row = props.cardTable.getNumberOfRows('cardBody_1');
            //                 let index = row;
            //                 for (let i = 1; i < value.length; i++) {
            //                     props.cardTable.addRow(moduleId, -1, null, false);
            //                     setBodyValue(props, moduleId, index, value[i]);
            //                     index++;
            //                 }
            //                 setRowNo(props, moduleId, 'rowno');
            //             }
            //         }
            //     }
            //     //新增->多选走这个分支
            //     else {
            //         let len = value.length;
            //         let row = index;
            //         for (let i = 0; i < len; i++) {
            //             setBodyValue(props, moduleId, row, value[i]);
            //             if (i < len - 1) //如果是最后一行，则不再增行，否则会多出来一行
            //                 props.cardTable.addRow(moduleId, -1, null, false);
            //             row++;
            //         }
            //         setRowNo(props, moduleId, 'rowno');
            //     }
            {
                setBodyValue(props, moduleId, index, value);
                //wxr 20200514 货位编辑后带出仓库
                //出问题就把他放在26行,这些都是单选的
                (0,external_nc_lightapp_front_.ajax)({
                    url: constance.URL.autoFillValue,
                    data: {
                        key,
                        pk_mid_ref: pk_mid_ref.value,
                        mpk: value.refpk
                    },
                    async: false,
                    success: (res)=>{
                        let { success , data  } = res;
                        //填充数据
                        if (success && data) {
                            for(let k in data){
                                props.cardTable.setValByKeyAndIndex(moduleId, index, k, {
                                    value: data[k].value,
                                    display: data[k].display
                                });
                            }
                        }
                    }
                });
            }
        }
    } else if (key === "hname1") {
        if (value.value == '') {
            props.cardTable.setValByKeyAndIndex(moduleId, index, constance.IVo2VoItf.KEY_HCODE, {
                display: null,
                value: null
            });
            props.cardTable.setValByKeyAndIndex(moduleId, index, constance.IVo2VoItf.KEY_HNAME, {
                display: null,
                value: null
            });
            props.cardTable.setValByKeyAndIndex(moduleId, index, constance.IVo2VoItf.KEY_HPK, {
                display: null,
                value: null
            });
        } else //这个参照已经没了,所以去掉了
        // if(refp.getRefModel().getClass().getName().equals("nc.ui.bonus.ref.PayProjectRefModel")){  //因为奖金和收入接口相互依赖，故使用这种方式进行判断
        //     e.getBillCardPanel().setBodyValueAt("", row, "chargetype");
        // }
        if (Array.isArray(value)) {
            props.cardTable.setValByKeyAndIndex(moduleId, index, constance.IVo2VoItf.KEY_HCODE, {
                value: value[0].refcode,
                display: value[0].refcode
            });
            props.cardTable.setValByKeyAndIndex(moduleId, index, constance.IVo2VoItf.KEY_HNAME, {
                value: value[0].refname,
                display: value[0].refname
            });
            props.cardTable.setValByKeyAndIndex(moduleId, index, constance.IVo2VoItf.KEY_HPK, {
                value: value[0].refpk,
                display: value[0].refpk
            });
        } else // if(refp.getRefModel().getClass().getName().equals("nc.ui.bonus.ref.PayProjectRefModel")){
        //     Object payclassname =  refp.getRefModel().getValue("payclassname");
        //     e.getBillCardPanel().setBodyValueAt(payclassname, row, "chargetype");
        // }
        {
            props.cardTable.setValByKeyAndIndex(moduleId, index, constance.IVo2VoItf.KEY_HCODE, {
                value: value.refcode,
                display: value.refcode
            });
            props.cardTable.setValByKeyAndIndex(moduleId, index, constance.IVo2VoItf.KEY_HNAME, {
                value: value.refname,
                display: value.refname
            });
            props.cardTable.setValByKeyAndIndex(moduleId, index, constance.IVo2VoItf.KEY_HPK, {
                value: value.refpk,
                display: value.refpk
            });
        }
        let selVals = [];
        if (!Array.isArray(value)) {
            selVals.push(value);
        } else {
            selVals = selVals.concat(value);
        }
        let param = {
            key,
            pk_hrp_ref: pk_hrp_ref.value,
            hpk: props.cardTable.getValByKeyAndIndex(moduleId, index, 'hpk').value,
            map: {
                jsonrefs: JSON.stringify(selVals),
                jsonrecord: JSON.stringify(record)
            }
        };
        (0,external_nc_lightapp_front_.ajax)({
            url: constance.URL.autoFillValue,
            data: param,
            async: false,
            success: (res)=>{
                let { success , data  } = res;
                //填充数据
                if (success && data) {
                    for(let k in data){
                        if (k === 'newAddRows') {
                            data[k].forEach((map, idx)=>{
                                props.cardTable.addRow(moduleId, -1, map, true);
                            });
                            bodyAfterEvent_setRowNo(props, moduleId, 'rowno');
                        } else {
                            props.cardTable.setValByKeyAndIndex(moduleId, index, k, {
                                value: data[k].value,
                                display: data[k].display
                            });
                        }
                    }
                }
            }
        });
    } else if (key === "stordoccode") {
        let param = {
            key,
            pk_stordoc: value[0].refpk
        };
        (0,external_nc_lightapp_front_.ajax)({
            url: constance.URL.autoFillValue,
            data: param,
            async: false,
            success: (res)=>{
                let { success , data  } = res;
                //填充数据
                if (success && data) {
                    for(let k in data){
                        props.cardTable.setValByKeyAndIndex(moduleId, index, k, {
                            value: data[k].value,
                            display: data[k].display
                        });
                    }
                }
            }
        });
    }
}

;// CONCATENATED MODULE: ./src/hpf/hpfc/m0z10302/card/afterEvents/index.js




;// CONCATENATED MODULE: ./src/hpf/hpfc/m0z10302/card/utils/cardPageUtil.js



/**
 * 清空卡片数据
 * @param {*} props 
 */ function clearCardData(props) {
    props.form.EmptyAllFormValue(constance.AREA.cardFormId);
    constance.CARDTABLEAREAIDS.forEach((areaId)=>{
        props.cardTable.setTableData(areaId, {
            rows: []
        });
    });
}
/**
 * 当主组织为空时，设置页面
 * @param {*} props 
 */ function setCardPageForEmptypk_org(props) {
    props.form.setFormItemsDisabled(constance.AREA.cardFormId, {
        pk_org: false
    });
    props.initMetaByPkorg(constance.FIELDS.pk_org);
    props.button.setDisabled({
        [constance.BUTTONID.cardBody_11_AddLine]: true,
        [constance.BUTTONID.cardBody_11_DeleteLine]: true,
        [constance.BUTTONID.cardBody_11_CopyLine]: true
    });
}
/**
 * 设置卡片界面：数据、按钮状态
 * @param {*} props 
 * @param {*} data 
 * @param {*} isCompare 差异比较
 */ function setCardPage(props, data, isCompare = true) {
    props.beforeUpdatePage();
    if (data.head && data.head[constance.AREA.cardFormId]) {
        props.form.setAllFormValue({
            [constance.AREA.cardFormId]: data.head[constance.AREA.cardFormId]
        });
    }
    if (data.bodys) {
        constance.CARDTABLEAREAIDS.forEach((areaId)=>{
            if (data.bodys[areaId]) {
                // data.bodys[areaId].rows.map(item => {
                //    item.values.mname1.display = item.values.mname1.value;
                //    item.values.hname1.display = item.values.hname1.value;
                //    return item;
                // })
                isCompare ? data.bodys[areaId] = props.cardTable.updateDataByRowId(areaId, data.bodys[areaId], true) : props.cardTable.setTableData(areaId, data.bodys[areaId], null, true, true);
                props.cardTable.selectAllRows(areaId, false);
            } else // 取消表体勾选
            {
                props.cardTable.setTableData(areaId, {
                    rows: []
                });
            }
        });
    }
    // 更新按钮状态
    buttonControl.call(this, props);
    props.updatePage(constance.AREA.cardFormId, constance.CARDTABLEAREAIDS);
}
/**
 * 默认主组织
 * @param {*} props 
 * @param {*} context 
 */ function mainOrgInit(props, context) {
    let pk_org = context.pk_org;
    if (pk_org) {
        props.form.setFormItemsDisabled(constance.AREA.cardFormId, {
            pk_org: false
        });
        headAfterEvent.call(this, props, constance.AREA.cardFormId, constance.FIELDS.pk_org, {
            value: pk_org
        });
    } else {}
    setCardPageForEmptypk_org.call(this, props);
}
/**
 * 根据模板获取对应的区域ID和按钮ID
 * @param {*} moduleId 模板ID
 * @param {*} status 页面状态
 * @param {*} copyData 复制行数据
 */ function getAreaAndBtnId(moduleId, status, copyData) {
    let bodyAreaId, InnerAreaId, InnerBtnIds;
    switch(moduleId){
        case constance.AREA.cardBody_1:
            bodyAreaId = constance.AREA.cardBody_1_shoulder;
            InnerAreaId = constance.AREA.cardBody_1_inner;
            InnerBtnIds = status == constance.UISTATUS.browse ? null : copyData ? [
                constance.BUTTONID.cardBody_1_PasteLine
            ] : [
                constance.BUTTONID.cardBody_1_DeleteLine,
                constance.BUTTONID.cardBody_1_InsertLine
            ];
            break;
    }
    return {
        bodyAreaId: bodyAreaId,
        InnerAreaId: InnerAreaId,
        InnerBtnIds: InnerBtnIds
    };
}


;// CONCATENATED MODULE: ./src/hpf/hpfc/m0z10302/card/viewControl/buttonControl.js


function buttonControl(props) {
    let status = props.getUrlParam('status');
    // 页面状态
    // 1、设置页面状态
    setUIState(props, status);
    // 2、按钮状态控制
    setButtonState(props, status);
    // 3、主按钮设置
    // setMainButton(props, status);
    // 4、返回按钮控件状态控制
    setHeadInfoState(props, status);
    // 5、卡片分页器状态控制
    setCardPaginationState(props, status);
}
function setUIState(props, status) {
    props.form.setFormStatus(constance.AREA.cardFormId, status == constance.UISTATUS.copy ? constance.UISTATUS.add : status);
    let uistatus = status == constance.UISTATUS.browse ? status : constance.UISTATUS.edit;
    constance.CARDTABLEAREAIDS.forEach((areaId)=>{
        props.cardTable.setStatus(areaId, uistatus);
    });
    let isDisabled = status != constance.UISTATUS.add;
    props.form.setFormItemsDisabled(constance.AREA.cardFormId, {
        [constance.FIELDS.pk_org]: isDisabled
    });
    // 设置主组织编辑性
    let pk_org = props.form.getFormItemsValue(constance.AREA.cardFormId, 'pk_org').value;
    let idissys = props.form.getFormItemsValue(constance.AREA.cardFormId, 'idissys').value;
    let pk_mid_ref = props.form.getFormItemsValue(constance.AREA.cardFormId, 'pk_mid_ref').display;
    let pk_hrp_ref = props.form.getFormItemsValue(constance.AREA.cardFormId, 'pk_hrp_ref').value;
    if (pk_mid_ref == '来源科室档案' && (idissys == '1' || idissys == '8')) {
        props.form.setFormItemsVisible(constance.AREA.cardFormId, {
            'srcbilltype': true,
            'srcbillitempk': true
        });
    } else //'srcbillitemtxt': true
    {
        props.form.setFormItemsVisible(constance.AREA.cardFormId, {
            'srcbilltype': false,
            'srcbillitempk': false,
            'srcbillitemtxt': false
        });
    }
    if (idissys && pk_mid_ref && pk_hrp_ref) {
        props.button.setButtonDisabled(constance.BUTTONID.EditImport, false);
    } else {
        props.button.setButtonDisabled(constance.BUTTONID.EditImport, true);
    }
}
function setButtonState(props, status) {
    props.button.setButtonVisible([
        constance.BUTTONID.Add,
        constance.BUTTONID.Edit,
        constance.BUTTONID.Delete,
        constance.BUTTONID.Copy,
        constance.BUTTONID.Refresh
    ], status == constance.UISTATUS.browse);
    props.button.setButtonVisible([
        constance.BUTTONID.Save,
        constance.BUTTONID.Cancel,
        constance.BUTTONID.AutomaticControl,
        constance.BUTTONID.EditExport,
        constance.BUTTONID.EditImport,
        constance.BUTTONID.cardBody_1_AddLine,
        constance.BUTTONID.cardBody_1_DeleteLine,
        constance.BUTTONID.cardBody_1_CopyLine
    ], status != constance.UISTATUS.browse);
    props.button.setButtonVisible([
        constance.BUTTONID.cardBody_1_PasteLineToTail,
        constance.BUTTONID.cardBody_1_CancelB
    ], false);
}
function setHeadInfoState(props, status) {
    props.BillHeadInfo.setBillHeadInfoVisible({
        showBackBtn: status == constance.UISTATUS.browse,
        showBillCode: true,
        billCode: null
    });
}
function setCardPaginationState(props, status) {
    props.cardPagination.setCardPaginationVisible('cardPaginationBtn', status == constance.UISTATUS.browse);
}
/**
 * 设置卡片肩部按钮可用性：删行、复制行
 */ function onRowsSelected(props, moduleId) {
    let buttonArr = constance.DELETELINEBTNS[moduleId];
    let checkedRows = props.cardTable.getCheckedRows(moduleId);
    if (checkedRows && checkedRows.length > 0) {
        props.button.setButtonDisabled(buttonArr, false);
    } else {
        props.button.setButtonDisabled(buttonArr, true);
    }
}
/**
 * 无数据时，设置卡片空界面
 * @param {*} props
 */ function setEmptyValueDisplay(props) {
    clearCardData(props);
    // 清空卡片数据
    setUIState(props, constance.UISTATUS.browse);
    // 设置卡片编辑性
    props.BillHeadInfo.setBillHeadInfoVisible({
        showBackBtn: true,
        showBillCode: false
    });
    // 设置按钮可见性
    props.button.setButtonVisible([
        constance.BUTTONID.Add
    ], true);
    props.button.setButtonVisible([
        constance.BUTTONID.Edit,
        constance.BUTTONID.Delete,
        constance.BUTTONID.Copy,
        constance.BUTTONID.Refresh,
        constance.BUTTONID.Save,
        constance.BUTTONID.Cancel,
        constance.BUTTONID.AutomaticControl,
        constance.BUTTONID.EditExport,
        constance.BUTTONID.EditImport,
        constance.BUTTONID.cardBody_1_AddLine,
        constance.BUTTONID.cardBody_1_DeleteLine,
        constance.BUTTONID.cardBody_1_CopyLine,
        constance.BUTTONID.cardBody_1_PasteLineToTail,
        constance.BUTTONID.cardBody_1_CancelB
    ], false);
    setCardPaginationState(props, false);
}


;// CONCATENATED MODULE: ./src/hpf/hpfc/m0z10302/card/btnClicks/pageInfoClick.js







/* harmony default export */ function pageInfoClick(props, pk, isRefresh = false, param) {
    // 考虑删除页时，下一页为null的情况
    if (!pk) {
        setEmptyValueDisplay(props);
        return;
    }
    // 刷新需要重新查询数据
    if (!isRefresh) {
        let cacheData = (0,cacheDataManager/* getCacheDataByPk */.ic)(props, constance.DATASOURCECACHE.dataSourceListCacheKey, pk);
        // 获取缓存数据
        if (cacheData) {
            setCardPage.call(this, props, cacheData, false);
            return;
        }
    }
    let reqData = {
        pks: [
            pk
        ],
        pagecode: constance.PAGECODE.cardPagecode
    };
    if (param) {
        reqData.idissys = param.idissys;
        reqData.pk_mid_ref = param.pk_mid_ref;
        reqData.pk_hrp_ref = param.pk_hrp_ref;
    }
    (0,external_nc_lightapp_front_.ajax)({
        url: constance.URL.queryCard,
        data: reqData,
        success: (res)=>{
            if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
                props.dealFormulamsg(res.formulamsg);
            }
            //参数一：返回的公式对象
            if (res.success && res.data) {
                props.setUrlParam({
                    id: pk
                });
                setCardPage.call(this, props, res.data, false);
                // 更新缓存数据
                (0,cacheDataManager/* updateCacheData */.hE)(props, constance.FIELDS.pk_head_fields, pk, res.data, constance.AREA.cardFormId, constance.DATASOURCECACHE.dataSourceListCacheKey);
                isRefresh ? (0,messageUtil/* showRefreshInfo */.BY)() : '';
            } else {
                setEmptyValueDisplay(props);
            }
        }
    });
}

;// CONCATENATED MODULE: ./src/hpf/hpfc/m0z10302/card/btnClicks/addBtnClick.js



/* harmony default export */ function addBtnClick(props) {
    props.setUrlParam({
        status: constance.UISTATUS.add
    });
    clearCardData.call(this, props);
    buttonControl.call(this, props);
    mainOrgInit.call(this, props, this.contexts);
}

;// CONCATENATED MODULE: ./src/hpf/hpfc/m0z10302/card/btnClicks/copyBtnClick.js



/* harmony default export */ function copyBtnClick(props, pk) {
    pk = pk ? pk : props.form.getFormItemsValue(constance.AREA.cardFormId, constance.FIELDS.pk_head_fields).value;
    (0,external_nc_lightapp_front_.ajax)({
        url: constance.URL.copy,
        data: pk,
        success: (res)=>{
            if (res.success && res.data) {
                props.setUrlParam({
                    status: constance.UISTATUS.copy,
                    id: pk
                });
                setCardPage.call(this, props, res.data, false);
            }
        }
    });
}

;// CONCATENATED MODULE: ./src/hpf/hpfc/m0z10302/card/btnClicks/backBtnClick.js

/* harmony default export */ function backBtnClick(props) {
    props.pushTo(constance.URL.list);
}

;// CONCATENATED MODULE: ./src/hpf/hpfc/m0z10302/card/btnClicks/editBtnClick.js


/* harmony default export */ function editBtnClick(props) {
    props.setUrlParam({
        status: constance.UISTATUS.edit
    });
    constance.CARDTABLEAREAIDS.forEach((areaId)=>{
        props.cardTable.selectAllRows(areaId, false);
    });
    // 取消浏览态表体勾选
    buttonControl.call(this, props);
}

;// CONCATENATED MODULE: ./src/hpf/hpfc/m0z10302/card/btnClicks/refreshBtnClick.js


/* harmony default export */ function refreshBtnClick(props) {
    pageInfoClick.call(this, props, props.form.getFormItemsValue(constance.AREA.cardFormId, constance.FIELDS.pk_head_fields).value, true);
}

;// CONCATENATED MODULE: ./src/hpf/hpfc/m0z10302/card/btnClicks/deleteBtnClick.js





function deleteBtnClick(props) {
    // 按钮删除
    (0,messageUtil/* showSingleDeleteDialog */.rD)({
        beSureBtnClick: ()=>{
            let reqData = {
                infos: [
                    {
                        id: props.form.getFormItemsValue(constance.AREA.cardFormId, constance.FIELDS.pk_head_fields).value,
                        ts: props.form.getFormItemsValue(constance.AREA.cardFormId, constance.FIELDS.ts).value
                    }
                ]
            };
            (0,external_nc_lightapp_front_.ajax)({
                url: constance.URL["delete"],
                data: reqData,
                success: (res)=>{
                    if (res.success && res.data) {
                        (0,messageUtil/* showSuccessInfo */.c2)(res.data.message);
                        let pk = res.data.successIds[0];
                        let nextId = (0,cacheDataManager/* getNextId */.YN)(props, pk, constance.DATASOURCECACHE.dataSourceListCacheKey);
                        // 删除缓存数据
                        (0,cacheDataManager/* deleteCacheData */.g1)(props, constance.FIELDS.pk_head_fields, pk, constance.DATASOURCECACHE.dataSourceListCacheKey);
                        props.setUrlParam({
                            status: constance.UISTATUS.browse,
                            id: nextId
                        });
                        pageInfoClick.call(this, props, nextId);
                    }
                }
            });
        }
    });
}

;// CONCATENATED MODULE: ./src/hpf/hpfc/m0z10302/card/btnClicks/cancelBtnClick.js




/* harmony default export */ function cancelBtnClick(props) {
    (0,messageUtil/* showCancelDialog */.Us)({
        beSureBtnClick: ()=>{
            let status = props.getUrlParam('status');
            let id = props.getUrlParam('id');
            props.setUrlParam({
                status: constance.UISTATUS.browse
            });
            if (status == constance.UISTATUS.add) {
                let pk = id ? id : (0,cacheDataManager/* getCurrentLastId */.$$)(constance.DATASOURCECACHE.dataSourceListCacheKey);
                pageInfoClick.call(this, props, pk);
                props.resMetaAfterPkorgEdit();
            } else {
                let pk = props.form.getFormItemsValue(constance.AREA.cardFormId, constance.FIELDS.pk_head_fields).value;
                pageInfoClick.call(this, props, pk ? pk : id);
            }
        }
    });
}

// EXTERNAL MODULE: ./src/hpf/hpfc/m0z10302/tool/multiLangUtil.js
var multiLangUtil = __webpack_require__(3899);
;// CONCATENATED MODULE: ./src/hpf/hpfc/m0z10302/card/btnClicks/saveBtnClick.js






/* harmony default export */ function saveBtnClick(props) {
    // 过滤表中空行
    filterEmptyRows();
    // 表头必输项校验
    let flag = props.form.isCheckNow(constance.AREA.cardFormId);
    if (!flag) return;
    // 表体必输项校验
    let bodyFlag = props.cardTable.checkTableRequired(constance.CARDTABLEAREAIDS);
    if (!bodyFlag) return;
    let data = props.createExtCardData(constance.PAGECODE.cardPagecode, constance.AREA.cardFormId, constance.CARDTABLEAREAIDS);
    //解决查询出数据后点新增然后取消，然后再点新增保存后报‘未知错误’
    let dr = data.head.card_head.rows[0].values.dr;
    if (dr) {
        delete data.head.card_head.rows[0].values.dr;
    }
    let checkdata = null;
    (0,external_nc_lightapp_front_.ajax)({
        url: constance.URL.beforeSaveCheck,
        data: data,
        async: false,
        success: (res)=>{
            if (res.success && res.data) {
                checkdata = res.data;
            }
        }
    });
    if (checkdata) {
        if (checkdata.flag == 'toast') {
            (0,external_nc_lightapp_front_.toast)({
                color: 'warning',
                content: checkdata.errMsg
            });
        }
        /* 当前来源档案类型已经存在档案对照数据 ，不能重复保存！ */ if (checkdata.flag == 'promptBox') {
            let modalConfig = {
                title: '询问',
                color: 'warning',
                content: checkdata.errMsg,
                /** 系统检测到" + list.toString() + "档案未对照目标档案，是否保存? */ closeByClickBackDrop: false,
                //点击遮罩不关闭提示框
                //点击确定按钮事件
                beSureBtnClick: ()=>{
                    props.validateToSave(data, ()=>{
                        (0,external_nc_lightapp_front_.ajax)({
                            url: constance.URL.save,
                            data: data,
                            success: (res)=>{
                                if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
                                    props.dealFormulamsg(res.formulamsg);
                                }
                                //参数一：返回的公式对象
                                if (res.success && res.data) {
                                    let pk = res.data.head[constance.AREA.cardFormId].rows[0].values[constance.FIELDS.pk_head_fields].value;
                                    let status = props.getUrlParam('status');
                                    // 差异更新，补全数据
                                    constance.CARDTABLEAREAIDS.map((moduleId)=>{
                                        if (res.data.bodys && res.data.bodys[moduleId]) {
                                            let fullTableData = props.cardTable.updateDataByRowId(moduleId, res.data.bodys[moduleId], true);
                                            res.data.bodys[moduleId] = fullTableData;
                                        }
                                    });
                                    if (status == constance.UISTATUS.add || status == constance.UISTATUS.copy) {
                                        (0,cacheDataManager/* addCacheData */.Xw)(props, constance.FIELDS.pk_head_fields, pk, res.data, constance.AREA.cardFormId, constance.DATASOURCECACHE.dataSourceListCacheKey);
                                        // 更新翻页组件当前pk值
                                        props.cardPagination.setCardPaginationId({
                                            id: pk,
                                            status: 1
                                        });
                                    } else {
                                        (0,cacheDataManager/* updateCacheData */.hE)(props, constance.FIELDS.pk_head_fields, pk, res.data, constance.AREA.cardFormId, constance.DATASOURCECACHE.dataSourceListCacheKey);
                                    }
                                    props.setUrlParam({
                                        status: constance.UISTATUS.browse
                                    });
                                    setCardPage.call(this, props, res.data);
                                    (0,messageUtil/* showSuccessInfo */.c2)((0,multiLangUtil/* getLangByResId */.k)(this, '4001PUBMESSAGE-0000002'));
                                }
                            }
                        });
                    });
                },
                /* 国际化处理： 保存成功*/ cancelBtnClick: ()=>{},
                closeBtnClick: ()=>{}
            };
            (0,external_nc_lightapp_front_.promptBox)(modalConfig);
        }
        if (checkdata.flag == 'pass') {
            props.validateToSave(data, ()=>{
                (0,external_nc_lightapp_front_.ajax)({
                    url: constance.URL.save,
                    data: data,
                    success: (res)=>{
                        if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
                            props.dealFormulamsg(res.formulamsg);
                        }
                        //参数一：返回的公式对象
                        if (res.success && res.data) {
                            let pk = res.data.head[constance.AREA.cardFormId].rows[0].values[constance.FIELDS.pk_head_fields].value;
                            let status = props.getUrlParam('status');
                            // 差异更新，补全数据
                            constance.CARDTABLEAREAIDS.map((moduleId)=>{
                                if (res.data.bodys && res.data.bodys[moduleId]) {
                                    let fullTableData = props.cardTable.updateDataByRowId(moduleId, res.data.bodys[moduleId], true);
                                    res.data.bodys[moduleId] = fullTableData;
                                }
                            });
                            if (status == constance.UISTATUS.add || status == constance.UISTATUS.copy) {
                                (0,cacheDataManager/* addCacheData */.Xw)(props, constance.FIELDS.pk_head_fields, pk, res.data, constance.AREA.cardFormId, constance.DATASOURCECACHE.dataSourceListCacheKey);
                                // 更新翻页组件当前pk值
                                props.cardPagination.setCardPaginationId({
                                    id: pk,
                                    status: 1
                                });
                            } else {
                                (0,cacheDataManager/* updateCacheData */.hE)(props, constance.FIELDS.pk_head_fields, pk, res.data, constance.AREA.cardFormId, constance.DATASOURCECACHE.dataSourceListCacheKey);
                            }
                            props.setUrlParam({
                                status: constance.UISTATUS.browse
                            });
                            setCardPage.call(this, props, res.data);
                            (0,messageUtil/* showSuccessInfo */.c2)((0,multiLangUtil/* getLangByResId */.k)(this, '4001PUBMESSAGE-0000002'));
                        }
                    }
                });
            });
        }
    }
}
/* 国际化处理： 保存成功*/ function filterEmptyRows() {} // props.cardTable.filterEmptyRows(AREA.cardBody_1, [], 'except');

;// CONCATENATED MODULE: ./src/hpf/hpfc/m0z10302/card/btnClicks/addLineBtnClick.js

const { setRowNo: addLineBtnClick_setRowNo  } = RownoUtils;
/* harmony default export */ function addLineBtnClick(props, moduleId) {
    let rowCount = props.cardTable.getNumberOfRows(moduleId);
    props.cardTable.addRow(moduleId, rowCount, {}, true);
    let meta = this.props.meta.getMeta();
    meta['cardBody_1'].items.forEach((item)=>{
        //add by mzq业务类型下拉框
        if (item.attrname === "业务类型") {
            item.itemtype = "select";
            let selectoptions = [
                {
                    display: '门诊',
                    value: '1'
                },
                {
                    display: '住院',
                    value: '2'
                }
            ];
            item.options = selectoptions;
        }
    });
    this.props.meta.setMeta(meta);
    addLineBtnClick_setRowNo(props, moduleId, 'rowno');
}

;// CONCATENATED MODULE: ./src/hpf/hpfc/m0z10302/card/btnClicks/deleteLineBtnClick.js

/* harmony default export */ function deleteLineBtnClick(props, moduleId, record, index) {
    if (record && index >= 0) {
        // 列操作
        props.cardTable.delRowsByIndex(moduleId, index);
        // 按钮可用性
        if (props.cardTable.getNumberOfRows(moduleId) > 0) {
            let checkArr = props.cardTable.getCheckedRows(moduleId);
            if (!checkArr || checkArr.length < 1) {
                props.button.setDisabled(getHeadButtonIds(moduleId), true);
            } else {
                props.button.setDisabled(getHeadButtonIds(moduleId), false);
            }
        }
    } else {
        // 肩操作
        let checkArr = props.cardTable.getCheckedRows(moduleId);
        let rowIndexes = [];
        if (checkArr && checkArr.length > 0) {
            checkArr.forEach((row)=>{
                rowIndexes.push(row.index);
            });
            props.cardTable.delRowsByIndex(moduleId, rowIndexes);
            // 按钮可用性
            props.button.setDisabled(getHeadButtonIds(moduleId), true);
        }
    }
}
function getHeadButtonIds(moduleId) {
    let buttonIds;
    switch(moduleId){
        case constance.AREA.cardBody_1:
            buttonIds = [
                constance.BUTTONID.cardBody_1_DeleteLine,
                constance.BUTTONID.cardBody_1_CopyLine
            ];
            break;
    }
    return buttonIds;
}

;// CONCATENATED MODULE: ./src/hpf/hpfc/m0z10302/tool/cardTableTools/rowCopyPasteUtils.js

// 表体肩部按钮初始化状态
const BTNINITSTATUS = true;
// 表体肩部按钮复制中状态
const BTNPASTESTATUS = false;
/**
 * 复制-单行（通常用于操作列复制）
 * @param {*} props 
 * @param {*} moduleId 
 * @param {*} record --操作列操作中的行数据
 * @param {*} initBtns --初始化显示的按钮
 * @param {*} pasteBtns --复制中显示的按钮
 */ function copyRow(props, moduleId, record, initBtns, pasteBtns) {
    // 缓存复制的数据
    this.setState({
        copyRowDatas: record
    });
    // 设置按钮可见性
    setBtnVisible(props, initBtns, pasteBtns, BTNPASTESTATUS);
    // 多选框不可用
    props.cardTable.setAllCheckboxAble(moduleId, false);
    return record;
}
/**
 * 复制-多行（通常用于肩部复制）
 * @param {*} props 
 * @param {*} moduleId 
 * @param {*} initBtns 
 * @param {*} pasteBtns 
 */ function copyRows(props, moduleId, initBtns, pasteBtns) {
    // 缓存选中行数据
    let checkArr = props.cardTable.getCheckedRows(moduleId);
    if (checkArr && checkArr.length > 0) {
        this.setState({
            copyRowDatas: checkArr
        });
        setBtnVisible(props, initBtns, pasteBtns, BTNPASTESTATUS);
        props.cardTable.setAllCheckboxAble(moduleId, false);
        return checkArr;
    }
}
/**
 * 粘贴数据到index下方（通常用于操作列粘贴）
 * @param {*} props 
 * @param {*} moduleId 
 * @param {*} index 
 * @param {*} initBtns --复制前显示按钮
 * @param {*} pasteBtns --复制后显示按钮
 * @param {*} fieldsForClear --需要清空的字段
 */ function pasteRowsToIndex(props, moduleId, index, initBtns, pasteBtns, fieldsForClear) {
    // 粘贴至此
    pasteLines(props, moduleId, this.state.copyRowDatas, index - 1, fieldsForClear);
    // 清空缓存，切换按钮
    this.setState({
        copyRowDatas: null
    });
    setBtnVisible(props, initBtns, pasteBtns, BTNINITSTATUS);
    props.cardTable.selectAllRows(moduleId, false);
    props.cardTable.setAllCheckboxAble(moduleId, true);
}
/**
 * 粘贴至末行
 * @param {*} props 
 * @param {*} moduleId 
 * @param {*} initBtns 
 * @param {*} pasteBtns 
 * @param {*} fieldsForClear 
 */ function pasteRowsToTail(props, moduleId, initBtns, pasteBtns, fieldsForClear) {
    // 批量粘贴至末行
    let rowCount = props.cardTable.getNumberOfRows(moduleId);
    pasteRowsToIndex.call(this, props, moduleId, rowCount, initBtns, pasteBtns, fieldsForClear);
}
/**
 * 取消复制
 * @param {*} props 
 * @param {*} moduleId 
 * @param {*} initBtns 
 * @param {*} pasteBtns 
 */ function cancel(props, moduleId, initBtns, pasteBtns) {
    // 清空复制行缓存数据
    this.setState({
        copyRowDatas: null
    });
    setBtnVisible(props, initBtns, pasteBtns, BTNINITSTATUS);
    props.cardTable.selectAllRows(moduleId, false);
    props.cardTable.setAllCheckboxAble(moduleId, true);
}
/**
 * 批量复制方法
 * @param {*} props 
 * @param {*} moduleId 
 * @param {*} copyRowDatas 
 * @param {*} index 
 * @param {*} fieldsForClear 
 */ function pasteLines(props, moduleId, copyRowDatas, index, fieldsForClear) {
    let data = (0,external_nc_lightapp_front_.deepClone)(copyRowDatas);
    if (data) {
        if (data instanceof Array) {
            // 多行
            // 选中行行数
            let checkCount = data.length;
            let insertData = [];
            // 循环粘贴至末行
            for(let i = 0; i < checkCount; i++){
                let rowData = data[i].data;
                clearFields(rowData, fieldsForClear);
                insertData.push(rowData);
            }
            props.cardTable.insertRowsAfterIndex(moduleId, insertData, index);
        } else {
            // 单行
            clearFields(data, fieldsForClear);
            props.cardTable.insertRowsAfterIndex(moduleId, data, index);
        }
    }
}
/**
 * 清空要清空的字段
 * @param {*} rowData 
 * @param {*} fieldsForClear 
 */ function clearFields(copyRowDatas, fieldsForClear) {
    if (fieldsForClear && fieldsForClear instanceof Array) {
        if (copyRowDatas instanceof Array) {
            copyRowDatas.forEach((rowData)=>{
                fieldsForClear.forEach((field)=>{
                    rowData.values[field] = {
                        value: null,
                        display: null,
                        scale: -1
                    };
                });
            });
        } else {
            fieldsForClear.forEach((field)=>{
                copyRowDatas.values[field] = {
                    value: null,
                    display: null,
                    scale: -1
                };
            });
        }
    }
}
/**
 * 设置按钮可见性
 * @param {*} props 
 * @param {*} initBtns 
 * @param {*} pasteBtns 
 * @param {*} status 
 */ function setBtnVisible(props, initBtns, pasteBtns, status) {
    if (initBtns) {
        props.button.setButtonVisible(initBtns, status);
    }
    if (pasteBtns) {
        props.button.setButtonVisible(pasteBtns, !status);
    }
}
const rowCopyPasteUtils = {
    copyRow,
    copyRows,
    pasteRowsToIndex,
    pasteRowsToTail,
    cancel
};


;// CONCATENATED MODULE: ./src/hpf/hpfc/m0z10302/card/btnClicks/copyLineBtnClick.js


/* harmony default export */ function copyLineBtnClick(props, moduleId) {
    this.copyLineDatas[moduleId] = rowCopyPasteUtils.copyRows.call(this, props, moduleId, constance.COPYPASTEBTNS[moduleId].initBtns, constance.COPYPASTEBTNS[moduleId].pasteBtns);
}

;// CONCATENATED MODULE: ./src/hpf/hpfc/m0z10302/card/btnClicks/pasteLineBtnClick.js


/* harmony default export */ function pasteLineBtnClick(props, moduleId, record, index) {
    // 效率优化开启
    props.beforeUpdatePage();
    this.state.copyRowDatas = this.copyLineDatas[moduleId];
    // 需要粘贴的数据
    if (index >= 0 && record) {
        // 操作列 粘贴至此
        rowCopyPasteUtils.pasteRowsToIndex.call(this, props, moduleId, index, constance.COPYPASTEBTNS[moduleId].initBtns, constance.COPYPASTEBTNS[moduleId].pasteBtns, constance.PASTECLEARFIELDS[moduleId]);
    } else {
        // 粘贴至末行
        rowCopyPasteUtils.pasteRowsToTail.call(this, props, moduleId, constance.COPYPASTEBTNS[moduleId].initBtns, constance.COPYPASTEBTNS[moduleId].pasteBtns, constance.PASTECLEARFIELDS[moduleId]);
    }
    this.copyLineDatas[moduleId] = null;
    // 清空复制数据
    // 效率优化关闭
    props.updatePage(constance.AREA.cardFormId, moduleId);
}

;// CONCATENATED MODULE: ./src/hpf/hpfc/m0z10302/card/btnClicks/cancelBBtnClick.js


/* harmony default export */ function cancelBBtnClick(props, moduleId) {
    rowCopyPasteUtils.cancel.call(this, props, moduleId, constance.COPYPASTEBTNS[moduleId].initBtns, constance.COPYPASTEBTNS[moduleId].pasteBtns);
    this.copyLineDatas[moduleId] = null;
} // 清空复制数据

;// CONCATENATED MODULE: ./src/hpf/hpfc/m0z10302/card/btnClicks/insertLineBtnClick.js


/* harmony default export */ function insertLineBtnClick(props, moduleId, record, index) {
    props.cardTable.addRow(moduleId, index, {});
    RownoUtils.setRowNo(props, moduleId, constance.FIELDS.crowno);
}

;// CONCATENATED MODULE: ./src/hpf/hpfc/m0z10302/card/btnClicks/automaticControlClick.js


/* harmony default export */ function automaticControlClick(props) {
    // 表头必输项校验
    let flag = props.form.isCheckNow(constance.AREA.cardFormId);
    if (!flag) return;
    let data = props.createExtCardData(constance.PAGECODE.cardPagecode, constance.AREA.cardFormId, constance.CARDTABLEAREAIDS);
    data.head.card_head.rows[0].values.pk_group = {
        display: (0,external_nc_lightapp_front_.getBusinessInfo)().groupName,
        value: (0,external_nc_lightapp_front_.getBusinessInfo)().groupId
    };
    if (data.head.card_head.rows[0].values.dr) {
        //卡片页面点新增会报dr=null的问题,修复
        delete data.head.card_head.rows[0].values.dr;
    }
    (0,external_nc_lightapp_front_.ajax)({
        url: constance.URL.automaticControl,
        data: data,
        async: false,
        success: (res)=>{
            if (res.success && res.data) {
                let children = res.data.children[0];
                for(let i = 0; i < children.length; i++){
                    props.cardTable.setValByKeyAndIndex(constance.AREA.cardBody_1, i, constance.IVo2VoItf.KEY_HCODE, {
                        value: children[i].hcode,
                        display: children[i].hcode
                    });
                    props.cardTable.setValByKeyAndIndex(constance.AREA.cardBody_1, i, "hname1", {
                        value: children[i].hcode,
                        display: children[i].hcode
                    });
                    props.cardTable.setValByKeyAndIndex(constance.AREA.cardBody_1, i, constance.IVo2VoItf.KEY_HNAME, {
                        value: children[i].hname,
                        display: children[i].hname
                    });
                    props.cardTable.setValByKeyAndIndex(constance.AREA.cardBody_1, i, constance.IVo2VoItf.KEY_HPK, {
                        value: children[i].hpk,
                        display: children[i].hpk
                    });
                }
            }
        }
    });
}

;// CONCATENATED MODULE: ./src/hpf/hpfc/m0z10302/card/btnClicks/editExportClick.js


/* harmony default export */ function editExportClick(props) {
    // 表头必输项校验
    let flag = props.form.isCheckNow(constance.AREA.cardFormId);
    if (!flag) return;
    let headcols = props.meta.getMeta()[constance.AREA.cardFormId].items.map((item)=>[
            item.attrcode,
            item.label
        ]);
    let showhideflag = props.form.getFormItemsVisible(constance.AREA.cardFormId, headcols.map((item)=>item[0]));
    let headdata = new Map();
    //获取表头显示的字段以及值
    headcols.forEach((item, index)=>{
        if (showhideflag[index]) {
            headdata.set(item, props.form.getFormItemsValue(constance.AREA.cardFormId, item[0]));
        }
    });
    // if (item[0] == 'srcbillitempk') {
    //     headdata.set(['srcbillitemtxt', '单据项目编码'], props.form.getFormItemsValue(AREA.cardFormId, 'srcbillitemtxt'));
    // }
    //获取表体显示的字段信息
    let bodydata = props.meta.getMeta()[constance.AREA.cardBody_1].items.filter((item)=>item.visible && item.attrcode !== 'rowno' && item.attrcode !== 'opr').map((item)=>[
            item.attrcode,
            item.label
        ]);
    (0,external_nc_lightapp_front_.formDownload)({
        params: {
            headdata,
            bodydata
        },
        url: constance.URL.editExport,
        enctype: 2
    });
}

;// CONCATENATED MODULE: ./src/hpf/hpfc/m0z10302/card/btnClicks/index.js

















// 表头按钮区操作
function buttonClick(props, id) {
    switch(id){
        case constance.BUTTONID.Add:
            addBtnClick.call(this, props);
            break;
        case constance.BUTTONID.Edit:
            editBtnClick.call(this, props);
            break;
        case constance.BUTTONID.Delete:
            deleteBtnClick.call(this, props);
            break;
        case constance.BUTTONID.Copy:
            copyBtnClick.call(this, props);
            break;
        case constance.BUTTONID.Refresh:
            refreshBtnClick.call(this, props);
            break;
        case constance.BUTTONID.Save:
            saveBtnClick.call(this, props);
            break;
        case constance.BUTTONID.Cancel:
            cancelBtnClick.call(this, props);
            break;
        case constance.BUTTONID.Back:
            backBtnClick.call(this, props);
            break;
        case constance.BUTTONID.AutomaticControl:
            automaticControlClick.call(this, props);
            break;
        case constance.BUTTONID.EditExport:
            editExportClick.call(this, props);
            break;
        case constance.BUTTONID.EditImport:
            let flag = props.form.isCheckNow(constance.AREA.cardFormId);
            if (!flag) return;
            let headcols = props.meta.getMeta()[constance.AREA.cardFormId].items.map((item)=>[
                    item.attrcode,
                    item.label
                ]);
            let showhideflag = props.form.getFormItemsVisible(constance.AREA.cardFormId, headcols.map((item)=>item[0]));
            let headinfo = new Map();
            //获取表头显示的字段以及值
            headcols.forEach((item, index)=>{
                if (showhideflag[index]) {
                    headinfo.set(item, props.form.getFormItemsValue(constance.AREA.cardFormId, item[0]));
                }
            });
            //获取表体显示的字段信息
            let bodyinfo = props.meta.getMeta()[constance.AREA.cardBody_1].items.filter((item)=>item.visible && item.attrcode !== 'rowno' && item.attrcode !== 'opr').map((item)=>[
                    item.attrcode,
                    item.label
                ]);
            let bodys = props.cardTable.getVisibleRows("cardBody_1");
            let bodydatas = [];
            bodys.forEach((item)=>{
                let bodydata = {};
                bodydata.rowno = item.values.rowno.value;
                bodydata.hpk = item.values.hpk.value;
                bodydata.hcode = item.values.hcode.value;
                bodydata.hname = item.values.hname.value;
                bodydata.msyscode = item.values.msyscode.value;
                bodydata.mpk = item.values.mpk.value;
                bodydata.mcode = item.values.mcode.value;
                bodydata.mname = item.values.mname.value;
                bodydatas.push(bodydata);
            });
            this.config.data = {
                headinfo: JSON.stringify(headinfo),
                bodyinfo: JSON.stringify(bodyinfo),
                bodydata: JSON.stringify(bodydatas)
            };
            this.props.button.setUploadConfig(constance.BUTTONID.EditImport, this.config);
            break;
    }
}
// 表体按钮操作
function lineBtnClick(moduleId, props, id, text, record, index) {
    switch(id){
        case constance.BUTTONID.cardBody_1_AddLine:
            addLineBtnClick.call(this, props, moduleId);
            break;
        case constance.BUTTONID.cardBody_1_DeleteLine:
            deleteLineBtnClick.call(this, props, moduleId, record, index);
            break;
        case constance.BUTTONID.cardBody_1_CopyLine:
            copyLineBtnClick.call(this, props, moduleId);
            break;
        case constance.BUTTONID.cardBody_1_PasteLineToTail:
        case constance.BUTTONID.cardBody_1_PasteLine:
            pasteLineBtnClick.call(this, props, moduleId, record, index);
            break;
        case constance.BUTTONID.cardBody_1_CancelB:
            cancelBBtnClick.call(this, props, moduleId);
            break;
        case constance.BUTTONID.cardBody_1_InsertLine:
            insertLineBtnClick.call(this, props, moduleId, record, index);
            break;
    }
}


;// CONCATENATED MODULE: ./src/hpf/hpfc/m0z10302/card/init/initTemplate.js








/* harmony default export */ function initTemplate(props) {
    props.createUIDom({
        pagecode: constance.PAGECODE.cardPagecode
    }, (data)=>{
        if (data) {
            if (data.context) {
                this.contexts = data.context;
            }
            if (data.button) {
                let button = data.button;
                props.button.hideButtonsByAreas([
                    constance.AREA.cardHead
                ]);
                // 隐藏所有按钮
                props.button.setOprationBtnsRenderStatus([
                    constance.AREA.cardBody_1_inner
                ], false);
                // props.cardTable.selectAllRows(AREA.cardTableId, false); // 取消浏览态表体勾选
                props.button.setButtons(button);
                this.props.button.setUploadConfig(constance.BUTTONID.EditImport, this.config);
            }
            if (data.template) {
                let meta = data.template;
                modifierMeta.call(this, props, meta);
                props.meta.setMeta(meta, ()=>{
                    // 设置默认数据
                    setDefaultData.call(this, props);
                });
            }
        }
    });
}
function modifierMeta(props, meta) {
    let status = props.getUrlParam('status');
    meta[constance.AREA.cardFormId].status = status;
    let id = props.getUrlParam('id');
    let idissys = props.getUrlParam('idissys');
    let pk_mid_ref = props.getUrlParam('pk_mid_ref');
    let pk_hrp_ref = props.getUrlParam('pk_hrp_ref');
    let showcols = [];
    let hidecols = [];
    let namemap = {};
    let vdefshowlist = [];
    if (pk_mid_ref && pk_hrp_ref) {
        (0,external_nc_lightapp_front_.ajax)({
            url: constance.URL.initColsShow,
            data: {
                id,
                idissys,
                pk_mid_ref,
                pk_hrp_ref
            },
            async: false,
            success: (res)=>{
                //填充数据
                if (res.success) {
                    showcols = res.data.showList;
                    hidecols = res.data.hideList;
                    namemap = Object.assign(res.data.nameMap);
                    vdefshowlist = res.data.vdefShowList;
                }
            }
        });
    }
    let map = new Map();
    let fieldcodes = [];
    if (vdefshowlist && vdefshowlist.length > 0) {
        fieldcodes = vdefshowlist.map((item)=>{
            map.set(item.fieldcode, item.attrcode);
            return item.fieldcode;
        });
    }
    [
        constance.AREA.cardBody_1
    ].forEach((moduleId)=>{
        meta[moduleId].status = status;
        //设置动态列展示 suqc
        meta[moduleId].items.map((item, key)=>{
            if (showcols.length > 0 && showcols.indexOf(item.attrcode) != -1) {
                item.visible = true;
            }
            if (fieldcodes.indexOf(item.attrcode) > -1) {
                item.visible = true;
                item.attrname = namemap[map.get(item.attrcode)];
                item.label = namemap[map.get(item.attrcode)];
            }
            if (hidecols.length > 0 && hidecols.indexOf(item.attrcode) != -1) {
                item.visible = false;
            }
            return item;
        });
        // 操作列
        meta[moduleId].items.push({
            label: (0,multiLangUtil/* getLangByResId */.k)(this, '4001PUBMESSAGE-0000006'),
            /* 国际化处理： 操作*/ itemtype: 'customer',
            attrcode: 'opr',
            width: '160px',
            visible: true,
            fixed: 'right',
            render: (text, record, index)=>{
                if (props.getUrlParam('status') != constance.UISTATUS.browse) {
                    let { InnerAreaId , InnerBtnIds  } = getAreaAndBtnId(moduleId, props.getUrlParam('status'), this.copyLineDatas[moduleId]);
                    return props.button.createOprationButton(InnerBtnIds, {
                        area: InnerAreaId,
                        buttonLimit: 3,
                        onButtonClick: (props, key)=>lineBtnClick.call(this, moduleId, props, key, text, record, index)
                    });
                }
            }
        });
    });
    //搜索参照过滤
    meta[constance.AREA.cardFormId].items.map((item)=>{
        if (item.attrcode === 'pk_org') {
            //财务组织过滤
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
function setDefaultData(props) {
    let status = props.getUrlParam('status');
    let pk = props.getUrlParam('id');
    let idissys = props.getUrlParam('idissys');
    let pk_mid_ref = props.getUrlParam('pk_mid_ref');
    let pk_hrp_ref = props.getUrlParam('pk_hrp_ref');
    let param = {
        idissys,
        pk_mid_ref,
        pk_hrp_ref
    };
    if (status == constance.UISTATUS.add) {
        addBtnClick.call(this, props);
    } else if (status == constance.UISTATUS.copy) {
        copyBtnClick.call(this, props, pk);
    } else {
        pageInfoClick.call(this, props, pk, false, param);
    }
    // 设置按钮可用性
    props.button.setButtonDisabled([
        constance.BUTTONID.cardBody_1_DeleteLine,
        constance.BUTTONID.cardBody_1_CopyLine
    ], true);
}

;// CONCATENATED MODULE: ./src/hpf/hpfc/m0z10302/card/init/index.js



// EXTERNAL MODULE: ./src/hpf/hpfc/m0z10302/tool/hotKeysUtil.js
var hotKeysUtil = __webpack_require__(8165);
// EXTERNAL MODULE: ./src/hpf/hpfc/m0z10302/tool/titleUtil.js
var titleUtil = __webpack_require__(2591);
;// CONCATENATED MODULE: ./src/hpf/hpfc/m0z10302/card/beforeEvents/headBeforeEvent.js
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _asyncToGenerator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}

/* harmony default export */ function headBeforeEvent(props, moduleId, key, value, oldvalue, refinfo) {
    return _ref.apply(this, arguments);
}
function _ref() {
    _ref = _asyncToGenerator(function*(props, moduleId, key, value, oldvalue, refinfo) {
        return new Promise((resolve, reject)=>{
            let idissys = props.form.getFormItemsValue(moduleId, 'idissys').value;
            if (key == "pk_mid_ref") {
                let meta = props.meta.getMeta();
                meta[moduleId].items.forEach((item)=>{
                    if (item.attrcode == "pk_mid_ref") {
                        item.queryCondition = {
                            key,
                            idissys,
                            GridRefActionExt: "nccloud.web.hpf.itfdocref.refsqlbuilder.BDRefInfoSqlBuilder"
                        };
                    }
                });
                props.meta.setMeta(meta, ()=>{
                    resolve(true);
                });
            }
            if (key == "pk_hrp_ref") {
                let meta = props.meta.getMeta();
                meta[moduleId].items.forEach((item)=>{
                    if (item.attrcode == "pk_hrp_ref") {
                        item.queryCondition = {
                            key,
                            pk_mid_ref: props.form.getFormItemsValue(moduleId, 'pk_mid_ref').display,
                            idissys,
                            GridRefActionExt: "nccloud.web.hpf.itfdocref.refsqlbuilder.BDRefInfoSqlBuilder"
                        };
                    }
                });
                props.meta.setMeta(meta, ()=>{
                    resolve(true);
                });
            }
            if (key == "srcbilltype") {
                let meta = props.meta.getMeta();
                meta[moduleId].items.forEach((item)=>{
                    if (item.attrcode == "srcbilltype") {
                        item.queryCondition = {
                            idissys,
                            GridRefActionExt: "nccloud.web.hpf.itfdocref.refsqlbuilder.SrcBillTypeSqlBuilder"
                        };
                    }
                });
                props.meta.setMeta(meta, ()=>{
                    resolve(true);
                });
            }
            if (key == "srcbillitempk") {
                let meta = props.meta.getMeta();
                meta[moduleId].items.forEach((item)=>{
                    if (item.attrcode == "srcbillitempk") {
                        item.queryCondition = {
                            idissys,
                            pk_billtypeid: props.form.getFormItemsValue(moduleId, 'srcbilltype').value,
                            GridRefActionExt: "nccloud.web.hpf.itfdocref.refsqlbuilder.SrcBillItemSqlBuilder"
                        };
                    }
                });
                props.meta.setMeta(meta, ()=>{
                    resolve(true);
                });
            }
            resolve(true);
        });
    });
    return _ref.apply(this, arguments);
}

;// CONCATENATED MODULE: ./src/hpf/hpfc/m0z10302/card/beforeEvents/bodyBeforeEvent.js
function bodyBeforeEvent_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function bodyBeforeEvent_asyncToGenerator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                bodyBeforeEvent_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                bodyBeforeEvent_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}



/* harmony default export */ function bodyBeforeEvent(props, moduleId, key, value, index, record) {
    return bodyBeforeEvent_ref.apply(this, arguments);
}
function bodyBeforeEvent_ref() {
    bodyBeforeEvent_ref = bodyBeforeEvent_asyncToGenerator(function*(props, moduleId, key, value, index, record) {
        return new Promise(function(resolve, reject) {
            let [pk_org, idissys, pk_mid_ref, pk_hrp_ref, srcbilltype, srcbillitempk, pk_interdocref] = props.form.getFormItemsValue(constance.AREA.cardFormId, [
                constance.FIELDS.pk_org,
                constance.FIELDS.idissys,
                "pk_mid_ref",
                "pk_hrp_ref",
                "srcbilltype",
                "srcbillitempk",
                "pk_interdocref"
            ]);
            //目标系统
            if (!pk_mid_ref.value || !pk_hrp_ref.value) {
                messageUtil/* showWarningInfo */.hP("请注意", "请先完善表头信息！");
                return reject(false);
            }
            if (key === 'mname1') {
                let data = beforeEditForMID.call(this, props, key);
                let { refvo , ismulti  } = data;
                let meta = props.meta.getMeta();
                meta[moduleId].items.map((item)=>{
                    if (item.attrcode == 'mname1') {
                        item.isMultiSelectedEnabled = ismulti ? true : false;
                        if (refvo.refpath) {
                            item.refcode = refvo.refpath;
                            item.queryCondition = {
                                pk_org: pk_org.value,
                                pk_group: (0,external_nc_lightapp_front_.getBusinessInfo)().groupId,
                                pk_interdocref: pk_interdocref.value,
                                idissys: idissys.value,
                                midpk: pk_mid_ref.value,
                                midname: pk_mid_ref.display,
                                hrppk: pk_hrp_ref.value,
                                hrpname: pk_hrp_ref.display,
                                srcbilltypepk: srcbilltype.value,
                                srcbillitempk: srcbillitempk.value,
                                srcbilltypename: srcbilltype.display,
                                GridRefActionExt: 'nccloud.web.hpf.itfdocref.refsqlbuilder.Mname1RefSqlBuilder'
                            };
                        } else {
                            //TODO 后续处理
                            messageUtil/* showInfoDialog */.hE("提示", "未找到动态参照refpath,请注册!");
                        }
                    }
                });
                props.meta.setMeta(meta, ()=>{
                    resolve(true);
                });
            } else if (key === 'hname1') {
                let data = beforeEditForHRP(props, key, index);
                let { refvo , ismulti , isLeafsel , wherePart , pk_accbook  } = data;
                let meta = props.meta.getMeta();
                meta[moduleId].items.map((item)=>{
                    if (item.attrcode == 'hname1') {
                        if (ismulti) {
                            item.isMultiSelectedEnabled = ismulti ? true : false;
                        }
                        if (isLeafsel) {
                            //TODO 设置参照是否只能选子节点
                            item.onlyLeafCanSelect = isLeafsel ? true : false;
                        }
                        if (refvo.refpath) {
                            item.refcode = refvo.refpath;
                            item.queryCondition = ()=>{
                                let condition = {
                                    pk_org: pk_org.value,
                                    pk_group: (0,external_nc_lightapp_front_.getBusinessInfo)().groupId,
                                    pk_interdocref: pk_interdocref.value,
                                    idissys: idissys.value,
                                    midpk: pk_mid_ref.value,
                                    midname: pk_mid_ref.display,
                                    hrppk: pk_hrp_ref.value,
                                    hrpname: pk_hrp_ref.display,
                                    wherePart: wherePart,
                                    GridRefActionExt: 'nccloud.web.hpf.itfdocref.refsqlbuilder.Hname1RefSqlBuilder'
                                };
                                if (pk_accbook) {
                                    condition.pk_accountingbook = pk_accbook.value;
                                }
                                if (refvo.para1) {
                                    condition.pk_defdoclist = refvo.para1;
                                }
                                return condition;
                            };
                        }
                    }
                });
                props.meta.setMeta(meta, ()=>{
                    resolve(true);
                });
            } else if (key === "pk_measdoc") {
                let meta = props.meta.getMeta();
                let hpk = props.cardTable.getValByKeyAndIndex(constance.AREA.cardBody_1, index, 'hpk');
                let pk_material = hpk.value;
                if (pk_material) {
                    meta[moduleId].items.map((item)=>{
                        if (item.attrcode == 'pk_measdoc') {
                            items.queryCondition = {
                                wherePart: `  and pk_measdoc in (select pk_measdoc from bd_materialconvert 
                                                 where pk_material = '${pk_material}' and dr = 0 "
                                                 union
                                                 select pk_measdoc from bd_material where pk_material = '${pk_material}')`
                            };
                        }
                    });
                    props.meta.setMeta(meta, ()=>{
                        resolve(true);
                    });
                }
            } else if (key === "stordoccode") {
                //     new StoreHandler().beforeEdit(e);
                let meta = props.meta.getMeta();
                meta[moduleId].items.map((item)=>{
                    if (item.attrcode == 'stordoccode') {
                        items.queryCondition = {
                            partWhere: ` and csflag = 'Y' `
                        };
                    }
                });
                props.meta.setMeta(meta, ()=>{
                    resolve(true);
                });
            }
            resolve(true);
        });
    });
    return bodyBeforeEvent_ref.apply(this, arguments);
}
function beforeEditForHRP(props, key, index) {
    let retobj = {};
    let [pk_org, idissys, pk_mid_ref, pk_hrp_ref] = props.form.getFormItemsValue(constance.AREA.cardFormId, [
        "pk_org",
        "idissys",
        "pk_mid_ref",
        "pk_hrp_ref"
    ]);
    //目标系统
    let param = {
        key: key,
        idissys: idissys.value,
        pk_mid_ref: pk_mid_ref.value,
        midname: pk_mid_ref.display,
        pk_hrp_ref: pk_hrp_ref.value,
        pk_org: pk_org.value
    };
    let pk_storedoc = props.cardTable.getValByKeyAndIndex(constance.AREA.cardBody_1, index, 'stordoccode').value;
    if (pk_storedoc) {
        param.pk_storedoc = pk_storedoc;
    }
    (0,external_nc_lightapp_front_.ajax)({
        url: constance.URL.dynamicRefHandle,
        data: param,
        mode: 'post',
        async: false,
        success: (res)=>{
            if (res.success && res.data != null) {
                retobj = res.data;
            }
        }
    });
    return retobj;
}
function beforeEditForMID(props, key) {
    let retobj = {};
    let [idissys, pk_mid_ref, pk_hrp_ref] = props.form.getFormItemsValue(constance.AREA.cardFormId, [
        "idissys",
        "pk_mid_ref",
        "pk_hrp_ref"
    ]);
    //目标系统
    let param = {
        key: key,
        idissys: idissys.value,
        pk_mid_ref: pk_mid_ref.value,
        midname: pk_mid_ref.display,
        pk_hrp_ref: pk_hrp_ref.value
    };
    (0,external_nc_lightapp_front_.ajax)({
        url: constance.URL.dynamicRefHandle,
        data: param,
        mode: 'post',
        async: false,
        success: (res)=>{
            if (res.success && res.data != null) {
                retobj = res.data;
            }
        }
    });
    return retobj;
}

;// CONCATENATED MODULE: ./src/hpf/hpfc/m0z10302/card/beforeEvents/index.js




;// CONCATENATED MODULE: ./src/hpf/hpfc/m0z10302/card/btnClicks/editImportEvent.js


function uploadAfterEvent(info) {
    if (info.file.status === 'done') {
        if (info.file.response.data) {
            let data = info.file.response.data.data;
            let infos = this.props.cardTable.getAllData(constance.AREA.cardBody_1);
            if (data.bodys[constance.AREA.cardBody_1]) {
                let impdata = new Map();
                //待导入数据
                data.bodys.cardBody_1.rows.forEach((item)=>{
                    let key = item.values.msyscode.value + item.values.mpk.value + item.values.mcode.value + item.values.mname.value;
                    impdata.set(key, item);
                });
                let newrows = [];
                //过滤界面上数据，补齐还是尾部追加
                infos.rows.forEach((item)=>{
                    //目的档案为空的
                    if (!item.values.hpk.value) {
                        //根据来源系统+PK+编码+名称 拼主键
                        let key = item.values.msyscode.value + item.values.mpk.value + item.values.mcode.value + item.values.mname.value;
                        let improw = impdata.get(key);
                        if (improw) {
                            item.values.hpk = improw.values.hpk;
                            item.values.hcode = improw.values.hcode;
                            item.values.hname = improw.values.hname;
                            item.values.hname1 = {
                                value: improw.values.hcode.value,
                                display: improw.values.hcode.value
                            };
                            Object.keys(improw.values).forEach((fieldName)=>{
                                if (fieldName.indexOf('vdef') > -1) {
                                    if (item.values[fieldName].value == undefined || item.values[fieldName].value == '') {
                                        item.values[fieldName] = {
                                            value: improw.values[fieldName].value,
                                            display: improw.values[fieldName].value
                                        };
                                    }
                                }
                            });
                            newrows.push(item);
                            impdata.delete(key);
                        } else {
                            newrows.push(item);
                        }
                    } else {
                        newrows.push(item);
                    }
                });
                data.bodys[constance.AREA.cardBody_1].rows = newrows.concat([
                    ...impdata.values()
                ]);
                this.props.cardTable.setTableData(constance.AREA.cardBody_1, data.bodys[constance.AREA.cardBody_1]);
            }
            (0,external_nc_lightapp_front_.promptBox)({
                color: 'success',
                title: "导入完成",
                content: info.file.response.data.externalData.impmsg,
                noCancelBtn: true
            });
        }
        if (info.file.response.error) {
            (0,external_nc_lightapp_front_.toast)({
                color: 'warning',
                content: info.file.response.error.message
            });
        }
    }
}

;// CONCATENATED MODULE: ./src/hpf/hpfc/m0z10302/card/index.js
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














const { NCAffix  } = external_nc_lightapp_front_.base;
let DiscountCard = class DiscountCard extends external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_.Component {
    componentWillMount() {
        // 关闭浏览器
        window.onbeforeunload = ()=>{
            let status = this.props.cardTable.getStatus(constance.AREA.cardBody_1);
            if (status == constance.UISTATUS.edit) {
                return (0,multiLangUtil/* getLangByResId */.k)(this, '4001PUBMESSAGE-0000003');
            }
        };
    }
    render() {
        let { button , cardTable , form , cardPagination  } = this.props;
        const { createCardPagination  } = cardPagination;
        let { createForm  } = form;
        let { createCardTable  } = cardTable;
        const { createButtonApp  } = button;
        return /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement("div", {
            className: "nc-bill-card",
            __source: {
                fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10302\\card\\index.js",
                lineNumber: 105,
                columnNumber: 13
            },
            __self: this
        }, /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement("div", {
            className: "nc-bill-top-area",
            __source: {
                fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10302\\card\\index.js",
                lineNumber: 106,
                columnNumber: 17
            },
            __self: this
        }, /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement(NCAffix, {
            __source: {
                fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10302\\card\\index.js",
                lineNumber: 107,
                columnNumber: 21
            },
            __self: this
        }, /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement("div", {
            className: "nc-bill-header-area",
            __source: {
                fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10302\\card\\index.js",
                lineNumber: 108,
                columnNumber: 25
            },
            __self: this
        }, /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement("div", {
            __source: {
                fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10302\\card\\index.js",
                lineNumber: 109,
                columnNumber: 29
            },
            __self: this
        }, (0,titleUtil/* createCardTitle */.e)(this, {
            billCode: '',
            // 单据号
            backBtnClick: buttonClick.bind(this, this.props, constance.BUTTONID.Back)
        })), // 返回按钮的点击事件
        /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement("div", {
            className: "header-button-area",
            __source: {
                fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10302\\card\\index.js",
                lineNumber: 115,
                columnNumber: 29
            },
            __self: this
        }, createButtonApp({
            area: constance.AREA.cardHead,
            onButtonClick: buttonClick.bind(this)
        })), /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement("div", {
            className: "header-cardPagination-area",
            style: {
                float: 'right'
            },
            __source: {
                fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10302\\card\\index.js",
                lineNumber: 121,
                columnNumber: 29
            },
            __self: this
        }, createCardPagination({
            dataSource: constance.DATASOURCECACHE.dataSourceListCacheKey,
            handlePageInfoChange: pageInfoClick.bind(this)
        })))), /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement("div", {
            className: "nc-bill-form-area",
            __source: {
                fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10302\\card\\index.js",
                lineNumber: 129,
                columnNumber: 21
            },
            __self: this
        }, createForm(constance.AREA.cardFormId, {
            onBeforeEvent: headBeforeEvent.bind(this),
            onAfterEvent: headAfterEvent.bind(this)
        }))), /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement("div", {
            className: "nc-bill-bottom-area",
            __source: {
                fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10302\\card\\index.js",
                lineNumber: 137,
                columnNumber: 17
            },
            __self: this
        }, /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement("div", {
            className: "nc-bill-table-area",
            __source: {
                fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10302\\card\\index.js",
                lineNumber: 138,
                columnNumber: 21
            },
            __self: this
        }, createCardTable(constance.CARDTABLEAREAIDS[0], {
            tableHead: this.getTableHead.bind(this, constance.CARDTABLEAREAIDS[0]),
            hideAdd: true,
            showCheck: true,
            hideSwitch: ()=>false,
            hideDel: !this.bodyActionFlag,
            hideModelSave: true,
            selectedChange: onRowsSelected.bind(this),
            onBeforeEvent: bodyBeforeEvent.bind(this),
            onAfterEvent: bodyAfterEvent.bind(this),
            adaptionHeight: true
        }))));
    }
    constructor(props){
        super(props);
        _defineProperty(this, "initUploadConfig", ()=>{
            if (!this.config) {
                return {
                    name: 'file',
                    action: constance.URL.editImport,
                    headers: {
                        authorization: 'authorization-text'
                    },
                    showLoading: false,
                    onChange: uploadAfterEvent.bind(this)
                };
            }
            return this.config;
        });
        /* 国际化处理： 当前单据未保存，您确认离开此页面*/ // 获取列表肩部信息
        _defineProperty(this, "getTableHead", (moduleId)=>{
            let { bodyAreaId  } = getAreaAndBtnId(moduleId);
            // 肩部按钮区域
            return /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement("div", {
                className: "shoulder-definition-area",
                __source: {
                    fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10302\\card\\index.js",
                    lineNumber: 80,
                    columnNumber: 13
                },
                __self: this
            }, /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement("div", {
                className: "definition-icons",
                __source: {
                    fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10302\\card\\index.js",
                    lineNumber: 81,
                    columnNumber: 17
                },
                __self: this
            }, this.props.button.createButtonApp({
                area: bodyAreaId,
                ignoreHotkeyCode: (0,hotKeysUtil/* getCardDisableHotKeyBtn */.E)(),
                onButtonClick: lineBtnClick.bind(this, moduleId)
            })));
        });
        // 楼层点击回调函数
        _defineProperty(this, "clickFunction", (moduleId)=>{
            this.props.cardTable.toggleCardTable(moduleId, true);
        });
        this.state = {
            copyRowDatas: null,
            // 复制行数据
            refshowData: null
        };
        this.contexts = null;
        // 所有复制行数据
        this.copyLineDatas = {
            [constance.AREA.cardBody_1]: null
        };
        this.bodyActionFlag = true;
        //操作列按钮可用标志
        props.use.form(constance.AREA.cardFormId);
        // props.use.form(AREA.cardBody_1);
        props.use.cardTable(constance.AREA.cardFormId);
        props.use.cardTable(constance.AREA.cardBody_1);
        this.config = this.initUploadConfig();
        (0,multiLangUtil/* initLang */.v)(this, constance.MULTILANG.langfileId, constance.MULTILANG.domainName, initTemplate.bind(this, this.props));
    }
};
DiscountCard = (0,external_nc_lightapp_front_.createPage)({
    orderOfHotKey: [
        constance.AREA.cardFormId,
        constance.AREA.cardBody_1
    ],
    billinfo: {
        billtype: 'extcard',
        pagecode: constance.PAGECODE.cardPagecode,
        headcode: constance.AREA.cardFormId,
        bodycode: {
            [constance.AREA.cardBody_1]: 'cardTable'
        }
    }
})(DiscountCard);
/* harmony default export */ const card = (DiscountCard);

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=index.2d6cab82.js.map