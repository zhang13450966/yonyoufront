/*! @ncctag {"project":"hpf","branch":"develop-ncc1.0","provider":"suqch","date":"2023/8/30 10:51:22"} */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"), require("nc-lightapp-front"));
	else if(typeof define === 'function' && define.amd)
		define(["react", "nc-lightapp-front"], factory);
	else if(typeof exports === 'object')
		exports["hpf/hpfc/m0z10301/card/index"] = factory(require("react"), require("nc-lightapp-front"));
	else
		root["hpf/hpfc/m0z10301/card/index"] = factory(root["React"], root["nc-lightapp-front"]);
})(self, (__WEBPACK_EXTERNAL_MODULE__6487__, __WEBPACK_EXTERNAL_MODULE__5118__) => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 2582:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BILL_TYPE_CODE": () => (/* binding */ BILL_TYPE_CODE),
/* harmony export */   "CARD": () => (/* binding */ CARD),
/* harmony export */   "CARD_ADD_DISABLED_BUTTON": () => (/* binding */ CARD_ADD_DISABLED_BUTTON),
/* harmony export */   "CARD_BUTTON": () => (/* binding */ CARD_BUTTON),
/* harmony export */   "CARD_CACHE": () => (/* binding */ CARD_CACHE),
/* harmony export */   "CARD_DISABLED_BUTTON": () => (/* binding */ CARD_DISABLED_BUTTON),
/* harmony export */   "DATASOURCE": () => (/* binding */ DATASOURCE),
/* harmony export */   "FIELD": () => (/* binding */ FIELD),
/* harmony export */   "MULTILANG": () => (/* binding */ MULTILANG),
/* harmony export */   "PRIMARY_KEY": () => (/* binding */ PRIMARY_KEY),
/* harmony export */   "REQUEST_URL": () => (/* binding */ REQUEST_URL),
/* harmony export */   "STATUS": () => (/* binding */ STATUS),
/* harmony export */   "editcfg": () => (/* binding */ editcfg)
/* harmony export */ });
/* unused harmony exports APPCODE, LIST, SEARCH_CACHE, base_path, LIST_BUTTON, LIST_DISABLED_BUTTON, COLS_EDITABLE */
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

/* unused harmony exports listCreate, listRefresh, listEdit, listCopy, listCommit, listUnCommit, checkSelected, listAttachment, listBillTrack, listLinkApprove, listHeadDelete, listBodyDelete, listSearch, pageInfoClick, PromptMessage, handleDoubleClick, initDataBefore, initData, onPrint, onOutput */
/* harmony import */ var nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5118);
/* harmony import */ var nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(nc_lightapp_front__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _constant_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2582);


//列表新增
function listCreate(props) {
    props.pushTo(REQUEST_URL.toCard, {
        status: STATUS.add,
        pagecode: CARD.page_code
    });
}
//列表刷新
function listRefresh(props) {
    let { getDefData  } = cardCache;
    let queryInfo = getDefData(SEARCH_CACHE.key, SEARCH_CACHE.dataSource);
    listSearch(props, queryInfo);
}
//列表修改
function listEdit(props, pk) {
    props.pushTo(REQUEST_URL.toCard, {
        status: STATUS.edit,
        id: pk,
        pagecode: CARD.page_code
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
            let pks = selectDatas && selectDatas.map((item)=>item.data.values[PRIMARY_KEY.head_id].value);
            let pkMapTs = new Map();
            selectDatas && selectDatas.map((item)=>{
                let pk = item.data.values[PRIMARY_KEY.head_id].value;
                let ts = item.data.values[FIELD.ts] && item.data.values[FIELD.ts].value;
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
    ajax({
        url: REQUEST_URL.commit,
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
            let pks = selectDatas && selectDatas.map((item)=>item.data.values[PRIMARY_KEY.head_id].value);
            let pkMapTs = new Map();
            selectDatas && selectDatas.map((item)=>{
                let pk = item.data.values[PRIMARY_KEY.head_id].value;
                let ts = item.data.values[FIELD.ts] && item.data.values[FIELD.ts].value;
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
    ajax({
        url: REQUEST_URL.unCommit,
        data,
        success: (res)=>{
            if (res.success) {
                //成功
                listRefresh(props);
            } else {
                //失败
                toast({
                    color: STATUS.warning,
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
    let selectDatas = props.table && props.table.getCheckedRows(LIST.table_id);
    if (isCheckOne && selectDatas.length > 1) {
        toast({
            color: STATUS.warning,
            content: props.json['M0Z10301-000012']
        });
        /* 国际化处理： 请选中一行表体数据!*/ valid = false;
    } else if (selectDatas.length == 0) {
        toast({
            color: STATUS.warning,
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
        let billId = selectDatas[0] && selectDatas[0].data.values[PRIMARY_KEY.head_id].value;
        let billNo = selectDatas[0] && selectDatas[0].data.values[PRIMARY_KEY.bill_no].value;
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
        let billId = selectDatas[0] && selectDatas[0].data.values[PRIMARY_KEY.head_id].value;
        this.setState({
            showBillTrack: true,
            billTrackBillId: billId,
            billTrackBillType: BILL_TYPE_CODE
        });
    }
}
//列表审批详情
function listLinkApprove(props) {
    let select = checkSelected(props, true);
    if (select.valid) {
        let selectDatas = select.selectDatas;
        let billId = selectDatas[0] && selectDatas[0].data.values[PRIMARY_KEY.head_id].value;
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
        pks = selectDatas && selectDatas.map((item)=>item.data.values[PRIMARY_KEY.head_id].value);
        let pkMapTs = new Map();
        selectDatas && selectDatas.map((item)=>{
            let pk = item.data.values[PRIMARY_KEY.head_id].value;
            let ts = item.data.values[FIELD.ts] && item.data.values[FIELD.ts].value;
            //主键与tsMap
            if (pk && ts) {
                pkMapTs.set(pk, ts);
            }
        });
        data = {
            pks,
            pkMapTs
        };
        ajax({
            url: REQUEST_URL.delete,
            data,
            success: (res)=>{
                if (res.success) {
                    //成功
                    let allTableData = props.table.getAllTableData(LIST.table_id);
                    let allPks = allTableData.rows[0] && allTableData.rows.map((item)=>item.values[PRIMARY_KEY.head_id].value);
                    let deleteRowIndexArr = pks.map((item)=>allPks.findIndex((v)=>v == item)).filter((item)=>item != -1);
                    props.table.deleteCacheId(LIST.table_id, pks);
                    props.table.deleteTableRowsByIndex(LIST.table_id, deleteRowIndexArr);
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
    let pageInfo = props.table.getTablePageInfo(LIST.table_id);
    if (!queryInfo) {
        queryInfo = props.search.getQueryInfo(LIST.search_id);
    }
    queryInfo.pageInfo = pageInfo;
    queryInfo.pageCode = LIST.page_code;
    // 刷新按钮可用
    props.button.setDisabled({
        [LIST_BUTTON.refresh]: false
    });
    ajax({
        url: REQUEST_URL.queryList,
        data: queryInfo,
        success: (res)=>{
            let { success , data  } = res;
            if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
                props.dealFormulamsg(res.formulamsg);
            }
            if (success && data && data[LIST.table_id]) {
                props.table.setAllTableData(LIST.table_id, data[LIST.table_id]);
                toast({
                    color: STATUS.success
                });
            } else {
                props.table.setAllTableData(LIST.table_id, {
                    rows: []
                });
                toast({
                    color: STATUS.warning,
                    content: props.json['M0Z10301-000010']
                });
            }
            /* 国际化处理： 未查询出符合条件的数据！*/ // 将查询条件缓存
            let { setDefData  } = cardCache;
            setDefData(SEARCH_CACHE.key, SEARCH_CACHE.dataSource, queryInfo);
        }
    });
}
//分页查询
function pageInfoClick(props, config, pks) {
    let data = {
        pks,
        pagecode: LIST.page_code
    };
    ajax({
        url: REQUEST_URL.queryListByPks,
        data,
        success: (res)=>{
            let { success , data  } = res;
            if (success && data && data[LIST.table_id]) {
                props.table.setAllTableData(LIST.table_id, data[LIST.table_id]);
                toast({
                    color: STATUS.success
                });
            } else {
                props.table.setAllTableData(LIST.table_id, {
                    rows: []
                });
                toast({
                    color: STATUS.warning,
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
        toast({
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
        toast({
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
        toast({
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
    props.pushTo(REQUEST_URL.toCard, {
        status: STATUS.browse,
        id: record[PRIMARY_KEY.head_id].value,
        idissys: record[FIELD.idissys].value,
        idissysbilltype: record[FIELD.idissysbilltype].value,
        pagecode: CARD.page_code,
        scene: props.getUrlParam('scene')
    });
}
//初始化数据前校验
function initDataBefore(props) {
    let queryInfo = props.search.getSearchValByField(LIST.search_id, "pk_org").value.firstvalue;
    let pk_org = queryInfo.split(",");
    if (queryInfo && pk_org.length == 1) {
        ajax({
            url: REQUEST_URL.setInitDataBefore,
            data: {
                pk_org: pk_org[0]
            },
            success: (res)=>{
                if (res.data.value) {
                    initData(props, res.data.pk_org);
                } else {
                    promptBox({
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
        toast({
            color: 'danger',
            content: '请选择一个业务单元进行初始化'
        });
    }
}
//初始化数据
function initData(props, pk_org) {
    ajax({
        url: REQUEST_URL.setInitData,
        data: {
            pk_org,
            flag_clear: true
        },
        success: (res)=>{
            toast({
                content: '初始化成功'
            });
            let { getDefData  } = cardCache;
            let queryInfo = getDefData(SEARCH_CACHE.key, SEARCH_CACHE.dataSource);
            listSearch(props, queryInfo);
        }
    });
}
//打印
function onPrint(props) {
    let allData = props.table.getAllTableData(LIST.table_id);
    if (allData.rows.length === 0) {
        toast({
            color: STATUS.warning,
            content: "无可打印数据"
        });
        /* 国际化处理:*/ return;
    }
    let pks = allData.allpks;
    print('pdf', REQUEST_URL.print, {
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
    let allData = props.table.getAllTableData(LIST.table_id);
    if (allData.rows.length === 0) {
        toast({
            color: STATUS.warning,
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
  "default": () => (/* binding */ card)
});

// EXTERNAL MODULE: external {"root":"React","var":"React","commonjs":"react","commonjs2":"react","amd":"react"}
var external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_ = __webpack_require__(6487);
var external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default = /*#__PURE__*/__webpack_require__.n(external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_);
// EXTERNAL MODULE: external "nc-lightapp-front"
var external_nc_lightapp_front_ = __webpack_require__(5118);
// EXTERNAL MODULE: ./src/hpf/hpfc/m0z10301/constant/index.js
var constant = __webpack_require__(2582);
;// CONCATENATED MODULE: ./src/hpf/hpfc/m0z10301/card/events/buttonVisibilityControl.js

/**
* @description: 卡片按钮可见性
*/ function buttonVisibilityControl(props) {
    /** 
     * 此处应根据实际情况自由发挥
     * 目标就是将某个状态下的某些按钮展示或隐藏
     * 示例代码可能过于繁琐且难以理解
     * 
     * 可调用如下方法实现
     * props.button.setButtonVisible();
     * props.button.setButtonDisabled();
     * 
     * 例如
     * let btn1 = [ 编辑态下显示的按钮 ];
     * let btn2 = [ 编辑态下不显示的按钮 ];
     * 
     * props.button.setButtonVisible(btn1,true);
     * props.button.setButtonVisible(btn2,false);
     * 即可控制编辑态下的显示按钮。
    */ let buttons = props.button.getButtons();
    if (!buttons || buttons.length == 0) {
        //模板没渲染完成，暂不渲染按钮
        return;
    }
    let status = props.getUrlParam(constant.STATUS.status);
    let id = props.getUrlParam(constant.PRIMARY_KEY.id);
    let isBrowse = status === constant.STATUS.browse;
    //单据状态
    let billStatus = props.form.getFormItemsValue(constant.CARD.form_id, constant.FIELD.billStatus) && props.form.getFormItemsValue(constant.CARD.form_id, constant.FIELD.billStatus).value;
    let btnObj = {};
    //将要显示的按钮
    let showBtn = [];
    //编辑态显示按钮
    let editBtn = [
        constant.CARD_BUTTON.save,
        constant.CARD_BUTTON.saveAdd,
        constant.CARD_BUTTON.saveCommit,
        constant.CARD_BUTTON.cancel,
        constant.CARD_BUTTON.addRow,
        constant.CARD_BUTTON.deleteRow,
        constant.CARD_BUTTON.copyRows,
        constant.CARD_BUTTON.insertRow,
        constant.CARD_BUTTON.delRow,
        constant.CARD_BUTTON.copyRow,
        constant.CARD_BUTTON.pasteHere,
        constant.CARD_BUTTON.expand
    ];
    //联查按钮
    let unionBtn = [
        constant.CARD_BUTTON.billTrack,
        constant.CARD_BUTTON.approvalLink
    ];
    //获得所有的按钮的编码（不包括按钮组下的按钮）
    let parentButtons = buttons.map((item)=>item.key);
    //(有重复的按钮编码，但无妨)
    let allBtns = [
        ...parentButtons,
        ...editBtn,
        ...unionBtn,
        constant.CARD_BUTTON.create,
        constant.CARD_BUTTON.update,
        constant.CARD_BUTTON["delete"],
        constant.CARD_BUTTON.copy,
        constant.CARD_BUTTON.output
    ];
    if (!isBrowse) {
        //编辑态
        showBtn = editBtn;
    } else {
        //浏览态
        if (!id) {
            //点击新增然后点击取消后
            showBtn = [
                constant.CARD_BUTTON.create
            ];
        } else {
            //单据浏览态
            let commonBtn = [
                constant.CARD_BUTTON.create,
                constant.CARD_BUTTON.copy,
                constant.CARD_BUTTON.attachment,
                ...unionBtn,
                constant.CARD_BUTTON.print,
                constant.CARD_BUTTON.output,
                constant.CARD_BUTTON.refresh,
                constant.CARD_BUTTON.fold,
                constant.CARD_BUTTON.unfold
            ];
            switch(billStatus){
                case constant.STATUS.NOSTATE:
                    showBtn = [
                        constant.CARD_BUTTON.update,
                        constant.CARD_BUTTON["delete"],
                        constant.CARD_BUTTON.commit,
                        ...commonBtn
                    ];
                    break;
                case constant.STATUS.PASSING:
                case constant.STATUS.COMMIT:
                case constant.STATUS.GOINGON:
                    showBtn = [
                        constant.CARD_BUTTON.unCommit,
                        ...commonBtn
                    ];
                    break;
                default:
                    showBtn = [
                        ...commonBtn
                    ];
                    break;
            }
        }
    }
    for (let item of allBtns){
        btnObj[item] = showBtn.includes(item);
    }
    //控制按钮显示与否
    props.button.setButtonVisible(btnObj);
    //设置按钮禁用
    //props.button.setButtonDisabled(CARD_DISABLED_BUTTON, true);
    props.button.setButtonDisabled(constant.CARD_BUTTON.save, false);
    props.button.setButtonDisabled(constant.CARD_BUTTON.addRow, false);
    props.button.setButtonDisabled(constant.CARD_BUTTON.deleteRow, false);
    //设置卡片状态
    props.cardTable.setStatus(constant.CARD.table_code, isBrowse ? constant.STATUS.browse : constant.STATUS.edit);
    if (!isBrowse) {
        let idissys = props.getUrlParam('idissys');
        //目标系统
        let idissysbilltype = props.getUrlParam('idissysbilltype');
        //目标系统单据类型
        if (idissys == 8) {
            if (constant.editcfg.has(idissysbilltype)) {
                let indexs = [];
                if (idissysbilltype == 'CP04') {
                    //收入单据(项目成本)
                    props.cardTable.getAllRows('card_body').forEach((item, index)=>{
                        if (constant.editcfg.get(idissysbilltype).indexOf(item.values.fieldcode.value) > -1) {
                            indexs.push(index);
                        }
                    });
                    props.cardTable.setEditableByIndex('card_body', indexs, [
                        'fieldcode',
                        'fieldname',
                        'ifchange',
                        'ifgroup'
                    ], false);
                } else {
                    props.cardTable.getAllRows('card_body').forEach((item, index)=>{
                        if (constant.editcfg.get(idissysbilltype).indexOf(item.values.fieldcode.value) > -1) {
                            indexs.push(index);
                        }
                    });
                    props.cardTable.setEditableByIndex('card_body', indexs, [
                        'ifchange'
                    ], false);
                }
            }
        }
    }
    props.form.setFormStatus(constant.CARD.form_id, status);
}

// EXTERNAL MODULE: ./src/hpf/hpfc/m0z10301/list/events/listOperator.js
var listOperator = __webpack_require__(1924);
;// CONCATENATED MODULE: ./src/hpf/hpfc/m0z10301/card/events/bodyButtonClick.js


/**
* @description: 表体按钮点击事件
* @param: key 当前触发按钮名称
* @param: index 当前行序
* @param: record 当前行信息
*/ function bodyButtonClick(props, key, text, record, index) {
    let rowno;
    switch(key){
        //肩 新增
        case constant.CARD_BUTTON.addRow:
            //自动填充行号
            rowno = getRowNo(props);
            props.cardTable.addRow(constant.CARD.table_code, -1, {
                rowno: {
                    display: rowno.toString(),
                    value: rowno.toString()
                }
            });
            break;
        //肩 删除
        case constant.CARD_BUTTON.deleteRow:
            let checkedRows = props.cardTable.getCheckedRows(constant.CARD.table_code);
            let checkedIndex = checkedRows && checkedRows.map((item)=>item.index);
            if (checkedRows.length > 0) {
                props.cardTable.delRowsByIndex(constant.CARD.table_code, checkedIndex);
                props.button.setButtonDisabled(constant.CARD_DISABLED_BUTTON, true);
            }
            break;
        //行 展开
        case constant.CARD_BUTTON.expand:
            props.cardTable.openTabModel(constant.CARD.table_code, constant.STATUS.edit, record, index);
            break;
        //行 展开（浏览态）
        case constant.CARD_BUTTON.unfold:
        //行 收起
        case constant.CARD_BUTTON.fold:
            props.cardTable.toggleTabRowView(constant.CARD.table_code, record);
            break;
        //行 插行
        case constant.CARD_BUTTON.insertRow:
            //自动填充行号
            rowno = getRowNo(props);
            props.cardTable.addRow(constant.CARD.table_code, index, {
                rowno: {
                    display: rowno.toString(),
                    value: rowno.toString()
                }
            });
            break;
        //行 删行
        case constant.CARD_BUTTON.delRow:
            props.cardTable.delRowsByIndex(constant.CARD.table_code, index);
            break;
        //行 复制行
        case constant.CARD_BUTTON.copyRow:
            props.cardTable.pasteRow(constant.CARD.table_code, index, [
                constant.PRIMARY_KEY.body_id
            ]);
            break;
        //肩 复制行
        case constant.CARD_BUTTON.copyRows:
            copyControl.call(this, props, true);
            break;
        //肩 取消复制
        case constant.CARD_BUTTON.pasteCancel:
            copyControl.call(this, props, false);
            break;
        //肩 粘贴至末行
        case constant.CARD_BUTTON.pasteTail:
            let lastIndex = props.cardTable.getNumberOfRows(constant.CARD.table_code);
            props.cardTable.insertRowsAfterIndex(constant.CARD.table_code, getPasteRows(props), lastIndex);
            copyControl.call(this, props, false);
            props.cardTable.selectAllRows(constant.CARD.table_code, false);
            break;
        //行 粘贴至此
        case constant.CARD_BUTTON.pasteHere:
            props.cardTable.insertRowsAfterIndex(constant.CARD.table_code, getPasteRows(props), index);
            copyControl.call(this, props, false);
            props.cardTable.selectAllRows(constant.CARD.table_code, false);
            break;
    }
    if (![
        constant.CARD_BUTTON.unfold,
        constant.CARD_BUTTON.fold
    ].includes(key)) {
        props.cardTable.setStatus(constant.CARD.table_code, constant.STATUS.edit);
    }
}
//获取行号
function getRowNo(props) {
    //自动填充行号
    let rows = props.cardTable.getAllRows(constant.CARD.table_code);
    let maxRowNo = 0;
    rows.forEach((row)=>{
        if (row.values.rowno.value && parseInt(row.values.rowno.value) > maxRowNo) {
            maxRowNo = parseInt(row.values.rowno.value);
        }
    });
    maxRowNo += 10;
    return maxRowNo;
}
//复制时的状态控制
function copyControl(props, flag) {
    //肩部按钮显示控制
    props.button.setButtonVisible({
        [constant.CARD_BUTTON.addRow]: !flag,
        [constant.CARD_BUTTON.deleteRow]: !flag,
        [constant.CARD_BUTTON.copyRows]: !flag,
        [constant.CARD_BUTTON.pasteTail]: flag,
        [constant.CARD_BUTTON.pasteCancel]: flag
    });
    props.cardTable.setAllCheckboxAble(constant.CARD.table_code, !flag);
    this.setState({
        isPaste: flag
    });
}
/**
 * 获取粘贴行数据
 *
 * @returns 返回粘贴行数据
 */ function getPasteRows(props) {
    let checkedRows = props.cardTable.getCheckedRows(constant.CARD.table_code);
    let selectRowCopy = (0,external_nc_lightapp_front_.deepClone)(checkedRows);
    let selectArr = selectRowCopy.map((item)=>{
        item.data.selected = false;
        item.data.values[constant.PRIMARY_KEY.head_id] ? item.data.values[constant.PRIMARY_KEY.head_id].value = null : null;
        item.data.values[constant.PRIMARY_KEY.body_id] ? item.data.values[constant.PRIMARY_KEY.body_id].value = null : null;
        return item.data;
    });
    return selectArr;
}

;// CONCATENATED MODULE: ./src/hpf/hpfc/m0z10301/card/events/afterHeadEvent.js




/**
 * @description: 表头编辑后事件
 * @param: moduleId 区域编码
 * @param: key 当前字段编码
 */ function afterHeadEvent(props, moduleId, key, value, oldValue) {
    if (key === constant.FIELD.org) {
        props.resMetaAfterPkorgEdit();
        //选择主组织以后，恢复其他字段的编辑性
        props.button.setButtonDisabled(constant.CARD_ADD_DISABLED_BUTTON, false);
        //恢复增行编辑性
        props.cardTable.setAllCheckboxAble(constant.CARD.table_code, true);
        if (oldValue.value && value.value != oldValue.value) {
            //更改业务单元时提示会清空表体
            (0,external_nc_lightapp_front_.promptBox)({
                color: 'info',
                title: '确认修改',
                content: `是否修改业务单元，这样会清空您录入的信息？`,
                noFooter: false,
                noCancelBtn: false,
                beSureBtnName: '是',
                cancelBtnName: '否',
                hasCloseBtn: false,
                beSureBtnClick: ()=>{
                    //清空目标系统，目标系统单据类型，中间表元数据
                    props.form.setFormItemsValue(constant.CARD.form_id, {
                        idissys: {
                            value: null,
                            display: null
                        },
                        idissysbilltype: {
                            value: null,
                            display: null
                        },
                        midmetadata: {
                            value: null,
                            display: null
                        }
                    });
                    //清空表格数据
                    clearTable(props);
                },
                cancelBtnClick: ()=>{
                    //业务单元重新赋值变更前的值
                    props.form.setFormItemsValue(constant.CARD.form_id, {
                        pk_org: {
                            value: oldValue.value,
                            display: oldValue.display
                        }
                    });
                },
                closeByClickBackDrop: false
            });
        }
    }
    if (key == "idissys") {
        if (value.value && value.value != oldValue.value) {
            //清空目标系统单据类型，中间表元数据
            props.form.setFormItemsValue(constant.CARD.form_id, {
                idissysbilltype: {
                    value: null,
                    display: null
                },
                midmetadata: {
                    value: null,
                    display: null
                }
            });
            //清空表格数据
            clearTable(props);
        }
    }
    if (key == "idissysbilltype") {
        if (value.value && value.value != oldValue.value) {
            //清空中间表元数据
            props.form.setFormItemsValue(constant.CARD.form_id, {
                midmetadata: {
                    value: null,
                    display: null
                }
            });
            //清空表格数据
            clearTable(props);
        }
    }
    if (key == "midmetadata") {
        if (value.value && value.value != oldValue.value) {
            //显示遮罩
            this.setState({
                showLoading: true
            });
            let tableid = value.values.defaulttablename.value;
            //成本-收入数据采集-隐藏“是否转换”列
            hideTableCol(props);
            //清空表格数据
            clearTable(props);
            //填充选择的元数据字段
            (0,external_nc_lightapp_front_.ajax)({
                url: constant.REQUEST_URL.queryColumn,
                data: {
                    tableid: tableid
                },
                success: (res)=>{
                    let rowno = getRowNo(props);
                    let gridData = [];
                    res.data.forEach((data)=>{
                        gridData.push({
                            values: {
                                rowno: {
                                    display: rowno,
                                    value: rowno.toString()
                                },
                                //行号
                                fieldid: {
                                    display: data.fieldid,
                                    value: data.fieldid
                                },
                                //字段id
                                fieldcode: {
                                    display: data.fieldcode,
                                    value: data.fieldcode
                                },
                                //字段编码
                                fieldname: {
                                    display: data.fieldname,
                                    value: data.fieldname
                                }
                            }
                        });
                        //字段名称
                        rowno += 10;
                    });
                    props.cardTable.insertRowsAfterIndex(constant.CARD.table_code, gridData, -1);
                    //关闭遮罩
                    this.setState({
                        showLoading: false
                    });
                },
                error: (error)=>{
                    console.log(error);
                    //关闭遮罩
                    this.setState({
                        showLoading: false
                    });
                }
            });
        }
    }
}
/**
 * 清空表格数据
 * */ function clearTable(props) {
    let rows = props.cardTable.getAllRows(constant.CARD.table_code);
    rows.forEach((row)=>{
        props.cardTable.delRowByRowId(constant.CARD.table_code, row.rowid);
    });
}
function hideTableCol(props) {
    let [idissys, idissysbilltype] = props.form.getFormItemsValue(constant.CARD.form_id, [
        constant.FIELD.idissys,
        constant.FIELD.idissysbilltype
    ]);
    //目标系统
    let meta = props.meta.getMeta();
    meta[constant.CARD.table_code].items.map((item, key)=>{
        if (item.attrcode == 'ifchange') {
            if (idissys.value == '8' && idissysbilltype.refcode == 'CO12') {
                item.visible = false;
            } else {
                item.visible = true;
            }
        }
        return item;
    });
    props.meta.setMeta(meta);
}

;// CONCATENATED MODULE: ./src/hpf/hpfc/m0z10301/card/events/cardOperator.js




let { updateCache , addCache , getNextId , deleteCacheById , getCacheById , getCurrentLastId  } = external_nc_lightapp_front_.cardCache;
//卡片返回
function cardBack(props) {
    props.pushTo(constant.REQUEST_URL.toList, {});
}
//卡片新增
function cardCreate(props) {
    props.setUrlParam({
        status: constant.STATUS.add
    });
    //单据有主组织，新增时,将其他字段设置为不可编辑
    props.initMetaByPkorg();
    props.button.setButtonDisabled(constant.CARD_ADD_DISABLED_BUTTON, true);
    props.cardTable.setAllCheckboxAble(constant.CARD.table_code, false);
    clearAll(props);
    setByStatus(props);
    let { getDefData  } = external_nc_lightapp_front_.cardCache;
    let context = getDefData(constant.CARD_CACHE.key, constant.CARD_CACHE.dataSource);
    if (context) {
        let { pk_org , org_Name  } = context;
        props.form.setFormItemsValue(constant.CARD.form_id, {
            [constant.FIELD.org]: {
                value: pk_org,
                display: org_Name
            }
        });
        afterHeadEvent(props, constant.CARD.form_id, constant.FIELD.org, {
            display: org_Name,
            value: pk_org
        }, {
            display: null,
            value: null
        });
    }
    //新增时赋值创建人，创建时间
    let userName = window.parent.GETBUSINESSINFO().userName;
    let userId = window.parent.GETBUSINESSINFO().userId;
    let now = getNowDateTime();
    props.form.setFormItemsValue(constant.CARD.form_id, {
        creator: {
            value: userId,
            display: userName
        },
        creationtime: {
            display: now,
            value: now
        }
    });
}
/**
 * 获取当前时间
 * */ function getNowDateTime() {
    let now = new Date();
    return `${now.getFullYear()}-${now.getMonth() + 1 < 10 ? `0${now.getMonth() + 1}` : now.getMonth() + 1}-${now.getDate() < 10 ? `0${now.getDate()}` : now.getDate()} ${now.getHours() < 10 ? `0${now.getHours()}` : now.getHours()}:${now.getMinutes() < 10 ? `0${now.getMinutes()}` : now.getMinutes()}:${now.getSeconds() < 10 ? `0${now.getSeconds()}` : now.getSeconds()}`;
}
/**
 * 根据状态设置卡片
 * @param {*} status
 */ function setByStatus(props) {
    buttonVisibilityControl(props);
    let status = props.getUrlParam(constant.STATUS.status);
    //设置单据编号
    props.BillHeadInfo.setBillHeadInfoVisible({
        showBackBtn: status === constant.STATUS.browse,
        showBillCode: false,
        billCode: props.form.getFormItemsValue(constant.CARD.form_id, constant.PRIMARY_KEY.bill_no) && props.form.getFormItemsValue(constant.CARD.form_id, constant.PRIMARY_KEY.bill_no).value
    });
    if (status !== constant.STATUS.add) {
        props.resMetaAfterPkorgEdit();
    }
}
//选择主组织以后，恢复其他字段的编辑性
/**
 * 组织多版本视图
 * @param {*} props
 * @param {*} headCode
 */ function orgVersionView(props) {
    let status = props.getUrlParam(STATUS.status);
    //浏览态显示组织版本，编辑态显示组织
    let showflag = status == STATUS.browse;
    let obj = {};
    obj[FIELD.org] = !showflag;
    props.form.setFormItemsVisible(CARD.form_id, obj);
}
//清空表头表体数据
function clearAll(props) {
    props.form.EmptyAllFormValue(constant.CARD.form_id);
    props.cardTable.setTableData(constant.CARD.table_code, {
        rows: []
    });
}
//复制时清空数据
function copyClear(props) {
    if (props.getUrlParam('isCopy')) {
        props.form.setFormItemsValue(constant.CARD.form_id, {
            [constant.PRIMARY_KEY.head_id]: {
                value: null,
                display: null
            },
            [constant.PRIMARY_KEY.bill_no]: {
                value: null,
                display: null
            },
            [constant.FIELD.billStatus]: {
                value: constant.STATUS.NOSTATE,
                display: '自由'
            }
        });
        props.cardTable.setColValue(constant.CARD.table_code, constant.PRIMARY_KEY.head_id, {
            value: null,
            display: null
        });
        props.cardTable.setColValue(constant.CARD.table_code, constant.PRIMARY_KEY.body_id, {
            value: null,
            display: null
        });
        let num = props.cardTable.getNumberOfRows(constant.CARD.table_code, false);
        let updateArray = [];
        for(let i = 0; i < num; i++){
            updateArray.push({
                index: i,
                status: '2'
            });
        }
        //新增态
        props.cardTable.setRowStatusByIndexs(constant.CARD.table_code, updateArray);
        props.setUrlParam({
            id: null,
            isCopy: false,
            status: constant.STATUS.add
        });
    }
}
//卡片保存
function cardSave(props) {
    return new Promise((resolve, rejected)=>{
        let flag = props.form.isCheckNow(constant.CARD.form_id) && props.cardTable.checkTableRequired(constant.CARD.table_code);
        if (flag) {
            let data = props.createMasterChildData(constant.CARD.page_code, constant.CARD.form_id, constant.CARD.table_code, 'cardTable');
            props.validateToSave(data, ()=>{
                let status = props.getUrlParam(constant.STATUS.status);
                (0,external_nc_lightapp_front_.ajax)({
                    url: constant.REQUEST_URL.save,
                    data,
                    success: (res)=>{
                        let { success , data  } = res;
                        if (success) {
                            (0,external_nc_lightapp_front_.toast)({
                                color: constant.STATUS.success,
                                content: props.json['M0Z10301-000004']
                            });
                            /* 国际化处理： 保存成功*/ if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
                                props.dealFormulamsg(res.formulamsg);
                            }
                            let id = null;
                            if (res.data) {
                                if (res.data.head && res.data.head[constant.CARD.form_id]) {
                                    id = res.data.head[constant.CARD.form_id].rows[0].values[constant.PRIMARY_KEY.head_id].value;
                                    props.form.setAllFormValue({
                                        [constant.CARD.form_id]: res.data.head[constant.CARD.form_id]
                                    });
                                }
                                if (res.data.body && res.data.body[constant.CARD.table_code]) {
                                    props.cardTable.setTableData(constant.CARD.table_code, res.data.body[constant.CARD.table_code]);
                                }
                            }
                            props.setUrlParam({
                                id,
                                status: constant.STATUS.browse
                            });
                            // 缓存
                            if (status === constant.STATUS.add) {
                                addCache(id, data, constant.CARD.form_id, constant.DATASOURCE);
                            } else {
                                updateCache(constant.PRIMARY_KEY.head_id, id, data, constant.CARD.form_id, constant.DATASOURCE);
                            }
                            setByStatus(props);
                            resolve(true);
                        }
                    }
                });
            }, {
                [constant.CARD.table_code]: 'cardTable'
            });
        }
    });
}
//卡片修改
function cardUpdate(props) {
    props.setUrlParam({
        status: constant.STATUS.edit
    });
    setByStatus(props);
    //修改时时赋值修改人，修改时间
    let userName = window.parent.GETBUSINESSINFO().userName;
    let userId = window.parent.GETBUSINESSINFO().userId;
    let now = getNowDateTime();
    props.form.setFormItemsValue(constant.CARD.form_id, {
        modifier: {
            value: userId,
            display: userName
        },
        modifiedtime: {
            display: now,
            value: now
        }
    });
}
//卡片修改
function cardCopy(props) {
    props.setUrlParam({
        isCopy: true
    });
    copyClear(props);
    setByStatus(props);
}
//卡片删除
function cardDelete(props) {
    let pk = props.form.getFormItemsValue(constant.CARD.form_id, constant.PRIMARY_KEY.head_id).value || props.getUrlParam(constant.PRIMARY_KEY.id);
    let ts = props.form.getFormItemsValue(constant.CARD.form_id, constant.FIELD.ts) && props.form.getFormItemsValue(constant.CARD.form_id, constant.FIELD.ts).value;
    let pkMapTs = new Map();
    //主键与tsMap
    if (pk && ts) {
        pkMapTs.set(pk, ts);
    }
    let data = {
        pks: [
            pk
        ],
        pkMapTs
    };
    (0,external_nc_lightapp_front_.ajax)({
        url: constant.REQUEST_URL["delete"],
        data,
        success: (res)=>{
            if (res.success) {
                (0,external_nc_lightapp_front_.toast)({
                    color: constant.STATUS.success,
                    content: props.json['M0Z10301-000005']
                });
                /* 国际化处理： 删除成功*/ // 获取下一条数据的id
                let nextId = getNextId(pk, constant.DATASOURCE);
                //删除缓存
                deleteCacheById(constant.PRIMARY_KEY.head_id, pk, constant.DATASOURCE);
                let lastId = nextId || null;
                props.setUrlParam({
                    status: constant.STATUS.browse,
                    id: lastId
                });
                if (lastId) {
                    getCardData(props, lastId);
                } else {
                    // 删除的是最后一个的操作
                    clearAll(props);
                    setByStatus(props);
                }
            }
        }
    });
}
/**
 * 卡片详情
 * @param {*} id         单据id
 * @param {*} isRefresh  是否刷新按钮，是的话不取缓存数据，直接调取接口，并addCache, 默认否
 */ function getCardData(props, id, isRefresh = false, callBack) {
    clearAll(props);
    if (!isRefresh) {
        let cardData = getCacheById(id, constant.DATASOURCE);
        if (cardData) {
            //有缓存
            cardData.head && props.form.setAllFormValue({
                [constant.CARD.form_id]: cardData.head[constant.CARD.form_id]
            });
            //成本档案对照特殊处理 add by suqc
            showHideColsCtrl(props, cardData.head[constant.CARD.form_id]);
            cardData.body && props.cardTable.setTableData(constant.CARD.table_code, cardData.body[constant.CARD.table_code]);
            setByStatus(props);
            return;
        }
    }
    (0,external_nc_lightapp_front_.ajax)({
        url: constant.REQUEST_URL.queryCard,
        data: {
            pk: id,
            pagecode: constant.CARD.page_code
        },
        success: (res)=>{
            let { success , data  } = res;
            if (success) {
                if (data && data.head) {
                    props.form.setAllFormValue({
                        [constant.CARD.form_id]: data.head[constant.CARD.form_id]
                    });
                    //成本档案对照特殊处理 add by suqc
                    showHideColsCtrl(props, data.head[constant.CARD.form_id]);
                }
                if (data && data.body) {
                    //回显字段编码
                    data.body[constant.CARD.table_code].rows.forEach((item)=>{
                        item.values.fieldcode.display = item.values.fieldcode.value;
                    });
                    props.cardTable.setTableData(constant.CARD.table_code, data.body[constant.CARD.table_code]);
                }
                // 更新缓存
                updateCache(constant.PRIMARY_KEY.head_id, id, data, constant.CARD.form_id, constant.DATASOURCE);
                callBack && callBack(props);
                setByStatus(props);
            }
        },
        error: (res)=>{
            (0,external_nc_lightapp_front_.toast)({
                color: constant.STATUS.danger,
                content: res.message
            });
            clearAll(props);
            setByStatus(props);
        }
    });
}
function showHideColsCtrl(props, head) {
    if (head.rows && head.rows.length > 0) {
        let idissys = head.rows[0].values.idissys.value;
        let idissysbilltype = head.rows[0].values.idissysbilltype.value;
        let meta = props.meta.getMeta();
        meta[constant.CARD.table_code].items.map((item, key)=>{
            if (item.attrcode == 'ifchange') {
                if (idissys == 8 && idissysbilltype == '0001ZZZZ5C204CC569DD') {
                    item.visible = false;
                } else {
                    item.visible = true;
                }
            }
            return item;
        });
        props.meta.setMeta(meta);
    }
}
//卡片取消
function cardCancel(props) {
    let id = props.getUrlParam(constant.PRIMARY_KEY.id);
    props.setUrlParam({
        status: constant.STATUS.browse
    });
    if (id) {
        //有id切换编辑态
        props.form.cancel(constant.CARD.form_id);
        props.cardTable.resetTableData(constant.CARD.table_code);
        getCardData(props, id);
    } else {
        //没有id查缓存中最后一条数据
        let currentLastId = getCurrentLastId(constant.DATASOURCE);
        let lastId = currentLastId || null;
        props.setUrlParam({
            id: lastId
        });
        if (lastId) {
            getCardData(props, lastId);
        } else {
            clearAll(props);
            setByStatus(props);
        }
    }
}
//卡片刷新
function cardRefresh(props) {
    let id = props.getUrlParam(constant.PRIMARY_KEY.id);
    getCardData(props, id, true);
}
/**
 * 卡片分页
 * @param {*} props  页面内置对象
 * @param {*} pk    下一页的pk
 */ function pageClick(props, id) {
    props.setUrlParam({
        status: constant.STATUS.browse,
        id
    });
    getCardData(props, id);
}
//卡片附件
function cardAttachment(props) {
    let billId = props.form.getFormItemsValue(constant.CARD.form_id, constant.PRIMARY_KEY.head_id) && props.form.getFormItemsValue(constant.CARD.form_id, constant.PRIMARY_KEY.head_id).value;
    let billNo = props.form.getFormItemsValue(constant.CARD.form_id, constant.PRIMARY_KEY.bill_no) && props.form.getFormItemsValue(constant.CARD.form_id, constant.PRIMARY_KEY.bill_no).value;
    this.setState({
        showUploader: !this.state.showUploader,
        billInfo: {
            billId,
            billNo
        }
    });
}
//卡片单据追溯
function cardBillTrack(props) {
    let billId = props.form.getFormItemsValue(constant.CARD.form_id, constant.PRIMARY_KEY.head_id) && props.form.getFormItemsValue(constant.CARD.form_id, constant.PRIMARY_KEY.head_id).value;
    this.setState({
        showBillTrack: true,
        billTrackBillId: billId,
        billTrackBillType: constant.BILL_TYPE_CODE
    });
}
//卡片联查审批详情
function cardLinkApprove(props) {
    let billId = props.form.getFormItemsValue(constant.CARD.form_id, constant.PRIMARY_KEY.head_id) && props.form.getFormItemsValue(constant.CARD.form_id, constant.PRIMARY_KEY.head_id).value;
    this.setState({
        showApproveDetail: true,
        billId
    });
}
//卡片提交
function cardCommit(props, data) {
    if (!data) {
        let pk = props.form.getFormItemsValue(constant.CARD.form_id, constant.PRIMARY_KEY.head_id) && props.form.getFormItemsValue(constant.CARD.form_id, constant.PRIMARY_KEY.head_id).value;
        let ts = props.form.getFormItemsValue(constant.CARD.form_id, constant.FIELD.ts) && props.form.getFormItemsValue(constant.CARD.form_id, constant.FIELD.ts).value;
        let pkMapTs = new Map();
        //主键与tsMap
        if (pk && ts) {
            pkMapTs.set(pk, ts);
        }
        data = {
            pks: [
                pk
            ],
            pkMapTs
        };
    }
    (0,external_nc_lightapp_front_.ajax)({
        url: constant.REQUEST_URL.commit,
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
                } else {
                    cardRefresh(props);
                }
            } else {
                //失败
                (0,external_nc_lightapp_front_.toast)({
                    color: constant.STATUS.warning,
                    content: props.json['M0Z10301-000015']
                });
            }
        }
    });
}
/* 国际化处理： 提交失败*/ //卡片收回
function cardUnCommit(props) {
    let pk = props.form.getFormItemsValue(constant.CARD.form_id, constant.PRIMARY_KEY.head_id) && props.form.getFormItemsValue(constant.CARD.form_id, constant.PRIMARY_KEY.head_id).value;
    let ts = props.form.getFormItemsValue(constant.CARD.form_id, constant.FIELD.ts) && props.form.getFormItemsValue(constant.CARD.form_id, constant.FIELD.ts).value;
    let pkMapTs = new Map();
    //主键与tsMap
    if (pk && ts) {
        pkMapTs.set(pk, ts);
    }
    let data = {
        pks: [
            pk
        ],
        pkMapTs
    };
    (0,external_nc_lightapp_front_.ajax)({
        url: constant.REQUEST_URL.unCommit,
        data,
        success: (res)=>{
            if (res.success) {
                //成功
                cardRefresh(props);
            } else {
                //失败
                (0,external_nc_lightapp_front_.toast)({
                    color: constant.STATUS.warning,
                    content: props.json['M0Z10301-000017']
                });
            }
        }
    });
} /* 国际化处理： 收回失败*/ 

;// CONCATENATED MODULE: ./src/hpf/hpfc/m0z10301/card/events/initTemplate.js






/**
 * @description: 卡片模板渲染
 */ function initTemplate(props) {
    props.createUIDom({}, (data)=>{
        if (data) {
            if (data.button) {
                let button = data.button;
                props.button.setButtons(button);
                buttonVisibilityControl(props);
            }
            if (data.template) {
                let meta = data.template;
                meta = modifierMeta.call(this, props, meta);
                props.meta.setMeta(meta, ()=>{
                    let status = this.props.getUrlParam(constant.STATUS.status);
                    let id = this.props.getUrlParam(constant.PRIMARY_KEY.id);
                    if (status === constant.STATUS.add) {
                        //新增
                        cardCreate(this.props);
                    } else if (id) {
                        getCardData(this.props, id, false, copyClear);
                    }
                });
            }
            if (data.context && data.context.pk_org) {
                if (props.getUrlParam(constant.STATUS.status) === constant.STATUS.add) {
                    //设置默认组织
                    let { pk_org , org_Name  } = data.context;
                    props.form.setFormItemsValue(constant.CARD.form_id, {
                        [constant.FIELD.org]: {
                            value: pk_org,
                            display: org_Name
                        }
                    });
                    afterHeadEvent(props, constant.CARD.form_id, constant.FIELD.org, {
                        display: org_Name,
                        value: pk_org
                    }, {
                        display: null,
                        value: null
                    });
                }
                // 将组织信息缓存
                let { setDefData  } = external_nc_lightapp_front_.cardCache;
                setDefData(constant.CARD_CACHE.key, constant.CARD_CACHE.dataSource, data.context);
            }
        }
    });
}
//表体统一参照过滤
/*
                props.cardTable.setQueryCondition(CARD.table_code, {
                        department: () => {
                                return {
                                        pk_org: props.form.getFormItemsValue(CARD.form_id, FIELD.org).value
                                };
                        }
                });
                */ function modifierMeta(props, meta) {
    //表头参照过滤
    meta[constant.CARD.form_id].items.map((item)=>{
        if (item.attrcode === constant.FIELD.org) {
            //财务组织
            item.queryCondition = ()=>({
                    funcode: props.getSearchParam('c')
                });
        }
    });
    //appcode获取
    //设置动态列展示 suqc    成本管理-收入数据采集 隐藏“是否转换”列
    let idissys = this.props.getUrlParam(constant.FIELD.idissys);
    //目标系统
    let idissysbilltype = this.props.getUrlParam(constant.FIELD.idissysbilltype);
    //目标系统单据类型
    if (idissys == 8 && idissysbilltype == '0001ZZZZ5C204CC569DD') {
        //收入数据采集
        meta[constant.CARD.table_code].items.map((item, key)=>{
            if (item.attrcode == 'ifchange') {
                //隐藏“是否转换”列
                item.visible = false;
            }
            return item;
        });
    }
    // for (let item of Object.keys(meta.gridrelation)) {
    //     meta[item].items.push({
    //         attrcode: 'opr',
    //         label: this.state.json['M0Z10301-000006'],/* 国际化处理： 操作*/
    //         itemtype: 'customer',
    //         fixed: 'right',
    //         className: 'table-opr',
    //         visible: true,
    //         width: 200,
    //         render: (text, record, index) => {
    //             let status = props.getUrlParam(STATUS.status);
    //             let buttonAry = [];
    //             if (status === STATUS.browse) { //浏览态
    //                 buttonAry = [record.expandRowStatus ? CARD_BUTTON.fold : CARD_BUTTON.unfold];
    //             } else { //编辑态
    //                 buttonAry = this.state.isPaste ? [CARD_BUTTON.pasteHere] : [CARD_BUTTON.insertRow, CARD_BUTTON.delRow, CARD_BUTTON.copyRow];
    //             }
    //             return props.button.createOprationButton(buttonAry, {
    //                 area: CARD.body_btn_code,
    //                 buttonLimit: 4,
    //                 onButtonClick: (props, key) => bodyButtonClick.call(this, props, key, text, record, index)
    //             });
    //         }
    //     })
    // }
    return meta;
}

;// CONCATENATED MODULE: ./src/hpf/hpfc/m0z10301/card/events/buttonClick.js
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



/**
* @description: 卡片页头部按钮操作
* @param: isFromSide 是否来自侧拉区域
* @param: id 当前按钮名
*/ function buttonClick(props, id, hotkey, isFromSide) {
    switch(id){
        //返回
        case constant.CARD_BUTTON.back:
            cardBack(props);
            break;
        //头部 新增
        case constant.CARD_BUTTON.create:
            cardCreate(props);
            break;
        //头部 保存
        case constant.CARD_BUTTON.save:
            cardSave(_objectSpreadProps(_objectSpread({}, props), {
                json: this.state.json
            })).then(()=>{
                if (isFromSide) {
                    props.cardTable.closeModel(constant.CARD.table_code);
                }
                cardRefresh(props);
            });
            break;
        //头部 保存新增
        case constant.CARD_BUTTON.saveAdd:
            cardSave(_objectSpreadProps(_objectSpread({}, props), {
                json: this.state.json
            })).then((flag)=>{
                if (flag) {
                    cardCreate(props);
                }
            });
            break;
        //头部 保存提交
        case constant.CARD_BUTTON.saveCommit:
            cardSave(_objectSpreadProps(_objectSpread({}, props), {
                json: this.state.json
            })).then((flag)=>{
                if (flag) {
                    cardCommit.call(this, _objectSpreadProps(_objectSpread({}, props), {
                        json: this.state.json
                    }));
                }
            });
            break;
        //头部 修改
        case constant.CARD_BUTTON.update:
            cardUpdate(props);
            break;
        //头部 复制
        case constant.CARD_BUTTON.copy:
            cardCopy(props);
            break;
        //头部 删除
        case constant.CARD_BUTTON["delete"]:
            (0,external_nc_lightapp_front_.promptBox)({
                color: constant.STATUS.warning,
                title: this.state.json['M0Z10301-000000'],
                /* 国际化处理： 删除*/ content: this.state.json['M0Z10301-000001'],
                /* 国际化处理： 确定删除吗？*/ beSureBtnClick: ()=>{
                    cardDelete(_objectSpreadProps(_objectSpread({}, props), {
                        json: this.state.json
                    }));
                }
            });
            break;
        // 头部 取消
        case constant.CARD_BUTTON.cancel:
            (0,external_nc_lightapp_front_.promptBox)({
                color: constant.STATUS.warning,
                title: this.state.json['M0Z10301-000002'],
                /* 国际化处理： 取消*/ content: this.state.json['M0Z10301-000003'],
                /* 国际化处理： 是否确认要取消?*/ beSureBtnClick: ()=>{
                    cardCancel(_objectSpreadProps(_objectSpread({}, props), {
                        json: this.state.json
                    }));
                }
            });
            break;
        //头部 刷新
        case constant.CARD_BUTTON.refresh:
            cardRefresh(_objectSpreadProps(_objectSpread({}, props), {
                json: this.state.json
            }));
            break;
        //附件
        case constant.CARD_BUTTON.attachment:
            cardAttachment.call(this, props);
            break;
        //单据追溯
        case constant.CARD_BUTTON.billTrack:
            cardBillTrack.call(this, props);
            break;
        //审批详情
        case constant.CARD_BUTTON.approvalLink:
            cardLinkApprove.call(this, props);
            break;
        //单据提交
        case constant.CARD_BUTTON.commit:
            cardCommit.call(this, _objectSpreadProps(_objectSpread({}, props), {
                json: this.state.json
            }));
            break;
        //单据收回
        case constant.CARD_BUTTON.unCommit:
            cardUnCommit(_objectSpreadProps(_objectSpread({}, props), {
                json: this.state.json
            }));
            break;
        default:
            break;
    }
}

;// CONCATENATED MODULE: ./src/hpf/hpfc/m0z10301/card/events/beforeHeadEvent.js


/**
 * @description: 表头编辑前事件
 * @param: moduleId 区域编码
 * @param: key 当前字段编码
 * @return: 布尔 true表示可编辑
 */ function beforeHeadEvent(props, moduleId, key, value, data) {
    return new Promise((resolve, reject)=>{
        // 目标系统单据类类型
        if (key === 'idissysbilltype') {
            let meta = props.meta.getMeta();
            // 获取目标系统
            let idissys = props.form.getFormItemsValue(constant.CARD.form_id, "idissys").value;
            if (!idissys) {
                (0,external_nc_lightapp_front_.toast)({
                    content: '请先选择目标系统',
                    color: 'warning'
                });
                return;
            }
            meta[moduleId].items.find((item)=>{
                if (item.attrcode === 'idissysbilltype') {
                    // 给参照类字段项目设置查询条件
                    item.queryCondition = {
                        idissys,
                        // 复杂条件写扩展过滤器进行SQL处理（树形："TreeRefActionExt" ，表形: "GridRefActionExt"）
                        GridRefActionExt: 'nccloud.web.hpf.sumrulevo.refsqlbuilder.AllBillRefSqlBuilder'
                    };
                }
            });
            // 重新设置模板元数据
            props.meta.setMeta(meta, ()=>{
                // 异步调用，需要重新设置meta
                resolve(true);
            });
        } else //中间表元数据
        if (key == 'midmetadata') {
            let meta = props.meta.getMeta();
            // 获取目标系统
            let idissys = props.form.getFormItemsValue(constant.CARD.form_id, "idissys").value;
            if (!idissys) {
                (0,external_nc_lightapp_front_.toast)({
                    content: '请先选择目标系统',
                    color: 'warning'
                });
                return;
            }
            let idissysbilltype = props.form.getFormItemsValue("card_head", "idissysbilltype");
            let idissysbilltype_pk = idissysbilltype.value;
            if (!idissysbilltype || !idissysbilltype_pk) {
                (0,external_nc_lightapp_front_.toast)({
                    content: '请先选择目标系统单据类型',
                    color: 'warning'
                });
                return;
            }
            meta[moduleId].items.find((item)=>{
                if (item.attrcode === 'midmetadata') {
                    // 给参照类字段项目设置查询条件
                    item.queryCondition = {
                        idissys,
                        idissysbilltype_pk,
                        // 复杂条件写扩展过滤器进行SQL处理（树形："TreeRefActionExt" ，表形: "GridRefActionExt"）
                        GridRefActionExt: 'nccloud.web.hpf.sumrulevo.refsqlbuilder.MdEntityRefSqlBuilder'
                    };
                }
            });
            // 重新设置模板元数据
            props.meta.setMeta(meta, ()=>{
                // 异步调用，需要重新设置meta
                resolve(true);
            });
        } else {
            resolve(true);
        }
    });
}

;// CONCATENATED MODULE: ./src/hpf/hpfc/m0z10301/card/events/beforeTableEvent.js
/**
 * @description: 表体编辑前事件
 * @param: moduleId 区域编码
 * @param: key 当前字段编码
 * @return: 布尔 true表示可编辑
 */ function beforeTableEvent(props, moduleId, key, value, index, record, status) {
    return new Promise((resolve, reject)=>{
        if (key === "fieldcode") {
            let meta = props.meta.getMeta();
            meta[moduleId].items.find((item)=>{
                if ('fieldcode' === item.attrcode) {
                    // 获取目标系统
                    let classid = props.form.getFormItemsValue("card_head", "midmetadata").value;
                    // 给参照类字段项目设置查询条件
                    item.queryCondition = {
                        classid: classid
                    };
                }
            });
            // // 复杂条件写扩展过滤器进行SQL处理（树形："TreeRefActionExt" ，表形: "GridRefActionExt"）
            // GridRefActionExt: 'nccloud.web.hpf.sumrulevo.refsqlbuilder.MdEntityRefSqlBuilder',
            // 重新设置模板元数据
            props.meta.setMeta(meta, ()=>{
                // 异步调用，需要重新设置meta
                resolve(true);
            });
        } else {
            resolve(true);
        }
    });
}

;// CONCATENATED MODULE: ./src/hpf/hpfc/m0z10301/card/events/afterTableEvent.js

/**
 * @description: 表体编辑后事件
 * @param: moduleId 区域编码
 * @param: key 当前字段编码
 */ function afterTableEvent(props, moduleId, key, value, changedrows, index, record, type, method) {
    //字段编码参照赋值
    if (key == "fieldcode") {
        props.cardTable.setValByKeyAndIndex(moduleId, index, "fieldid", {
            value: value.refpk
        });
        props.cardTable.setValByKeyAndIndex(moduleId, index, "fieldname", {
            value: value.refname
        });
        props.cardTable.setValByKeyAndIndex(moduleId, index, "fieldcode", {
            value: value.refcode
        });
        //成本管理部分单据项目不可编辑 add by mzq    
        let idissysbilltype = props.getUrlParam('idissysbilltype');
        if (constant.editcfg.get(idissysbilltype).indexOf(value.values.code.value) > -1) {
            if (value.values.code.value == "cydeptcode" || value.values.code.value == "cydeptname") {
                props.cardTable.setValByKeyAndIndex(moduleId, index, "ifchange", {
                    value: true
                });
            } else {
                props.cardTable.setValByKeyAndIndex(moduleId, index, "ifchange", {
                    value: false
                });
            }
            //props.cardTable.setValByKeyAndIndex(moduleId, index, "ifchange", { value: true });             
            props.cardTable.setEditableByIndex('card_body', index, [
                'fieldcode',
                'fieldname',
                'ifchange'
            ], false);
        }
    }
}

;// CONCATENATED MODULE: ./src/hpf/hpfc/m0z10301/card/events/bodySelectedEvent.js

//单选
function bodySelectedEvent(props, moduleId, record, index, status) {
    let checkedRows = props.cardTable.getCheckedRows(constant.CARD.table_code);
    if (checkedRows.length > 0) {
        props.button.setButtonDisabled(constant.CARD_DISABLED_BUTTON, false);
    } else {
        props.button.setButtonDisabled(constant.CARD_DISABLED_BUTTON, true);
    }
}
//全选
function bodySelectedAllEvent(props, moduleId, status, length) {
    props.button.setButtonDisabled(constant.CARD_DISABLED_BUTTON, !(status && length > 0));
}

;// CONCATENATED MODULE: ./src/hpf/hpfc/m0z10301/card/index.js
function card_defineProperty(obj, key, value) {
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
function card_objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === 'function') {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            card_defineProperty(target, key, source[key]);
        });
    }
    return target;
}
function card_ownKeys(object, enumerableOnly) {
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
function card_objectSpreadProps(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        card_ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}












/**
 * @description: 卡片
 */ const { NCAffix , NCLoading  } = external_nc_lightapp_front_.base;
let Card = class Card extends external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_.Component {
    //是否显示遮罩
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
        // 关闭浏览器
        window.onbeforeunload = ()=>{
            let status = this.props.cardTable.getStatus(constant.CARD.table_code);
            if (status == constant.STATUS.edit) {
                return this.state.json['M0Z10301-000007'];
            }
        };
    }
    /* 国际化处理： 当前单据未保存，您确认离开此页面？*/ componentDidMount() {}
    render() {
        let { form , cardPagination , BillHeadInfo , cardTable  } = this.props;
        let { createCardPagination  } = cardPagination;
        let { createForm  } = form;
        let { createCardTable  } = cardTable;
        let { createBillHeadInfo  } = BillHeadInfo;
        let { NCUploader , BillTrack , ApprovalTrans , ApproveDetail  } = external_nc_lightapp_front_.high;
        let status = this.props.getUrlParam(constant.STATUS.status);
        let id = this.props.getUrlParam(constant.PRIMARY_KEY.id);
        let billNo = this.props.form.getFormItemsValue(constant.CARD.page_code, constant.PRIMARY_KEY.bill_no);
        return /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement("div", {
            className: "nc-bill-card",
            __source: {
                fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10301\\card\\index.js",
                lineNumber: 108,
                columnNumber: 13
            },
            __self: this
        }, /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement("div", {
            className: "nc-bill-top-area",
            __source: {
                fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10301\\card\\index.js",
                lineNumber: 109,
                columnNumber: 17
            },
            __self: this
        }, /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement(NCAffix, {
            __source: {
                fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10301\\card\\index.js",
                lineNumber: 110,
                columnNumber: 21
            },
            __self: this
        }, /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement("div", {
            className: "nc-bill-header-area",
            __source: {
                fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10301\\card\\index.js",
                lineNumber: 111,
                columnNumber: 25
            },
            __self: this
        }, /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement("div", {
            __source: {
                fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10301\\card\\index.js",
                lineNumber: 112,
                columnNumber: 29
            },
            __self: this
        }, createBillHeadInfo({
            title: "数据汇总规则",
            //标题
            billCode: billNo && billNo.value,
            //单据号
            showBillCode: false,
            backBtnClick: buttonClick.bind(this, this.props, constant.CARD_BUTTON.back)
        })), /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement("div", {
            className: "header-button-area",
            __source: {
                fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10301\\card\\index.js",
                lineNumber: 120,
                columnNumber: 29
            },
            __self: this
        }, this.props.button.createButtonApp({
            area: constant.CARD.head_btn_code,
            onButtonClick: buttonClick.bind(this)
        })), status == constant.STATUS.browse && id && /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement("div", {
            className: "header-cardPagination-area",
            style: {
                float: 'right'
            },
            __source: {
                fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10301\\card\\index.js",
                lineNumber: 127,
                columnNumber: 29
            },
            __self: this
        }, createCardPagination({
            dataSource: constant.DATASOURCE,
            pkname: constant.PRIMARY_KEY.head_id,
            handlePageInfoChange: this.handlePageInfoChange
        })))), /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement("div", {
            className: "nc-bill-form-area",
            __source: {
                fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10301\\card\\index.js",
                lineNumber: 137,
                columnNumber: 21
            },
            __self: this
        }, createForm(constant.CARD.form_id, {
            onAfterEvent: afterHeadEvent.bind(this),
            onBeforeEvent: beforeHeadEvent
        }))), /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement("div", {
            className: "nc-bill-bottom-area",
            __source: {
                fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10301\\card\\index.js",
                lineNumber: 145,
                columnNumber: 17
            },
            __self: this
        }, /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement("div", {
            className: "nc-bill-table-area",
            __source: {
                fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10301\\card\\index.js",
                lineNumber: 146,
                columnNumber: 21
            },
            __self: this
        }, createCardTable(constant.CARD.table_code, {
            tableHead: this.getTableHead.bind(this),
            showCheck: true,
            showIndex: false,
            onSelected: bodySelectedEvent,
            onSelectedAll: bodySelectedAllEvent,
            onBeforeEvent: beforeTableEvent,
            onAfterEvent: afterTableEvent,
            adaptionHeight: true,
            modelSave: buttonClick.bind(this, card_objectSpreadProps(card_objectSpread({}, this.props), {
                json: this.state.json
            }), constant.CARD_BUTTON.save, undefined, true)
        }))), /* 附件 */ this.state.showUploader && /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement(NCUploader, card_objectSpreadProps(card_objectSpread({
            placement: 'bottom'
        }, this.state.billInfo), {
            onHide: ()=>{
                this.setState({
                    showUploader: false
                });
            },
            __source: {
                fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10301\\card\\index.js",
                lineNumber: 166,
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
                fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10301\\card\\index.js",
                lineNumber: 179,
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
                fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10301\\card\\index.js",
                lineNumber: 191,
                columnNumber: 21
            },
            __self: this
        }), /*/!* 联查审批详情 *!/*/ /*{*/ /*    <ApproveDetail*/ /*        show={this.state.showApproveDetail}*/ /*        billtype={BILL_TYPE_CODE}*/ /*        billid={this.state.billId}*/ /*        close={() => {*/ /*            this.setState({*/ /*                showApproveDetail: false*/ /*            });*/ /*        }}*/ /*    />*/ /*}*/ /*自动填充字段时的遮罩*/ /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement(NCLoading, {
            fullScreen: true,
            showBackDrop: true,
            show: this.state.showLoading,
            tip: "加载元数据字段中，请稍后...",
            __source: {
                fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10301\\card\\index.js",
                lineNumber: 215,
                columnNumber: 17
            },
            __self: this
        }));
    }
    constructor(props){
        super(props);
        card_defineProperty(this, "handlePageInfoChange", (props, id)=>{
            pageClick(card_objectSpreadProps(card_objectSpread({}, props), {
                json: this.state.json
            }), id);
        });
        //获取列表肩部信息
        card_defineProperty(this, "getTableHead", ()=>/*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement("div", {
                className: "shoulder-definition-area",
                __source: {
                    fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10301\\card\\index.js",
                    lineNumber: 69,
                    columnNumber: 9
                },
                __self: this
            }, /*#__PURE__*/ external_root_React_var_React_commonjs_react_commonjs2_react_amd_react_default().createElement("div", {
                className: "definition-icons",
                __source: {
                    fileName: "D:\\yonyou\\hotwebs\\src\\hpf\\hpfc\\m0z10301\\card\\index.js",
                    lineNumber: 70,
                    columnNumber: 13
                },
                __self: this
            }, this.props.button.createButtonApp({
                area: constant.CARD.shoulder_btn_code,
                onButtonClick: bodyButtonClick.bind(this),
                popContainer: document.querySelector('.header-button-area')
            }))));
        //指派提交
        card_defineProperty(this, "getAssignUser", (value)=>{
            cardCommit(card_objectSpreadProps(card_objectSpread({}, this.props), {
                json: this.state.json
            }), {
                pks: this.state.curPk,
                userObj: value
            });
            this.compositeTurnOff();
        });
        //关闭指派
        card_defineProperty(this, "compositeTurnOff", ()=>{
            this.setState({
                compositeData: null,
                compositeDisplay: false
            });
        });
        props.use.form(constant.CARD.form_id, constant.CARD.page_code);
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
            showLoading: false
        };
    }
};
Card = (0,external_nc_lightapp_front_.createPage)({
    billinfo: {
        billtype: 'card',
        pagecode: constant.CARD.page_code,
        headcode: constant.CARD.form_id,
        bodycode: constant.CARD.table_code
    }
})(Card);
/* harmony default export */ const card = (Card);

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=index.e84c7e2b.js.map