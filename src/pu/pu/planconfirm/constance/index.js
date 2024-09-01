/*
 * @Author: yinliangc 
 * @PageInfo: 进度确认单常量
 * @Date: 2021-11-19 09:53:09 
 * @Last Modified by: fangmj7
 * @Last Modified time: 2022-04-07 10:47:05
 */
// 区域ID
const AREA = {
	head: 'head',
	body: 'body',
	search: 'search',
	view: 'view',
	browse: 'childform1', // 浏览态展开
	edit: 'childform2', // 编辑态展开
	listHeadBtnArea: 'list_head', //列表表头按钮区域
	listInnerBtnArea: 'list_inner', //列表操作列按钮区域
	cardHeadBtnArea: 'card_head', //卡片表头按钮区域
	cardBodyBtnArea: 'card_body', //卡片表体按钮区域
	cardBodyInnerBtnArea: 'card_body_inner', //卡片表体操作按钮区域
	pageMsgType: 'pageMsgType',
	leftarea: 'leftarea' //左侧分单区域
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

//  缓存常量
const CONSTFIELD = {
	planConfirmCacheKey: 'scm.pu.planconfirm.planConfirmCacheKey',
	planConfirmCacheTabKey: 'scm.pu.planconfirm.planConfirmCacheTabKey',
	dataSource: 'pu.pu.planconfirm.dataSource', // 进度确认单，缓存常量
	transferDataSource: 'pu.pu.planconfirm.transferDataSource', //缓存名称，转单和下游卡片页为一个缓存
	conditionCache: '400401400_condition', //搜索域条件
	PlanconfirmTransferCache: 'scm.pu.planconfirm.planconfirmTransferCache', //拉单缓存
	planconfirmCardCache: 'scm.pu.planconfirm.planconfirmcard', //卡片缓存
	PlanConfirmRefAdd21P: 'scm.pu.planconfirm.planconfirmadd21P' //
};

//拉单常量
const TRANSFER2C = {
	pk_order_payplan: 'pk_order_payplan',
	vbillcode: 'vbillcode',
	billtype: '21P',
	appcode: '400400806',
	CSOURCETYPECODE: '21P', // 来源单据类型
	GOTO2C: '/transfer21P', //拉采购订单付款计划
	PAGEID: '400400806_21Pto2C', // //页面标识
	AREAID: 'list_head',
	SEARCHID: '400400806tranfer_query', //查询区域
	GETQUERYDATA: '/nccloud/pu/planconfirm/query21Pfor2C.do', //采购订单付款计划查询
	LIST_TABLE_CHILD: 'list_body', //付款计划子表
	LIST_TABLE: 'list_head', //付款计划主表
	VIEW: 'view', //视图vo
	PK_ORDER_PAYPLAN_B: 'pk_order_payplan_b', //采购订单付款的计划
	vordercode: 'vordercode',
	pk_org: 'pk_org', //采购组织
	pk_order: 'pk_order', //订单主键
	payplanlist: '/pu/pu/orderpayplan/list/', //订单付款计划列表
	payplanappcode: '400400806', //订单付款计划appcode
	payplanpagecode: '400400806_list' //付款计划列表
};

// 页面信息
const PAGECODE = {
	appcode: '400401400', // 功能编码
	list: '400401400_list', // 列表页面编码
	card: '400401400_card', // 卡片页面编码
	transFrom21Appcode: '400400806', // 采购订单付款计划appcode
	transFrom21List: '400400806_21to2c', // 采购订单付款计划页面编码
	tree: 'tree',
	leftarea: 'leftarea',
	head: 'head',
	body: 'body',
	cardhead: 'card_head', //进度确认单卡片表头
	cardbody: 'card_body', //进度确认单表体物料详情
	billType: '2C', //单据类型
	view: 'view'
};

const BATCHITEM = [ 'nnum', 'nconfirmorimny', 'nconfirmmny', 'vmemo' ];

// 单据状态
const BILLSTATUS = {
	free: '0', //自由
	approving: '2', //审批中
	approve: '3', //审批通过
	nopass: '4' //审批不通过
};

// 路径
const URL = {
	list: '/list',
	card: '/card',
	transfer: '/transfer',
	save: '/nccloud/pu/planconfirm/save.do', // 保存
	listquery: '/nccloud/pu/planconfirm/listquery.do', // 列表查询按钮查询
	cardquery: '/nccloud/pu/planconfirm/cardquery.do', // 卡片查询按钮查询
	permission: '/nccloud/pu/planconfirm/permission.do', // 权限校验（修改、打印按钮使用）
	delete: '/nccloud/pu/planconfirm/delete.do', // 删除
	commit: '/nccloud/pu/planconfirm/commit.do', // 提交
	saveandcommit: '/nccloud/pu/planconfirm/saveandcommit.do', // 保存提交
	uncommit: '/nccloud/pu/planconfirm/uncommit.do', // 收回
	print: '/nccloud/pu/planconfirm/print.do',
	querypageURL: '/nccloud/pu/planconfirm/pagequery.do', // 列表翻页查询
	orderpayplanToplanconfirm: '/nccloud/pu/planconfirm/orderpayplanToplanconfirm.do', //拉单确认
	cardHeadBeforeEvent: '/nccloud/pu/planconfirm/headBeforeEvent.do', //表头的编辑前事件
	cardBodyBeforeEvent: '/nccloud/pu/planconfirm/bodyBeforeEvent.do', //表体编辑前事件
	cardHeadAfterEvent: '/nccloud/pu/planconfirm/headAfterEvent.do', //表头的编辑后事件
	cardBodyAfterEvent: '/nccloud/pu/planconfirm/bodyAfterEvent.do' //表体编辑后事件
};

// 参数
const FIELD = {
	pk: 'pk', //里程碑看板跳转
	ccurrencyid: 'ccurrencyid', //本币
	nglobalexchgrate: 'nglobalexchgrate', //全局本位币汇率
	ngroupexchgrate: 'ngroupexchgrate', //集团本位币汇率
	nexchangerate: 'nexchangerate', //折本汇率
	dratedate: 'dratedate', //汇率来源日期
	cratetype: 'cratetype', //汇率类型
	fratecategory: 'fratecategory', //汇率类别
	EXPORTATION: '3', //出口
	IMPORTATION: '4', //进口
	pk_material: 'cmaterialid', //物料最新版本
	corigcurrencyid: 'corigcurrencyid', //币种
	pk_supplier_v: 'pk_supplier_v', //供应商最新版本
	pk_supplier: 'pk_supplier', //供应商
	hid: 'pk_planconfirm', // 表头主键
	bid: 'pk_planconfirm_b', // 表体主键
	pk_org: 'pk_org', // 采购组织最新版本
	pk_org_v: 'pk_org_v', // 采购组织最新版本
	vbillcode: 'vbillcode', // 单据号
	ctranstypeid: 'ctranstypeid', // 确认类型
	vtrantypecode: 'vtrantypecode', // 确认类型编码
	fbillstatus: 'fbillstatus', // 单据状态
	cconfirmpsnid: 'cconfirmpsnid', // 确认人
	cconfirmdeptid: 'cconfirmdeptid', // 确认部门oid
	cconfirmdeptvid: 'cconfirmdeptvid', // 确认部门vid
	crowno: 'crowno', // 行号
	ts: 'ts', // 时间戳
	approve: '3', //审批态
	saga_status: 'saga_status', //事务状态
	csourcebid: 'csrcbid' //来源单据bid
};

// 按钮ID
const BTNID = {
	Back: 'Back', // 卡片左上角的返回按钮
	Query: 'Query', // 查询
	Add: 'Add', //新增
	AddGroup: 'AddGroup', //新增按钮组
	Edit: 'Edit', //修改
	Delete: 'Delete', //删除
	Commit: 'Commit', //提交
	UnCommit: 'UnCommit', // 收回
	File: 'File', // 附件
	Link: 'Link', // 联查-下拉
	BillLink: 'BillLink', // 单据追溯
	ApproveDetail: 'ApproveDetail', // 审批详情
	Print: 'Print', // 打印
	Output: 'OutPut', // 输出
	PrintCountQuery: 'PrintCountQuery', // 打印次数查询
	Refresh: 'Refresh', // 刷新
	Save: 'Save', // 保存
	SaveCommit: 'SaveCommit', // 保存提交
	Cancel: 'Cancel', // 取消
	DeleteLine: 'DeleteLine', // 删行
	ResetRowNo: 'ResetRowNo', // 重排行号
	OpenCard: 'OpenCard', // 展开
	OpenCardBrowse: 'OpenCardBrowse' //浏览态展开
};

// 状态常量
const UISTATE = {
	add: 'add',
	edit: 'edit',
	browse: 'browse'
};

// 其他一些不好归类的常量
const OHTER = {
	billtype: '2C', // 单据类型
	scene: 'scene', //场景信息，审批中心使用
	approve: 'approvesce', //审批，审批中心使用
	busifuncode: 'pu', // 业务场景
	status: 'status', // status参数，url参数也会用到
	id: 'id', // url参数，主键
	source21P: '21P', // 来源采购订单付款计划
	outputType: 'output'
};

export { AREA, FIELD, BILLSTATUS, PAGECODE, URL, BTNID, UISTATE, CONSTFIELD, OHTER, TRANSFER2C, BATCHITEM, FREEFIELD };
