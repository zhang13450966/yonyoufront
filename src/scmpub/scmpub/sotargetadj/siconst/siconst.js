/*
 * @Author: zhangchangqing
 * @PageInfo: 销售指标调整单
 * @Date: 2018-04-19 10:28:28
 * @Last Modified by: liulux
 * @Last Modified time: 2021-08-27 01:11:35
 */

const TARGETADJ_LIST = {
	transferDataSource: 'scmpub.scmpub.targetadj.transferDataSource', //缓存名称，转单和下游卡片页为一个缓存
	dataSource: 'scmpub.scmpub.targetadj.targetadjDataSource', //缓存名称 列表和卡片公用一个
	commitURL: '/nccloud/scmpub/targetadj/commit.do', //提交地址
	uncommitURL: '/nccloud/scmpub/targetadj/uncommit.do', //收回
	queryListURL: '/nccloud/scmpub/targetadj/queryList.do', //查询列表地址
	batchDeleteURL: '/nccloud/scmpub/targetadj/batchDelete.do', //批量删除地址
	deleteURL: '/nccloud/scmpub/targetadj/delete.do', //删除地址
	queryPageURL: '/nccloud/scmpub/targetadj/queryPage.do', //分页查询地址
	id: 'id',
	oid: '1001K61000000000N5TC', //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改   1001K61000000000N5TC  1001K61000000000JOMN
	ooid: '1001K61000000000JOMN', //查询物资需求申请单使用
	listUrl: '/list',
	cardUrl: '/card',
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
	appcode20: '400102404', //销售指标调整单的应用编码
	cardpageid: '400102404_card', //卡片pagecode
	listpageid: '400102404_list', //列表pagecode
	moduleId: '4001', //模块id
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
	billType: '4622', //销售指标调整单的单据类型
	outputType: 'output', //打印输出类型
	vbillcode: 'vbillcode' //单据号码
};
//单据状态
const FBILLSTATUS = {
	free: '0', //单据状态 自由
	approve: '1', //审批中
	unapproved: '2', //审批不通过
	approved: '3' //审批
};
//列表按钮
const TARGETADJ_LIST_BUTTON = {
	Refresh: 'Refresh', //刷新
	ApproveInfo: 'ApproveInfo', //查看审批意见
	add: 'Add', //新增
	delete: 'Delete', //删除
	deleteRow: 'Delete', //删除-行
	Edit: 'Edit', //修改
	EditRow: 'Edit', //修改-行
	copy: 'Copy', //复制
	File: 'File', //附件管理
	output: 'output', //输出
	commit: 'Commit', //提交
	commitRow: 'Commit', //提交-行
	uncommit: 'UnCommit', //收回
	list_inner: 'list_inner' //列表行按钮区域
};
const TARGETADJ_CARD = {
	card: 'card', //一主一子 billtype
	//推单
	sotoPraybillURL: '/nccloud/scmpub/targetadj/sotoPraybillqueryaction.do', // 销售销售指标调整单
	materialURL: 'nccloud.web.scmpub.targetadj.util.FilterTargetSqlBuilder', //物料/期间过滤
	headBeforeEventURL: '/nccloud/scmpub/targetadj/headBeforeEdit.do', //表头编辑前事件
	bodyBeforeEventURL: '/nccloud/scmpub/targetadj/bodyBeforeEdit.do', //表体编辑前事件
	commitURL: '/nccloud/scmpub/targetadj/commit.do', //提交地址
	saveCommitURL: '/nccloud/scmpub/targetadj/saveCommit.do', //保存提交
	uncommitURL: '/nccloud/scmpub/targetadj/uncommit.do', //收回地址
	orgChangEventURL: '/nccloud/scmpub/targetadj/orgChangEvent.do', //主组织编辑事件
	deleteURL: '/nccloud/scmpub/targetadj/delete.do', //删除地址
	saveURL: '/nccloud/scmpub/targetadj/save.do', //修改保存
	newSaveURL: '/nccloud/scmpub/targetadj/newSave.do', //新增保存
	queryCardInfoURL: '/nccloud/scmpub/targetadj/queryCardInfo.do', //查询卡片信息
	queryTargetCardInfoURL: '/nccloud/scmpub/targetadj/queryTargetCardInfo.do', //查询销售指标表信息
	editCardInfoURL: '/nccloud/scmpub/targetadj/edit.do', //修改查询卡片信息pu.buyingreq.edit
	numbAfterEditURL: '/nccloud/scmpub/targetadj/numbAfterEdit.do', //联动计算请求地址
	bodyAfterEditURL: '/nccloud/scmpub/targetadj/bodyAfterEdit.do', //表体编辑后请求地址
	headAfterEditURL: '/nccloud/scmpub/targetadj/headAfterEdit.do', //表头编辑后请求地址
	headafterquery: '/nccloud/scmpub/targetadj/headafterquery.do', //表头编辑后地址

	saveandcommit: '/nccloud/scmpub/targetadj/saveandcommit.do', //保存提交
	id: 'id',
	orgChange: 'orgChange', //组织修改的弹出框定义
	ts: 'ts',
	pageMsgType: 'pageMsgType', //审批中心父页面url参数
	copy: 'copy',
	comeType: 'comeType',
	oid: '0001Z810000000039R8O',
	approveoid: '0001Z81000000004X97S', //销售指标调整单审批的oid
	purchaseorg: 'pu', // 采购 业务场景
	storereq: 'st', // 库存 业务场景
	listUrl: '/list',
	cardUrl: '/card',
	headf: 'card_headf', //第一个表头取
	formId: 'card_head', //表头区域
	tableId: 'card_body', //表体区域
	tableOldId: 'card_body_old',
	leftarea: 'leftarea', //左侧的列表区域
	tailinfo: 'tailinfo', //操作信息
	status: 'status',
	type: 'type', //用来判断是否是从转单页面进入
	transfer: 'transfer', //
	cardpageid: '400102404_card', //卡片pagecode
	listpageid: '400102404_list', //列表pagecode
	pricePage: '400102404_price', //价格论证表
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
	pk_org: 'pk_org', //库存组织
	pk_org_v: 'pk_org_v', //库存组织版本
	billType: '4622', //销售指标调整单的单据类型
	billTypeOrder: '21', //采购订单类型
	directarrange: 'directarrange', //推单
	channelType: 'channelType', //推单
	config: {
		headAreaId: 'card_head',
		bodyAreaId: 'card_body',
		bodyPKfield: 'pk_targetadj_b'
	},
	bodyFileds: [ 'pk_purchaseorg', 'pk_srcmaterial', 'pk_material', 'cordertrantypecode', 'cprojectid', 'dbilldate' ]
};
//卡片按钮

const TARGETADJ_CARD_BUTTON = {
	Group1: 'Group1', //新增页按钮组
	Group2: 'Group2', //新增肩上按钮组
	Group3: 'Group3', //自由态单据浏览态按钮组
	Save: 'Save', //保存
	SaveCommit: 'SaveCommit', //保存提交
	Cancel: 'Cancel', //取消
	AddLine: 'AddLine', //新增肩上增行
	DeleteLine: 'DeleteLine', //新增肩上删行
	Adds: 'Adds',
	Add: 'Add',
	Edit: 'Edit',
	Delete: 'Delete',
	Copy: 'Copy',
	Commit: 'Commit',
	Refresh: 'Refresh', //刷新
	File: 'File', //更多里的附件管理
	UnCommit: 'UnCommit', //收回
	ApproveInfo: 'ApproveInfo', //查看审批意见
	OpenRowEdit: 'OpenRowEdit', //行操作-展开-编辑，新增
	Delete_row: 'DeleteLine', //行操作-删行
	InsertLine: 'InsertLine', //行操作-插入行
	card_body_inner: 'card_body_inner', //行操作-area 按钮显示区域名称
	cardBodyInit: [ 'Group2', 'AddLine', 'DeleteLine', 'OpenRow', 'DeleteLine', 'InsertLine' ],
	cardBodyCopy: [ 'Material_PastLast', 'PasteLast', 'PasteCancel', 'PasteThis' ],
	shoudlerBtns: [ 'DeleteLine', 'CopyLine', 'OnhandQuery', 'EditRowNum' ]
};
//表头
const ATTRCODE = {
	cmarsetid: 'cmarsetid', //物料维度
	vperiod: 'vperiod', //期间
	ctargetid: 'ctargetid', //销售指标表id
	ts: 'ts',
	vtrantypecode: 'vtrantypecode', //单据类型编码
	pk_targetadj: 'pk_targetadj', //销售指标调整单表头主键
	pk_org_v: 'pk_org_v',
	pk_org: 'pk_org', //组织最新版本
	dbilldate: 'dbilldate', //申请日期
	fstatusflag: 'fstatusflag', //单据状态
	vbillcode: 'vbillcode', //单据号
	vnote: 'vnote', //备注
	otherfields: [ 'pk_org' ]
};
//表体
const ATTRCODES = {
	ts: 'ts',
	ccustomerid: 'ccustomerid', //客户
	// 发布到电子商务 采购组织可编辑 是否固定换算率 行关闭 主计量单位 集团 库存组织 销售指标调整单主键 销售指标调整单行id 累计订货数量 生成合同次数 生成价格审批单次数 生成询报价单次数 来源单据分录标识 来源单据标识 来源单据类型 来源单据行号 来源交易类型 源头单据分录标识  源头单据标识  源头单据类型 源头单据号 源头单据行号 源头单据类型 已安排
	otherfields: []
};

export {
	TARGETADJ_LIST,
	TARGETADJ_CARD,
	ATTRCODE,
	ATTRCODES,
	TARGETADJ_LIST_BUTTON,
	TARGETADJ_CARD_BUTTON,
	FBILLSTATUS
};
