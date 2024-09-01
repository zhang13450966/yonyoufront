/*! @ncctag {"project":"hpf","branch":"develop-ncc1.0","provider":"suqch","date":"2023/8/30 10:51:22"} */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["hpf/hpfc/m0z10301/constant/index"] = factory();
	else
		root["hpf/hpfc/m0z10301/constant/index"] = factory();
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
/* harmony export */   "COLS_EDITABLE": () => (/* binding */ COLS_EDITABLE),
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
/* harmony export */   "base_path": () => (/* binding */ base_path),
/* harmony export */   "editcfg": () => (/* binding */ editcfg)
/* harmony export */ });
/**
* @description: 常量
*/ //应用编码
const APPCODE = 'M0Z10301';
//单据类型
const BILL_TYPE_CODE = 'SUMRULE';
/**
* @description: 多语
* @param moduleId: 多语资源名
* @param domainName: 工程名
*/ const MULTILANG = {
    moduleId: 'M0Z10301',
    domainName: 'hpf'
};
/**
 * 列表
 */ const LIST = {
    page_title: 'M0Z10301-000011',
    //页面标题 /* 国际化处理： 投融资费用*/
    page_code: 'M0Z10301_LIST',
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
    page_title: 'M0Z10301-000011',
    //页面标题 /* 国际化处理： 投融资费用*/
    page_code: 'M0Z10301_CARD',
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
const base_path = '/nccloud/hpf/hpfc/';
//url
const REQUEST_URL = {
    save: `/nccloud/hpf/hpfc/savesumruleVO.do`,
    //保存
    delete: `/nccloud/hpf/hpfc/deletesumruleVO.do`,
    //删除
    queryCard: `/nccloud/hpf/hpfc/querycardsumruleVO.do`,
    //卡片查询
    queryList: `/nccloud/hpf/hpfc/querypagesumruleVO.do`,
    //列表查询
    queryListByPks: `/nccloud/hpf/hpfc/querypagebypksumruleVO.do`,
    //列表分页查询
    commit: `/nccloud/hpf/hpfc/commitsumruleVO.do`,
    //提交
    unCommit: `/nccloud/hpf/hpfc/uncommitsumruleVO.do`,
    //收回
    setInitDataBefore: '/nccloud/hpf/hpfc/setinitdatabefore.do',
    //初始化数据前校验
    setInitData: '/nccloud/hpf/hpfc/setinitdata.do',
    //初始化数据
    toCard: '/card',
    toList: '/list',
    queryColumn: '/nccloud/hpf/hpfc/queryColumn.do',
    //查询元数据字段
    print: '/nccloud/hpf/hpfc/HpfsumrulePrintAction.do'
};
//主表打印
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
    setInitData: 'InitData',
    bodyUpdate: 'edit',
    bodyDelete: 'delete',
    bodyCommit: 'commit',
    bodyUnCommit: 'unCommit',
    copy: 'copy'
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
    LIST_BUTTON.output,
    LIST_BUTTON.bodyUpdate
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
    print: 'Print',
    output: 'Output',
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
    pasteHere: 'pasteHere'
};
//卡片默认禁用按钮
const CARD_DISABLED_BUTTON = [
    CARD_BUTTON.deleteRow,
    CARD_BUTTON.copyRows
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
    ts: 'ts',
    //时间戳
    idissys: 'idissys',
    idissysbilltype: 'idissysbilltype'
};
//主属性字段名
const PRIMARY_KEY = {
    head_id: 'pk_sumrule',
    //表头主键字段名
    body_id: 'pk_sumrule_h',
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
};
//提交 态
//预制字段不可编辑
const COLS_EDITABLE = {
    //收入单据（项目成本）-中间库住院权责/中间库门诊收入
    sr_xm: [
        'vchargetypecode',
        'vchargetypename',
        'vexedeptcode',
        'vexedeptname',
        'vapplydeptcode',
        'vapplydeptname',
        'vapplydoctorcode',
        'vapplydoctorname',
        'dinprice',
        'valuationnmny'
    ]
};
const editcfg = new Map([
    //收入单据（项目成本）   'fieldcode', 'fieldname', 'ifchange', 'ifgroup' 字段禁止编辑
    [
        'CP04',
        [
            'vchargetypecode',
            'vchargetypename',
            'vexedeptcode',
            'vexedeptname',
            'vapplydeptcode',
            'vapplydeptname',
            'vapplydoctorcode',
            'vapplydoctorname',
            'dinprice',
            'valuationnmny'
        ]
    ],
    //人员工资明细  'ifchange' 字段禁止编辑
    [
        '0001ZZZZD01EE175077C',
        [
            'vdeptcode',
            'vdeptname',
            'vfundsourcecode',
            'vfundsourcename'
        ]
    ],
    [
        '0002ZZZZD01EE175077C',
        [
            'vdeptcode',
            'vdeptname',
            'vfundsourcecode',
            'vfundsourcename'
        ]
    ],
    //设备折旧明细
    [
        '0001ZZZZF7A86CABE5A7',
        [
            'vdeptcode',
            'vdeptname',
            'vequipcode',
            'vequipname',
            'vfundsourcecode',
            'vfundsourcename'
        ]
    ],
    //材料出库明细
    [
        '0001ZZZZE193F6699639',
        [
            'vdeptcode',
            'vdeptname',
            'vfundsourcecode',
            'vfundsourcename'
        ]
    ],
    [
        '0002ZZZZE193F6699639',
        [
            'vdeptcode',
            'vdeptname',
            'vfundsourcecode',
            'vfundsourcename'
        ]
    ],
    //DRG/病种住院权责收入				
    [
        'DG11',
        [
            'acceptrefund',
            'billscode',
            'billstype',
            'dbusdate',
            'diagnosiscode',
            'diagnosisname',
            'dinprice',
            'executedeptcodeone',
            'executedeptcodethree',
            'executedeptcodetwo',
            'executedeptnamefour',
            'executedeptnameone',
            'executedeptnamethree',
            'executedeptnametwo',
            'executedoctorcodeone',
            'executedoctorcodethree',
            'executedoctorcodetwo',
            'executedoctornamefour',
            'executedoctornameone',
            'executedoctornamethree',
            'executedoctornametwo',
            'fetrange',
            'medicaltype',
            'nmny',
            'nquantity',
            'pawpaynmny',
            'pk_mid_clinic_income',
            'syscode',
            'transtype',
            'valuationnmny',
            'vapplydeptcode',
            'vapplydeptname',
            'vapplydoctorcode',
            'vapplydoctorname',
            'vchargercode',
            'vchargername',
            'vchargetypecode',
            'vchargetypename',
            'vcustcode',
            'vcustname',
            'vexedeptcode',
            'vexedeptname',
            'vincomeclass',
            'vincometypecode',
            'vincometypename',
            'vnote',
            'vpatientcode',
            'vpatientname',
            'vpayorgtypecode',
            'vpayorgtypename',
            'vpaywaycode',
            'vpaywayname',
            'vtranswayname',
            'vbrcbcode',
            'vbrcbname',
            'jzcode',
            'hospitalnumber'
        ]
    ],
    //DRG分组明细
    [
        'DG10',
        [
            'cydeptcode',
            'cydeptname',
            'period',
            'patientcode',
            'patientname',
            'age',
            'sex',
            'bano',
            'zyno',
            'zycnt',
            'zyday',
            'ybtype',
            'rydate',
            'cydate',
            'cystatus',
            'ndccode',
            'ndcname',
            'drgcode',
            'drgname',
            'rw',
            'zyallmny',
            'majorzd',
            'minorzd1',
            'majorzd2',
            'minorzd3',
            'minorzd4',
            'majorss',
            'majorss1',
            'majorss2',
            'majorss3',
            'majorss4'
        ]
    ],
    //病案首页
    [
        'DG31',
        [
            'admittedcode',
            'admittedname',
            'outdeptcode',
            'outdeptname',
            'admissiondate',
            'age',
            'dischargedate',
            'dischargenmy',
            'hospitaldays',
            'hospitalnumber',
            'infectcode',
            'infectname',
            'instypecode',
            'instypename',
            'leavestatuscode',
            'leavestatusname',
            'maindiagnosecode',
            'maindiagnosename',
            'mainsurgerycode',
            'mainsurgeryname',
            'medicalno',
            'minordiagnose1code',
            'minordiagnose1name',
            'minordiagnose2code',
            'minordiagnose2name',
            'minordiagnose3code',
            'minordiagnose3name',
            'minordiagnose4code',
            'minordiagnose4name',
            'minorsurgery1code',
            'minorsurgery1name',
            'minorsurgery2code',
            'minorsurgery2name',
            'minorsurgery3code',
            'minorsurgery3name',
            'minorsurgery4code',
            'minorsurgery4name',
            'patienttype',
            'period',
            'pk_mid_medicrec_page',
            'rescuenum',
            'residentdoctorcode',
            'residentdoctorname',
            'sex',
            'singlediseasecode',
            'singlediseasename',
            'successnum',
            'syscode',
            'vpatientcode',
            'vpatientname'
        ]
    ]
]);

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=index.84b0321f.js.map