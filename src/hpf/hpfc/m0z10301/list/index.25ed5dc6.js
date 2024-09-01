/*! @ncctag {"project":"hpf","branch":"develop-ncc1.0","provider":"suqch","date":"2023/8/30 10:51:22"} */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"), require("nc-lightapp-front"));
	else if(typeof define === 'function' && define.amd)
		define(["react", "nc-lightapp-front"], factory);
	else if(typeof exports === 'object')
		exports["hpf/hpfc/m0z10301/list/index"] = factory(require("react"), require("nc-lightapp-front"));
	else
		root["hpf/hpfc/m0z10301/list/index"] = factory(root["React"], root["nc-lightapp-front"]);
})(self, (__WEBPACK_EXTERNAL_MODULE__6487__, __WEBPACK_EXTERNAL_MODULE__5118__) => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 2582:
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
/* unused harmony exports DATASOURCE, CARD_CACHE, base_path, CARD_BUTTON, CARD_DISABLED_BUTTON, CARD_ADD_DISABLED_BUTTON, COLS_EDITABLE, editcfg */
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


/***/ }),

/***/ 1924:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "A1": () => (/* binding */ listLinkApprove),
/* harmony export */   "E2": () => (/* binding */ listRefresh),
/* harmony export */   "Fw": () => (/* binding */ listCreate),
/* harmony export */   "HT": () => (/* binding */ listAttachment),
/* harmony export */   "KJ": () => (/* binding */ listEdit),
/* harmony export */   "O5": () => (/* binding */ listCommit),
/* harmony export */   "Oq": () => (/* binding */ handleDoubleClick),
/* harmony export */   "Pc": () => (/* binding */ onOutput),
/* harmony export */   "Se": () => (/* binding */ listUnCommit),
/* harmony export */   "TF": () => (/* binding */ onPrint),
/* harmony export */   "YK": () => (/* binding */ pageInfoClick),
/* harmony export */   "bm": () => (/* binding */ listHeadDelete),
/* harmony export */   "h9": () => (/* binding */ listBillTrack),
/* harmony export */   "mx": () => (/* binding */ listSearch),
/* harmony export */   "nT": () => (/* binding */ initDataBefore)
/* harmony export */ });
/* unused harmony exports listCopy, checkSelected, listBodyDelete, PromptMessage, initData */
/* harmony import */ var nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5118);
/* harmony import */ var nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _constant_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2582);


//列表新增
function listCreate(props) {
    props.pushTo(_constant_index__WEBPACK_IMPORTED_MODULE_1__.REQUEST_URL.toCard, {
        status: _constant_index__WEBPACK_IMPORTED_MODULE_1__.STATUS.add,
        pagecode: _constant_index__WEBPACK_IMPORTED_MODULE_1__.CARD.page_code
    });
}
//列表刷新
function listRefresh(props) {
    let { getDefData  } = nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.cardCache;
    let queryInfo = getDefData(_constant_index__WEBPACK_IMPORTED_MODULE_1__.SEARCH_CACHE.key, _constant_index__WEBPACK_IMPORTED_MODULE_1__.SEARCH_CACHE.dataSource);
    listSearch(props, queryInfo);
}
//列表修改
function listEdit(props, pk) {
    props.pushTo(_constant_index__WEBPACK_IMPORTED_MODULE_1__.REQUEST_URL.toCard, {
        status: _constant_index__WEBPACK_IMPORTED_MODULE_1__.STATUS.edit,
        id: pk,
        pagecode: _constant_index__WEBPACK_IMPORTED_MODULE_1__.CARD.page_code
    });
}
//列表复制
function listCopy(props, pk) {
    props.pushTo(REQUEST_URL.toCard, {
        status: STATUS.edit,
        id: pk,
        pagecode: CARD.page_code,
        isCopy: true
    });
}
//列表提交
function listCommit(props, data) {
    if (!data) {
        let select = checkSelected(props, false);
        if (!select.valid) {
            return;
        }
        if (select.valid) {
            let selectDatas = select.selectDatas;
            let pks = selectDatas && selectDatas.map((item)=>item.data.values[_constant_index__WEBPACK_IMPORTED_MODULE_1__.PRIMARY_KEY.head_id].value);
            let pkMapTs = new Map();
            selectDatas && selectDatas.map((item)=>{
                let pk = item.data.values[_constant_index__WEBPACK_IMPORTED_MODULE_1__.PRIMARY_KEY.head_id].value;
                let ts = item.data.values[_constant_index__WEBPACK_IMPORTED_MODULE_1__.FIELD.ts] && item.data.values[_constant_index__WEBPACK_IMPORTED_MODULE_1__.FIELD.ts].value;
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
    (0,nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.ajax)({
        url: _constant_index__WEBPACK_IMPORTED_MODULE_1__.REQUEST_URL.commit,
        data,
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
                    PromptMessage.call(this, res);
                    listRefresh(props);
                }
            } else {
                //失败
                PromptMessage.call(this, res);
            }
        }
    });
}
//toast({ color: STATUS.warning, content: props.json['M0Z10301-000015'] });/* 国际化处理： 提交失败*/
//列表收回
function listUnCommit(props, data) {
    if (!data) {
        let select = checkSelected(props, false);
        if (select.valid) {
            let selectDatas = select.selectDatas;
            let pks = selectDatas && selectDatas.map((item)=>item.data.values[_constant_index__WEBPACK_IMPORTED_MODULE_1__.PRIMARY_KEY.head_id].value);
            let pkMapTs = new Map();
            selectDatas && selectDatas.map((item)=>{
                let pk = item.data.values[_constant_index__WEBPACK_IMPORTED_MODULE_1__.PRIMARY_KEY.head_id].value;
                let ts = item.data.values[_constant_index__WEBPACK_IMPORTED_MODULE_1__.FIELD.ts] && item.data.values[_constant_index__WEBPACK_IMPORTED_MODULE_1__.FIELD.ts].value;
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
    (0,nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.ajax)({
        url: _constant_index__WEBPACK_IMPORTED_MODULE_1__.REQUEST_URL.unCommit,
        data,
        success: (res)=>{
            if (res.success) {
                //成功
                listRefresh(props);
            } else {
                //失败
                (0,nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.toast)({
                    color: _constant_index__WEBPACK_IMPORTED_MODULE_1__.STATUS.warning,
                    content: props.json['M0Z10301-000017']
                });
            }
        }
    });
}
/* 国际化处理： 收回失败*/ /**
 * 是否选中数据
 *
 * @param {*} isCheckOne 是否选中一条数据
 * @returns 返回是否校验成功
 */ function checkSelected(props, isCheckOne) {
    let valid = true;
    let selectDatas = props.table && props.table.getCheckedRows(_constant_index__WEBPACK_IMPORTED_MODULE_1__.LIST.table_id);
    if (isCheckOne && selectDatas.length > 1) {
        (0,nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.toast)({
            color: _constant_index__WEBPACK_IMPORTED_MODULE_1__.STATUS.warning,
            content: props.json['M0Z10301-000012']
        });
        /* 国际化处理： 请选中一行表体数据!*/ valid = false;
    } else if (selectDatas.length == 0) {
        (0,nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.toast)({
            color: _constant_index__WEBPACK_IMPORTED_MODULE_1__.STATUS.warning,
            content: props.json['M0Z10301-000013']
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
        let billId = selectDatas[0] && selectDatas[0].data.values[_constant_index__WEBPACK_IMPORTED_MODULE_1__.PRIMARY_KEY.head_id].value;
        let billNo = selectDatas[0] && selectDatas[0].data.values[_constant_index__WEBPACK_IMPORTED_MODULE_1__.PRIMARY_KEY.bill_no].value;
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
        let billId = selectDatas[0] && selectDatas[0].data.values[_constant_index__WEBPACK_IMPORTED_MODULE_1__.PRIMARY_KEY.head_id].value;
        this.setState({
            showBillTrack: true,
            billTrackBillId: billId,
            billTrackBillType: _constant_index__WEBPACK_IMPORTED_MODULE_1__.BILL_TYPE_CODE
        });
    }
}
//列表审批详情
function listLinkApprove(props) {
    let select = checkSelected(props, true);
    if (select.valid) {
        let selectDatas = select.selectDatas;
        let billId = selectDatas[0] && selectDatas[0].data.values[_constant_index__WEBPACK_IMPORTED_MODULE_1__.PRIMARY_KEY.head_id].value;
        this.setState({
            showApproveDetail: true,
            billId
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
        pks = selectDatas && selectDatas.map((item)=>item.data.values[_constant_index__WEBPACK_IMPORTED_MODULE_1__.PRIMARY_KEY.head_id].value);
        let pkMapTs = new Map();
        selectDatas && selectDatas.map((item)=>{
            let pk = item.data.values[_constant_index__WEBPACK_IMPORTED_MODULE_1__.PRIMARY_KEY.head_id].value;
            let ts = item.data.values[_constant_index__WEBPACK_IMPORTED_MODULE_1__.FIELD.ts] && item.data.values[_constant_index__WEBPACK_IMPORTED_MODULE_1__.FIELD.ts].value;
            //主键与tsMap
            if (pk && ts) {
                pkMapTs.set(pk, ts);
            }
        });
        data = {
            pks,
            pkMapTs
        };
        (0,nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.ajax)({
            url: _constant_index__WEBPACK_IMPORTED_MODULE_1__.REQUEST_URL["delete"],
            data,
            success: (res)=>{
                if (res.success) {
                    //成功
                    let allTableData = props.table.getAllTableData(_constant_index__WEBPACK_IMPORTED_MODULE_1__.LIST.table_id);
                    let allPks = allTableData.rows[0] && allTableData.rows.map((item)=>item.values[_constant_index__WEBPACK_IMPORTED_MODULE_1__.PRIMARY_KEY.head_id].value);
                    let deleteRowIndexArr = pks.map((item)=>allPks.findIndex((v)=>v == item)).filter((item)=>item != -1);
                    props.table.deleteCacheId(_constant_index__WEBPACK_IMPORTED_MODULE_1__.LIST.table_id, pks);
                    props.table.deleteTableRowsByIndex(_constant_index__WEBPACK_IMPORTED_MODULE_1__.LIST.table_id, deleteRowIndexArr);
                    (0,nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.toast)({
                        color: _constant_index__WEBPACK_IMPORTED_MODULE_1__.STATUS.success,
                        content: props.json['M0Z10301-000005']
                    });
                } else /* 国际化处理： 删除成功*/ {
                    //失败
                    (0,nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.toast)({
                        color: _constant_index__WEBPACK_IMPORTED_MODULE_1__.STATUS.warning,
                        content: props.json['M0Z10301-000009']
                    });
                }
            }
        });
    }
}
/* 国际化处理： 删除失败*/ //列表表体删除
function listBodyDelete(props, data, index) {
    ajax({
        url: REQUEST_URL.delete,
        data,
        success: (res)=>{
            if (res.success) {
                //成功
                props.table.deleteCacheId(LIST.table_id, data.pks[0]);
                props.table.deleteTableRowsByIndex(LIST.table_id, index);
                toast({
                    color: STATUS.success,
                    content: props.json['M0Z10301-000005']
                });
            } else /* 国际化处理： 删除成功*/ {
                //失败
                toast({
                    color: STATUS.warning,
                    content: props.json['M0Z10301-000009']
                });
            }
        }
    });
}
/* 国际化处理： 删除失败*/ //列表查询
function listSearch(props, queryInfo) {
    let pageInfo = props.table.getTablePageInfo(_constant_index__WEBPACK_IMPORTED_MODULE_1__.LIST.table_id);
    if (!queryInfo) {
        queryInfo = props.search.getQueryInfo(_constant_index__WEBPACK_IMPORTED_MODULE_1__.LIST.search_id);
    }
    queryInfo.pageInfo = pageInfo;
    queryInfo.pageCode = _constant_index__WEBPACK_IMPORTED_MODULE_1__.LIST.page_code;
    // 刷新按钮可用
    props.button.setDisabled({
        [_constant_index__WEBPACK_IMPORTED_MODULE_1__.LIST_BUTTON.refresh]: false
    });
    (0,nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.ajax)({
        url: _constant_index__WEBPACK_IMPORTED_MODULE_1__.REQUEST_URL.queryList,
        data: queryInfo,
        success: (res)=>{
            let { success , data  } = res;
            if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
                props.dealFormulamsg(res.formulamsg);
            }
            if (success && data && data[_constant_index__WEBPACK_IMPORTED_MODULE_1__.LIST.table_id]) {
                props.table.setAllTableData(_constant_index__WEBPACK_IMPORTED_MODULE_1__.LIST.table_id, data[_constant_index__WEBPACK_IMPORTED_MODULE_1__.LIST.table_id]);
                (0,nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.toast)({
                    color: _constant_index__WEBPACK_IMPORTED_MODULE_1__.STATUS.success
                });
            } else {
                props.table.setAllTableData(_constant_index__WEBPACK_IMPORTED_MODULE_1__.LIST.table_id, {
                    rows: []
                });
                (0,nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.toast)({
                    color: _constant_index__WEBPACK_IMPORTED_MODULE_1__.STATUS.warning,
                    content: props.json['M0Z10301-000010']
                });
            }
            /* 国际化处理： 未查询出符合条件的数据！*/ // 将查询条件缓存
            let { setDefData  } = nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.cardCache;
            setDefData(_constant_index__WEBPACK_IMPORTED_MODULE_1__.SEARCH_CACHE.key, _constant_index__WEBPACK_IMPORTED_MODULE_1__.SEARCH_CACHE.dataSource, queryInfo);
        }
    });
}
//分页查询
function pageInfoClick(props, config, pks) {
    let data = {
        pks,
        pagecode: _constant_index__WEBPACK_IMPORTED_MODULE_1__.LIST.page_code
    };
    (0,nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.ajax)({
        url: _constant_index__WEBPACK_IMPORTED_MODULE_1__.REQUEST_URL.queryListByPks,
        data,
        success: (res)=>{
            let { success , data  } = res;
            if (success && data && data[_constant_index__WEBPACK_IMPORTED_MODULE_1__.LIST.table_id]) {
                props.table.setAllTableData(_constant_index__WEBPACK_IMPORTED_MODULE_1__.LIST.table_id, data[_constant_index__WEBPACK_IMPORTED_MODULE_1__.LIST.table_id]);
                (0,nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.toast)({
                    color: _constant_index__WEBPACK_IMPORTED_MODULE_1__.STATUS.success
                });
            } else {
                props.table.setAllTableData(_constant_index__WEBPACK_IMPORTED_MODULE_1__.LIST.table_id, {
                    rows: []
                });
                (0,nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.toast)({
                    color: _constant_index__WEBPACK_IMPORTED_MODULE_1__.STATUS.warning,
                    content: props.json['M0Z10301-000010']
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
    /* 国际化处理： 成功,条 ,,成功*/ content = content + ',失败' + failNum + ',条';
    /* 国际化处理： 失败,条,条*/ let errMsgArr = res.data.errormessages;
    //全部成功
    if (status == 0) {
        (0,nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.toast)({
            color: "success",
            title: '提交' + msg,
            content,
            TextArr: [
                '展开',
                '收起',
                '关闭'
            ],
            /* 国际化处理： 展开,收起,关闭*/ groupOperation: true
        });
    } else //全部失败
    if (status == 1) {
        (0,nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.toast)({
            duration: "infinity",
            color: "danger",
            title: '提交' + msg,
            content,
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
        (0,nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.toast)({
            duration: "infinity",
            color: "warning",
            title: '提交' + msg,
            content,
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
    props.pushTo(_constant_index__WEBPACK_IMPORTED_MODULE_1__.REQUEST_URL.toCard, {
        status: _constant_index__WEBPACK_IMPORTED_MODULE_1__.STATUS.browse,
        id: record[_constant_index__WEBPACK_IMPORTED_MODULE_1__.PRIMARY_KEY.head_id].value,
        idissys: record[_constant_index__WEBPACK_IMPORTED_MODULE_1__.FIELD.idissys].value,
        idissysbilltype: record[_constant_index__WEBPACK_IMPORTED_MODULE_1__.FIELD.idissysbilltype].value,
        pagecode: _constant_index__WEBPACK_IMPORTED_MODULE_1__.CARD.page_code,
        scene: props.getUrlParam('scene')
    });
}
//初始化数据前校验
function initDataBefore(props) {
    let queryInfo = props.search.getSearchValByField(_constant_index__WEBPACK_IMPORTED_MODULE_1__.LIST.search_id, "pk_org").value.firstvalue;
    let pk_org = queryInfo.split(",");
    if (queryInfo && pk_org.length == 1) {
        (0,nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.ajax)({
            url: _constant_index__WEBPACK_IMPORTED_MODULE_1__.REQUEST_URL.setInitDataBefore,
            data: {
                pk_org: pk_org[0]
            },
            success: (res)=>{
                if (res.data.value) {
                    initData(props, res.data.pk_org);
                } else {
                    (0,nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.promptBox)({
                        color: 'warning',
                        title: '提示',
                        content: `当前业务单元${res.data.orgName}存在数据汇总规则数据，是否删除原有的数据重新预置数据！`,
                        noFooter: false,
                        noCancelBtn: false,
                        beSureBtnName: '是',
                        cancelBtnName: '否',
                        hasCloseBtn: true,
                        beSureBtnClick: ()=>initData(props, res.data.pk_org),
                        closeByClickBackDrop: false
                    });
                }
            }
        });
    } else {
        (0,nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.toast)({
            color: 'danger',
            content: '请选择一个业务单元进行初始化'
        });
    }
}
//初始化数据
function initData(props, pk_org) {
    (0,nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.ajax)({
        url: _constant_index__WEBPACK_IMPORTED_MODULE_1__.REQUEST_URL.setInitData,
        data: {
            pk_org,
            flag_clear: true
        },
        success: (res)=>{
            (0,nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.toast)({
                content: '初始化成功'
            });
            let { getDefData  } = nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.cardCache;
            let queryInfo = getDefData(_constant_index__WEBPACK_IMPORTED_MODULE_1__.SEARCH_CACHE.key, _constant_index__WEBPACK_IMPORTED_MODULE_1__.SEARCH_CACHE.dataSource);
            listSearch(props, queryInfo);
        }
    });
}
//打印
function onPrint(props) {
    let allData = props.table.getAllTableData(_constant_index__WEBPACK_IMPORTED_MODULE_1__.LIST.table_id);
    if (allData.rows.length === 0) {
        (0,nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.toast)({
            color: _constant_index__WEBPACK_IMPORTED_MODULE_1__.STATUS.warning,
            content: "无可打印数据"
        });
        /* 国际化处理:*/ return;
    }
    let pks = allData.allpks;
    (0,nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.print)('pdf', _constant_index__WEBPACK_IMPORTED_MODULE_1__.REQUEST_URL.print, {
        funcode: props.appcode,
        //功能节点编码
        nodekey: 'M0Z10301',
        //模板节点编码
        oids: pks,
        outputType: 'output'
    });
}
//输出
function onOutput(props) {
    let allData = props.table.getAllTableData(_constant_index__WEBPACK_IMPORTED_MODULE_1__.LIST.table_id);
    if (allData.rows.length === 0) {
        (0,nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__.toast)({
            color: _constant_index__WEBPACK_IMPORTED_MODULE_1__.STATUS.warning,
            content: "无可输出的数据"
        });
        /* 国际化处理:*/ return;
    }
    let pks = allData.allpks;
    this.setState({
        ids: pks
    }, this.refs.printOutput.open());
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
  "default": () => (/* binding */ list)
});

// EXTERNAL MODULE: external {"root":"React","var":"React","commonjs":"react","commonjs2":"react","amd":"react"}
var external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_ = __webpack_require__(6487);
var external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default = /*#__PURE__*/__webpack_require__.n(external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_);
// EXTERNAL MODULE: external "nc-lightapp-front"
var external_nc_lightapp_front_ = __webpack_require__(5118);
// EXTERNAL MODULE: ./src/hpf/hpfc/m0z10301/constant/index.js
var constant = __webpack_require__(2582);
// EXTERNAL MODULE: ./src/hpf/hpfc/m0z10301/list/events/listOperator.js
var listOperator = __webpack_require__(1924);
;// CONCATENATED MODULE: ./src/hpf/hpfc/m0z10301/list/events/bodyButtonClick.js
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
            listBodyDelete(_objectSpreadProps(_objectSpread({}, props), {
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
            listCommit.call(this, _objectSpreadProps(_objectSpread({}, props), {
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
            listUnCommit(_objectSpreadProps(_objectSpread({}, props), {
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

;// CONCATENATED MODULE: ./src/hpf/hpfc/m0z10301/list/events/selectedEvent.js

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
            constant.LIST_BUTTON.output
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
        if (isAllNoState) {
            showBtn.push(constant.LIST_BUTTON.commit);
        }
        if (isAllPassing) {
            showBtn.push(constant.LIST_BUTTON.unCommit);
        }
        props.button.setButtonDisabled(showBtn, false);
    } else {
        //单选
        let busistatus = selectDatas[0].data.values[constant.FIELD.billStatus] && selectDatas[0].data.values[constant.FIELD.billStatus].value;
        if (busistatus == constant.STATUS.NOSTATE) {
            //自由
            showBtn = [
                constant.LIST_BUTTON.commit,
                constant.LIST_BUTTON["delete"],
                constant.LIST_BUTTON.bodyUpdate
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
            constant.LIST_BUTTON.output
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
        if (isAllNoState) {
            showBtn.push(constant.LIST_BUTTON.commit);
        }
        if (isAllPassing) {
            showBtn.push(constant.LIST_BUTTON.unCommit);
        }
        props.button.setButtonDisabled(showBtn, false);
    }
}

;// CONCATENATED MODULE: ./src/hpf/hpfc/m0z10301/list/events/initTemplate.js



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
                props.button.setPopContent(constant.LIST_BUTTON.bodyDelete, this.state.json['M0Z10301-000008']);
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
                            item.initialvalue = {
                                display: org_Name,
                                value: pk_org
                            };
                        }
                    });
                }
                //else if (item.attrcode == FIELD.orgV) {
                //                                                              item.initialvalue = { display: org_v_Name, value: pk_org_v }
                //                                                      }
                meta[constant.LIST.search_id].items.map((item)=>{
                    if (item.attrcode == constant.FIELD.org) {
                        item.isMultiSelectedEnabled = false;
                    }
                });
                props.meta.setMeta(meta);
                //查询区赋予组织
                //判断查询区域组织是否有值，如果有则表明快速查询方案已个性化定制。无需加载默认业务单元
                if (data.context && data.context.pk_org) {
                    let orgValue = props.search.getSearchValByField(constant.LIST.search_id, constant.FIELD.org);
                    //let orgVValue = props.search.getSearchValByField(LIST.search_id, FIELD.orgV);
                    // if (!(orgValue && orgValue.value) && !(orgVValue && orgVValue.value)) {
                    if (!(orgValue && orgValue.value)) {
                        let { pk_org , org_Name  } = data.context;
                        props.search.setSearchValByField(constant.LIST.search_id, constant.FIELD.org, {
                            display: org_Name,
                            value: pk_org
                        });
                    }
                }
                //目标系统
                let idissys = this.props.search.getSearchValByField(constant.LIST.search_id, "idissys").value.firstvalue;
                //目标系统单据类型添加参照过滤
                this.props.search.setTemlateByField(constant.LIST.search_id, "idissysbilltype", "queryCondition", {
                    idissys,
                    GridRefActionExt: 'nccloud.web.hpf.sumrulevo.refsqlbuilder.AllBillRefSqlBuilder'
                });
                this.props.search.setSearchValByField(constant.LIST.search_id, "idissysbilltype", {
                    display: "",
                    value: ""
                });
                selectedEvent(props);
            }
        }
    });
}
function modifierMeta(props, meta) {
    // //查询区参照过滤
    // meta[LIST.search_id].items.map((item) => {
    //     if (item.attrcode === FIELD.org) { //财务组织过滤
    //         item.isMultiSelectedEnabled = false; //财务组织多选
    //         item.queryCondition = () => {
    //             return {
    //                 funcode: props.getSearchParam('c'),//appcode获取
    //                 //用户权限过滤
    //                 TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
    //             };
    //         };
    //     }
    //     //else if (item.attrcode === FIELD.orgV) {
    //     //      item.isMultiSelectedEnabled = true;
    //     //      item.queryCondition = () => {
    //     //              return {
    //     //                      funcode: props.getSearchParam('c')//appcode获取
    //     //              };
    //     //      };
    //     //}
    // });
    //开启分页
    meta[constant.LIST.table_id].pagination = true;
    meta[constant.LIST.table_id].items = meta[constant.LIST.table_id].items.map((item, key)=>{
        if (item.attrcode == constant.PRIMARY_KEY.bill_no) {
            item.render = (text, record, index)=>/*#__PURE__*/ React.createElement("a", {
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
                        fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10301\\list\\events\\initTemplate.js",
                        lineNumber: 102,
                        columnNumber: 21
                    },
                    __self: this
                }, record[constant.PRIMARY_KEY.bill_no] && record[constant.PRIMARY_KEY.bill_no].value);
        }
        return item;
    });
    //添加操作列
    //示例代码
    // meta[LIST.table_id].items.push({
    //     itemtype: 'customer',
    //     attrcode: 'opr',
    //     label: this.state.json['M0Z10301-000006'],/* 国际化处理： 操作*/
    //     width: '180px',
    //     fixed: 'right',
    //     className: "table-opr",
    //     visible: true,
    //     render: (text, record, index) => {
    //         let buttonAry = [];
    //         //单据没有实际审批业务，注释掉审批状态判断，避免出现表格没有修改按钮情况
    //         // let billStatus = record[FIELD.billStatus] && record[FIELD.billStatus].value;
    //         //buttonAry = [LIST_BUTTON.bodyCommit, LIST_BUTTON.bodyUpdate, LIST_BUTTON.bodyDelete, LIST_BUTTON.copy];
    //         // switch (billStatus) {
    //         //     case STATUS.NOSTATE:
    //         //         buttonAry = [LIST_BUTTON.bodyCommit, LIST_BUTTON.bodyUpdate, LIST_BUTTON.bodyDelete, LIST_BUTTON.copy];
    //         //         break;
    //         //     case STATUS.PASSING:
    //         //     case STATUS.COMMIT:
    //         //     case STATUS.GOINGON:
    //         //         buttonAry = [LIST_BUTTON.bodyUnCommit, LIST_BUTTON.copy];
    //         //         break;
    //         //     default:
    //         //         buttonAry = [LIST_BUTTON.copy];
    //         //         break;
    //         // }
    //         return props.button.createOprationButton(buttonAry, {
    //             area: LIST.body_btn_code,
    //             buttonLimit: 4,
    //             onButtonClick: (props, key) => bodyButtonClick.call(this, props, key, text, record, index)
    //         });
    //     }
    // });
    return meta;
}

;// CONCATENATED MODULE: ./src/hpf/hpfc/m0z10301/list/events/buttonClick.js
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
            (0,listOperator/* listCreate */.Fw)(props);
            break;
        //修改
        case constant.LIST_BUTTON.bodyUpdate:
            let selectDatas = props.table && props.table.getCheckedRows(constant.LIST.table_id);
            let pk = selectDatas[0].data.values[constant.PRIMARY_KEY.head_id] && selectDatas[0].data.values[constant.PRIMARY_KEY.head_id].value;
            (0,listOperator/* listEdit */.KJ)(props, pk);
            break;
        //删除
        case constant.LIST_BUTTON["delete"]:
            (0,external_nc_lightapp_front_.promptBox)({
                color: constant.STATUS.warning,
                title: this.state.json['M0Z10301-000000'],
                /* 国际化处理： 删除*/ content: this.state.json['M0Z10301-000001'],
                /* 国际化处理： 确定删除吗？*/ beSureBtnClick: ()=>{
                    (0,listOperator/* listHeadDelete */.bm)(buttonClick_objectSpreadProps(buttonClick_objectSpread({}, props), {
                        json: this.state.json
                    }));
                    props.button.setButtonDisabled(constant.LIST_DISABLED_BUTTON, true);
                }
            });
            break;
        //附件
        case constant.LIST_BUTTON.attachment:
            listOperator/* listAttachment.call */.HT.call(this, buttonClick_objectSpreadProps(buttonClick_objectSpread({}, props), {
                json: this.state.json
            }));
            break;
        //单据追溯
        case constant.LIST_BUTTON.billTrack:
            listOperator/* listBillTrack.call */.h9.call(this, buttonClick_objectSpreadProps(buttonClick_objectSpread({}, props), {
                json: this.state.json
            }));
            break;
        //审批详情
        case constant.LIST_BUTTON.approvalLink:
            listOperator/* listLinkApprove.call */.A1.call(this, buttonClick_objectSpreadProps(buttonClick_objectSpread({}, props), {
                json: this.state.json
            }));
            break;
        //提交
        case constant.LIST_BUTTON.commit:
            listOperator/* listCommit.call */.O5.call(this, buttonClick_objectSpreadProps(buttonClick_objectSpread({}, props), {
                json: this.state.json
            }));
            break;
        //收回
        case constant.LIST_BUTTON.unCommit:
            (0,listOperator/* listUnCommit */.Se)(buttonClick_objectSpreadProps(buttonClick_objectSpread({}, props), {
                json: this.state.json
            }));
            break;
        //刷新
        case constant.LIST_BUTTON.refresh:
            (0,listOperator/* listRefresh */.E2)(buttonClick_objectSpreadProps(buttonClick_objectSpread({}, props), {
                json: this.state.json
            }));
            break;
        //初始化数据
        case constant.LIST_BUTTON.setInitData:
            (0,listOperator/* initDataBefore */.nT)(buttonClick_objectSpreadProps(buttonClick_objectSpread({}, props), {
                json: this.state.json
            }));
            break;
        //打印
        case constant.LIST_BUTTON.print:
            (0,listOperator/* onPrint */.TF)(buttonClick_objectSpreadProps(buttonClick_objectSpread({}, props), {
                json: this.state.json
            }));
            break;
        //输出
        case constant.LIST_BUTTON.output:
            listOperator/* onOutput.call */.Pc.call(this, buttonClick_objectSpreadProps(buttonClick_objectSpread({}, props), {
                json: this.state.json
            }));
            break;
    }
}

;// CONCATENATED MODULE: ./src/hpf/hpfc/m0z10301/list/events/searchBtnClick.js

//点击查询，获取查询区数据
function searchBtnClick(props) {
    (0,listOperator/* listSearch */.mx)(props);
}

;// CONCATENATED MODULE: ./src/hpf/hpfc/m0z10301/list/index.js
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
    }
    render() {
        let { table , search  } = this.props;
        let { createSimpleTable  } = table;
        let { NCCreateSearch  } = search;
        let { NCUploader , BillTrack , ApprovalTrans , ApproveDetail  } = external_nc_lightapp_front_.high;
        return /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement("div", {
            className: "nc-bill-list",
            __source: {
                fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10301\\list\\index.js",
                lineNumber: 115,
                columnNumber: 13
            },
            __self: this
        }, /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement("div", {
            className: "nc-bill-header-area",
            __source: {
                fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10301\\list\\index.js",
                lineNumber: 116,
                columnNumber: 17
            },
            __self: this
        }, /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement("div", {
            className: "header-title-search-area",
            __source: {
                fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10301\\list\\index.js",
                lineNumber: 117,
                columnNumber: 21
            },
            __self: this
        }, (0,external_nc_lightapp_front_.createPageIcon)(), /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement("h2", {
            className: "title-search-detail",
            __source: {
                fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10301\\list\\index.js",
                lineNumber: 119,
                columnNumber: 25
            },
            __self: this
        }, "数据汇总规则")), /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement("div", {
            className: "header-button-area",
            __source: {
                fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10301\\list\\index.js",
                lineNumber: 122,
                columnNumber: 21
            },
            __self: this
        }, this.props.button.createButtonApp({
            area: constant.LIST.head_btn_code,
            onButtonClick: buttonClick.bind(this)
        }))), /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement("div", {
            className: "nc-bill-search-area",
            __source: {
                fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10301\\list\\index.js",
                lineNumber: 130,
                columnNumber: 17
            },
            __self: this
        }, NCCreateSearch(constant.LIST.search_id, {
            clickSearchBtn: this.clickSearchBtn,
            onAfterEvent: this.afterEvent
        })), /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement("div", {
            className: "nc-bill-table-area",
            __source: {
                fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10301\\list\\index.js",
                lineNumber: 137,
                columnNumber: 17
            },
            __self: this
        }, createSimpleTable(constant.LIST.table_id, {
            showCheck: true,
            showIndex: true,
            //显示序号
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
                fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10301\\list\\index.js",
                lineNumber: 152,
                columnNumber: 21
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
                fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10301\\list\\index.js",
                lineNumber: 165,
                columnNumber: 21
            },
            __self: this
        }), /* 指派 */ this.state.compositeDisplay && /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement(ApprovalTrans, {
            title: this.state.json['M0Z10301-000018'],
            /* 国际化处理： 指派*/ data: this.state.compositeData,
            display: this.state.compositeDisplay,
            getResult: this.getAssignUser,
            cancel: this.compositeTurnOff,
            __source: {
                fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10301\\list\\index.js",
                lineNumber: 177,
                columnNumber: 21
            },
            __self: this
        }), /*/!* 联查审批详情 *!/*/ /*{*/ /*    <ApproveDetail*/ /*        show={this.state.showApproveDetail}*/ /*        billtype={BILL_TYPE_CODE}*/ /*        billid={this.state.billId}*/ /*        close={() => {*/ /*            this.setState({*/ /*                showApproveDetail: false*/ /*            });*/ /*        }}*/ /*    />*/ /*}*/ /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement(PrintOutput, {
            ref: "printOutput",
            url: constant.REQUEST_URL.print,
            data: {
                funcode: constant.APPCODE,
                //功能节点编码
                nodekey: constant.APPCODE,
                //模板节点编码
                oids: this.state.ids,
                outputType: 'output'
            },
            __source: {
                fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10301\\list\\index.js",
                lineNumber: 199,
                columnNumber: 17
            },
            __self: this
        }));
    }
    constructor(props){
        super(props);
        list_defineProperty(this, "handlePageInfoChange", (props, config, pks)=>{
            (0,listOperator/* pageInfoClick */.YK)(list_objectSpreadProps(list_objectSpread({}, props), {
                json: this.state.json
            }), config, pks);
        });
        list_defineProperty(this, "onRowDoubleClick", (record, index, props)=>{
            (0,listOperator/* handleDoubleClick */.Oq)(record, index, list_objectSpreadProps(list_objectSpread({}, props), {
                json: this.state.json
            }));
        });
        list_defineProperty(this, "clickSearchBtn", (props)=>{
            searchBtnClick(list_objectSpreadProps(list_objectSpread({}, props), {
                json: this.state.json
            }));
        });
        list_defineProperty(this, "afterEvent", (key, value)=>{
            if (key === "idissys") {
                //目标系统单据类型添加参照过滤
                this.props.search.setTemlateByField(constant.LIST.search_id, "idissysbilltype", "queryCondition", {
                    idissys: value,
                    GridRefActionExt: 'nccloud.web.hpf.sumrulevo.refsqlbuilder.AllBillRefSqlBuilder'
                });
                this.props.search.setSearchValByField(constant.LIST.search_id, "idissysbilltype", {
                    display: "",
                    value: ""
                });
            }
            if (key === "idissysbilltype") {
                //目标系统
                let idissys = this.props.search.getSearchValByField(constant.LIST.search_id, "idissys").value.firstvalue;
                //中间表元数据添加参照过滤
                this.props.search.setTemlateByField(constant.LIST.search_id, "midmetadata", "queryCondition", {
                    idissys,
                    idissysbilltype_code: value.refcode,
                    idissysbilltype_pk: value.refpk,
                    GridRefActionExt: 'nccloud.web.hpf.sumrulevo.refsqlbuilder.MdEntityRefSqlBuilder'
                });
            }
        });
        list_defineProperty(this, "clickSelectBtn", (props, moduleId, record, index, status)=>{
            selectedEvent(props, moduleId, record, index, status);
        });
        list_defineProperty(this, "clickSelectAllBtn", (props, moduleId, status, length)=>{
            selectedAllEvent(props, moduleId, status, length);
        });
        //指派提交
        list_defineProperty(this, "getAssignUser", (value)=>{
            (0,listOperator/* listCommit */.O5)(list_objectSpreadProps(list_objectSpread({}, this.props), {
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
            billId: null
        };
        props.use.table(constant.LIST.table_id);
    }
};
List = (0,external_nc_lightapp_front_.createPage)({})(List);
/* harmony default export */ const list = (List);

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=index.25ed5dc6.js.map