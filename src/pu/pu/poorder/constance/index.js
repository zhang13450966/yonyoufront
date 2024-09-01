/*
 * @Author: CongKe
 * @PageInfo: 采购订单常量
 * @Date: 2018-04-17 14:00:27
 * @Last Modified by: yinliangc
 * @Last Modified time: 2022-04-07 13:33:11
 */
const URL = {
	getList: '/nccloud/pu/poorder/query.do', //列表态数据查询
	currentpage: '/nccloud/pu/poorder/currentpage.do', //列表当前分页查询
	save: '/nccloud/pu/poordercard/save.do', //卡片态编辑保存链接
	afterEvent: '/nccloud/pu/poordercard/afterevent.do', //编辑后事件处理
	getCard: '/nccloud/pu/poordercard/query.do', //卡片态数据查询
	delete: '/nccloud/pu/poordercard/delete.do', //卡片态删除
	griddelete: '/nccloud/pu/poordercard/gridorderdeleteaction.do', //卡片态删除
	cardHeadAfterEvent: '/nccloud/pu/poordercard/cardheadafterevent.do', //卡片表头编辑后事件
	cardBodyAfterEvent: '/nccloud/pu/poordercard/cardbodyafterevent.do', //卡片表体编辑后事件
	finalopen: '/nccloud/pu/poorder/finalopenaction.do', //整单打开
	finalClose: '/nccloud/pu/poorder/finalcloseaction.do', //最终关闭
	gridfinalopen: '/nccloud/pu/poorder/gridfinalopenaction.do', //批量打开
	gridfinalClose: '/nccloud/pu/poorder/gridfinalcloseaction.do', //批量关闭
	commit: '/nccloud/pu/poordercard/commitaction.do', //提交
	gridcommit: '/nccloud/pu/poorder/gridordercommitaction.do', //批量提交
	uncommit: '/nccloud/pu/poordercard/uncommitaction.do', //收回
	griduncommit: '/nccloud/pu/poordercard/gridorderuncommitaction.do', //批量收回
	freeze: '/nccloud/pu/poordercard/poorderfreezeaction.do', // 冻结
	unfreeze: '/nccloud/pu/poordercard/poorderunfreezeaction.do', // 解冻
	gridfreeze: '/nccloud/pu/poorder/gridorderfreezeaction.do', // 批量冻结
	gridunfreeze: '/nccloud/pu/poorder/gridorderunfreezeaction.do', // 批量冻结
	transportstatusquery: '/nccloud/pu/poorder/transportstatusqueryaction.do', // 联查运输状态
	print: '/nccloud/pu/poorder/orderprintaction.do', // 打印
	receiveplanprint: '/nccloud/pu/poorder/receiveplanprintaction.do', // 到货计划打印
	arriveplanquery: '/nccloud/pu/poordercard/arriveplanqueryaction.do', //到货计划查询
	arriveplansave: '/nccloud/pu/poordercard/arriveplansaveaction.do', //到货计划保存
	arriveplanafterevent: '/nccloud/pu/poorder/arriveplanaftereventaction.do', //到货计划编辑后事件
	arrivalplancheck: '/nccloud/pu/poorder/arrivalplancheckaction.do', //到货计划权限校验
	porprownomodel: '/nccloud/pu/poorder/porprownomodel.do', //到货计划参照采购订单表体
	arrivedeletecheckaction: '/nccloud/pu/poorder/arriveplandeletecheckaction.do', //到货计划删行校验
	interceptor: '/nccloud/pu/poorder/cardinterceptoraction.do', //卡片拦截-主要处理关联合同
	stockquery: '/nccloud/pu/poordercard/orderatpqueryaction.do', //卡片存量查询
	salesquery: '/nccloud/pu/poordercard/ordersalesqueryaction.do', //卡片销量查询
	grossprofit: '/nccloud/pu/poordercard/ordergrossprofitaction.do', //卡片毛利预估
	supplierap: '/nccloud/pu/poordercard/ordersupplierapaction.do', //卡片供应商应付
	checkorg: '/nccloud/pu/poordercard/issaleorgaction.do', //卡片销量查询检查是否销售组织
	pricequery: '/nccloud/pu/poordercard/querydefaultpriceaction.do', //卡片采购询价
	cooppricequery: '/nccloud/pu/poordercard/querycooppriceaction.do', //卡片询协同售价
	headbeforeedit: '/nccloud/pu/poordercard/ordercardheadbeforeeditaction.do', //卡片表头编辑前
	bodybeforeedit: '/nccloud/pu/poordercard/ordercardbodybeforeeditaction.do', //卡片表体编辑前
	savecommit: '/nccloud/pu/poorder/ordersavecommit.do', // 保存提交
	editdatapermission: '/nccloud/pu/poordercard/poordercardeditdatapermissionaction.do', // 修改权限检查
	refz2check: '/nccloud/pu/poorder/refz2fromcheckaction.do', // 合同模块启用权限校验
	sysinitgroup: '/nccloud/scmpub/pub/sysinitgroup.do', //公共模块启用判断
	combine: '/nccloud/pu/poordercard/combineshowaction.do', //合并显示
	combintPrint: '/nccloud/pu/poordercard/combineprintaction.do', //合并打印
	rowclose: '/nccloud/pu/poordercard/rowclose.do', //卡片行关闭
	rowopen: '/nccloud/pu/poordercard/rowopen.do', //卡片行打开
	supplierquotas: '/nccloud/pu/poorder/supplierquotasaction.do', // 配额分配
	defaultsupplier: '/nccloud/pu/poorder/defaultsupplieraction.do', // 确认供应商
	//推单
	sotoorder: '/nccloud/pu/poorder/sotoordercardqueryaction.do', // 销售推采购订单
	pushcoopsale: '/nccloud/pu/poorder/pushcoopsaleorderaction.do', // 生成协同销售订单
	//小部件
	widget20to21: '/nccloud/pu/poorder/widgetquery20for21action.do', //请购生成订单
	flowquery20for21: '/nccloud/pu/poorder/flowquery20for21action.do', //请购生成订单
	refbillqueryaction: '/nccloud/pu/pub/refbillqueryaction.do', //来源单据查询
	payplan: '/pu/pu/orderpayplan/list/', //生成付款计划
	generalSetpiece: '/nccloud/pu/pub/generalSetpiece.do', //成套件信息
	supplementinfo: '/nccloud/pu/poordercard/ordersupplementinfo.do', //辅助信息
	saveandcommit: '/nccloud/pu/poorder/saveandcommit.do', //同一个事务的保存提交For NCCnative
	linpayplay: '/nccloud/pu/poorder/linpayplay.do', //联查采购计划
	printvalidate: '/nccloud/pu/poorder/orderprintvalidate.do', // 打印前校验
	gotoCard: '/card', //跳转到卡片页
	gotoList: '/list', //列表跳转
	transinfo: '/nccloud/pu/poordercard/transinfo.do', //内部交易信息
	exportUrl: '/nccloud/pu/poorder/export.do', //导出模板
	importUrl: '/nccloud/pu/poorder/import.do' //导出模板
};

//页面编码
const PAGECODE = {
	billType: '21',
	dbilldateVal: '',
	searchId: '400400800_query',
	tableId: 'list_head',
	listcode: '400400800_list', // pu_poorder_list
	list_inner: 'list_inner', //列表表格行
	//卡片态常量
	cardcode: '400400800_card', // pu_poorder_card
	cardhead: 'card_head', //表头采购信息
	head_tailinfo: 'card_tailinfo', //审计+人员信息
	head_payment: 'card_payment', //付款协议
	cardbody: 'card_material', //表体采购物料详情
	material1: 'material1', //物料执行情况
	material_table_row: 'card_material_inner', //物料表格区域
	payment_table_row: 'card_payment_inner', //付款协议表格区域
	childform1: 'childform1',
	childform2: 'childform2',
	queryType: 'simple', //查询类型
	tree: 'tree',
	leftarea: 'leftarea',
	title_card: 'title_card', // 卡片标题区域
	bodyIds: [ 'card_payment', 'card_material' ]
};

const OrderCache = {
	OrderCacheKey: 'scm.pu.poorder.datasource', //数据缓存
	Searchval: 'PoOrderList_serachVal', //查询条件
	OrderListTabCode: 'OrderListTabCode', //订单列表页签缓存
	OrderCardCache: 'scm.pu.poorder.ordercard', //卡片缓存
	OrderTransferCache: 'scm.pu.poorder.ordertransfercache', //拉单缓存
	OrderRefAdd20: 'scm.pu.poorder.orderrefadd20', //
	refBillDataCach: 'scm.pu.poorder.refBillDataCach'
};

const BATCHITEM = [
	'pk_material',
	'nastnum',
	'nnum',
	'nqtorigtaxprice',
	'nqtorigprice',
	'ntaxrate',
	'ctaxcodeid',
	'nitemdiscountrate',
	'nexchangerate',
	'ftaxtypeflag',
	'pk_apliabcenter_v',
	'dplanarrvdate',
	'pk_reqstoorg_v',
	'pk_arrvstoorg_v',
	'pk_psfinanceorg_v',
	'pk_apfinanceorg_v',
	'pk_flowstockorg_v',
	'pk_reqstordoc',
	'cprojectid',
	'vbmemo'
];

const FIELD = {
	PURCHASEORG: 'pu', // 采购 业务场景
	STOCKORG: 'st', // 库存
	pk_dept_v: 'pk_dept_v', //采购部门
	pk_dept: 'pk_dept', //采购部门
	pk_order_b: 'pk_order_b',
	cemployeeid: 'cemployeeid', //采购员
	id: 'id',
	ts: 'ts', //时间戳
	pks: 'pks',
	crowno: 'crowno', // 行号
	vbillcode: 'vbillcode', //订单编号
	pk_org: 'pk_org', //组织参照--列表使用
	pk_org_v: 'pk_org_v', //组织版本--卡片使用
	pk_order: 'pk_order', //主键
	pk_group: 'pk_group', //集团
	pk_freecust: 'pk_freecust', //散户
	pk_bankdoc: 'pk_bankdoc', //银行账户
	corigcurrencyid: 'corigcurrencyid', //币种 原币
	pk_deliveradd: 'pk_deliveradd', //供应商发货地址
	bisreplenish: 'bisreplenish', //补货
	pk_material: 'pk_material', //物料参照
	pk_reqstoorg_v: 'pk_reqstoorg_v', //需求库存组织
	pk_arrvstoorg_v: 'pk_arrvstoorg_v', //收货库存组织
	pk_psfinanceorg_v: 'pk_psfinanceorg_v', // 结算财务组织
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
	cqtunitid: 'cqtunitid', //报价单位
	pk_reqstordoc: 'pk_reqstordoc', //需求仓库
	pk_reqdept_v: 'pk_reqdept_v', //需求部门
	pk_recvstordoc: 'pk_recvstordoc', //收货仓库
	nastnum: 'nastnum', //数量
	nqtorigtaxprice: 'nqtorigtaxprice', //含税单价
	norigtaxmny: 'norigtaxmny', //价税合计
	nqtorigprice: 'nqtorigprice', //无税单价
	nqtorignetprice: 'nqtorignetprice', //无税净价
	nnum: 'nnum', // 主数量
	ntax: 'ntax', // 税额
	norigmny: 'norigmny', // 金额
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
	vbatchcode: 'vbatchcode', //批次号
	ccontractid: 'ccontractid', //合同信息
	ccontractrowid: 'ccontractrowid', //合同明细
	vcontractcode: 'vcontractcode', //合同号
	ncalcostmny: 'ncalcostmny', // 计成本金额
	ncaltaxmny: 'ncaltaxmny', // 计税金额
	nnosubtax: 'nnosubtax', // 不可抵扣税额
	nmny: 'nmny', // 本币无税金额
	ntaxmny: 'ntaxmny', // 本币价税合计
	ngroupmny: 'ngroupmny', // 集团本币无税金额
	ngrouptaxmny: 'ngrouptaxmny', // 集团本币价税合计
	nglobalmny: 'nglobalmny', // 全局本币无税金额
	nglobaltaxmny: 'nglobaltaxmny', //全局本币价税合计
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
	PrayBill: '20', //请购单
	PurDaily: 'Z2', //采购合同
	SoOrder: '30', //销售订单
	EXPORTATION: '3', //出口
	IMPORTATION: '4', //进口
	free: '0', //单据状态 自由
	commit: '1', //提交
	approve: '2', //审批中
	approved: '3', //审批通过
	unapproved: '4', //审批不通过
	other: '5', //输出
	sagaStatus: 'saga_status', //事务状态
	pk_supplier_v: 'pk_supplier_v', //供应商版本
	pk_recvcustomer_v: 'pk_recvcustomer_v', //收货客户版本
	pk_invcsupllier_v: 'pk_invcsupllier_v', //开票供应商版本
	casscustvid: 'casscustvid', //客户版本
	cratetype: 'cratetype', //组织汇率类型
	fratecategory: 'fratecategory', //组织汇率类别
	dratedate: 'dratedate', //组织汇率来源日期
	revisionstatus: 'revisionstatus',
	scene: 'scene',
	pk_srcorder: 'pk_srcorder',
	approvesce: 'approvesce',
	pk: 'pk', // 里程碑看板跳转过来用
	nhtaxrate: 'nhtaxrate' // 整单税率
};
const LIST_BUTTON = {
	search: 'search', //查询
	Add: 'Add', //新增
	selfmake: 'SelfMake', //自制
	Pu_GenerateOrder: 'Pu_GenerateOrder', //采购合同生成订单
	Req_GenerateOrder: 'Req_GenerateOrder', //请购生成订单
	D_Sale_GenerateOrder: 'D_Sale_GenerateOrder', //直运销售生成订单
	Pu_co_GenerateOrder: 'Pu_co_GenerateOrder', //销售协同生成订单
	OrderTOSaleBill: 'OrderTOSaleBill', //生成协同销售订单
	Replenishment: 'Replenishment', //补货
	Delete: 'Delete', //删除
	Commit: 'Commit', //按钮名称-提交
	ToCommit: 'ToCommit', //功能-提交
	UnCommit: 'UnCommit', //收回
	ApproveInfo: 'ApproveInfo', //查看审批意见
	SupplierAp: 'SupplierAp', //供应商应付
	Auxiliary: 'Auxiliary', //辅助功能
	Freeze: 'Freeze', //冻结
	UnFreeze: 'UnFreeze', //解冻
	OpenBill: 'OpenBill', //整单打开
	CloseBill: 'CloseBill', //整单关闭
	Annex_Management: 'Annex_Management', //附件管理
	QueryAboutBusiness: 'QueryAboutBusiness', //单据追溯
	LinkQuery: 'LinkQuery', //联查
	Arrival_Plan: 'Arrival_Plan', //到货计划
	Payment_Plan: 'Payment_Plan', //付款计划
	Transport_State: 'Transport_State', //运输状态
	PayExecStat: 'PayExecStat', //运输状态
	Refresh: 'Refresh', //刷新
	Print: 'Print', //打印
	Print_list: 'Print_list', //打印清单
	PrintOut: 'PrintOut', //输出
	List_Inner_Commit: 'Commit', //行提交
	Copy: 'Copy', //行复制
	List_Inner_UnCommit: 'List_Inner_UnCommit', //行收回
	SMS_CIRCULAR: 'SMS_CIRCULAR', //短信通知 --到货计划使用
	Edit: 'Edit',
	Save: 'Save', // 保存
	Cancel: 'Cancel', //取消
	DelLine: 'DelLine', //删行
	CopyLine: 'CopyLine', //复制行
	Bi_GenerateOrder: 'Bi_GenerateOrder', // 借入生成订单
	ToInformation: 'ToInformation', //内部交易信息
	printCountQuery: 'PrintCountQuery', //打印次数查询
	Import: 'Import', //导入
	Export: 'Export' //导出
};
const BUTTON = {
	Back: 'Back', //返回
	Head_Group1: 'Head_Group1', //保存+保存提交
	Head_Group2: 'Head_Group2', //修改+删除+复制
	Save: 'Save', //保存
	TemporaryStorage: 'TemporaryStorage', //暂存
	SaveCommit: 'SaveCommit', //保存并提交
	Cancel: 'Cancel', //取消
	Add: 'Add', //新增
	Add_Group1: 'Add_Group1', //新增下拉=自制
	Add_Group2: 'Add_Group2', //新增下拉=请购生成订单+直运销售生成订单+购销协同生成订单+采购合同生成订单
	selfmake: 'SelfMake', //自制
	Pu_GenerateOrder: 'Pu_GenerateOrder', //采购合同生成订单
	Req_GenerateOrder: 'Req_GenerateOrder', //请购生成订单
	D_Sale_GenerateOrder: 'D_Sale_GenerateOrder', //直运销售生成订单
	Pu_co_GenerateOrder: 'Pu_co_GenerateOrder', //购销协同生成订单
	replenishment: 'Replenishment', //补货
	Edit: 'Edit', //修改
	Delete: 'Delete', //删除
	Copy: 'Copy', // 	复制
	Commit: 'Commit', //提交
	UnCommit: 'UnCommit', //收回
	Auxiliary: 'Auxiliary', //辅助功能
	aux_g1: 'aux_g1', //辅助下拉1
	arrival_plan: 'Arrival_Plan', //到货计划
	Payment_Plan: 'Payment_Plan', //付款计划
	OrderTOSaleBill: 'OrderTOSaleBill', //生成协同销售订单
	Freeze: 'Freeze', //冻结
	UnFreeze: 'UnFreeze', //解冻
	OpenBill: 'OpenBill', //整单打开
	CloseBill: 'CloseBill', //整单关闭
	aux_g2: 'aux_g2', //辅助下拉2
	QueryAboutBusiness: 'QueryAboutBusiness', //单据追溯
	ApproveInfo: 'ApproveInfo', //查看审批意见
	SupplierAp: 'SupplierAp', //供应商应付
	LinkPoPlan: 'LinkPoPlan', //联查采购计划
	aux_g3: 'aux_g3', //辅助下拉3
	annex_management: 'Annex_Management', //附件管理
	LinkQuery: 'LinkQuery', //联查
	LinkQuery_g1: 'LinkQuery_g1', //联查下拉
	Transport_State: 'Transport_State', //运输状态
	PayExecStat: 'PayExecStat', //付款执行情况
	print: 'Print', //打印
	PrintOut: 'PrintOut', //输出
	printCountQuery: 'PrintCountQuery', //打印次数查询
	CombineShow: 'CombineShow', //合并显示
	Refresh: 'Refresh', //刷新
	ShowDraft: 'ShowDraft', //显示草稿
	showDraft: 'showDraft', //新增小应用显示草稿
	Pay_Addline: 'Pay_AddLine', //付款协议增行
	Card_Body_Group1: 'Card_Body_Group1', //物料表格肩部按钮组
	Material_AddLine: 'Material_AddLine', //物料信息增行
	materialDeleteLine: 'DeleteLine', //物料删行
	copyline: 'CopyLine', //复制行
	Card_Body_Group2: 'Card_Body_Group2',
	puinquiry: 'Pu_Inquiry', //采购询价
	checkpuinquiry: 'CheckPuInquiry', //询协同售价
	puinquirys: 'Pu_Inquirys', //采购询价
	checkpuinquirys: 'CheckPuInquirys', //询协同售价
	Correct: 'Correct', // 	批改 material
	StockQuery: 'StockQuery', //存量查询
	SalesQuery: 'SalesQuery', //销量查询
	GrossProfit: 'GrossProfit', //毛利预估
	Resetno: 'Resetno', //重排行号
	Material_PastLast: 'Material_PastLast', //复制至末行+复制取消
	PasteLast: 'PasteLast', //复制至末行
	PasteCancel: 'PasteCancel', //复制取消
	PasteThis: 'PasteThis', //粘贴至此
	Pay_DeleteLine: 'Pay_DeleteLine', //付款协议删行 payment_table_row
	openbrowse: 'OpenBrowse', //浏览态行操作展开  material_table_row
	openedit: 'OpenEdit', //编辑态行操作展开
	Material_DeleteLine: 'DeleteLine', //物料表格内删行
	CopyLine_row: 'CopyLine_row', //复制行
	InsertLine: 'InsertLine', //插行
	RefAddLind: 'RefAddLind', //参照增行
	QuitTransferBill: 'QuitTransferBill', //退出转单
	RowOpen: 'RowOpen', //行打开
	RowClose: 'RowClose', //行关闭
	orgChange: 'orgChange', // 组织切换
	SetPiece: 'SetPiece', //成套件
	SupplementaryInfo: 'SupplementaryInfo', //辅助信息
	Bi_GenerateOrder: 'Bi_GenerateOrder', // 借入生成订单
	materialCardInitBtn: [
		'MaterialDeleteLine',
		'Material_AddLine',
		'CopyLine',
		'Correct',
		'CheckPuInquiry',
		'Pu_Inquiry',
		'Resetno'
	],
	materialCardPastBtn: [ 'Material_PastLast', 'PasteLast', 'PasteCancel' ],
	ToInformation: 'ToInformation' //内部交易信息
};
const STATUS = {
	status: 'status', //状态标志
	edit: 'edit', //编辑态
	browse: 'browse', //浏览
	copy: 'copy',
	tempstatus: 'tempstatus', //暂存标志
	add: 'add' //新增
};
const BUTTON_DISABLED = true;
const TRANSFER = {
	transfer: 'transfer', //转单类型参数
	channelType: 'channelType', //推单参数
	replenishmentarrange: 'replenishmentarrange', //补货安排
	directarrange: 'directarrange', //直运安排
	priceaudit: 'priceaudit' // 价格审批单
};

const TRANSFER20 = {
	appcode: '400400400',
	CSOURCETYPECODE: '20', // 单据类型
	GOTO20: '/transfer20', //拉请购单
	PAGEID: '400400400_20to21', //'400400400_transfer', //页面标识
	SEARCHID: '400400400_tranfer_query', //查询区域
	LIST_TABLE: 'po_praybill', //请购单主表
	LIST_TABLE_CHILD: 'pk_praybill_b', //请购单子表
	VIEW: 'view', //视图vo
	GETQUERYDATA: '/nccloud/pu/poorder/query20for21action.do', //请购单查询
	TRANSFERXTO21ACTION: '/nccloud/pu/poorder/transfer20to21action.do',
	KEY: 'pk_praybill_b',
	Quota_Allocation: 'Quota_Allocation',
	ScanTransfer: 'ScanTransfer',
	Supplier: 'Supplier',
	Refresh: 'Refresh',
	billtype: '20',
	vbillcode: 'vbillcode',
	pk_praybill: 'pk_praybill'
};

const TRANSFERZ2 = {
	appcode: '400400800',
	CSOURCETYPECODE: 'Z2', // 单据类型
	GOTOZ2: '/transferz2', // 拉采购合同
	PAGEID: '400200301_transfer', //页面标识
	SEARCHID: '40203001_tranfer_query', //查询区域
	LIST_TABLE: 'ct_pu', //主表
	LIST_TABLE_CHILD: 'ct_pu_b', //子表
	VIEW: 'view', //视图vo
	GETQUERYDATA: '/nccloud/pu/poorder/queryz2for21action.do', //采购合同查询
	TRANSFERXTO21ACTION: '/nccloud/pu/poorder/transferz2to21action.do',
	KEY: 'pk_ct_pu_b',
	Refresh: 'Refresh',
	billtype: 'Z2', // 传入后台的单据类型都必须是大写
	vbillcode: 'vbillcode',
	pk_ct_pu: 'pk_ct_pu'
};
const TRANSFER30TO21 = {
	appcode: '400600400',
	CSOURCETYPECODE: '30TO21', // 单据类型  直运
	GOTO30SALE: '/transfer30sale', // 拉直运销售
	PAGEID: '400600400_30to21sale', //页面标识
	SEARCHID: '400600301_list_query', //查询区域
	LIST_TABLE: 'so_saleorder', //主表
	LIST_TABLE_CHILD: 'so_saleorder_b', //子表
	VIEW: 'view', //视图vo
	GETQUERYDATA: '/nccloud/pu/poorder/query30salefor21action.do', //直运销售查询
	TRANSFERXTO21ACTION: '/nccloud/pu/poorder/transfer30saleto21action.do',
	KEY: 'csaleorderbid', //csaleorderid  csaleorderbid
	Refresh: 'Refresh',
	billtype: '30',
	vbillcode: 'vbillcode',
	csaleorderid: 'csaleorderid'
};
const TRANSFER30TO21COOP = {
	appcode: '400600400',
	CSOURCETYPECODE: '30TO21COOP', // 单据类型 销售协同
	GOTO30COOP: '/transfer30coop', // 拉协同销售
	PAGEID: '400600400_30to21coop', //页面标识
	SEARCHID: '400600301_list_query', //查询区域
	LIST_TABLE: 'so_saleorder', //主表
	LIST_TABLE_CHILD: 'so_saleorder_b', //子表
	VIEW: 'view', //视图vo
	GETQUERYDATA: '/nccloud/pu/poorder/query30coopfor21action.do', //协同销售订单查询
	TRANSFERXTO21ACTION: '/nccloud/pu/poorder/transfer30coopto21action.do',
	KEY: 'csaleorderbid',
	Refresh: 'Refresh',
	billtype: '30',
	vbillcode: 'vbillcode',
	csaleorderid: 'csaleorderid'
};
const TRANSFERMULTI = {
	CSOURCETYPECODE: 'MULTI', // 单据类型 多来源
	GOTOMULTI: '/transfer23_45', // 拉协同销售
	PAGEID: '400600301_list_transfercoop', //页面标识
	SEARCHID: '', //查询区域
	LIST_TABLE: '', //主表
	LIST_TABLE_CHILD: '', //子表
	TRANSFERXTO21ACTION: '/nccloud/pu/poorder/transfermultito21action.do',
	KEY: 'csaleorderbid',
	Refresh: 'Refresh',
	APPCODE23: '400401200',
	APPCODE45: '400800800',
	billtype23: '23',
	billtype45: '45',
	pk_arriveorder: 'pk_arriveorder',
	cgeneralhid: 'cgeneralhid',
	vbillcode: 'vbillcode'
};

const ARRIVEPLAN = {
	PAGECODE: '400400416_arriveplan', //页面标识
	TABLEID: 'po_order_bb1', //表格ID
	LIST_TITLE: 'LIST_TITLE',
	TABLEINNER: 'TABLEINNER'
};

const STOCKQUERY = {
	PAGECODE: '400400800_atpparamvo', //页面标识
	TABLEID: 'atpforonematerialitemvo' //表格ID
};
//销量查询
const SALESQUERY = {
	PAGECODE: '400400800_salesquery', //页面标识
	TABLEID: 'salesquerymaterialitemvo', //表格ID
	LIST_TITLE: 'LIST_TITLE' //模板按钮区域
};
//毛利预估
const GROSSPROFITQUEYR = {
	PAGECODE: '400400800_grossprofitestimate', //页面标识
	GROSS_HEAD: 'grossprofit_head', //表头
	GROSS_BODY: 'grossprofit_body' //表体
};
//供应商应付
const SUPPLIERAP = {
	PAGECODE: '400400800_supplierap', //页面标识
	TABLEID: 'supplierapitemvo' //表格ID
};
const APPFLAG = 'APPFLAG'; //小应用进入界面的标识

const APPCODE = {
	orderAppCode: '400400800',
	payplanAppCode: '400400806' //付款计划appcode
};

const TRANSFER49 = {
	appcode: '400800832',
	CSOURCETYPECODE: '49', // 介入单单据类型
	GOTO49: '/transfer49', // 参照介入单
	PAGEID: '400800832_49to21', // 页面编码
	SEARCHID: '400800832_query', // 查询区编码
	LIST_TABLE: 'head', // 表头
	LIST_TABLE_CHILD: 'body', // 表体
	VIEW: 'view49', // 主子展示编码
	GETQUERYDATA: '/nccloud/pu/poorder/query49for21action.do', // 查询请求
	TRANSFERXTO21ACTION: '/nccloud/pu/poorder/transfer49to21action.do',
	KEY: 'cgeneralhid',
	Refresh: 'Refresh',
	billtype: '49',
	vbillcode: 'vbillcode',
	cgeneralhid: 'cgeneralhid'
};

const COMMON = {
	LINK_KEY: 'pulinkkey' //共享联查key
};

const PUSHCONST = {
	vsrcAppcode: 'vsrcAppcode',
	replenishmentArrangeIds: 'replenishmentarrange', // 补货刘奇参数变更  replenishmentArrangeIds
	directArrangeIds: 'directarrange', // 直运 directArrangeIds
	pushId: 'pushId' // 价格审批单
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
	ARRIVEPLAN,
	TRANSFER20,
	TRANSFERZ2,
	TRANSFER30TO21,
	TRANSFER30TO21COOP,
	TRANSFERMULTI,
	TRANSFER,
	BUTTON_DISABLED,
	APPFLAG,
	STOCKQUERY,
	SALESQUERY,
	GROSSPROFITQUEYR,
	SUPPLIERAP,
	OrderCache,
	APPCODE,
	TRANSFER49,
	COMMON,
	PUSHCONST,
	BATCHITEM,
	FREEFIELD
};
