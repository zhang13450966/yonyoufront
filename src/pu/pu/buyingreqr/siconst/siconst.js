/*
 * @Author: zhangchangqing
 * @PageInfo: 请购单修订
 * @Date: 2018-04-19 10:28:28
 * @Last Modified by: tianzhyw
 * @Last Modified time: 2021-10-26 20:33:51
 */

const BUYINGREQ_LIST = {
	dataSource: 'pu.pu.buyingreqr.buyingreqrDataSource', //缓存名称 列表和卡片公用一个
	printURL: '/nccloud/pu/buyingreq/print.do', //请购单打印
	openBillURL: '/nccloud/pu/buyingreq_r/openBill.do', //整单打开的地址
	closeBillURL: '/nccloud/pu/buyingreq_r/closeBill.do', //整单关闭的地址
	commitURL: '/nccloud/pu/buyingreq/commit.do', //提交地址
	uncommitURL: '/nccloud/pu/buyingreq/uncommit.do', //收回
	queryListURL: '/nccloud/pu/buyingreq_r/queryList.do', //查询列表地址
	batchDeleteURL: '/nccloud/pu/buyingreq_r/batchDelete.do', //批量删除地址
	deleteURL: '/nccloud/pu/buyingreq_r/delete.do', //删除地址
	reviseDeleteURL: '/nccloud/pu/buyingreq_r/reviseDelete.do', //修订删除地址
	queryPageURL: '/nccloud/pu/buyingreq_r/queryPage.do', //分页查询地址
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
	cardpageid: '400400402_card', //卡片pagecode
	listpageid: '400400402_list', //列表pagecode
	historypageid: '400400402_history', //修订历史页面
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
	vbillcode: 'vbillcode', //单据号码
	isRevise: 'isRevise'
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
	ReviseHistory: 'ReviseHistory', //查看修订详情
	Revise: 'Revise', //修订
	ReviseDelete: 'ReviseDelete', //修订删除
	ApproveInfo: 'ApproveInfo', //查看审批意见
	ApproveInfoRow: 'ApproveInfoRow', //查看审批意见-行
	add: 'Add', //新增
	delete: 'Delete', //删除
	deleteRow: 'DeleteRow', //删除-行
	Edit: 'Edit', //修改
	EditRow: 'EditRow', //修改-行
	File: 'File', //附件管理
	Print: 'Print', //打印
	output: 'output', //输出
	copy: 'Copy', //复制
	commit: 'Commit', //提交
	commitRow: 'CommitRow', //提交-行
	uncommit: 'UnCommit', //收回
	approveInfo: 'ApproveInfo',
	OpenBill: 'OpenBill', //整单打开
	CloseBill: 'CloseBill', //整单关闭
	QueryAboutBusiness: 'QueryAboutBusiness', //单据追溯
	list_inner: 'list_inner', //列表行按钮区域
	PrintCountQuery: 'PrintCountQuery' //打印次数查询
};
const BUYINGREQ_CARD = {
	reqstordocURL: 'nccloud.web.pu.buyingreq.util.ReqstordocSqlBuilder', //需求仓库过滤
	materialURL: 'nccloud.web.pu.buyingreq.util.MaterialSqlBuilder', //物料过滤
	headBeforeEventURL: '/nccloud/pu/buyingreq/headBeforeEdit.do', //表头编辑前事件
	bodyBeforeEventURL: '/nccloud/pu/buyingreq/bodyBeforeEdit.do', //表体编辑前事件
	openBillForCardURL: '/nccloud/pu/buyingreq_r/openBillForCard.do', //整单打开的地址
	closeBillForCardURL: '/nccloud/pu/buyingreq_r/closeBillForCard.do', //整单关闭的地址
	deleteURL: '/nccloud/pu/buyingreq_r/delete.do', //删除地址
	saveURL: '/nccloud/pu/buyingreq_r/save.do', //修改保存
	newSaveURL: '/nccloud/pu/buyingreq_r/newSave.do', //新增保存
	lineCloseURL: '/nccloud/pu/buyingreq_r/lineClose.do', //行关闭
	lineOpenURL: '/nccloud/pu/buyingreq_r/lineOpen.do', //行打开
	copyCardInfoURL: '/nccloud/pu/buyingreq_r/copy.do', //复制新增
	queryCardInfoURL: '/nccloud/pu/buyingreq_r/queryCardInfo.do', //查询卡片信息
	orgChangEventURL: '/nccloud/pu/buyingreq/orgChangEvent.do', //主组织编辑事件
	numbAfterEditURL: '/nccloud/pu/buyingreq/numbAfterEdit.do', //联动计算请求地址
	bodyAfterEditURL: '/nccloud/pu/buyingreq/bodyAfterEdit.do', //表体编辑后请求地址
	headAfterEditURL: '/nccloud/pu/buyingreq/headAfterEdit.do', //表头编辑后请求地址
	queryHistory: '/nccloud/pu/buyingreq_r/queryHistory.do', //查询修订历史
	queryHistoryb: '/nccloud/pu/buyingreq_r/queryHistoryb.do', //查询修订历史表体
	queryTemplet: '/nccloud/platform/templet/querypage.do', //查询模板
	linpayplay: '/nccloud/pu/buyingreq/linpayplay.do', //联查采购计划
	commitURL: '/nccloud/pu/buyingreq/commit.do', //提交地址
	saveCommitURL: '/nccloud/pu/buyingreq/saveCommit.do', //保存提交
	saveAndCommit: '/nccloud/pu/buyingreq_r/saveAndCommit.do', //保存提交
	uncommitURL: '/nccloud/pu/buyingreq/uncommit.do', //收回地址
	reviseDeleteURL: '/nccloud/pu/buyingreq_r/reviseDelete.do', //修订删除地址
	card: 'card',
	id: 'id',
	copy: 'copy',
	comeType: 'comeType',
	oid: '0001Z81000000004F0KX', //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改 0001Z81000000004F0KX
	listUrl: '/list',
	cardUrl: '/card',
	formId: 'card_head', //表头区域
	tableId: 'card_body', //表体区域
	childform2: 'childform2', //侧拉区域
	tailinfo: 'tailinfo', //操作信息
	purchaseorg: 'pu', // 采购 业务场景
	storereq: 'st', // 库存 业务场景
	status: 'status',
	cardpageid: '400400402_card', //卡片pagecode
	listpageid: '400400402_list', //列表pagecode
	historypageid: '400400402_history', //修订历史页面
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
	// firstcontent: getLangByResId(this, '4004PRAYBILLR-000025'),/* 国际化处理： 首页*/
	// firstcontent: getLangByResId(this, '4004PRAYBILLR-000026'),/* 国际化处理： 请购单管理*/
	// firstcontent: getLangByResId(this, '4004PRAYBILLR-000027'),/* 国际化处理： 物资需求申请*/
	pk_org: 'pk_org', //库存组织
	pk_org_v: 'pk_org_v', //库存组织版本
	billType: '20', //请购单的单据类型
	billTypeOrder: '21', //订单类型  采购订单类型
	bodyFileds: [ 'pk_purchaseorg', 'pk_srcmaterial', 'pk_material', 'cordertrantypecode', 'cprojectid', 'dbilldate' ],
	config: {
		headAreaId: 'card_head',
		bodyAreaId: 'card_body',
		bodyPKfield: 'pk_praybill_b'
	},
	configSrc: {
		headAreaId: 'card_head',
		bodyAreaId: 'card_body',
		bodyPKfield: 'pk_srcpraybillb'
	}
};
//卡片按钮

const BUYINGREQ_CARD_BUTTON = {
	PrintCountQuery: 'PrintCountQuery', //打印次数查询
	Revise: 'Revise', //修订
	ReviseHistory: 'ReviseHistory', //修订历史
	ReviseDelete: 'ReviseDelete', //修订删除
	Refresh: 'Refresh', //刷新
	Group1: 'Group1', //新增页按钮组
	Group2: 'Group2', //新增肩上按钮组
	Group3: 'Group3', //自由态单据浏览态按钮组
	Group4: 'Group4', //自由态单据浏览态按钮组
	Save: 'Save', //保存
	SaveCommit: 'SaveCommit', //保存提交
	Cancel: 'Cancel', //取消
	AddLine: 'AddLine', //新增肩上增行
	DeleteLine: 'DeleteLine', //新增肩上删行
	CopyLine: 'CopyLine', //新增肩上复制行
	OnhandQuery: 'OnhandQuery', //新增肩上存量查拣
	BatchUpdate: 'BatchUpdate', //新增肩上批改
	EditRowNum: 'EditRowNum', //新增肩上重排行号
	Adds: 'Adds',
	Add: 'Add',
	Edit: 'Edit',
	Delete: 'Delete',
	Copy: 'Copy',
	Commit: 'Commit',
	More: 'More', //
	QueryAboutBusiness: 'QueryAboutBusiness', //更多里的单据追溯
	OnhandQuery1: 'OnhandQuery1', //更多里的存量查拣
	File: 'File', //更多里的附件管理
	Print: 'Print', //打印
	output: 'output', //输出
	UnCommit: 'UnCommit', //审批中单据的收回
	ApproveInfo: 'ApproveInfo', //审批中单据的查看审批意见
	AssistMenu: 'AssistMenu', //审批通过单据的-辅助功能下拉按钮
	CloseBill: 'CloseBill', //审批通过单据的辅助功能中的整单关闭
	OpenBill: 'OpenBill', //审批通过单据的辅助功能中的整单打开
	File1: 'File1', //审批通过单据的辅助功能里的附件管理
	OpenRow: 'OpenRow', //展开
	CloseRow: 'CloseRow', //收起
	OpenRowBrowse: 'OpenRowBrowse', //行操作-展开-浏览态
	OpenRowEdit: 'OpenRowEdit', //行操作-展开-编辑，新增
	Delete_row: 'DeleteLine', //行操作-删行
	CopyLine_row: 'CopyLine_row', //行操作-复制行
	InsertLine: 'InsertLine', //行操作-插入行
	LineOpen: 'LineOpen', //行打开
	LineClose: 'LineClose', //行关闭
	card_body_inner: 'card_body_inner', //行操作-area 按钮显示区域名称
	Material_PastLast: 'Material_PastLast', //新增肩上粘贴按钮组
	PasteLast: 'PasteLast', //粘贴至末行
	PasteCancel: 'PasteCancel', //新增肩上复制取消
	PasteThis: 'PasteThis', //粘贴至此
	LinkPoPlan: 'LinkPoPlan', //联查采购计划
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
	shoudlerBtns: [ 'DeleteLine', 'CopyLine', 'LinkPoPlan', 'OnhandQuery', 'EditRowNum' ]
};

//表头
const ATTRCODE = {
	ts: 'ts',
	pk_praybill: 'pk_praybill', //请购单表头主键
	pk_praybill_b: 'pk_praybill_b', //请购单表体主键
	pk_srcpraybill: 'pk_srcpraybill', //记录请购单表头主键字段
	vtrantypecode: 'vtrantypecode', //单据类型编码
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
	pk_plandept: 'pk_plandept', //计划部门
	pk_planpsn: 'pk_planpsn', //计划员
	chprojectid: 'chprojectid', //项目
	vbillcode: 'vbillcode', //单据号
	bdirecttransit: 'bdirecttransit', //直运
	bispositioninv: 'bispositioninv', //按计划岗过滤物料
	vmemo: 'vmemo', //备注
	bsctype: 'bsctype', //委外
	sagaStatus: 'saga_status',
	saga_gtxid: 'saga_gtxid',
	nversion: 'nversion' //版本号
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
	pk_suggestsupplier_v: 'pk_suggestsupplier_v', //建议供应商版本
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
	pk_praybill_b: 'pk_praybill_b',
	pk_srcpraybillb: 'pk_srcpraybillb',
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
		'bisarrange',
		'pk_material.materialspec',
		'pk_material.materialtype'
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
	FREEFIELD
};
