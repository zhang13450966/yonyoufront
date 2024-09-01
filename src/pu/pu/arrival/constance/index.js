/*
 * @Author: ligangt
 * @PageInfo: 到货单常量
 * @Date: 2018-04-19 19:10:26
 * @Last Modified by: tianzhyw
 * @Last Modified time: 2022-01-26 15:51:59
 */

const URL = {
	save: '/nccloud/pu/arrival/insert.do',
	queryParam: '/nccloud/pu/arrival/queryParam.do',
	saveSend: '/nccloud/pu/arrival/saveSend.do',
	update: '/nccloud/pu/arrival/insert.do',
	delete: '/nccloud/pu/arrival/delete.do',
	queryScheme: '/nccloud/pu/arrival/queryScheme.do',
	pageQuery: '/nccloud/pu/arrival/pageQuery.do',
	queryCard: '/nccloud/pu/arrival/queryCard.do',
	commit: '/nccloud/pu/arrival/commit.do',
	uncommit: '/nccloud/pu/arrival/uncommit.do',
	approve: '/nccloud/pu/arrival/approve.do',
	unapprove: '/nccloud/pu/arrival/unapprove.do',
	quickArr: '/nccloud/pu/arrival/quickArr.do', //快速收货
	quickArrQuery: '/nccloud/pu/arrival/quickArrQuery.do',
	card: '/card',
	list: '/list',
	transfer21: '/ref21',
	transfer61: '/ref61',
	return21: '/return21',
	return61: '/return61',
	genAssertCard: '/nccloud/pu/arrival/crtAssert.do',
	delAssertCard: '/nccloud/pu/arrival/delAssert.do',
	genHJCard: '/nccloud/pu/arrival/transAssert.do',
	delHJCard: '/nccloud/pu/arrival/delTransAssert.do',
	verify: '/nccloud/pu/arrival/qualityCheck.do',
	queryOrder: '/nccloud/pu/arrival/queryOrder.do',
	queryOrderByPK: '/nccloud/pu/arrival/queryOrderByPK.do',
	transferOrder: '/nccloud/pu/arrival/transferOrder.do',
	querySubcont: '/nccloud/pu/arrival/querySubcont.do',
	transferSubcont: '/nccloud/pu/arrival/transferSubcont.do',
	queryReturnOrder: '/nccloud/pu/arrival/queryReturnOrder.do',
	transferReturnOrder: '/nccloud/pu/arrival/transferReturnOrder.do',
	queryReturnSubcont: '/nccloud/pu/arrival/queryReturnSubcont.do',
	transferReturnSubcont: '/nccloud/pu/arrival/transferReturnSubcont.do',
	fixRate: '/nccloud/pu/arrival/fixRate.do',
	print: '/nccloud/pu/arrival/print.do',
	printPermiss: '/nccloud/pu/arrival/printPermiss.do',
	beforeEditHead: '/nccloud/pu/arrival/beforeEditHead.do', //表头编辑前
	afterEditHead: '/nccloud/pu/arrival/afterEditHead.do', //表头编辑后
	afterBodyEdit: '/nccloud/pu/arrival/afterBodyEdit.do', //表体编辑后
	return23: '/nccloud/pu/arrival/return23.do', //基于原到货单退货
	combin: '/nccloud/pu/arrival/combin.do',
	combinprint: '/nccloud/pu/arrival/combinprint.do',
	pushToC005Check: '/nccloud/pu/arrival/pushToC005Check.do', //到货单推紧急放行单
	generalSetpiece: '/nccloud/pu/pub/generalSetpiece.do', //成套件信息
	saveandcommit: '/nccloud/pu/arrival/saveandcommit.do', // 到货单保存提交For Nccnative
	sagaCheck: '/nccloud/pu/arrival/materialsagacheck.do',
	scanTrans: '/nccloud/pu/arrival/scanTrans.do' //扫码拉单
};
/**
 * 单据模板ID
 */
const PAGECODE = {
	head: '400401200_list',
	card: '400401200_card',
	// transferOrder: '400401200_ref23',
	transferOrder: '400400800_21to23',
	// returnOrder: '400401200_return21',
	returnOrder: '400400800_return23',
	// transferSubcont: '400401200_ref61',
	transferSubcont: '400401200_61to23',
	returnSubcont: '400401200_61return23',
	transferCard: '400401200_transfer'
};

/**
 * 字段
 */
const FIELD = {
	sagaStatus: 'saga_status',
	vbillcode: 'vbillcode', //单据号
	pk_org: 'pk_org', //库存组织
	pk_material: 'pk_material', //物料
	pk_arriveorder: 'pk_arriveorder', //到货单主键
	pk_arriveorder_b: 'pk_arriveorder_b', //到货单表体主键
	norigmny: 'norigmny', //金额
	norigtaxmny: 'norigtaxmny', //价税合计
	ntax: 'ntax', //税额
	nmny: 'nmny', //本币无税金额
	ntaxmny: 'ntaxmny', //本币加税合计
	nnum: 'nnum', //主数量
	nastnum: 'nastnum', //数量
	nelignum: 'nelignum', //合格主数量
	nnotelignum: 'nnotelignum', //不合格主数量
	nwastnum: 'nwastnum', //途耗主数量
	crowno: 'crowno', //行号
	free: '0',
	unapproved: '4',
	castunitid: 'castunitid',
	dplanreceivedate: 'dplanreceivedate',
	pk_apliabcenter_v: 'pk_apliabcenter_v',
	pk_arrliabcenter_v: 'pk_arrliabcenter_v',
	pk_receivestore: 'pk_receivestore',
	bpresent: 'bpresent',
	bpresentsource: 'bpresentsource',
	materialname: 'pk_material.name',
	materialspec: 'pk_material.materialspec',
	materialtype: 'pk_material.materialtype',
	ts: 'ts',
	scene: 'scene',
	approvesce: 'approvesce',
	pk: 'pk' // 看板跳转
};

const BATCHITEM = [ 'nastnum', 'nnum', 'nplanastnum', 'nplannum', 'pk_receivestore', 'cprojectid', 'vmemob' ];

/**
 * 单据类型
 */
const BILLTYPE = {
	arrival: '23' //到货单
};

/**
 * 应用编码
 */
const APPCODE = {
	poorder: '400400800', //采购订单维护
	arrival: '400401200' //到货单
};
/**
 * 区域编码
 */
const AREA = {
	searchArea: 'searchArea',
	form: 'head',
	table: 'body',
	head: 'head',
	body: 'body',
	leftarea: 'leftarea',
	transferhead: 'transferhead',
	transferbody: 'transferbodd',
	transferview: 'transferview',
	childform1: 'childform1'
};

const COMMON = {
	moudleid: '4004',
	oid: '1001Z81000000000AJQ7',
	arrivalCacheKey: 'scm.pu.arrival.ArrivalListCacheKey',
	arrivalCacheTabKey: 'scm.pu.arrival.ArrivalListTabCacheKey',
	arrivalServal: 'scm.pu.arrival.ArrivalServalKey',
	arrivalRef21CacheKey: 'arrivaltransfer21DataSource',
	arrivalRef61CacheKey: 'arrivaltransfer61DataSource',
	arrivalReturn21CacheKey: 'arrivalreturn21DataSource',
	arrivalReturn61CacheKey: 'arrivalreturn61DataSource',
	arrivalRefBillCachekey: 'arrivalRefBillCachekey'
};
/**
 * 小应用ID
 */
const TRANSFER = {
	oid: '1001Z81000000000D9MJ',
	subcontoid: '1001Z810000000018U79',
	appid: '0001Z81000000003A2TC'
};
const APPID = '0001Z81000000002X382';
const LISTBUTTONS = [
	'Receive', //收货
	'RefOrder', //订单收货
	'RefSubcont', //委外收货
	'Return', //退货
	'ReturnOrder', //采购订单退货
	'ReturnSubcont', //委外订单退货
	'Commit', //提交
	'Edit', //修改
	'Delete', //删除
	'CommitGroup', //提交组
	'UnCommit', //收回
	'AulixiaryFunction', //辅助功能
	'QuickReceive', //快速收货
	'AccessoryManage', //附件
	'QueryAboutBusiness', //单据追溯
	'Print', //打印
	'Refresh', //刷新
	'OutPrint' //输出
];
/**
 * 卡片态全部按钮
 */
const ALLBUTTONS = [
	'Receive',
	'RefOrder',
	'RefSubcont',
	'Return',
	'ReturnOrder',
	'ReturnSubcont',
	'ReturnArrival',
	'Commit',
	'Edit',
	'Delete',
	'UnCommit',
	'Check',
	'AulixiaryFunction', //辅助功能
	'QuickReceive', //快速收货
	'AccessoryManage', //附件
	'Print',
	'Refresh',
	'ApproveInfo',
	'UergencyLetGo',
	'More',
	'PrintBarcode', //打印条码
	'DirPrintBarcode', //直接打印条形码
	'GenAssertCard',
	'DelAssertCard',
	'MaterialAssign',
	'GenTransAssert',
	'DelTransAssert',
	'Save',
	'SaveSend',
	'Cancel',
	'UrgencyLetGo',
	'CheckLine',
	'QueryAboutBusiness',
	'CopyLines',
	'DeleteLine',
	'ResetRowno',
	'PaseToThis',
	'PastToLast',
	'CancelPast',
	'StockQuery',
	'UrgentLetGo'
];
/**
 * 编辑态按钮
 */
const EDITBUTTONS = [
	'Save', //保存
	'SaveSend', //保存提交
	'Cancel', //取消
	'DeleteLine', //删行
	'CopyLines', //复制行
	'ResetRowno', //重排行号
	'PaseToThis', //粘贴至此
	'PastToLast', //粘贴至末行
	'CancelPast', //取消(复制)
	'StockQuery' //存量查询
];

const ADDBUTTONS = [
	'Receive', //收货
	'RefOrder', //采购订单收货
	'RefSubcont', //委外订单收货
	'Return', //退货
	'ReturnOrder', //采购订单退货
	'ReturnSubcont', //委外订单退货
	'ReturnArrival'
];
/**
 * 审批不通过浏览态按钮
 */
const FAILBUTTONS = [
	'Receive', //收货
	'RefOrder', //采购订单收货
	'RefSubcont', //委外订单收货
	'Return', //退货
	'ReturnOrder', //采购订单退货
	'ReturnSubcont', //委外订单退货
	'ReturnArrival',
	'QuickReceive', //快速收货
	'Edit', //修改
	'Delete',
	'More', //辅助功能
	'Print', //打印
	'OutPrint', //输出
	'PrintBarcode', //打印条码
	'DirPrintBarcode', //直接打印条码
	'AulixiaryFunction', //已无此按钮
	'AccessoryManage', //附件
	'QueryAboutBusiness', //单据追溯
	'ApproveInfo',
	'PrintBarcode',
	'DirPrintBarcode',
	'Refresh', //刷新
	'StockQuery' //存量查询
];
/**
 * 转单界面审批不通过按钮
 */
const TRANSFERFAILBUTTONS = [
	'Edit', //修改
	'More', //辅助功能
	'Print', //打印
	'OutPrint', //输出
	'PrintBarcode', //打印条码
	'DirPrintBarcode', //直接打印条码
	'AulixiaryFunction', //已无此按钮
	'AccessoryManage', //附件
	'PrintBarcode', //打印条码
	'QueryAboutBusiness', //单据追溯
	'DirPrintBarcode', //直接打印条码
	'Refresh',
	'Quit', //退出转单
	'StockQuery' //存量查询
];
/**
 * 自由态按钮
 */
const FREEBUTTONS = [
	'Receive', //收货
	'RefOrder', //采购订单收货
	'RefSubcont', //委外订单收货
	'Return', //退货
	'ReturnOrder', //采购订单退货
	'ReturnSubcont', //委外订单退货
	'QuickReceive', //快速收货
	'Commit', //提交
	'Edit', //修改
	'Delete', //删除
	'More', //辅助功能
	'Print', //打印
	'OutPrint', //输出
	'PrintBarcode', //打印条码
	'DirPrintBarcode', //直接打印条码
	'AulixiaryFunction',
	'AccessoryManage', //附件
	'ApproveInfo', //审批详情
	'QueryAboutBusiness', //单据追溯
	'PrintBarcode',
	'DirPrintBarcode',
	'Refresh', //刷新
	'StockQuery' //存量查询
];
/**
 * 转单界面自由态按钮
 */
const TRANSFERFREEBUTTONS = [
	'Commit', //提交
	'Edit', //修改
	'Delete', //删除
	'More', //辅助功能
	'Print', //打印
	'PrintBarcode', //打印条码
	'DirPrintBarcode', //直接打印条码
	'AulixiaryFunction',
	'AccessoryManage', //附件
	'QueryAboutBusiness', //单据追溯
	'ApproveInfo', //审批详情
	'PrintBarcode',
	'DirPrintBarcode',
	'Refresh',
	'Quit', //退出转单
	'StockQuery' //存量查询
];
/**
 * 执行中按钮
 */
const EXEBUTTONS = [
	'Receive',
	'RefOrder',
	'RefSubcont',
	'Return',
	'ReturnOrder',
	'ReturnSubcont',
	'ReturnArrival',
	'Check',
	'CheckLine',
	'QuickReceive', //快速收货
	'UrgencyLetGo',
	'More',
	'AccessoryManage',
	'QueryAboutBusiness',
	'Print',
	'PrintBarcode',
	'DirPrintBarcode',
	'GenAssertCard',
	'DelAssertCard',
	'MaterialAssign',
	'GenTransAssert',
	'DelTransAssert',
	'QuickReceive',
	'Refresh',
	'ApproveInfo',
	'UnCommit',
	'UrgentLetGo',
	'StockQuery' //存量查询
];
/**
 * 转单界面执行中按钮
 */
const TRANSFEREXEBUTTONS = [
	'CheckLine',
	'Check',
	'UnCommit',
	'ApproveInfo',
	'UrgencyLetGo',
	'More',
	'AccessoryManage',
	'QueryAboutBusiness',
	'Print',
	'PrintBarcode',
	'DirPrintBarcode',
	'GenAssertCard',
	'DelAssertCard',
	'MaterialAssign',
	'GenTransAssert',
	'DelTransAssert',
	'Refresh',
	'Quit',
	'StockQuery', //存量查询
	'UrgentLetGo'
];
/**
 * 审批中单据按钮
 */
const COMMITBUTTONS = [
	// 'Edit',
	'Receive',
	'RefOrder',
	'RefSubcont',
	'Return',
	'ReturnOrder',
	'ReturnSubcont',
	'UnCommit',
	'More',
	'QuickReceive', //快速收货
	'ApproveInfo',
	'AccessoryManage',
	'QueryAboutBusiness',
	'Print',
	'PrintBarcode',
	'DirPrintBarcode',
	'Refresh',
	'StockQuery' //存量查询
];
/**
 * 转单界面审批中单据按钮
 */
const TRANSFERCOMMITBUTTONS = [
	'UnCommit',
	'More',
	'ApproveInfo',
	'AccessoryManage',
	'QueryAboutBusiness',
	'Print',
	'PrintBarcode',
	'DirPrintBarcode',
	'Refresh',
	'Quit',
	'StockQuery' //存量查询
];
/**
 * 转单界面所有按钮
 */
const TRANSFERBUTTONS = [
	'Commit',
	'Edit',
	'Delete',
	'UnCommit',
	'Check',
	'AulixiaryFunction',
	'QuickReceive',
	'AccessoryManage',
	'QueryAboutBusiness',
	'Print',
	'Refresh',
	'ApproveInfo',
	'UgencyLetGo',
	'More',
	'PrintBarcode',
	'DirPrintBarcode',
	'GenAssertCard',
	'DelAssertCard',
	'MaterialAssign',
	'GenTransAssert',
	'DelTransAssert',
	'Quit',
	'UrgencyLetGo',
	'Save',
	'SaveSend',
	'Cancel',
	'CopyLines',
	'DeleteLine',
	'ResetRowno',
	'PaseToThis',
	'Refresh'
];
/**
 * 转单界面编辑态按钮
 */
const TRANSFEREDITBUTTONS = [
	'Save',
	'SaveSend',
	'Cancel',
	'DeleteLine',
	'CopyLines',
	'ResetRowno',
	'PaseToThis',
	'Quit'
];
const BUTTONAREA = {
	listhead: 'list_head',
	listinner: 'list_inner',
	cardhead: 'card_head',
	cardbody: 'card_body',
	cardbodyinner: 'card_body_inner'
};
/**
 * 自由辅助属性
 */
const FREEFIELD = {
	ccustomerid: 'casscustid',
	ccustomervid: 'casscustvid',
	cvendorid: 'pk_supplier',
	cvendorvid: 'pk_supplier_v'
};
export {
	URL,
	AREA,
	APPCODE,
	PAGECODE,
	APPID,
	COMMON,
	TRANSFER,
	BUTTONAREA,
	ALLBUTTONS,
	EDITBUTTONS,
	FREEBUTTONS,
	COMMITBUTTONS,
	EXEBUTTONS,
	TRANSFERBUTTONS,
	LISTBUTTONS,
	TRANSFEREDITBUTTONS,
	TRANSFEREXEBUTTONS,
	TRANSFERFREEBUTTONS,
	TRANSFERFAILBUTTONS,
	TRANSFERCOMMITBUTTONS,
	FAILBUTTONS,
	FIELD,
	BATCHITEM,
	BILLTYPE,
	ADDBUTTONS,
	FREEFIELD
};
