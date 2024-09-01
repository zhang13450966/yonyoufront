const URL = {
	cardinsert: '/nccloud/pu/pricestlcard/update.do', //卡片态新增链接
	cardupdate: '/nccloud/pu/pricestlcard/update.do', //卡片态编辑保存链接
	getCard: '/nccloud/pu/pricestlcard/query.do', //卡片态数据查询
	getList: '/nccloud/pu/pricestl/query.do', //列表态数据查询
	currentpage: '/nccloud/pu/pricestl/currentpage.do', //列表当前分页查询
	gotoCard: '/card', //跳转到卡片页
	gotoList: '/list', //列表跳转
	gridcommit: '/nccloud/pu/pricestlcard/commitaction.do', //提交按钮
	commit: '/nccloud/pu/pricestlcard/ancommitaction.do', //提交
	griduncommit: '/nccloud/pu/pricestlcard/uncommitaction.do', //批量收回
	uncommit: '/nccloud/pu/pricestlcard/uncommitAnaction.do', //收回
	griddelete: '/nccloud/pu/pricestlcard/griddeleteaction.do', //批量删除
	delete: '/nccloud/pu/pricestlcard/delete.do', //行删除
	print: '/nccloud/pu/pricestlcard/orderprintaction.do', // 打印
	editdatapermission: '/nccloud/pu/pricestlcard/datapermissionaction.do', // 修改权限检查
	ur: '/pu/pu/pricestl/list/index.html',
	saveAndCommitBtnClick: '/nccloud/pu/pricestlcard/saveandcommit.do'
};
const TRANSFER = {
	transfer: 'transfer' //转单类型参数
};

//页面编码
const PAGECODE = {
	PageCode: '400403600',
	billType: '24',
	dbilldateVal: '',
	searchId: '400403600_query',
	tableId: 'list_head',
	listcode: '400403600_list', // 模板编码、页面模板
	list_inner: 'list_inner', //列表表格区
	//卡片态常量
	cardcode: '400403600_card', // pu_poorder_card
	cardhead: 'card_head', //表头采购信息
	cardbody: 'card_meterial', //表体采购物料详情
	cardbodyano: 'car_quality', //优质优价相关信息z
	leftarea: 'left_area',
	material_table_row: 'card_material_inner', //物料表格区域
	quality_table_row: 'quality_table_row', //优质优价表格区域
	tree: 'tree'
};

const OrderCache = {
	OrderCacheKey: 'scm.pu.pricestl.datasource', //数据缓存
	Searchval: 'PoPricestlList_serachVal', //查询条件
	OrderListTabCode: 'OrderListTabCode', //订单列表页签缓存
	OrderCardCache: 'scm.pu.pricestl.ordercard', //卡片缓存
	OrderTransferCache: 'scm.pu.pricestl.ordertransfercache', //拉单缓存
	refBillDataCach: 'scm.pu.pricestl.refBillDataCach'
};

const FIELD = {
	ts: 'ts',
	id: 'id',
	crowno: 'crowno',
	nprice: 'nprice',
	ntaxmny: 'ntaxmny',
	pk_pricesettle: 'pk_pricesettle', //主键
	fbillstatus: 'fbillstatus', //单据状态
	pk_org: 'pk_org', //组织参照--列表使用
	pk_org_v: 'pk_org_v', //组织版本--卡片使用
	vbillcode: 'vbillcode', //价格结算单号
	free: '0', //单据状态 自由
	approve: '2', //审批中
	approved: '3', //审批通过
	unapproved: '4', //审批不通过
	other: '5', //输出
	tocommit: 'toCommit', //待提交
	approving: 'approving', //审批中
	executing: 'executing', //执行中
	all: 'all' //全部
};
const LIST_BUTTON = {
	search: 'search', //查询
	Add: 'Add', //新增
	Delete: 'Delete', //删除
	Commit: 'Commit', //按钮名称-提交
	ToCommit: 'ToCommit', //功能-提交
	UnCommit: 'UnCommit', //收回
	ApproveInfo: 'ApproveInfo', //查看审批意见
	Refresh: 'Refresh', //刷新
	Print: 'Print', //打印
	PrintOut: 'PrintOut', //输出
	List_Inner_Commit: 'List_Inner_Commit', //行提交
	List_Inner_Edit: 'List_Inner_Update', //行修改
	List_Inner_Delete: 'List_Inner_Delete', //行删除
	List_Inner_UnCommit: 'List_Inner_UnCommit', //行收回
	List_Inner_ApproveInfo: 'List_Inner_Approval_Info', //行查看审批意见
	Edit: 'Edit',
	Save: 'Save', // 保存
	Cancel: 'Cancel', //取消
	DelLine: 'DelLine' //删行
};
const BUTTON = {
	Back: 'Back',
	Add: 'Add', //新增
	Delete: 'Delete', //删除
	Commit: 'Commit', //提交
	UnCommit: 'UnCommit', //收回
	List_Inner_Commit: 'List_Inner_Commit', // 提交 行提交 list_inner
	List_Inner_Update: 'List_Inner_Update', // 修改 行修改
	List_Inner_UnCommit: 'List_Inner_UnCommit', //行收回
	List_Inner_Delete: 'List_Inner_Delete', //行删除
	List_Inner_Approval_Info: 'List_Inner_Approval_Info', //查看审批意见 行
	Print: 'Print', // 打印
	Refresh: 'Refresh', //刷新
	PrintOut: 'PrintOut', //输出
	Save: 'Save', //保存
	Cancel: 'Cancel', //取消
	TranPage: 'Tran_page', //翻页
	Edit: 'Update', //修改
	Save_Commit: 'Save_Commit', //保存提交
	openmeterialbrowse: 'OpenMeterialBrowse', //物料浏览态行操作展开  material_table_row
	openmeterialedit: 'OpenMeterialEdit', //物料编辑态行操作展开
	openqualitybrowse: 'OpenQualityBrowse' //优质优价浏览态行操作展开
	// openqualityedit:'OpenQualityEdit',//优质优价浏览态行操作展开
};
const STATUS = {
	status: 'status', //状态标志
	edit: 'edit', //编辑态
	browse: 'browse', //浏览
	billStatus: 'billStatus'
};
const BUTTON_DISABLED = true;
const TRANSFER30 = {
	transferList: '#transferList',
	org: '45org',
	appcode: '400800800',
	CSOURCETYPECODE: '24', // 单据类型
	GOTO20: '/transfer30', //拉采购入库单
	PAGEID: '400800800_transfer', //页面标识
	SEARCHID: '400800800_tranfer_query', //查询区域 编码
	LIST_TABLE: '400800800_tranfer_head', //采购入库单主表 区域编码
	LIST_TABLE_CHILD: '400800800_tranfer_body', //采购入库单子表 区域编码
	VIEW: '400800800_tranfer_title', //视图vo  主子表区域编码
	GETQUERYDATA: '/nccloud/pu/pricestlcard/query20for24action.do', //采购入库单查询
	TRANSFERXTO21ACTION: '/nccloud/pu/pricestlcard/transfer20to21action.do', //转单
	KEY: 'pk_praybill_b',
	Refresh: 'Refresh',
	Cgeneralhid: 'cgeneralhid',
	Cgeneralbid: 'cgeneralbid',
	Cgeneralbid_pk_org: 'cgeneralbid.pk_org',
	pk_org: 'pk_org',
	Refresh_id: 'Refresh_id', //刷新按钮的id
	button_secondary: 'button_secondary', //按钮
	area: '400800800_transfer', //按钮所在的区域
	order: '1' //按钮的顺序
};
const APPFLAG = 'APPFLAG'; //小应用进入界面的标识
//拉单页面的字段
const TRANSFER30QUERYFIELDS = {
	cpurorgoid: 'cpurorgoid', //采购组织
	pk_org: 'pk_org', //库存组织
	cbizid: 'cbizid', //采购员
	cdptid: 'cdptid', //采购部门
	cwarehouseid: 'cwarehouseid', //仓库
	cwhsmanagerid: 'cwhsmanagerid', //库管员
	approver: 'approver', //签字人
	cmaterialoid: 'cgeneralbid.cmaterialoid', //物料
	cvendorid: 'cgeneralbid.cvendorid', //供应商
	cstateid: 'cgeneralbid.cstateid', //库存状态
	cproductorid: 'cgeneralbid.cproductorid', //生产厂商
	vbatchcode: 'cgeneralbid.vbatchcode', //批次号
	ctrantypeid: 'ctrantypeid', //出入库类型
	TYPECODES: '45-03,45-02,45-01,45-04,45-05,45-Cxx-99'
};

export {
	URL,
	PAGECODE,
	FIELD,
	BUTTON,
	STATUS,
	LIST_BUTTON,
	BUTTON_DISABLED,
	APPFLAG,
	OrderCache,
	TRANSFER,
	TRANSFER30,
	TRANSFER30QUERYFIELDS
};
