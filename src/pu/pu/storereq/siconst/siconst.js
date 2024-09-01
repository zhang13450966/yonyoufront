/*
 * @Author: zhangchangqing
 * @PageInfo: 物资需求申请单
 * @Date: 2018-04-19 10:28:28
 * @Last Modified by: zhangmi
 * @Last Modified time: 2021-09-07 17:12:57
 */

const STOREREQ_LIST = {
	appcode: '400400000', //物资需求申请单应用编码
	transferDataSource: 'pu.pu.storereq.transferDataSource', //缓存名称，转单和下游卡片页为一个缓存
	dataSource: 'pu.pu.storereq.storereqDataSource', //缓存名称 列表和卡片公用一个
	openBillURL: '/nccloud/pu/storereq/openBill.do', //整单打开的地址
	closeBillURL: '/nccloud/pu/storereq/closeBill.do', //整单关闭的地址
	queryTransferURL: '/nccloud/pu/storereq/queryTransferList.do', //查询物资及服务需求单
	commitURL: '/nccloud/pu/storereq/commit.do', //提交地址
	uncommitURL: '/nccloud/pu/storereq/uncommit.do', //收回地址
	queryListURL: '/nccloud/pu/storereq/queryList.do', //查询列表地址
	batchDeleteURL: '/nccloud/pu/storereq/batchDelete.do', //批量删除地址
	deleteURL: '/nccloud/pu/storereq/delete.do', //删除地址
	queryPageURL: '/nccloud/pu/storereq/queryPage.do', //分页查询地址
	printURL: '/nccloud/pu/storereq/print.do', //打印地址
	transferUrl: '/transfer',
	id: 'id',
	oid: '1001K61000000000JOMN', //查询模板nc的 1002Z810000000008MYY   新的 1001K61000000000JOMN   0001Z81000000006TF0J
	listUrl: '/list',
	cardUrl: '/card',
	formId: 'list_head', //表头区域
	tableId: 'list_body', //表体区域
	VIEW: 'VIEW', //拉单主子拉平区域
	tailinfo: 'tailinfo', //操作信息
	outputType: 'output', //输出类型
	status: 'status',
	cardpageid: '400400000_card', //卡片pagecode
	listpageid: '400400000_list', //列表pagecode
	transferList: '400400000_4D14to422X', //物资拉物资及服务需求单
	appid: '0001Z81000000002YS6G', //注册小应用
	moduleId: '4004', //模块id
	browse: 'browse', //状态
	add: 'add', //状态
	searchId: 'list_query',
	edit: 'edit',
	purchaseorg: 'pu', // 采购 业务场景
	storereq: 'st', // 库存 业务场景
	xiangmu: 'it', //项目  业务场景
	transfer: 'transfer', //拉单类型使用
	// 列表态页签，单据状态
	toCommit: 'toCommit', // 待提交
	approving: 'approving', //审批中
	executing: 'executing', //执行中
	all: 'all', //全部
	templetqueryurl: '/nccloud/platform/templet/querypage.do',
	tree: 'tree', //查询模式
	simple: 'simple', //查询模式
	pk_org: 'pk_org',
	pk_mater_plan: 'pk_mater_plan', //物资及服务需求单-表头主键
	pk_mater_plan_b: 'pk_mater_plan_b', //物资及服务需求单-表体主键
	billType: '422X', //物资需求申请单的单据类型
	pk_appdept: 'pk_storereq_b.pk_appdept', //部门
	pk_apppsn: 'pk_storereq_b.pk_apppsn', //人员
	pk_reqstordoc: 'pk_storereq_b.pk_reqstordoc', //需求仓库
	vbillcode: 'vbillcode', //单据号码
	approvesce: 'approvesce',
	scene: 'scene'
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
const STOREREQ_LIST_BUTTON = {
	Refresh: 'Refresh', //刷新
	ApproveInfo: 'ApproveInfo', //查看审批意见
	add: 'Add', //新增
	AddFrom4D14: 'AddFrom4D14', //物资拉物资及服务需求单
	delete: 'Delete', //删除
	Print: 'Print', //打印
	Print_list: 'Print_list', //打印清单
	output: 'output', //输出
	mergeShow: 'mergeShow', //合并显示
	deleteRow: 'Delete', //删除-行
	Edit: 'Edit', //修改
	File: 'File', //附件管理
	copy: 'Copy', //复制
	commit: 'Commit', //提交
	commitRow: 'Commit', //提交-行
	uncommit: 'UnCommit', //收回
	OpenBill: 'OpenBill', //整单打开
	CloseBill: 'CloseBill', //整单关闭
	QueryAboutBusiness: 'QueryAboutBusiness', //单据追溯
	list_inner: 'list_inner', //列表行按钮区域
	PrintCountQuery: 'PrintCountQuery' //打印次数查询
};
const STOREREQ_CARD = {
	transfer: 'transfer',
	leftarea: 'leftarea', //左侧的列表区域
	type: 'type', //标记类型  拉单使用
	card: 'card', //卡片页
	reqstordocURL: 'nccloud.web.pu.storereq.util.ReqstordocSqlBuilder', //需求仓库过滤
	materialURL: 'nccloud.web.pu.storereq.util.MaterialSqlBuilder', //物料过滤
	headBeforeEventURL: '/nccloud/pu/storereq/headBeforeEdit.do', //表头编辑前事件
	bodyBeforeEventURL: '/nccloud/pu/storereq/bodyBeforeEdit.do', //表体编辑前事件
	orgChangEventURL: '/nccloud/pu/storereq/orgChangEvent.do', //主组织编辑事件
	commitURL: '/nccloud/pu/storereq/commit.do', //提交地址
	uncommitURL: '/nccloud/pu/storereq/uncommit.do', //提交地址
	openBillForCardURL: '/nccloud/pu/storereq/openBillForCard.do', //整单打开的地址
	closeBillForCardURL: '/nccloud/pu/storereq/closeBillForCard.do', //整单关闭的地址
	saveURL: '/nccloud/pu/storereq/save.do', //修改保存
	saveCommitURL: '/nccloud/pu/storereq/saveCommit.do', //保存提交
	deleteURL: '/nccloud/pu/storereq/delete.do', //删除地址
	newSaveURL: '/nccloud/pu/storereq/newSave.do', //新增保存
	translateURL: '/nccloud/pu/storereq/translate.do', //翻译空模板使用
	lineCloseURL: '/nccloud/pu/storereq/lineClose.do', //行关闭
	lineOpenURL: '/nccloud/pu/storereq/lineOpen.do', //行打开
	copyCardInfoURL: '/nccloud/pu/storereq/copy.do', //复制新增
	queryCardInfoURL: '/nccloud/pu/storereq/queryCardInfo.do', //查询卡片信息
	editCardInfoURL: '/nccloud/pu/storereq/edit.do', //修改卡片信息
	numbAfterEditURL: '/nccloud/pu/storereq/numbAfterEdit.do', //联动计算请求地址
	bodyAfterEditURL: '/nccloud/pu/storereq/bodyAfterEdit.do', //表体编辑后请求地址
	headAfterEditURL: '/nccloud/pu/storereq/headAfterEdit.do', //表头编辑后请求地址
	combine: '/nccloud/pu/storereq/combineshowaction.do', //合并显示
	combintPrint: '/nccloud/pu/storereq/combineprintaction.do', //合并打印
	transferURL: '/nccloud/pu/storereq/transferAction.do', //根据选中的物资及服务需求单生成 物资需求申请单
	saveandcommit: '/nccloud/pu/storereq/saveandcommit.do', //同一个事务的保存提交
	id: 'id',
	copy: 'copy',
	orgChange: 'orgChange', //
	pageMsgType: 'pageMsgType', //审批中心父地址的参数
	comeType: 'comeType',
	outputType: 'output', //输出类型
	oid: '0001Z81000000002YS6G',
	approveoid: '0001Z81000000005UGFM', //物资需求申请单审批小应用
	listUrl: '/list',
	cardUrl: '/card',
	formId: 'card_head', //表头区域
	tableId: 'card_body', //表体区域
	tailinfo: 'tailinfo', //操作信息
	childform1: 'childform1',
	status: 'status',
	cardpageid: '400400000_card', //卡片pagecode
	listpageid: '400400000_list', //列表pagecode
	moduleId: '4004', //模块id
	browse: 'browse', //状态
	add: 'add', //状态
	searchId: 'list_query',
	edit: 'edit',
	purchaseorg: 'pu', // 采购 业务场景
	storereq: 'st', // 库存 业务场景
	// 列表态页签，单据状态
	toCommit: 'toCommit', // 待提交
	approving: 'approving', //审批中
	executing: 'executing', //执行中
	all: 'all', //全部
	templetqueryurl: '/nccloud/platform/templet/querypage.do',
	// firstcontent: getLangByResId(this, '4004STOREREQ-000033') /* 国际化处理： 首页*/,
	// firstcontent: getLangByResId(this, '4004STOREREQ-000034') /* 国际化处理： 物资需求申请单管理*/,
	// firstcontent: getLangByResId(this, '4004STOREREQ-000035') /* 国际化处理： 物资需求申请*/,
	pk_org: 'pk_org', //库存组织
	pk_org_v: 'pk_org_v', //库存组织版本
	billType: '422X', //物资需求申请单的单据类型
	tempstatus: 'tempstatus', //暂存标志
	tempCardCacheKey: 'pu.pu.storereq.tempCardCacheKey', //暂存缓存标识
	config: {
		headAreaId: 'card_head',
		bodyAreaId: 'card_body',
		bodyPKfield: 'pk_storereq_b'
	},
	bodyFileds: [
		'dreqdate',
		'pk_srcmaterial',
		'pk_nextbalanceorg',
		'pk_nextbalanceorg_v',
		'pk_appdept_v',
		'pk_appdept',
		'pk_apppsn',
		'cprojectid'
	]
};
//列表按钮

const STOREREQ_CARD_BUTTON = {
	Group1: 'Group1', //新增页按钮组
	Group2: 'Group2', //新增肩上按钮组
	Group3: 'Group3', //自由态单据浏览态按钮组
	Group31: 'Group3-1', //新增下拉按钮
	Group7: 'Group7',
	Save: 'Save', //保存
	SaveCommit: 'SaveCommit', //保存提交
	Cancel: 'Cancel', //取消
	AddLine: 'AddLine', //新增肩上增行
	DeleteLine: 'DeleteLine', //新增肩上删行
	CopyLine: 'CopyLine', //新增肩上复制行
	OnhandQuery: 'OnhandQuery', //新增肩上存量查拣
	BatchUpdate: 'BatchUpdate', //新增肩上批改
	EditRowNum: 'EditRowNum', //新增肩上重排行号
	Material_PastLast: 'Material_PastLast', //新增肩上粘贴按钮组
	PasteLast: 'PasteLast', //粘贴至末行
	PasteCancel: 'PasteCancel', //新增肩上复制取消
	PasteThis: 'PasteThis', //粘贴至此
	Add: 'Add', //新增自制
	AddFrom4D14: 'AddFrom4D14', //物资拉物资及服务需求单
	CancelTransfer: 'CancelTransfer', //退出转单
	Edit: 'Edit', //修改
	Delete: 'Delete', //删除
	Copy: 'Copy',
	Commit: 'Commit',
	More: 'More', //
	QueryAboutBusiness: 'QueryAboutBusiness', //更多里的单据追溯
	OnhandQuery1: 'OnhandQuery1', //更多里的存量查拣
	File: 'File', //更多里的附件管理
	Print: 'Print', //更多里的打印
	PrintCountQuery: 'PrintCountQuery', //打印次数查询
	mergeShow: 'mergeShow', //合并显示
	output: 'output', //打印-输出
	UnCommit: 'UnCommit', //审批中单据的收回
	ApproveInfo: 'ApproveInfo', //查看审批意见
	AssistMenu: 'AssistMenu', //辅助功能下拉按钮
	CloseBill: 'CloseBill', //整单关闭
	OpenBill: 'OpenBill', //整单打开
	OpenRow: 'OpenRow', //展开-浏览态和编辑态公用
	CloseRow: 'CloseRow', //收起
	OpenRowBrowse: 'OpenRowBrowse', //行操作-展开-浏览态
	OpenRowEdit: 'OpenRowEdit', //行操作-展开-编辑，新增
	Delete_row: 'DeleteLine', //行操作-删行
	CopyLine_row: 'CopyLine_row', //行操作-复制行
	InsertLine: 'InsertLine', //行操作-插入行
	Refresh: 'Refresh', //刷新
	LineOpen: 'LineOpen', //行打开
	LineClose: 'LineClose', //行关闭
	TemporaryStorage: 'TemporaryStorage', //暂存
	ShowDraft: 'ShowDraft', //草稿
	card_body_inner: 'card_body_inner', //行操作-area 按钮显示区域名称
	cardBodyInit: [
		'Group2',
		'AddLine',
		'DeleteLine',
		'CopyLine',
		'OnhandQuery',
		'EditRowNum',
		'OpenRow',
		'DeleteLine',
		'CopyLine_row',
		'InsertLine'
	],
	cardBodyCopy: [ 'Material_PastLast', 'PasteLast', 'PasteCancel', 'PasteThis' ],
	shoudlerBtns: [ 'DeleteLine', 'CopyLine', 'OnhandQuery', 'EditRowNum' ]
};
//表头
const ATTRCODE = {
	ts: 'ts',
	vtrantypecode: 'vtrantypecode', //单据类型编码
	pk_storereq: 'pk_storereq', //物资需求申请单主键
	pk_group: 'pk_group', //集团
	pk_org: 'pk_org', //库存组织
	vbillcode: 'vbillcode', //申请单号 单据号
	pk_org_v: 'pk_org_v', //库存组织版本
	dbilldate: 'dbilldate', //申请日期
	pk_project: 'pk_project', //项目
	pk_apppsnh: 'pk_apppsnh', //表头申请人
	pk_appdepth_v: 'pk_appdepth_v', //表头申请部门
	pk_appdepth: 'pk_appdepth', //表头申请部门最新版本
	ctrantypeid: 'ctrantypeid', //表头物资需求申请类型
	fbillstatus: 'fbillstatus', //单据状态
	freqtypeflag: 'freqtypeflag', //需求类型
	noEditfield: [ 'ts' ], //表头不允许编辑字段
	sagaStatus: 'saga_status'
};
//表体
const ATTRCODES = {
	csourcebid: 'csourcebid', //来源单据明细
	ts: 'ts', //时间戳
	crowno: 'crowno', //行号
	pk_appdept_v: 'pk_appdept_v', //申请部门版本
	pk_appdept: 'pk_appdept', //申请部门
	pk_reqstordoc: 'pk_reqstordoc', //需求仓库
	pk_apppsn: 'pk_apppsn', //申请人
	nastnum: 'nastnum', //数量
	ntaxmny: 'ntaxmny', //本币价税合计
	nnum: 'nnum', //主数量
	naccuoutreqnum: 'naccuoutreqnum', //累计申请出库主数量
	naccuoutnum: 'naccuoutnum', //累计出库数量
	castunitid: 'castunitid', //单位
	cunitid: 'cunitid', //主单位
	vchangerate: 'vchangerate', //换算率
	dreqdate: 'dreqdate', //需求日期
	pk_material: 'pk_material', //物料编码
	csourcetypecode: 'csourcetypecode', //来源单据类型
	cprojectid: 'cprojectid', //项目
	cbs: 'cbs', //CBS
	pk_nextbalanceorg_v: 'pk_nextbalanceorg_v', //下次平衡库存组织
	pk_nextbalanceorg: 'pk_nextbalanceorg', //下次平衡库存组织最新版本
	cprojecttaskid: 'cprojecttaskid', //项目任务
	vbatchcode: 'vbatchcode', //批次号
	pk_batchcode: 'pk_batchcode', //批次号主键
	//汇总ID 汇总人 汇总日期 调拨单据交易类型 调拨单据号 调拨单据类型 调拨单据行号 调拨订单明细 调拨订单 下游单据交易类型 下游单据类型  下游单据行号 下游单据号 下游单据行 下游单据 转净需求主数量 库存满足主数量 已平衡 来源单据行时间戳 来源单据时间戳 源头单据行号 源头交易类型 源头单据号 源头单据 源头单据类型 来源单据行号 来源交易类型 来源单据号 汇总平衡转请购主数量 累计请购主数量 集团 库存组织 可申请出库主数量 本币币种 累计出库主数量 累计申请出库主数量 是否关闭 批次号主键 原始需求库存组织
	noEditfield: [
		'cgatherid',
		'cgatherpsnid',
		'tgathertime',
		'vfirsttrantype2',
		'vfirstcode2',
		'cfirsttypecode2',
		'vfirstrowno2',
		'cfirstbid2',
		'cfirstid2',
		'vsourcetrantype2',
		'csourcetypecode2',
		'vsourcerowno2',
		'vsourcecode2',
		'csourcebid2',
		'csourceid2',
		'nnetnum',
		'naccustornum',
		'bendgather',
		'sourcebts',
		'sourcets',
		'vfirstrowno',
		'vfirsttrantype',
		'vfirstcode',
		'cfirstid',
		'cfirsttypecode',
		'vsourcerowno',
		'vsourcetrantype',
		'vsourcecode',
		'naccumminusnum',
		'naccumbuyreqnum',
		'pk_group',
		'pk_org',
		'pk_org_v',
		'ncanoutreqnum',
		'ccurrencyid',
		'naccuoutnum',
		'naccuoutreqnum',
		'bclose',
		'pk_batchcode',
		'pk_reqstoorg_v',
		'ts'
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
	'cunitid', //主单位
	'castunitid', //单位
	'vchangerate', //换算率
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
	'vfree10'
];

const NCMODULE = {
	PIM: '4810' //项目综合管理
};

let BATCHITEMSNOFILTER = [
	'nastnum',
	'nnum',
	'dreqdate' //需求日期
];
/**
 * 自由辅助属性
 */
const FREEFIELD = {
	ccustomerid: '',
	ccustomervid: '',
	cvendorid: 'cvendorid',
	cvendorvid: 'cvendorvid'
};
export {
	STOREREQ_LIST,
	STOREREQ_CARD,
	ATTRCODE,
	ATTRCODES,
	STOREREQ_LIST_BUTTON,
	STOREREQ_CARD_BUTTON,
	FBILLSTATUS,
	CLEARFIELDS,
	clearItems,
	NCMODULE,
	BATCHITEMSNOFILTER,
	FREEFIELD
};
