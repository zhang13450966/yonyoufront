/*
 * @Author: CongKe
 * @PageInfo: 采购订单常量
 * @Date: 2018-04-17 14:00:27
 * @Last Modified by: tianzhyw
 * @Last Modified time: 2022-05-31 17:45:42
 */
const URL = {
	queryHistoryHead: '/nccloud/pu/poorder/queryHistoryHead.do', //请购单修订历史查询-表头
	queryHistoryBody: '/nccloud/pu/poorder/queryHistoryBody.do', //请购单修订历史查询-表体
	queryPage: '/nccloud/platform/templet/querypage.do', //模板查询
	getList: '/nccloud/pu/poorder/orderrevisequery.do', //列表态数据查询
	currentpage: '/nccloud/pu/poorder/revisequerybypks.do', //列表当前分页查询
	cardinsert: '/nccloud/pu/poorder/orderrevisesave.do', //卡片修订保存
	afterEvent: '/nccloud/pu/poordercard/afterevent.do', //编辑后事件处理
	cardHeadAfterEvent: '/nccloud/pu/poordercard/cardheadafterevent.do', //卡片表头编辑后事件
	cardBodyAfterEvent: '/nccloud/pu/poordercard/cardbodyafterevent.do', //卡片表体编辑后事件
	headbeforeedit: '/nccloud/pu/poordercard/ordercardheadbeforeeditaction.do', //卡片表头编辑前
	bodybeforeedit: '/nccloud/pu/poordercard/ordercardbodybeforeeditaction.do', //卡片表体编辑前
	stockquery: '/nccloud/pu/poordercard/orderatpqueryaction.do', //卡片存量查询
	supplierap: '/nccloud/pu/poordercard/ordersupplierapaction.do', //卡片供应商应付
	revisedatapermission: '/nccloud/pu/poorder/orderrevisedatapermission.do', //卡片修订权限检查
	getCard: '/nccloud/pu/poordercard/query.do', //卡片态数据查询
	//delete: '/nccloud/pu/poordercard/delete.do', //卡片态删除
	delete: '/nccloud/pu/poorder/orderrevisedeleteaction.do',
	print: '/nccloud/pu/poorder/orderprintaction.do', // 打印
	printvalidate: '/nccloud/pu/poorder/orderprintvalidate.do', // 打印前校验
	linpayplay: '/nccloud/pu/poorder/linpayplay.do', //联查采购计划
	gotoCard: '/card', //跳转到卡片页
	gotoList: '/list', //列表跳转
	commit: '/nccloud/pu/poorder/orderrevisecommitaction.do', //提交
	uncommit: '/nccloud/pu/poorder/orderreviseuncommitaction.do', //收回
	saveAndCommit: '/nccloud/pu/poorder/orderreviseandcommitaction.do', //保存提交
	gridcommit: '/nccloud/pu/poorder/gridorderrevisecommitaction.do', //批量提交
	griduncommit: '/nccloud/pu/poorder/gridorderreviseuncommitaction.do', //批量收回
	editCheck: '/nccloud/pu/poorder/orderreviseeditaction.do',
	pricequery: '/nccloud/pu/poordercard/querydefaultpriceaction.do', //卡片采购询价
	cooppricequery: '/nccloud/pu/poordercard/querycooppriceaction.do', //卡片询协同售价
	transinfo: '/nccloud/pu/poordercard/transinfo.do' //内部交易信息
};

//页面编码
const PAGECODE = {
	dbilldateVal: '',
	listcode: '400400802_list',
	searchId: '400400802_query',
	list_head: 'list_head',
	list_inner: 'list_inner', //列表表格行
	//卡片态常量
	cardcode: '400400802_card', //
	historycode: '400400802_history', //修订历史页面编码
	cardhead: 'card_head', //表头采购信息
	head_tailinfo: 'card_tailinfo', //审计+人员信息
	cardbody: 'card_material', //表体采购物料详情
	material1: 'childform2', //编辑展开
	material_table_row: 'card_material_inner', //物料表格区域
	childform1: 'childform1',
	childform2: 'childform2',
	queryType: 'simple' //查询类型
};

const FIELD = {
	pk_dept_v: 'pk_dept_v', //采购部门
	pk_dept: 'pk_dept', //采购部门
	cemployeeid: 'cemployeeid', //采购员
	id: 'id',
	ts: 'ts', //时间戳
	pks: 'pks',
	crowno: 'crowno', // 行号
	vbillcode: 'vbillcode', //订单编号
	pk_org: 'pk_org', //组织参照--列表使用
	pk_org_v: 'pk_org_v', //组织版本--卡片使用
	pk_order: 'pk_order', //主键
	pk_material: 'pk_material', //物料参照
	ctrantypeid: 'ctrantypeid', //订单类型
	approver: 'approver', //审批人
	pk_busitype: 'pk_busitype', //业务流程
	bcooptoso: 'bcooptoso', //已协同生成销售订单
	bsocooptome: 'bsocooptome', //由销售订单协同生成
	vcoopordercode: 'vcoopordercode', //对方订单号
	dbilldate: 'dbilldate', //订单日期
	bfrozen: 'bfrozen', //冻结
	forderstatus: 'forderstatus', //单据状态
	bfinalclose: 'bfinalclose', //最终关闭
	pk_supplier: 'pk_supplier', //供应商
	pk_invcsupllier: 'pk_invcsupllier', //开票供应商
	pk_payterm: 'pk_payterm', //付款协议
	castunitid: 'castunitid', //计量单位
	nastnum: 'nastnum', //数量
	nqtorigtaxprice: 'nqtorigtaxprice', //含税单价
	norigtaxmny: 'norigtaxmny', //价税合计
	ntaxrate: 'ntaxrate', //税率
	vtrantypecode: 'vtrantypecode', //订单类型
	csourcebid: 'csourcebid', //来源单据明细
	csourceid: 'csourceid', //来源单据
	csourcetypecode: 'csourcetypecode', //来源单据类型
	nsourcenum: 'nsourcenum', //来源单据主数量
	pk_srcorder_b: 'pk_srcorder_b', //修订来源订单明细
	sourcebts: 'sourcebts', //来源单据行TS
	sourcets: 'sourcets', //来源单据TS
	vsourcecode: 'vsourcecode', //来源单据号
	vsourcerowno: 'vsourcerowno', //来源单据行号
	vsourcetrantype: 'vsourcetrantype', //来源交易类型
	ccontractid: 'ccontractid', //合同信息
	ccontractrowid: 'ccontractrowid', //合同明细
	vcontractcode: 'vcontractcode', //合同号
	materialname: 'pk_order_b.pk_srcmaterial', //表头物料ID
	form: 'form', //form表单类型
	search: 'search', // search搜索类型
	table: 'table', // table表格类型
	pagecode: 'pagecode',
	formArea: 'formArea', // form表单区
	searchArea: 'searchArea', // search搜索区
	tableArea: 'tableArea', // table表格区
	tocommit: 'toCommit',
	approving: 'approving',
	executing: 'executing',
	all: 'all',
	free: '0', //单据状态 自由
	commit: '1', //提交
	approve: '2', //审批中
	approved: '3', //审批
	unapproved: '4', //审批不通过
	other: '5', //输出
	corigcurrencyid: 'corigcurrencyid',
	cratetype: 'cratetype',
	dratedate: 'dratedate',
	bislatest: 'bislatest', //
	revisionstatus: 'revisionstatus', //
	bisreviselatest: 'bisreviselatest', //
	pk_srcorder: 'pk_srcorder', //
	pk_order_b: 'pk_order_b', //
	nversion: 'nversion',
	PurDaily: 'Z2' //采购合同
};
const LIST_BUTTON = {
	Annex_Management: 'Annex_Management', //附件管理 list_head
	QueryAboutBusiness: 'QueryAboutBusiness', //单据追溯
	Print: 'Print', //打印
	Refresh: 'Refresh', //刷新
	Revise: 'Revise', //修订 list_inner
	Revised_Record_Info: 'Revised_Record_Info', //查看修订记录
	Commit: 'Commit', //提交
	UnCommit: 'UnCommit', //收回
	Delete: 'Delete', //修订删除
	ApproveInfo: 'ApproveInfo', //审批详情
	PrintCountQuery: 'PrintCountQuery', //打印次数查询
	Auxiliary: 'Auxiliary', //辅助功能
	ToInformation: 'ToInformation' //内部交易信息
};
const BUTTON = {
	Save: 'Save', //保存 card_head
	Cancel: 'Cancel', //取消
	Revise: 'Revise', //修订
	Revised_Record_Info: 'Revised_Record_Info', //查看修订记录
	Annex_Management: 'Annex_Management', //附件管理
	QueryAboutBusiness: 'QueryAboutBusiness', //单据追溯
	Print: 'Print', //打印
	Refresh: 'Refresh', //刷新
	Card_Body_Group1: 'Card_Body_Group1', //物料表格肩部按钮组 card_material
	Material_AddLine: 'Material_AddLine', //物料肩部增行
	materialDeleteLine: 'DeleteLine', //物料肩部删行
	copyline: 'CopyLine', // 物料肩部复制行
	StockQuery: 'StockQuery', //存量查询
	SupplierAp: 'SupplierAp', //供应商应付
	Resetno: 'Resetno', //重排行号
	openbrowse: 'OpenBrowse', //浏览态行操作展开  card_material_inner
	openedit: 'OpenEdit', //编辑态行操作展开
	Material_DeleteLine: 'DeleteLine', //物料表格内删行
	CopyLine_row: 'CopyLine_row', // 物料表格内复制行
	InsertLine: 'InsertLine', //物料表格内插行
	PasteLast: 'PasteLast', //粘贴至末行
	PasteCancel: 'PasteCancel', //取消
	PasteThis: 'PasteThis', //粘贴至此
	LinkPoPlan: 'LinkPoPlan', //联查采购计划
	Card_Body_Group2: 'Card_Body_Group2',
	checkpuinquiry: 'CheckPuInquiry', //询协同售价
	puinquiry: 'Pu_Inquiry', //采购询价
	puinquirys: 'Pu_Inquirys', //采购询价侧拉
	checkpuinquirys: 'CheckPuInquirys', //询协同售价侧拉
	Back: 'Back', // 返回
	Material_PastLast: 'Material_PastLast',
	materialCardInitBtn: [ 'MaterialDeleteLine', 'Material_AddLine', 'CopyLine', 'Resetno' ],
	materialCardPastBtn: [ 'Material_PastLast', 'PasteLast', 'PasteCancel' ],
	Commit: 'Commit', //提交
	UnCommit: 'UnCommit', //收回
	SaveCommit: 'SaveCommit', //保存提交
	Delete: 'Delete', //删除
	ApproveInfo: 'ApproveInfo', //审批详情
	PrintCountQuery: 'PrintCountQuery', //打印次数查询
	Auxiliary: 'Auxiliary', //辅助功能
	ToInformation: 'ToInformation', //内部交易信息
	aux_g1: 'aux_g1' //辅助功能下拉1组
};
//供应商应付
const SUPPLIERAP = {
	PAGECODE: '400400800_supplierap', //页面标识
	TABLEID: 'supplierapitemvo' //表格ID
};
const APPCODE = {
	orderAppCode: '400400800'
};
const STATUS = {
	status: 'status', //状态标志
	edit: 'edit', //编辑态
	browse: 'browse' //浏览
};
const STOCKQUERY = {
	PAGECODE: '400400800_atpparamvo', //页面标识
	TABLEID: 'atpforonematerialitemvo' //表格ID
};
const OrderReviseCache = {
	OrderReviseCacheKey: 'scm.pu.orderrevise.datasource', //数据缓存
	Searchval: 'PoOrderReviseList_serachVal', //查询条件
	OrderReviseListTabCode: 'OrderReviseListTabCode' //订单列表页签缓存
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
	PAGECODE,
	FIELD,
	BUTTON,
	STATUS,
	LIST_BUTTON,
	OrderReviseCache,
	STOCKQUERY,
	SUPPLIERAP,
	APPCODE,
	FREEFIELD
};
