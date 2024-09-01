/*
 * @Author: zhangchangqing
 * @PageInfo: 请购单
 * @Date: 2018-04-19 10:28:28
 * @Last Modified by: zhangmi
 * @Last Modified time: 2021-10-26 18:24:03
 */

const BUYINGREQ_LIST = {
	transferDataSource: 'pu.pu.buyingreq.transferDataSource', //缓存名称，转单和下游卡片页为一个缓存
	dataSource: 'pu.pu.buyingreq.buyingreqDataSource', //缓存名称 列表和卡片公用一个
	printURL: '/nccloud/pu/buyingreq/print.do', //请购单打印
	priceprintURL: '/nccloud/pu/buyingreq/priceprint.do', //请购单价格论证表打印
	queryTransferURL: '/nccloud/pu/buyingreq/queryTransferList.do', //查询物资需求申请单
	openBillURL: '/nccloud/pu/buyingreq/openBill.do', //整单打开的地址
	closeBillURL: '/nccloud/pu/buyingreq/closeBill.do', //整单关闭的地址
	commitURL: '/nccloud/pu/buyingreq/commit.do', //提交地址
	uncommitURL: '/nccloud/pu/buyingreq/uncommit.do', //收回
	queryListURL: '/nccloud/pu/buyingreq/queryList.do', //查询列表地址
	batchDeleteURL: '/nccloud/pu/buyingreq/batchDelete.do', //批量删除地址
	deleteURL: '/nccloud/pu/buyingreq/delete.do', //删除地址
	queryPageURL: '/nccloud/pu/buyingreq/queryPage.do', //分页查询地址
	ntpLinkList: '/nccloud/pu/buyingreq/ntpLinkList.do', //单据联查采购计划到请购单的列表加载
	id: 'id',
	oid: '1001K61000000000N5TC', //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改   1001K61000000000N5TC  1001K61000000000JOMN
	ooid: '1001K61000000000JOMN', //查询物资需求申请单使用
	listUrl: '/list',
	cardUrl: '/card',
	pk_storereq: 'pk_storereq', //物资需求申请单的表头pk
	pk_storereq_b: 'pk_storereq_b', //物资需求申请单的表体pk
	transferUrl: '/transfer',
	transfer: 'transfer', //
	grid: 'grid', //表格bodycode
	formId: 'list_head', //表头区域
	tableId: 'list_body', //表体区域
	VIEW: 'VIEW', //拉单拉平取悦
	tailinfo: 'tailinfo', //操作信息
	status: 'status',
	purchaseorg: 'pu', // 采购 业务场景
	storereq: 'st', // 库存 业务场景
	appcode: '400400000', //物资需求申请单的应用编码
	appcode20: '400400400', //请购单的应用编码
	cardpageid: '400400400_card', //卡片pagecode
	listpageid: '400400400_list', //列表pagecode
	transferList: '400400000_422Xto20', //请购单拉单查询列表 400400000_422Xto20  400400000_transfer
	transferCard: '', //
	appid: '0001Z810000000039R8O', //注册小应用
	transferAppid: '0001Z81000000002YS6G', //注册小应用
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
	// firstcontent: getLangByResId(this, '4004PRAYBILL-000042'),/* 国际化处理： 首页*/
	// firstcontent: getLangByResId(this, '4004PRAYBILL-000043'),/* 国际化处理： 请购单管理*/
	// firstcontent: getLangByResId(this, '4004PRAYBILL-000044'),/* 国际化处理： 物资需求申请*/
	pk_org: 'pk_org',
	billType: '20', //请购单的单据类型
	outputType: 'output', //打印输出类型
	pk_appdept: 'pk_buyingreq_b.pk_appdept', //部门
	pk_apppsn: 'pk_buyingreq_b.pk_apppsn', //人员
	pk_reqstordoc: 'pk_buyingreq_b.pk_reqstordoc', //需求仓库
	vbillcode: 'vbillcode', //单据号码
	exportset: '/nccloud/pu/buyingreq/exportset.do', //导出模板设置
	import: '/nccloud/pu/buyingreq/import.do', //导入
	scene: 'scene',
	approvesce: 'approvesce'
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
const BUYINGREQ_LIST_BUTTON = {
	Refresh: 'Refresh', //刷新
	StorereqBtn: 'StorereqBtn', //拉单-物资需求申请单
	ApproveInfo: 'ApproveInfo', //查看审批意见
	add: 'Add', //新增
	delete: 'Delete', //删除
	deleteRow: 'Delete', //删除-行
	Edit: 'Edit', //修改
	copy: 'Copy', //复制
	File: 'File', //附件管理
	Print: 'Print', //打印
	Print_list: 'Print_list', //打印清单
	output: 'output', //输出
	commit: 'Commit', //提交
	commitRow: 'Commit', //提交-行
	uncommit: 'UnCommit', //收回
	OpenBill: 'OpenBill', //整单打开
	CloseBill: 'CloseBill', //整单关闭
	list_inner: 'list_inner', //列表行按钮区域
	QueryAboutBusiness: 'QueryAboutBusiness', //单据追溯
	Import: 'Import', //导入
	Export: 'Export', //导出
	PrintCountQuery: 'PrintCountQuery' //打印次数查询
};
const BUYINGREQ_CARD = {
	card: 'card', //一主一子 billtype
	//推单
	sotoPraybillURL: '/nccloud/pu/buyingreq/sotoPraybillqueryaction.do', // 销售请购单
	reqstordocURL: 'nccloud.web.pu.buyingreq.util.ReqstordocSqlBuilder', //需求仓库过滤
	materialURL: 'nccloud.web.pu.buyingreq.util.MaterialSqlBuilder', //物料过滤
	headBeforeEventURL: '/nccloud/pu/buyingreq/headBeforeEdit.do', //表头编辑前事件
	bodyBeforeEventURL: '/nccloud/pu/buyingreq/bodyBeforeEdit.do', //表体编辑前事件
	commitURL: '/nccloud/pu/buyingreq/commit.do', //提交地址
	querypriceURL: '/nccloud/pu/buyingreq/queryprice.do', //查询价格论证表
	saveCommitURL: '/nccloud/pu/buyingreq/saveCommit.do', //保存提交
	uncommitURL: '/nccloud/pu/buyingreq/uncommit.do', //收回地址
	transferURL: '/nccloud/pu/buyingreq/transferAction.do', //根据选中的物资需求申请单生成请购单
	openBillForCardURL: '/nccloud/pu/buyingreq/openBillForCard.do', //整单打开的地址
	closeBillForCardURL: '/nccloud/pu/buyingreq/closeBillForCard.do', //整单关闭的地址
	orgChangEventURL: '/nccloud/pu/buyingreq/orgChangEvent.do', //主组织编辑事件
	deleteURL: '/nccloud/pu/buyingreq/delete.do', //删除地址
	saveURL: '/nccloud/pu/buyingreq/save.do', //修改保存
	newSaveURL: '/nccloud/pu/buyingreq/newSave.do', //新增保存
	lineCloseURL: '/nccloud/pu/buyingreq/lineClose.do', //行关闭
	lineOpenURL: '/nccloud/pu/buyingreq/lineOpen.do', //行打开
	copyCardInfoURL: '/nccloud/pu/buyingreq/copy.do', //复制新增
	queryCardInfoURL: '/nccloud/pu/buyingreq/queryCardInfo.do', //查询卡片信息
	editCardInfoURL: '/nccloud/pu/buyingreq/edit.do', //修改查询卡片信息pu.buyingreq.edit
	numbAfterEditURL: '/nccloud/pu/buyingreq/numbAfterEdit.do', //联动计算请求地址
	bodyAfterEditURL: '/nccloud/pu/buyingreq/bodyAfterEdit.do', //表体编辑后请求地址
	headAfterEditURL: '/nccloud/pu/buyingreq/headAfterEdit.do', //表头编辑后请求地址
	combine: '/nccloud/pu/buyingreq/combineshowaction.do', //合并显示
	combintPrint: '/nccloud/pu/buyingreq/combineprintaction.do', //合并打印
	saveandcommit: '/nccloud/pu/buyingreq/saveandcommit.do', //保存提交
	linpayplay: '/nccloud/pu/buyingreq/linpayplay.do', //联查采购计划,
	id: 'id',
	orgChange: 'orgChange', //组织修改的弹出框定义
	ts: 'ts',
	pageMsgType: 'pageMsgType', //审批中心父页面url参数
	copy: 'copy',
	comeType: 'comeType',
	oid: '0001Z810000000039R8O',
	approveoid: '0001Z81000000004X97S', //请购单审批的oid
	transferid: '1001K610000000017L9J', //请购单拉物资需求申请单
	purchaseorg: 'pu', // 采购 业务场景
	storereq: 'st', // 库存 业务场景
	listUrl: '/list',
	cardUrl: '/card',
	formId: 'card_head', //表头区域
	tableId: 'card_body', //表体区域
	childform1: 'childform1', //侧拉区域
	price_form: 'price_form', //价格论证表区域
	leftarea: 'leftarea', //左侧的列表区域
	tailinfo: 'tailinfo', //操作信息
	status: 'status',
	type: 'type', //用来判断是否是从转单页面进入
	transfer: 'transfer', //
	cardpageid: '400400400_card', //卡片pagecode
	listpageid: '400400400_list', //列表pagecode
	pricePage: '400400400_price', //价格论证表
	pageid: 'pageid', //模板id
	moduleId: '4004', //模块id
	browse: 'browse', //状态
	add: 'add', //状态
	searchId: 'list_query',
	edit: 'edit',
	// 列表态页签，单据状态
	toCommit: 'toCommit', // 待提交
	approving: 'approving', //审批中
	executing: 'executing', //执行中
	all: 'all', //全部
	templetqueryurl: '/nccloud/platform/templet/querypage.do',
	// firstcontent: getLangByResId(this, '4004PRAYBILL-000042'),/* 国际化处理： 首页*/
	// firstcontent: getLangByResId(this, '4004PRAYBILL-000043'),/* 国际化处理： 请购单管理*/
	// firstcontent: getLangByResId(this, '4004PRAYBILL-000044'),/* 国际化处理： 物资需求申请*/
	pk_org: 'pk_org', //库存组织
	pk_org_v: 'pk_org_v', //库存组织版本
	billType: '20', //请购单的单据类型
	billTypeOrder: '21', //采购订单类型
	replenishmentarrange: 'replenishmentarrange', //推单
	directarrange: 'directarrange', //推单
	channelTypeDataSource1: 'scm.so.replenishmentarrange.main', //直运的缓存id
	channelTypeDataSource2: 'scm.so.directarrange.main', //补货的缓存id
	channelTypeDataSource3: 'scm.so.directarrange.main', //维修计划缓存
	channelType: 'channelType', //推单
	srcbilltype: 'srcbilltype', //维修计划推单
	srcbilltype4B32: '4B32', //维修计划单据类型
	srcbilltype4B36: '4B36', //资产工单单据类型
	tempstatus: 'tempstatus', //暂存标志
	tempCardCacheKey: 'pu.pu.buyingreq.tempCardCacheKey', //暂存缓存标识
	config: {
		headAreaId: 'card_head',
		bodyAreaId: 'card_body',
		bodyPKfield: 'pk_praybill_b'
	},
	bodyFileds: [
		'pk_purchaseorg',
		'pk_srcmaterial',
		'pk_material',
		'cordertrantypecode',
		'cprojectid',
		'dbilldate',
		'pk_suggestsupplier',
		'pk_suggestsupplier_v',
		'dsuggestdate',
		'nnum',
		'nastnum',
		'ntaxmny',
		'ntaxprice'
	]
};
//卡片按钮

const BUYINGREQ_CARD_BUTTON = {
	Import: 'Import', //导入
	Export: 'Export', //导出
	Group1: 'Group1', //新增页按钮组
	Group2: 'Group2', //新增肩上按钮组
	Group3: 'Group3', //自由态单据浏览态按钮组
	Group7: 'Group7', //整单打开和关闭的分组
	Save: 'Save', //保存
	SaveCommit: 'SaveCommit', //保存提交
	Cancel: 'Cancel', //取消
	AddLine: 'AddLine', //新增肩上增行
	DeleteLine: 'DeleteLine', //新增肩上删行
	CopyLine: 'CopyLine', //新增肩上复制行
	OnhandQuery: 'OnhandQuery', //新增肩上存量查拣
	LinkPoPlan: 'LinkPoPlan', //联查采购计划
	BatchUpdate: 'BatchUpdate', //新增肩上批改
	EditRowNum: 'EditRowNum', //新增肩上重排行号
	StorereqBtn: 'StorereqBtn', //请购单拉单
	CancelTransfer: 'CancelTransfer', //退出转单
	Adds: 'Adds',
	Add: 'Add',
	Edit: 'Edit',
	Delete: 'Delete',
	Copy: 'Copy',
	Commit: 'Commit',
	More: 'More', //联查
	Refresh: 'Refresh', //刷新
	Price: 'Price', //价格论证表
	QueryAboutBusiness: 'QueryAboutBusiness', //更多里的单据追溯
	File: 'File', //更多里的附件管理
	Print: 'Print', //更多里的打印
	PrintCountQuery: 'PrintCountQuery', //打印次数查询
	output: 'output', //输出
	mergeShow: 'mergeShow', //合并显示
	UnCommit: 'UnCommit', //收回
	ApproveInfo: 'ApproveInfo', //查看审批意见
	AssistMenu: 'AssistMenu', //辅助功能下拉按钮
	CloseBill: 'CloseBill', //整单关闭
	OpenBill: 'OpenBill', //整单打开
	OpenRow: 'OpenRow', //展开通用
	CloseRow: 'CloseRow', //收起
	OpenRowBrowse: 'OpenRowBrowse', //行操作-展开-浏览态
	OpenRowEdit: 'OpenRowEdit', //行操作-展开-编辑，新增
	Delete_row: 'DeleteLine', //行操作-删行
	CopyLine_row: 'CopyLine_row', //行操作-复制行
	InsertLine: 'InsertLine', //行操作-插入行
	PasteThis: 'PasteThis', //行操作-粘贴至此
	LineOpen: 'LineOpen', //行打开
	LineClose: 'LineClose', //行关闭
	Material_PastLast: 'Material_PastLast', //新增肩上粘贴按钮组
	PasteLast: 'PasteLast', //粘贴至末行
	PasteCancel: 'PasteCancel', //新增肩上复制取消
	PasteThis: 'PasteThis', //粘贴至此
	card_body_inner: 'card_body_inner', //行操作-area 按钮显示区域名称
	TemporaryStorage: 'TemporaryStorage', //暂存
	ShowDraft: 'ShowDraft', //草稿
	cardBodyInit: [
		'Group2',
		'AddLine',
		'DeleteLine',
		'CopyLine',
		'OnhandQuery',
		// 'LinkPoPlan',
		'EditRowNum',
		'OpenRow',
		'DeleteLine',
		'CopyLine_row',
		'InsertLine'
	],
	cardBodyCopy: [ 'Material_PastLast', 'PasteLast', 'PasteCancel', 'PasteThis' ],
	shoudlerBtns: [ 'DeleteLine', 'CopyLine', 'OnhandQuery', 'EditRowNum', 'LinkPoPlan' ]
};
//表头
const ATTRCODE = {
	ts: 'ts',
	vtrantypecode: 'vtrantypecode', //单据类型编码
	pk_praybill: 'pk_praybill', //请购单表头主键
	pk_srcpraybill: 'pk_srcpraybill',
	pk_org_v: 'pk_org_v',
	pk_org: 'pk_org', //组织最新版本
	dbilldate: 'dbilldate', //申请日期
	pk_apppsnh: 'pk_apppsnh', //表头申请人
	pk_appdepth_v: 'pk_appdepth_v', //表头申请部门
	pk_appdepth: 'pk_appdepth', //表头申请部门最新版本
	ctrantypeid: 'ctrantypeid', //表头请购类型
	fbillstatus: 'fbillstatus', //单据状态
	modifystatus: 'modifystatus', //变更状态
	freqtypeflag: 'freqtypeflag', //需求类型
	pk_plandept_v: 'pk_plandept_v', //计划部门版本
	pk_plandept: 'pk_plandept', //计划部门
	pk_planpsn: 'pk_planpsn', //计划员
	chprojectid: 'chprojectid', //项目
	vbillcode: 'vbillcode', //单据号
	bdirecttransit: 'bdirecttransit', //直运
	bispositioninv: 'bispositioninv', //按计划岗过滤物料
	vmemo: 'vmemo', //备注
	bsctype: 'bsctype', //委外
	otherfields: [ 'pk_org' ],
	sagaStatus: 'saga_status',
	saga_gtxid: 'saga_gtxid'
};
//表体
const ATTRCODES = {
	ts: 'ts',
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
	dsuggestdate: 'dsuggestdate', //建议订货日期
	pk_suggestsupplier: 'pk_suggestsupplier', //建议供应商
	pk_suggestsupplier_v: 'pk_suggestsupplier_v', //建议供应商版本
	castunitid: 'castunitid', //单位
	cunitid: 'cunitid', //主单位
	pk_reqstor: 'pk_reqstor', //需求仓库
	pk_reqdept: 'pk_praybill_b.pk_reqdept', //需求部门
	dbilldate: 'dbilldate', //需求日期
	pk_appdept_v: 'pk_appdept_v', //申请部门
	pk_material: 'pk_material', //物料编码
	cprojectid: 'cprojectid', //项目
	cprojecttaskid: 'cprojecttaskid', //项目任务
	vbatchcode: 'vbatchcode', //批次号
	pk_batchcode: 'pk_batchcode', //批次档案
	vchangerate: 'vchangerate', //换算率
	cordertrantypecode: 'cordertrantypecode', //订单类型
	ntaxmny: 'ntaxmny', //本币价税合计
	ntaxprice: 'ntaxprice', //主本币含税单价
	csourcetypecode: 'csourcetypecode', //来源单据类型
	csourceid: 'csourceid', //来源单据标识
	csourcebid: 'csourcebid', //来源单据表体行id
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

let BATCHITEMSNOFILTER = [
	'nastnum',
	'nnum',
	'dreqdate', //需求日期
	'dsuggestdate' //建议订货日期
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
	'pk_suggestsupplier_v', //建议供应商版本
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
/**
 * 自由辅助属性
 */
const FREEFIELD = {
	ccustomerid: 'casscustid',
	ccustomervid: 'casscustvid',
	cvendorid: 'pk_suggestsupplier',
	cvendorvid: 'pk_suggestsupplier_v'
};
export {
	BUYINGREQ_LIST,
	BUYINGREQ_CARD,
	ATTRCODE,
	ATTRCODES,
	BUYINGREQ_LIST_BUTTON,
	BUYINGREQ_CARD_BUTTON,
	FBILLSTATUS,
	CLEARFIELDS,
	clearItems,
	BATCHITEMSNOFILTER,
	FREEFIELD
};
