/*
 * @Author: zhangchqf 
 * @PageInfo: 销售指标常量 
 * @Date: 2020-02-11 20:32:41 
 * @Last Modified by: songyt13
 * @Last Modified time: 2021-10-27 16:39:44
 */

const TARGET_LIST = {
	dataSource: 'scmpub.scmpub.sotarget.targetDataSource', //缓存名称 列表和卡片公用一个
	printURL: '/nccloud/scmpub/target/print.do', //请购单打印
	queryListURL: '/nccloud/scmpub/target/queryList.do', //查询列表地址
	batchDeleteURL: '/nccloud/scmpub/target/batchDelete.do', //批量删除地址
	deleteURL: '/nccloud/scmpub/target/delete.do', //删除地址
	queryPageURL: '/nccloud/scmpub/target/queryPage.do', //分页查询地址
	id: 'id',
	oid: '1005Z8100000000074YD', //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改 1005Z8100000000074YD
	listUrl: '/list',
	cardUrl: '/card',
	formId: 'list_head', //表头区域
	tableId: 'list_body', //表体区域
	tailinfo: 'tailinfo', //操作信息
	purchaseorg: 'pu', // 采购 业务场景
	storereq: 'st', // 库存 业务场景
	status: 'status',
	cardpageid: '400102400_card', //卡片pagecode
	listpageid: '400102400_list', //列表pagecode
	historypageid: '400102400_history', //修订历史页面
	appid: '0001Z81000000004F0KX', //注册小应用
	moduleId: '4004', //模块id
	browse: 'browse', //状态
	add: 'add', //状态
	tree: 'tree', //查询模式
	simple: 'simple', //查询模式
	searchId: 'list_query',
	edit: 'edit',
	// 列表态页签，单据状态
	toCommit: 'toCommit', // 待提交
	approving: 'approving', //审批中
	executing: 'executing', //执行中
	all: 'all', //全部
	templetqueryurl: '/nccloud/platform/templet/querypage.do',
	pk_org: 'pk_org',
	billType: '20', //请购单的单据类型
	outputType: 'output', //输出类型
	pk_appdept: 'pk_buyingreq_b.pk_appdept', //部门
	pk_apppsn: 'pk_buyingreq_b.pk_apppsn', //人员
	pk_reqstordoc: 'pk_buyingreq_b.pk_reqstordoc', //需求仓库
	vbillcode: 'vbillcode' //单据号码
};
//单据状态
const FBILLSTATUS = {
	free: '0', //单据状态 自由
	commit: '1', //提交
	approve: '2', //审批中
	approved: '3', //审批
	unapproved: '4', //审批不通过
	other: '5' //关闭
};
//列表按钮
const TARGET_LIST_BUTTON = {
	Refresh: 'Refresh', //刷新
	ReviseHistory: 'ReviseHistory', //查看修订详情
	Revise: 'Revise', //修订
	ApproveInfo: 'ApproveInfo', //查看审批意见
	ApproveInfoRow: 'ApproveInfoRow', //查看审批意见-行
	add: 'Add', //新增
	delete: 'Delete', //删除
	deleteRow: 'Delete', //删除-行
	Edit: 'Edit', //修改
	EditRow: 'Edit', //修改-行
	File: 'File', //附件管理
	Print: 'Print', //打印
	output: 'output', //输出
	copy: 'Copy', //复制
	commit: 'Commit', //提交
	commitRow: 'Commit', //提交-行
	uncommit: 'UnCommit', //收回
	approveInfo: 'ApproveInfo',
	OpenBill: 'OpenBill', //整单打开
	CloseBill: 'CloseBill', //整单关闭
	QueryAboutBusiness: 'QueryAboutBusiness', //单据追溯
	list_inner: 'list_inner', //列表行按钮区域
	blowsetflag: 'blowsetflag' //统一设定下级销售组织指标值
};
const TARGET_CARD = {
	queryByPkUrl: '/nccloud/scmpub/target/queryCard.do', //分页查询地址
	deleteUrl: '/nccloud/scmpub/target/delete.do',
	insertUrl: '/nccloud/scmpub/target/insert.do',
	updateUrl: '/nccloud/scmpub/target/update.do',
	headAfterEventUrl: '/nccloud/scmpub/target/headAfterEvent.do',
	headBeforeEventUrl: '/nccloud/scmpub/target/headBeforeEvent.do',
	bodyAfterEventUrl: '/nccloud/scmpub/target/bodyAfterEvent.do',
	card: 'card',
	id: 'id',
	copy: 'copy',
	comeType: 'comeType',
	listUrl: '/list',
	cardUrl: '/card',
	formId: 'card_head', //表头区域
	target_org: 'target_org',
	target_mar: 'target_mar',
	target_period: 'target_period',
	target_item: 'target_item', //指标项
	target_ratio: 'target_ratio', //指标项比率
	tailinfo: 'tailinfo', //操作信息
	insert: 'insert',
	update: 'update',
	status: 'status',
	cardpageid: '400102400_card', //卡片pagecode
	listpageid: '400102400_list', //列表pagecode

	browse: 'browse', //状态
	add: 'add', //状态
	edit: 'edit',
	// 列表态页签，单据状态
	pk_org: 'pk_org', //库存组织
	pk_target: 'pk_target', //主键
	ts: 'ts',
	dbegindate: 'dbegindate', //开始日期
	denddate: 'denddate', //结束日期
	fcyclesetflag: 'fcyclesetflag', //指标周期
	fmarsetflag: 'fmarsetflag', //物料指标设定方式
	fyearflag: 'fyearflag', //年度
	fmaintainflag: 'fmaintainflag', //指标维护方式
	fheadshowflag: 'fheadshowflag', //指标维护表头设置
	csaleorgid: 'csaleorgid', //销售组织
	cmaterialid: 'cmaterialid', //物料
	cbrandid: 'cbrandid', //品牌
	cprodlineid: 'cprodlineid', //产品线
	cmarbaseclassid: 'cmarbaseclassid', //物料基本分类
	cmarsaleclassid: 'cmarsaleclassid', //物料销售分类
	cmarcombineid: 'cmarcombineid', //物料组合
	crmvmarcomid: 'crmvmarcomid', //返利计算排除物料组合
	clinkyearitemid: 'clinkyearitemid', //关联年指标
	fitemtypeflag: 'fitemtypeflag', //指标项类别
	citemrowno: 'citemrowno', //行号
	vrownote: 'vrownote', //备注
	binclowflag: 'binclowflag',
	pk_target_mar: 'pk_target_mar',
	pk_target_item: 'pk_target_item',
	vtargetname: 'vtargetname', //指标项名称
	vtargetname2: 'vtargetname2',
	vtargetname3: 'vtargetname3',
	pk_org_v: 'pk_org_v', //库存组织版本
	blowsetflag: 'blowsetflag', //统一设置下级
	nhalfyearrate1: 'nhalfyearrate1',
	nhalfyearrate2: 'nhalfyearrate2',
	nmonthrate1: 'nmonthrate1',
	nmonthrate2: 'nmonthrate2',
	nmonthrate3: 'nmonthrate3',
	nmonthrate4: 'nmonthrate4',
	nmonthrate5: 'nmonthrate5',
	nmonthrate6: 'nmonthrate6',
	nmonthrate7: 'nmonthrate7',
	nmonthrate8: 'nmonthrate8',
	nmonthrate9: 'nmonthrate9',
	nmonthrate10: 'nmonthrate10',
	nmonthrate11: 'nmonthrate11',
	nmonthrate12: 'nmonthrate12',
	nquarterrate1: 'nquarterrate1',
	nquarterrate2: 'nquarterrate2',
	nquarterrate3: 'nquarterrate3',
	nquarterrate4: 'nquarterrate4',
	buttonArea: {
		target_org: 'target_org',
		target_mar: 'target_mar',
		target_item: 'target_item',
		target_org_inner: 'target_org_inner',
		target_mar_inner: 'target_mar_inner',
		target_item_inner: 'target_item_inner'
	},
	vperiod: 'vperiod', //指标期间
	dprdbegindate: 'dprdbegindate', //开始日期
	dprdenddate: 'dprdenddate' //结束日期
};
//卡片按钮

const TARGET_CARD_BUTTON = {
	Refresh: 'Refresh', //刷新
	Save: 'Save', //保存
	Cancel: 'Cancel', //取消
	Add: 'Add',
	Edit: 'Edit',
	Delete: 'Delete',
	Print: 'Print', //打印
	File: 'File',
	Addline_org: 'Addline_org',
	DelLine_org: 'DelLine_org',
	InnerDelLine_org: 'InnerDelLine_org',
	Addline_mar: 'Addline_mar',
	DelLine_mar: 'DelLine_mar',
	InnerDelLine_mar: 'InnerDelLine_mar',
	Addline_item: 'Addline_item',
	DelLine_item: 'DelLine_item',
	InnerDelLine_item: 'InnerDelLine_item'
};
const BROWNSTATUS_BUTTON = [
	TARGET_CARD_BUTTON.Refresh,
	TARGET_CARD_BUTTON.Add,
	TARGET_CARD_BUTTON.Edit,
	TARGET_CARD_BUTTON.Delete,
	TARGET_CARD_BUTTON.File
];
const EDITSTATUS_BUTTON = [
	TARGET_CARD_BUTTON.Save,
	TARGET_CARD_BUTTON.Cancel,
	TARGET_CARD_BUTTON.Addline_org,
	TARGET_CARD_BUTTON.Addline_mar,
	TARGET_CARD_BUTTON.Addline_item,
	TARGET_CARD_BUTTON.DelLine_org,
	TARGET_CARD_BUTTON.DelLine_mar,
	TARGET_CARD_BUTTON.DelLine_item,
	TARGET_CARD_BUTTON.InnerDelLine_org,
	TARGET_CARD_BUTTON.InnerDelLine_mar,
	TARGET_CARD_BUTTON.InnerDelLine_item
];
//表头
const ATTRCODE = {
	pk_praybill: 'pk_praybill', //请购单表头主键
	pk_praybill_b: 'pk_praybill_b', //请购单表体主键
	pk_org_v: 'pk_org_v',
	pk_org: 'pk_org', //组织最新版本
	dbilldate: 'dbilldate', //申请日期
	pk_apppsnh: 'pk_apppsnh', //表头申请人
	pk_appdepth_v: 'pk_appdepth_v', //表头申请部门
	pk_appdepth: 'pk_appdepth', //表头申请部门最新版本
	ctrantypeid: 'ctrantypeid', //表头请购类型
	fbillstatus: 'fbillstatus', //单据状态
	freqtypeflag: 'freqtypeflag', //需求类型
	pk_plandept_v: 'pk_plandept_v', //计划部门版本
	creator: 'creator', //创建人
	pk_plandept: 'pk_plandept', //计划部门
	pk_planpsn: 'pk_planpsn', //计划员
	chprojectid: 'chprojectid', //项目
	vbillcode: 'vbillcode', //单据号
	bdirecttransit: 'bdirecttransit', //直运
	bispositioninv: 'bispositioninv', //按计划岗过滤物料
	vmemo: 'vmemo', //备注
	bsctype: 'bsctype', //委外
	sagaStatus: 'saga_status',
	saga_gtxid: 'saga_gtxid'
};

//表体
const ATTRCODES = {
	bpublishtoec: 'bpublishtoec', //发布到电子商务
	nquotebill: 'nquotebill', //生成询报价单次数
	npriceauditbill: 'npriceauditbill', //生成价格审批单次数
	ngenct: 'ngenct', //生成合同次数
	naccumulatenum: 'naccumulatenum', //累计订货数量
	browclose: 'browclose', //行关闭
	crowno: 'crowno', //行号
	nastnum: 'nastnum', //数量
	nnum: 'nnum', //主数量
	pk_purchaseorg_v: 'pk_purchaseorg_v', //采购组织版本
	pk_purchaseorg: 'pk_purchaseorg', //采购组织
	pk_employee: 'pk_employee', //采购员
	bcanpurchaseorgedit: 'bcanpurchaseorgedit', //采购组织可编辑
	dreqdate: 'dreqdate', //需求日期
	pk_suggestsupplier: 'pk_suggestsupplier', //建议供应商
	castunitid: 'castunitid', //单位
	cunitid: 'cunitid', //主单位
	pk_reqdept: 'pk_praybill_b.pk_reqdept', //需求部门
	dbilldate: 'dbilldate', //请购日期
	pk_reqstor: 'pk_reqstor', //需求仓库
	pk_appdept_v: 'pk_appdept_v', //申请部门
	pk_material: 'pk_material', //物料编码
	cprojectid: 'cprojectid', //项目
	cprojecttaskid: 'cprojecttaskid', //项目任务
	vbatchcode: 'vbatchcode', //批次号
	pk_batchcode: 'pk_batchcode', //批次主键
	vchangerate: 'vchangerate', //换算率
	cordertrantypecode: 'cordertrantypecode', //订单类型
	ntaxmny: 'ntaxmny', //本币价税合计
	ntaxprice: 'ntaxprice', //主本币含税单价
	csourcetypecode: 'csourcetypecode', //来源单据类型
	csourceid: 'csourceid', //来源单据标识
	// 发布到电子商务 采购组织可编辑 是否固定换算率 行关闭 主计量单位 集团 库存组织 请购单主键 请购单行id 累计订货数量 生成合同次数 生成价格审批单次数 生成询报价单次数 来源单据分录标识 来源单据标识 来源单据类型 来源单据行号 来源交易类型 源头单据分录标识  源头单据标识  源头单据类型 源头单据号 源头单据行号 源头单据类型 已安排
	otherfields: [
		'bpublishtoec',
		'bcanpurchaseorgedit',
		'bfixedrate',
		'browclose',
		'cunitid',
		'pk_group',
		'pk_org',
		'pk_praybill',
		'pk_praybill_b',
		'naccumulatenum',
		'ngenct',
		'npriceauditbill',
		'nquotebill',
		'csourcebid',
		'csourcetypecode',
		'vsourcecode',
		'vsourcerowno',
		'vsrctrantypecode',
		'cfirstbid',
		'cfirstid',
		'cfirsttypecode',
		'vfirstcode',
		'vfirstrowno',
		'vfirsttrantype',
		'bisarrange'
	]
};
let CLEARFIELDS = [
	'crowno', //行号
	'nnum'
];
//物料编辑后要清空的字段
let clearItems = [
	'pk_srcmaterial', //物料信息
	'pk_material.name', //物料名称
	'pk_material.materialspec', //规格
	'pk_material.materialtype', //型号
	'cprojectid', //项目
	'pk_purchaseorg', //采购组织
	'pk_purchaseorg_v', //采购组织版本
	'pk_suggestsupplier', //建议供应商
	'cunitid', //主单位
	'castunitid', //单位
	'vchangerate', //换算率
	'bfixedrate', //是否固定换算率
	'pk_employee', //采购员
	'dreqdate', //需求日期
	'dsuggestdate', //建议订货日期
	'ccurrencyid', //本币币种
	'ntaxprice', //主本币含税单价
	'vbatchcode', //批次号
	'pk_batchcode', //批次号主键
	'vfree1',
	'vfree2',
	'vfree3',
	'vfree4',
	'vfree5',
	'vfree6',
	'vfree7',
	'vfree8',
	'vfree9',
	'vfreee10'
];
export {
	TARGET_LIST,
	TARGET_CARD,
	ATTRCODE,
	ATTRCODES,
	TARGET_LIST_BUTTON,
	TARGET_CARD_BUTTON,
	FBILLSTATUS,
	CLEARFIELDS,
	clearItems,
	BROWNSTATUS_BUTTON,
	EDITSTATUS_BUTTON
};
