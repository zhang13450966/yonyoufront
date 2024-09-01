/*
 * @Author: CongKe
 * @PageInfo: 采购订单付款计划常量
 * @Date: 2018-04-17 14:00:27
 * @Last Modified by: tianzhyw
 * @Last Modified time: 2022-04-29 15:17:43
 */
const URL = {
	queryPage: '/nccloud/platform/templet/querypage.do', // 模板查询
	getList: '/nccloud/pu/poorder/orderpayplanquery.do', // 列表态数据查询
	queryByPks: '/nccloud/pu/poorder/querypayplanbypks.do', // 分页跳转
	save: '/nccloud/pu/poorder/orderpayplansave.do', //保存
	afterEvent: '/nccloud/pu/poorder/orderpayplanafter.do', //编辑后事件
	beforeEvent: '/nccloud/pu/poorder/orderpayplanbefore.do', //编辑后事件
	print: '/nccloud/pu/poorder/orderpayplanprint.do', // 打印
	payreqcheck: '/nccloud/pu/poorder/payplantopayreqcheck.do', // 付款申请检查
	paycheck: '/nccloud/pu/poorder/payplantopaycheck.do', // 付款检查
	gotoList: '/pu/pu/orderpayplan/list/index.html', // 列表跳转
	printvalidate: '/nccloud/pu/poorder/payplanprintvalidate.do', // 打印前校验
	queryUnioDetailedByOrderId: '/nccloud/pu/poorder/queryuniodetailedbyorderid.do', // 根据pk_order联查获取数据
	queryUnioDetailedByPayplanbId: '/nccloud/pu/poorder/queryuniodetailedbypayplanbid.do' // 根据子表主键获取付款计划确认信息数据
};
//页面编码
const PAGECODE = {
	dbilldateVal: '',
	listcode: '400400806_list',
	searchId: '400400806_query',
	unioDetailed: '400400806_hint',
	tableId: 'list_head',
	tableArea: 'list_inner',
	queryType: 'simple',
	tree: 'tree',
	templetid: 'templetid',
	itemBodyCode: 'payplanb',
	itemConfirmBodyCode: 'payplans',
	billType: '21P'
};
const FIELD = {
	id: 'id',
	hid: 'pk_order_payplan', // 付款计划主表主键
	bid: 'pk_order_payplan_b', // 付款计划子表主键
	ts: 'ts', //时间戳
	pks: 'pks', //传参主键
	pagecode: 'pagecode', //页面参数
	pk_org: 'pk_org', //组织参照
	pk_order: 'pk_order', //主键
	pk_material: 'pk_material', //物料参照
	pk_supplier: 'pk_supplier', //供应商
	pk_srcmaterial_refer: 'pk_order_b.pk_srcmaterial', //物料参照字段
	NACCUMPAYORGMNY: 'naccumpayorgmny', //累计付款金额
	NACCUMPAYAPPORGMNY: 'naccumpayapporgmny', //累计付款申请金额
	feffdatetype: 'feffdatetype', // 起算依据
	DBEGINDATE: 'dbegindate', //起算日期
	DENDDATE: 'denddate', //账期到期日
	IITERMDAYS: 'iitermdays', //账期天数
	NORIGMNY: 'norigmny', // 金额
	NRATE: 'nrate', //比率
	vbillcode: 'vbillcode', // 订单编码
	vordercode: 'vordercode', // 订单编码
	dbilldate: 'dbilldate', //订单日期
	vorderbilldate: 'vorderbilldate', //订单日期
	bismilepost: 'bismilepost', // 里程碑采购
	pk: 'pk', // 里程碑采购看板跳转
	vordertrantype: 'vordertrantype', // 订单交易类型
	cunitid: 'cunitid', // 主单位
	saga_btxid: 'saga_btxid', // 分支事务id
	saga_gtxid: 'saga_gtxid', // 全局事务id
	saga_frozen: 'saga_frozen', // 冻结状态
	saga_status: 'saga_statuss' // 事务状态
};
const BUTTON = {
	Edit: 'Edit', // 修改  list_head
	GeneratePaymentApplication: 'GeneratePaymentApplication', // 生成付款申请
	Payment: 'Payment', // 付款
	QueryAboutBusiness: 'QueryAboutBusiness', // 单据追溯
	Print: 'Print', // 打印
	Refresh: 'Refresh', //刷新
	Add: 'Add', //新增  edit
	Delete: 'Delete', //删除
	Save: 'Save', //保存
	Cancel: 'Cancel', //取消
	List_Inner_Insert: 'List_Inner_Insert', //插行 list_inner
	List_Inner_Delete: 'List_Inner_Delete', //删行
	List_Inner_Copy: 'List_Inner_Copy', //复制行
	UnionQueryDetailed: 'UnionQueryDetailed', //联查明细
	UnionQueryGroup: 'UnionQueryGroup' //联查按钮组
};
const STATUS = {
	status: 'status', //状态标志
	edit: 'edit', //编辑态
	browse: 'browse' //浏览
};

const PAYPLANDATASOURCE = {
	PAYPLANCACHE: 'scm.pu.orderpayplan.datasource',
	payreqkey: '21TO36D1Pks', //付款申请
	paykey: '21ToF3Pks' //付款
};

const TRANSTYPE = {
	CONTRACT: 'Z2', //采购合同
	ORDER: '21', //采购订单
	INVOICE: '25', //采购发票
	WAREHOUSING: '45', //采购入库
	ARRIVAL: '23', //到货单
	PROGRESSCONFIRM: '2C' //进度确认单（除上述四种之外都是进度确认单）
};

const APPCODE = {
	CONTRACT: '400400604', //采购合同跳转
	ORDER: '400400800', //采购订单跳转
	INVOICE: '400401600', //采购发票跳转
	WAREHOUSING: '400800800', //采购入库跳转
	ARRIVAL: '400401200', //到货单
	PROGRESSCONFIRM: '400401400' //进度确认单跳转（除上述五种之外都是进度确认单）
};

const APPPAGECODE = {
	CONTRACT: '400400604_card', //采购合同跳转
	ORDER: '400400800_card', //采购订单跳转
	INVOICE: '400401600_card', //采购发票跳转
	WAREHOUSING: '400800800_card', //采购入库跳转
	ARRIVAL: '400401200_card', //到货单跳转
	PROGRESSCONFIRM: '400401400_card' //进度确认单跳转（除上述五种之外都是进度确认单）
};

const ROWNOKEY = {
	CROWNO: 'crowno'
};

export { URL, PAGECODE, FIELD, BUTTON, STATUS, PAYPLANDATASOURCE, TRANSTYPE, APPCODE, APPPAGECODE, ROWNOKEY };
