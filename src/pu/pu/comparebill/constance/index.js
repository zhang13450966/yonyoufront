/*
 * @Author: chaiwx 
 * @PageInfo: 常量输出  
 * @Date: 2018-04-12 15:24:33 
 * @Last Modified by: qishy
 * @Last Modified time: 2019-08-22 11:21:11
 */

// 区域ID
const AREA = {
	searchId: 'search',
	listTableId: 'head',
	cardFormId: 'head',
	cardTableId: 'body',
	srcView: 'view',
	leftarea: 'left'
};

//页面模板编码
const PAGECODE = {
	listPagecode: '400401616_list',
	cardPagecode: '400401616_card',
	appcode21: '400400800',
	transferPagecode21: '400400800_21to2507',
	appcode45: '400800800',
	transferPagecode45: '400800800_45to2507'
};

// 缓存命名空间
const CACHDATASOURCE = {
	dataSourceList: 'scm.pu.comparebill.dataSourceList',
	dataSourceTransfer: 'scm.pu.comparebill.dataSourceTransfer'
};

//url
const REQUESTURL = {
	query: '/nccloud/pu/comparebill/query.do',
	pageQuery: '/nccloud/pu/comparebill/pageQuery.do',
	budgetQuery: '/nccloud/pu/comparebill/budgetQuery.do',
	queryCard: '/nccloud/pu/comparebill/cardQuery.do',
	send: '/nccloud/pu/comparebill/send.do',
	unSend: '/nccloud/pu/comparebill/unSend.do',
	edit: '/nccloud/pu/comparebill/edit.do',
	delete: '/nccloud/pu/comparebill/delete.do',
	confirm: '/nccloud/pu/comparebill/confirm.do',
	unConfirm: '/nccloud/pu/comparebill/unConfirm.do',
	getPrice: '/nccloud/pu/comparebill/getPrice.do',
	ref21Query: '/nccloud/pu/comparebill/ref21Query.do',
	ref21Transfer: '/nccloud/pu/comparebill/ref21Transfer.do',
	ref45Query: '/nccloud/pu/comparebill/ref45Query.do',
	ref45Transfer: '/nccloud/pu/comparebill/ref45Transfer.do',
	save: '/nccloud/pu/comparebill/save.do',
	print: '/nccloud/pu/comparebill/print.do',
	printdatapermission: '/nccloud/pu/comparebill/printdatapermission.do',
	Output: '/nccloud/pu/comparebill/print.do',
	pushTo25Check: '/nccloud/pu/comparebill/pushTo25Check.do',

	headBeforeEdit: '/nccloud/pu/comparebill/headBeforeEdit.do',
	headAfterEdit: '/nccloud/pu/comparebill/headAfterEdit.do',
	bodyAfterEdit: '/nccloud/pu/comparebill/bodyAfterEdit.do',
	bodyBeforeEdit: '/nccloud/pu/comparebill/bodyBeforeEdit.do',

	addLine: '/nccloud/pu/comparebill/addLine.do',
	transtypeQuery: '/nccloud/pu/comparebill/transtype.do',
	linkQueryVoucher: '/nccloud/pu/comparebill/linkQueryVoucher.do',
	linkQuery: '/nccloud/pu/comparebill/linkQuery.do',
	linkQueryBudget: '/nccloud/pu/comparebill/linkQueryBudget.do',
	toTransfer21: '/transfer21',
	toTransfer45: '/transfer45',
	toCard: '/card',
	toList: '/list'
};

// 按钮ID
const BUTTONID = {
	Add: 'Add', //新增
	BuyOrder: 'BuyOrder', //采购订单
	BuyStore: 'BuyStore', //采购入库
	Delete: 'Delete', //删除
	Send: 'Send', //发送
	UnSend: 'UnSend', //取消发送
	Confirm: 'Confirm', //确认
	UnConfirm: 'UnConfirm', //取消确认
	Attachment: 'Attachment', //附件
	BillLinkQuery: 'BillLinkQuery', //单据追溯
	LinkQueryInvoice: 'LinkQueryInvoice', //联查发票
	Print: 'Print', //打印
	Output: 'Output', //输出
	Cancel: 'Cancel', //取消
	Refresh: 'Refresh',
	Back: 'back', //返回
	Invoice: 'Invoice', //收票
	CopyLine: 'CopyLine', //复制行
	PasteLineToTail: 'PasteLineToTail', //粘贴至末行
	CancelB: 'CancelB', //取消
	openbrowse: 'OpenBrowse', //浏览态展开
	openedit: 'OpenEdit', //编辑态展开
	PasteLine: 'PasteLine', //粘贴行
	SaveCommit: 'SaveCommit', //保存提交
	Copy: 'Copy', //复制
	Edit: 'Edit', //修改
	DeleteLine: 'DeleteLine', //删行
	SaveGroup: 'SaveGroup',
	Save: 'Save', //保存
	Quit: 'Quit', //退出转单
	UnCommit: 'UnCommit', //收回
	AddLineGroup: 'AddLineGroup',
	ResetRowNo: 'ResetRowNo', //重排行号
	SelPrice: 'SelPrice' //优质优价取价
};

// 复制粘贴按钮组
const COPYPASTEBTNS = {
	initBtns: [ BUTTONID.AddLine, BUTTONID.DeleteLine, BUTTONID.CopyLine ],
	pasteBtns: [ BUTTONID.PasteLineToTail, BUTTONID.CancelB ]
};

// 按钮区域
const BUTTONAREA = {
	list_head: 'list_head',
	list_inner: 'list_inner',
	card_head: 'card_head',
	card_body: 'card_body',
	card_body_inner: 'card_body_inner'
};

// 字段
const FIELDS = {
	nnum: 'nnum',
	nastnum: 'nastnum',
	crowno: 'crowno',
	ftaxtypeflag: 'ftaxtypeflag',
	ctaxcodeid: 'ctaxcodeid',
	pk_comparebill: 'pk_comparebill',
	forderstatus: 'forderstatus',
	dbilldate: 'dbilldate',
	dstartdate: 'dstartdate',
	denddate: 'denddate',
	pk_org_v: 'pk_org_v',
	pk_org: 'pk_org',
	pk_group: 'pk_group',
	vbillcode: 'vbillcode',
	pk_supplier: 'pk_supplier',
	pk_bizpsn: 'pk_bizpsn', //业务员
	corigcurrencyid: 'corigcurrencyid',
	ccurrencyid: 'ccurrencyid',
	ctrantypeid: 'ctrantypeid',
	nchangestdrate: 'nchangestdrate',
	pk_payterm: 'pk_payterm', //付款协议
	approver: 'approver',
	bsupplierconfirm: 'bsupplierconfirm', //供应商确认
	//表体字段
	pk_comparebill_b_pk_material_v: 'pk_comparebill_b.pk_material_v',
	pk_comparebill_b_pk_material_v_pk_marbasclass: 'pk_comparebill_b.pk_material_v.pk_marbasclass',
	csrcbid: 'csrcbid',
	nqtorigprice: 'nqtorigprice',
	ntaxrate: 'ntaxrate',
	nqtorigtaxprice: 'nqtorigtaxprice',
	norigtaxmny: 'norigtaxmny',
	nqttaxprice: 'nqttaxprice',
	nqtprice: 'nqtprice',
	pk_comparebill_b: 'pk_comparebill_b',
	ntotalnum: 'ntotalnum',
	ncollectnum: 'ncollectnum',
	ntotalmny: 'ntotalmny',
	ncollectmny: 'ncollectmny',
	ninvoicenum: 'ninvoicenum', //累计开票主数量
	cpurorgoid: 'cpurorgoid',
	cpurorgvid: 'cpurorgvid',
	cemployeeid: 'cemployeeid',
	pk_dept: 'pk_dept',
	pk_dept_v: 'pk_dept_v',
	pk_arrvstoorg: 'pk_order_b.pk_arrvstoorg', //收货库存组织最新版本
	pk_reqdept: 'pk_order_b.pk_reqdept', //需求部门
	billmaker: 'billmaker',
	dmakedate: 'dmakedate',
	billconfirmer: 'billconfirmer',
	dconfirmdate: 'dconfirmdate',
	ts: 'ts'
};

// 主组织字段
const MAIN_ORG_FIELD = {
	searchAllOrg: 'pk_psfinanceorg', //收票主组织
	search21Org: 'pk_order_b.pk_psfinanceorg', //采购订单
	search45Org: 'cfanaceorgoid' //采购入库单
};
const BILLSTATUS = {
	// 待发送
	free: '0',
	// 待供应商确认
	send: '1',
	// 已确认
	confirm: '2'
};

// tab
const TABS = {
	toCommit: 'toCommit',
	approving: 'approving',
	executing: 'executing',
	all: 'all'
};

// tabnum
const TABSNUM = {
	toCommit: 0,
	approving: 1,
	executing: 2,
	all: 3
};

// 缓存key
const CACHKEY = {
	searchCach: 'searchCach',
	transferSearchCach: 'transferSearchCach',
	tabCach: 'tabCach',
	Dlinksce: 'linksce',
	listDataCach: 'listDataCach',
	cardDataCach: 'cardDataCach'
};

// 批量操作成功单据标识
const SUCCESSKEY = 'bills';

// 操作（复制、退回）
const OPTIONS = {
	// 复制
	copy: 'copy',
	// 转单
	transfer: 'transfer',
	from21: 'from21',
	from45: 'from45'
};

let CLEARFIELDS = [ FIELDS.cbill_bid, FIELDS.ts, FIELDS.crowno ];

// 表头自定义项
const HEAD_VDEF = [
	'vdef1',
	'vdef2',
	'vdef3',
	'vdef4',
	'vdef5',
	'vdef6',
	'vdef7',
	'vdef8',
	'vdef9',
	'vdef10',
	'vdef11',
	'vdef12',
	'vdef13',
	'vdef14',
	'vdef15',
	'vdef16',
	'vdef17',
	'vdef18',
	'vdef19',
	'vdef20'
];

// 表体自定义项
const BODY_VBDEF = [
	'vbdef1',
	'vbdef2',
	'vbdef3',
	'vbdef4',
	'vbdef5',
	'vbdef6',
	'vbdef7',
	'vbdef8',
	'vbdef9',
	'vbdef10',
	'vbdef11',
	'vbdef12',
	'vbdef13',
	'vbdef14',
	'vbdef15',
	'vbdef16',
	'vbdef17',
	'vbdef18',
	'vbdef19',
	'vbdef20'
];

// 自由辅助属性
const VFREE = [ 'vfree1', 'vfree2', 'vfree3', 'vfree4', 'vfree5', 'vfree6', 'vfree7', 'vfree8', 'vfree9', 'vfree10' ];
export {
	AREA,
	PAGECODE,
	REQUESTURL,
	FIELDS,
	BUTTONID,
	BUTTONAREA,
	COPYPASTEBTNS,
	CACHDATASOURCE,
	BILLSTATUS,
	TABS,
	TABSNUM,
	CACHKEY,
	SUCCESSKEY,
	OPTIONS,
	CLEARFIELDS,
	HEAD_VDEF,
	BODY_VBDEF,
	VFREE,
	MAIN_ORG_FIELD
};
