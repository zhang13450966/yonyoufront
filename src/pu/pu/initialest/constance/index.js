/*
 * @Author: zhaochyu
 * @PageInfo: 常量定义
 * @Date: 2018-04-28 16:05:16
 * @Last Modified by: zhangmi
 * @Last Modified time: 2021-09-07 19:39:20
 */
const URL = {
	gotoTransfer: '/transfer', //跳转到转单界面
	gotoCard: '/pu/pu/initialest/card/index.html', //跳转到卡片态
	gotoList: '/pu/pu/initialest/list/index.html', // 跳转到列表态
	cardQuery: '/nccloud/pu/initialest/cardquery.do', //卡片态查询
	listQuery: '/nccloud/pu/initialest/listquery.do', //列表态查询
	cardSave: '/nccloud/pu/initialest/cardsave.do', //卡片保存
	cardUpadate: '/nccloud/pu/initialest/cardupdate.do', //卡片更新
	queryPage: '/nccloud/pu/initialest/querypage.do', //分页查询
	query: '/nccloud/pu/initialest/query.do', //列表界面查询
	cardinsert: '/nccloud/pu/initialest/insert/do', //卡片态新增链接
	orgRef: '/nccloud/pu/initialestcard/orgsRef.do', //采购组织参照
	getCard: '/nccloud/pu/initialestcard/query.do', //卡片态数据查询
	delete: '/nccloud/pu/initialest/delete.do', //删除
	save: '/nccloud/pu/initialest/save.do', //保存
	headAfterEdit: '/nccloud/pu/initialest/headafter.do', //表头编辑后事件
	bodyAfterEdit: '/nccloud/pu/initialest/bodyafter.do', //表头编辑后事件
	orgafter: '/nccloud/pu/initialest/orgafter.do', //主组织编辑后事件
	approve: '/nccloud/pu/initialest/approve.do', //审批
	unapprove: '/nccloud/pu/initialest/unapprove.do', //取消审批
	copy: '/nccloud/pu/initialest/copy.do', //复制
	queryOrder: '/nccloud/pu/initialest/queryOrder.do', //拉单采购订单查询
	transferOrder: '/nccloud/pu/initialest/transferOrder.do', //转单
	queryAddTab: '/nccloud/pu/initialest/queryAddTab.do', //查询业务流信息
	print: '/nccloud/pu/initialest/print.do', //打印
	import: '/nccloud/pu/initialest/import.do', //导入
	extrefsqlbuilder: 'nccloud.web.scmpub.ref.TransTypeRefFilterUtils', //交易类型参照过滤
	materialsqlbuilder: 'nccloud.web.pu.initialest.util.MaterialSqlBuilder', //物料编辑前事件过滤
	castunitidSqlBuilder: 'nccloud.web.pu.initialest.util.CastunitidSqlBuilder', //单位过滤
	ctaxcodeidSqlBuilder: 'nccloud.web.pu.initialest.util.CtaxcodeidSqlBuilder', //税码过滤
	beforeEdit: '/nccloud/pu/initialest/before.do', //编辑前事件处理
	cardurl: '/card', //新交互跳转
	listurl: '/list', //新交互列表跳转
	org_permissions: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter', //主组织权限
	orgv_permissions: 'nccloud.web.scmpub.ref.AppPermissionOrgVidRefFilter', //主组织vid权限
	fixRate: '/nccloud/pu/initialest/vchange.do', //汇率设置
	exportset: '/nccloud/pu/initialest/exportset.do', //导出模板设置
	sagascheck: '/nccloud/pu/initialest/initialestsagascheck.do' // sagas事务校验
};
/**
 * 操作类型
 */
const ACTIONNAME = {
	write: 'WRITE', //保存
	delete: 'DELETE', //删除
	sign: 'SIGN', //签字
	cancelsign: 'CANCELSIGN' //取消签字
};
/**
 * 界面状态
 */
const UISTATE = {
	edit: 'edit', // 编辑态
	browse: 'browse', // 浏览态
	add: 'add', //新增态
	transfer: 'transfer', //转单
	Copy: 'Copy' //复制
};
/**
 * 页签code
 */
const TABCODE = {
	process: 0, //处理中
	total: 1 //总数
};
// 区域ID
const AREA = {
	searchArea: 'searchArea',
	listSearchArea: 'list_query', //列表态搜索区域
	listTableArea: 'list_head', //列表态表格区域
	cardFormArea: 'card_head', //卡片态from区域
	cardTableArea: 'card_body', //卡片态表格区域
	modalArea: 'modal', //modal区域
	list_inner: 'list_inner', //列表态行内区域
	leftarea: 'leftarea', //左边区域
	card_body_inner: 'card_body_inner', //卡片态行内区域
	VIEW: 'view' //拉单拉平取悦
};
/**
 * 字段
 */
const ATTRCODES = {
	crowno: 'crowno'
};
/**
 * 小应用ID
 */
const TRANSFER = {
	//oid: "1005Z8100000000132CC",
	oid: '1001K61000000001GN64',
	appid: '0001Z810000000034RGJ',
	view: 'view'
};
//页面编码
const PAGECODE = {
	poorder: '400400800', //采购订单
	dbilldateVal: '',
	searchId: 'list_query', //查询区编码
	oid: '0001Z81000000006TH8H',
	// oid: "1001AA10000000013RCB",
	appcode: '400402800', //小应用编码
	appid: '0001Z810000000034RGJ',
	tableId: 'list_head', //列表的table区
	listpagecode: '400402800_list',
	list: '400402800_list', // 列表界面编码
	cardpagecode: '400402800_card', //卡片界面编码
	cardhead: 'card_head', //卡片态from区
	cardbody: 'card_body', //卡片态table区
	childform1: 'childform1',
	childform2: 'childform2',
	childform3: 'childform3', //卡片态操作信息
	queryType: 'simple',
	billType: '4T', //期初暂估类型
	pageInfo: {
		//分页信息
		pageIndex: 0,
		pageSize: 10
	},
	transferlist: '400400800_21to4T', //转单页面code
	transfercard: '400402800_transfer' //转单页面code
};
const FBILLSTATUS = {
	free: '0', //自由态
	approved: '3' //审批通过
};

const FIELD = {
	default: [
		{
			field: 'dr',
			value: { firstvalue: '0' },
			oprtype: '\u003d'
		}
	],
	operation: 'operation', //操作列
	pk_initialest: 'pk_initialest',
	pk_org_v: 'pk_org_v', //组织参照
	formArea: 'card_head', // 卡片态form表单区
	cardTable: 'card_body', //卡片态表格区
	searchArea: 'list_query', // search搜索区
	tableArea: 'list_head', // table表格区
	all: 'all', //页签全部
	free: 'free', //页签处理中
	fbillstatus: 'billStatus', //单据状态
	ts: 'ts', //时间戳
	cardId: 'id', //列表态跳转卡片态，主键请求参数
	cardStatus: 'status', //列表态跳转卡片态，主键请求参数
	transfer: 'transfer', //转单
	output: 'output', //输出
	pk_order: 'pk_order', //采购订单表头
	pk_order_b: 'pk_order_b', //采购订单表体
	pu: 'pu', //pu模块
	st: 'st', //库存模块
	attachpk_initialest: 'attachpk_initialest', //附件管理主键
	showUploader: 'showUploader', //附件管理位置主键
	target: 'target', //目标位置
	freeNum: 'freeNum', //自由态数量
	currentTab: 'currentTab', //当前页签
	endpk_initialest: 'pk_initialest', //列表态最后一条pk
	isSelfMake: 'isSelfMake', //是否配了新增按钮课件
	isref21: 'isref21', //是否配了拉采购订单
	org: 'org', //将默认的个性化中心组织放在缓冲里
	orgName: 'orgName', //将默认的个性化中心组织名称放在缓冲里
	tabCode: 'tabCode', //页签
	btntabcode: 'btntabcode', //按钮可见性控制性帮助变量,
	sagaStatus: 'saga_status' //事务状态
};
const TABS = [ 'free', 'all' ];
//表体自定义项
const VBDEF = [
	'vbdef1',
	'vbdef2',
	'vbdef3',
	'vbdef4',
	'vbdef5',
	'vbdef6',
	'vbdef7',
	'vbdef8',
	'vbdef9',
	'vbdef10',
	'vbdef11',
	'vbdef12',
	'vbdef13',
	'vbdef14',
	'vbdef15',
	'vbdef16',
	'vbdef17',
	'vbdef18',
	'vbdef19',
	'vbdef20'
];
//表头自定义项
const VDEF = [
	'vdef1',
	'vdef2',
	'vdef3',
	'vdef4',
	'vdef5',
	'vdef6',
	'vdef7',
	'vdef8',
	'vdef9',
	'vdef10',
	'vdef11',
	'vdef12',
	'vdef13',
	'vdef14',
	'vdef15',
	'vdef16',
	'vdef17',
	'vdef18',
	'vdef19',
	'vdef20'
];
const LIST_BUTTON = {
	Selfmake: 'Selfmake', //自制
	Delete: 'Delete', //表头删除
	//Approve: 'Approve', //行内审批
	Approve: 'Approve', //审批
	UnApprove: 'UnApprove', //取消审批
	Edit: 'Edit', //修改
	More: 'More', //更多
	Copy: 'Copy', //行内复制
	//UnApprove: 'UnApprove', //行内取消审批
	Puorder: 'Puorder', //拉单
	modelList: 'modelList', //弹出框提示
	BillTraceability: 'BillTraceability', //单据追溯
	AttaMange: 'AttaMange', //附件管理
	Refresh: 'Refresh', //刷新
	Print: 'Print', //打印
	Output: 'Output', //输出
	Import: 'Import', //导入
	Export: 'Export' //导出
};
const CARD_BUTTON = {
	AddLine: 'AddLine', //增行
	Selfmake: 'Selfmake', //审批已通过新增
	DeleteLine: 'DeleteLine', //删行
	Edit: 'Edit', //修改
	Delete: 'Delete', //删除
	Copy: 'Copy', //复制(自由态卡片)
	Save: 'Save', //保存
	Renumber: 'Renumber', //重新排号
	Cancel: 'Cancel', //取消
	Unfold: 'Unfold', //展开
	unfold: 'unfold', //展开
	deleteLine: 'deleteLine', //删行
	copyLine: 'copyLine', //行内复制行
	CopyLine: 'CopyLine', //肩上复制行
	InsertLine: 'InsertLine', //插入行
	BillTraceability: 'BillTraceability', //卡片自由态单据追溯
	Approve: 'Approve', //审批
	AttaMange: 'AttaMange', //卡片自由态附件管理
	quitTransfer: 'quitTransfer', //退出转单
	UnApprove: 'UnApprove', //取消审批
	Puorder: 'Puorder', //卡片审批已通过拉采购订单
	Print: 'Print', //打印
	modelList: 'modelList', //删除弹出框提示
	formModel: 'formModel', //切换主组织弹出框提示
	cancelModel: 'cancelModel', //取消弹框提示
	Cancelcopyline: 'Cancelcopyline', //取消复制行
	Pastetolast: 'Pastetolast', //粘贴至末行
	Pastehere: 'Pastehere', //粘贴至此
	Refresh: 'Refresh', //自由态刷新
	Import: 'Import', //导入
	Export: 'Export', //导出
	Output: 'Output', //输出
	Add: 'Add', //新增
	More: 'More' //更多
};
/**
 * 卡片表头字段
 */
const HEAD_FIELD = {
	pk_initialest: 'pk_initialest', //期初暂估单
	pk_org_v: 'pk_org_v', //主组织版本
	pk_org: 'pk_org', //主组织
	pk_stockorg: 'pk_stockorg', //库存组织
	pk_stockorg_v: 'pk_stockorg_v', //库存组织版本
	vtrantypecode: 'vtrantypecode', //期初暂估类型编码
	pk_busitype: 'pk_busitype', //业务流程
	ccurrencyid: 'ccurrencyid', //本位币
	nexchangerate: 'nexchangerate', //折本汇率
	pk_managepsn: 'pk_managepsn', //保管员
	pk_stordoc: 'pk_stordoc', //仓库
	ctrantypeid: 'ctrantypeid', //期初暂估类型
	pk_supplier: 'pk_supplier', //供应商
	pk_supplier_v: 'pk_supplier_v', //供应商
	pk_dept_v: 'pk_dept_v', //部门版本
	pk_dept: 'pk_dept', //部门
	pk_bizpsn: 'pk_bizpsn', //采购员
	pk_purchaseorg: 'pk_purchaseorg', //采购组织版
	vbillcode: 'vbillcode', //单据号
	fbillstatus: 'fbillstatus', //单据状态
	ntotalastnum: 'ntotalastnum', //总数量
	ntotalorigmny: 'ntotalorigmny', //总价税合计
	corigcurrencyid: 'corigcurrencyid', //币种
	dbilldate: 'dbilldate', //单据日期
	pk_purchaseorg_v: 'pk_purchaseorg_v', //采购组织
	cratetype: 'cratetype',
	dratedate: 'dratedate',
	fratecategory: 'fratecategory'
};
/**
 * 卡片表体
 */
const BODY_FIELD = {
	pk_initialest_b: 'pk_initialest_b', //期初暂估单表体主键
	pk_material: 'pk_material', //物料
	pk_apliabcenter_v: 'pk_apliabcenter_v', //利润中心版本
	pk_apliabcenter: 'pk_apliabcenter', //利润中心
	casscustid: 'casscustid', //客户
	casscustvid: 'casscustvid', //客户
	csourceid: 'csourceid', //来源单据
	csourcebid: 'csourcebid', //来源单据明细
	vsourcerowno: 'vsourcerowno', //来源单据行号
	sourcets: 'sourcets', //来源单据时间戳
	sourcebts: 'sourcebts', //来源单据行时间戳
	vordertrantype: 'vordertrantype', //订单交易类型
	pk_order_b: 'pk_order_b', //订单行主键
	pk_order: 'pk_order', //订单主键
	vordercode: 'vordercode', //订单号
	corderrowno: 'corderrowno', //订单行号
	bsettlefinish: 'bsettlefinish', //是否结算完成
	naccsettlenum: 'naccsettlenum', //累计结算数量
	naccwashmny: 'naccwashmny', //累计冲减暂估金额
	bestimateap: 'bestimateap', //暂估应付标志
	naccinvoicenum: 'naccinvoicenum', //累计开票数量
	ncaninvoicenum: 'ncaninvoicenum', //可开票数量
	ncalcostmny: 'ncalcostmny', //计成本金额
	ts: 'ts', //时间戳
	ftaxtypeflag: 'ftaxtypeflag', //扣税类别
	crowno: 'crowno', //行号
	vctcode: 'vctcode', //合同号
	pk_apfinanceorg_v: 'pk_apfinanceorg_v', //应付组织
	pk_srcmaterial: 'pk_srcmaterial', //物料版本
	materialspec: 'pk_material.materialspec', //规格
	materialtype: 'pk_material.materialtype', //型号
	vchangerate: 'vchangerate', //换算率
	pk_batchcode: 'pk_batchcode', //批次档案
	vbatchcode: 'vbatchcode', //批次号
	cunitid: 'cunitid', //主单位
	castunitid: 'castunitid', //单位
	nastnum: 'nastnum', //数量
	nnum: 'nnum', //主数量
	nastorigprice: 'nastorigprice', //无税单价
	norigmny: 'norigmny', //无税金额
	ntaxrate: 'ntaxrate', //税率
	nasttaxprice: 'nasttaxprice', //本币含税单价
	nastprice: 'nastprice', //本币无税单价
	nmny: 'nmny', //本币无税金额
	ntaxmny: 'ntaxmny', //本币价税合计
	norigprice: 'norigprice', //主无税单价
	norigtaxprice: 'norigtaxprice', //主含税单价
	nprice: 'nprice', //主本币无税价
	ntaxprice: 'ntaxprice', //主本币含税价
	nastorigtaxprice: 'nastorigtaxprice', //含税单价
	ntax: 'ntax', //税额
	ncaltaxmny: 'ncaltaxmny', //计税金额
	norigtaxmny: 'norigtaxmny', //价税合计
	bopptaxflag: 'bopptaxflag', //逆向征税
	naccgoodssettlemny: 'naccgoodssettlemny', //累计货物结算金额
	naccsettlemny: 'naccsettlemny', //累计结算金额
	naccfeesettlemny: 'naccfeesettlemny', //累计费用结算金额
	nsourcenum: 'nsourcenum', //来源单据主数量
	nestcalcostprice: 'nestcalcostprice', //计成本单价
	csendcountryid: 'csendcountryid', //发货国家/地区
	crececountryid: 'crececountryid', //收货国家/地区
	ctaxcountryid: 'ctaxcountryid', //报税国家/地区
	fbuysellflag: 'fbuysellflag', //购销类型
	btriatradeflag: 'btriatradeflag', //三角贸易
	ctaxcodeid: 'ctaxcodeid', //税码
	nnosubtaxrate: 'nnosubtaxrate', //不可抵扣税率
	nnosubtax: 'nnosubtax', //不可抵扣税额
	vbmemo: 'vbmemo', //备注
	baffectcost: 'baffectcost', //影响成本标志
	baffectpccost: 'baffectpccost', //影响利润中心成本
	cproductorid: 'cproductorid', //生产厂商
	cprojectid: 'cprojectid', //项目
	csourcetypecode: 'csourcetypecode', //来源单据类型
	vsourcetrantype: 'vsourcetrantype', //来源交易类型
	vsourcecode: 'vsourcecode', //来源单据号
	pk_materialname: 'pk_material.name', //物料名称
	vfree1: 'vfree1',
	vfree2: 'vfree2',
	vfree3: 'vfree3',
	vfree4: 'vfree4',
	vfree5: 'vfree5',
	vfree6: 'vfree6',
	vfree7: 'vfree7',
	vfree8: 'vfree8',
	vfree9: 'vfree9',
	vfree10: 'vfree10',
	childform1: 'childform1',
	cardInitBtn: [ 'AddLine', 'DeleteLine', 'CopyLine', 'Renumber', 'unfold', 'deleteLine', 'copyLine', 'InsertLine' ], //卡片肩部初始化要显示的按钮
	cardPastBtn: [ 'Pastetolast', 'Cancelcopyline', 'Cancelcopyline' ],
	pk_invcsupllier: 'pk_invcsupllier' //开票供应商
};
/**
 * 搜索区字段
 */
const SEARCH_FIELD = {
	pk_org: 'pk_org', //主组织
	pk_srcmaterial: 'po_initialest_b.pk_srcmaterial', //物料
	pk_supplier: 'pk_supplier', //供应商（和拉单一样）
	ctrantypeid: 'ctrantypeid', //期初暂估类型（和拉单一样）
	pk_stockorg: 'pk_stockorg', //库存组织
	pk_stordoc: 'pk_stordoc', //仓库
	pk_srcmaterialCode: 'po_initialest_b.pk_srcmaterial.code', //物料编码
	pk_srcmaterialName: 'po_initialest_b.pk_srcmaterial.name', //物料名称
	pk_marbasclass: 'po_initialest_b.pk_srcmaterial.pk_marbasclass', //物料基本分类
	casscustid: 'po_initialest_b.casscustid', //客户
	// 拉单
	pk_psfinanceorg: 'pk_order_b.pk_psfinanceorg', //结算财务组织
	pk_srcmaterialorder: 'pk_order_b.pk_srcmaterial', //拉单物料
	pk_srcmaterialcode: 'pk_order_b.pk_srcmaterial.code', //拉单物料编码
	pk_srcmaterialname: 'pk_order_b.pk_srcmaterial.name', //拉单物料名称
	pk_marbasclassorder: 'pk_order_b.pk_srcmaterial.pk_marbasclass', //拉单物料基本分类
	casscustidorder: 'pk_order_b.casscustid', //客户
	billmaker: 'billmaker', //制单人
	approver: 'approver' //审批人
};

/**
 * DATASOURCE常量
 */
const DATASOURCE = {
	dataSource: 'scm.pu.initialest.datasource', //列表卡片缓冲数据空间
	listDataCache: 'listDataCache', //表格数据缓冲主键
	transferdataSource: 'scm.pu.initialest.transferdataSource' //转单缓冲空间
};
const CLEARFIELDS = [
	'crowno', //行号
	'nnum'
];
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
	UISTATE,
	TABCODE,
	AREA,
	LIST_BUTTON,
	TRANSFER,
	CARD_BUTTON,
	FBILLSTATUS,
	ATTRCODES,
	SEARCH_FIELD,
	HEAD_FIELD,
	BODY_FIELD,
	DATASOURCE,
	TABS,
	VDEF,
	VBDEF,
	CLEARFIELDS,
	FREEFIELD
};
