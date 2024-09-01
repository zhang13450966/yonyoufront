/*
 * @Author: zhangchangqing 
 * @PageInfo: 请购单修订 
 * @Date: 2018-04-19 10:28:28 
 * @Last Modified by: heyfn
 * @Last Modified time: 2022-05-06 10:13:39
 */

const BUYINGREQ_LIST = {
	config: {
		AreaId: 'list_head',
		bodyPKfield: 'pk_praybill_b'
	},
	bodyAfterEditURL: '/nccloud/pu/buyingreqarrange/bodyAfterEdit.do', //edittable编辑后请求地址
	commitURL: '/nccloud/pu/buyingreq_r/commit.do', //提交地址
	queryListURL: '/nccloud/pu/buyingreqarrange/queryList.do', //查询列表地址
	cancelBatchURL: '/nccloud/pu/buyingreqarrange/cancel.do', //批量取消
	saveBatchURL: '/nccloud/pu/buyingreqarrange/save.do', //批量取消
	id: 'id',
	oid: '1001Z81000000000XZ0A', //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改 1001Z81000000000XZ0A
	listUrl: '/pu/pu/buyingreqarrange/list/index.html',
	cardUrl: '/pu/pu/buyingreqarrange/card/index.html',
	formId: 'list_head', //表头区域
	batchArrange: 'list_arrange', //批量安排区域
	tableId: 'list_body', //表体区域
	tailinfo: 'tailinfo', //操作信息
	status: 'status',
	cardpageid: '400400402_card', //卡片pagecode
	listpageid: '400400404_list', //列表pagecode
	appid: '0001Z81000000004MHVC', //注册小应用 查询按钮
	purchaseorg: 'pu', // 采购 业务场景
	storereq: 'st', // 库存 业务场景
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
	true: 'true',
	false: 'false',
	all: 'all', //全部
	templetqueryurl: '/nccloud/platform/templet/querypage.do',
	pk_org: 'pk_org',
	billType: '422X', //请购单的单据类型
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
const BUYINGREQ_LIST_BUTTON = {
	BatchArrange: 'BatchArrange', //批量安排
	Edit: 'Edit', //安排
	CancelArrange: 'CancelArrange', //取消安排
	Cancel: 'Cancel', //取消
	Save: 'Save', //确定、保存
	Refresh: 'Refresh' //刷新
};
const BUYINGREQ_CARD = {
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
	id: 'id',
	copy: 'copy',
	comeType: 'comeType',
	oid: '0001Z81000000004F0KX', //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改 0001Z81000000004F0KX
	listUrl: '/pu/pu/buyingreqarrange/list/index.html',
	cardUrl: '/pu/pu/buyingreqarrange/card/index.html',
	formId: 'card_head', //表头区域
	tableId: 'card_body', //表体区域
	tailinfo: 'tailinfo', //操作信息
	status: 'status',
	cardpageid: '400400402_card', //卡片pagecode
	listpageid: '400400402_list', //列表pagecode
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
	// firstcontent: getLangByResId(this, '4004PRAYBILLARRANGE-000005'),/* 国际化处理： 首页*/
	// firstcontent: getLangByResId(this, '4004PRAYBILLARRANGE-000006'),/* 国际化处理： 请购单管理*/
	// firstcontent: getLangByResId(this, '4004PRAYBILLARRANGE-000007'),/* 国际化处理： 物资需求申请*/
	pk_org: 'pk_org', //库存组织
	pk_org_v: 'pk_org_v', //库存组织版本
	billType: '20', //请购单的单据类型
	reqAppcode: '400400400', //请购单卡片界面appcode
	reqCardPAGECODE: '400400400_card' //请购单卡片界面pagecode
};
//卡片按钮

const BUYINGREQ_CARD_BUTTON = {
	Revise: 'Revise', //修订
	Group1: 'Group1', //新增页按钮组
	Group2: 'Group2', //新增肩上按钮组
	Group3: 'Group3', //自由态单据浏览态按钮组
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
	Print: 'Print', //更多里的打印
	UnCommit: 'UnCommit', //审批中单据的收回
	ApproveInfo: 'ApproveInfo', //审批中单据的查看审批意见
	AssistMenu: 'AssistMenu', //审批通过单据的-辅助功能下拉按钮
	CloseBill: 'CloseBill', //审批通过单据的辅助功能中的整单关闭
	OpenBill: 'OpenBill', //审批通过单据的辅助功能中的整单打开
	File1: 'File1', //审批通过单据的辅助功能里的附件管理
	OpenRowBrowse: 'OpenRowBrowse', //行操作-展开-浏览态
	OpenRowEdit: 'OpenRowEdit', //行操作-展开-编辑，新增
	Delete_row: 'Delete_row', //行操作-删行
	CopyLine_row: 'CopyLine_row', //行操作-复制行
	InsertLine: 'InsertLine', //行操作-插入行
	LineOpen: 'LineOpen', //行打开
	LineClose: 'LineClose', //行关闭
	card_body_inner: 'card_body_inner' //行操作-area 按钮显示区域名称
};
//表头
const ATTRCODE = {
	pk_org: 'pk_org',
	dbilldate: 'dbilldate', //申请日期
	pk_apppsnh: 'pk_apppsnh', //表头申请人
	pk_appdepth_v: 'pk_appdepth_v', //表头申请部门
	pk_appdepth: 'pk_appdepth', //表头申请部门最新版本
	ctrantypeid: 'ctrantypeid', //表头物资需求申请类型
	fbillstatus: 'fbillstatus', //单据状态
	freqtypeflag: 'freqtypeflag', //需求类型
	pk_plandept_v: 'pk_plandept_v', //计划部门版本
	pk_plandept: 'pk_plandept', //计划部门
	pk_planpsn: 'pk_planpsn', //计划员
	chprojectid: 'chprojectid', //项目
	bdirecttransit: 'bdirecttransit', //直运
	bsctype: 'bsctype' //委外
};
//表体
const ATTRCODES = {
	pk_purchaseorg: 'pk_purchaseorg', //采购组织
	pk_employee: 'pk_employee', //采购员
	bcanpurchaseorgedit: 'bcanpurchaseorgedit', //采购组织可编辑
	nastnum: 'nastnum', //数量
	nuum: 'nuum', //主数量
	pk_purchaseorg_v: 'pk_purchaseorg_v', //采购组织版本
	dreqdate: 'dreqdate', //需求日期
	pk_suggestsupplier: 'pk_suggestsupplier', //建议供应商
	pk_suggestsupplier_v: 'pk_suggestsupplier_v', //建议供应商版本
	castunitid: 'castunitid', //单位
	pk_reqstor: 'pk_reqstor', //需求仓库
	pk_appdept_v: 'pk_appdept_v', //申请部门
	pk_reqdept: 'pk_praybill_b.pk_reqdept', //需求部门
	pk_material: 'pk_material', //物料编码
	cprojectid: 'cprojectid', //项目
	vbatchcode: 'vbatchcode' //批次号
};

export {
	BUYINGREQ_LIST,
	BUYINGREQ_CARD,
	ATTRCODE,
	ATTRCODES,
	BUYINGREQ_LIST_BUTTON,
	BUYINGREQ_CARD_BUTTON,
	FBILLSTATUS
};
