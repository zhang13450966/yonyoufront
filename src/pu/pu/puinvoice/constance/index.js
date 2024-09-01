/*
 * @Author: jiangfw
 * @PageInfo: 常量
 * @Date: 2018-04-24 15:05:00
 * @Last Modified by: guoylei
 * @Last Modified time: 2022-05-05 16:49:39
 */
// import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
const COMMON = {
	PuinvoiceCacheKey: 'scm.pu.puinvoice.PuinvoiceCacheKey', //采购发票缓存
	TransferCacheKey: 'scm.pu.puinvoice.TransferCacheKey', //拉单缓存
	TransferFrom2507: 'scm.pu.comparebill.compareBillTo25', //对账单退单缓存
	CompareBillIds: 'CompareBillIds', //对账单id
	CurrentTab: 'CurrentTab', //列表当前页签
	BusiInfoData: 'BusiInfoData', //应用业务流相关信息
	RefBillTypeInfo: 'RefBillTypeInfo', //参照上游单据类型信息
	PURCHASEORG: 'pu', //业务人员来源采购场景
	cardPageId: '400401600_card', //卡片pagecode
	listPageId: '400401600_list', //列表pagecode
	LINK_KEY: 'pulinkkey', //共享联查发票key

	// 拉采购订单查询模板id
	templetid_21: 'templetid_21',
	// 拉期初暂估单查询模板id
	templetid_4T: 'templetid_4T',
	// 拉采购入库单查询模板id
	templetid_45: 'templetid_45',

	moduleId: '4004', //模块id
	billCode: '25', //单据编号
	tree: 'tree', //查询模式
	simple: 'simple', //查询模式
	ref50: 'ref50', //单来源拉单
	invoice: 'invoice', //收票拉单
	html: 'html', //html 打印模式
	pdf: 'pdf', //pdf 打印模式
	printTemplet: '400401600', //采购发票打印模板
	combinePrintNodeKey: '40040160001', //采购发票合并打印模板

	tempstatus: 'tempstatus', //暂存标志
	tempCardCacheKey: 'pu.pu.puinvoice.tempCardCacheKey', //暂存缓存标识
	vordercode: 'vordercode',
	pk_org: 'pk_org',
	pk_order: 'pk_order',
	payplanlist: '/pu/pu/orderpayplan/list/',
	payplanappcode: '400400806',
	payplanpagecode: '400400806_list'
};

const SCENE = {
	approvesce: 'approvesce', //审批场景
	ssctp: 'zycl',
	scene: 'scene'
};

const Q_TEMPLET_ID = {
	qTempletIdIndex: 'qTempletIdIndex', //查询模板参数名称

	qTempletid_21: 'qTempletid_21', // 拉采购订单查询模板id
	qTempletid_45: 'qTempletid_45', // 拉采购入库单查询模板id
	qTempletid_4T: 'qTempletid_4T' // 拉期初暂估单查询模板id
};

//应用编码
const APPCODE = {
	puinvoice: '400401600', //采购发票
	puinvoiceAppr: '400401604', //采购发票审批
	transfer50: '400401606', //消耗汇总收票
	vmisum: '400802000', //消耗汇总
	invoiceAll: '400401602', //收票
	invoiceScAll: '400401608', //委外收票
	poorder: '400400800', //采购订单维护
	initialest: '400402800', //期初暂估单
	purchaseIn: '400800800', //采购入库
	// scorder: '', //委外订单
	subcontIn: '400800812', //委托加工入库
	poorder21P: '400400806',
	settle: '50161402' //GXWW
};

const BILLTYPE = {
	invoice: '25', //采购发票
	po_order: '21', //采购订单
	purchaseIn: '45', //采购入库单
	initEstimate: '4T', //期初暂估单
	sc_order: '61', //委外订单
	subcontIn: '47', //委外加工入库单
	vmiSum: '50', //消耗汇总
	pscSettle: '55E6', //加工费结算单
	payplan_order: '21P' // 里程碑采购

	// invoice_n: getLangByResId(this, '4004PUINVOICE-000026') /* 国际化处理： 采购发票*/,
	// po_order_n: getLangByResId(this, '4004PUINVOICE-000033') /* 国际化处理： 采购订单*/,
	// purchaseIn_n: getLangByResId(this, '4004PUINVOICE-000034') /* 国际化处理： 采购入库单*/,
	// initEstimate_n: getLangByResId(this, '4004PUINVOICE-000035') /* 国际化处理： 期初暂估单*/,
	// sc_order_n: getLangByResId(this, '4004PUINVOICE-000036') /* 国际化处理： 委外订单*/,
	// subcontIn_n: getLangByResId(this, '4004PUINVOICE-000037') /* 国际化处理： 委外加工入库单*/,
	// vmiSum_n: getLangByResId(this, '4004PUINVOICE-000038') /* 国际化处理： 消耗汇总*/,
	// pscSettle_n: getLangByResId(this, '4004PUINVOICE-000039') /* 国际化处理： 加工费结算单*/
};

const PAGECODE = {
	invoiceCard: '400401600_card', //卡片界面
	invoiceList: '400401600_list', //列表界面
	ref50_list: '400802000_50to25', //消耗汇总拉单列表界面
	ref21_list: '400400800_21to25', // 采购订单
	ref25_list: '400400806_21Pto25', // 采购发票
	ref45_list: '400800800_45to25', // 采购入库单
	ref4T_list: '4Tto25', // 期初暂估单
	ref61_list: '400401600_61to25', // 委外定单
	ref47_list: '400800812_47to25', // 委外加工入库单
	refAll_list: 'invoiceAll', // 收票全部
	invoiceScAll: 'invoiceScAll', // 委外收票全部
	ref55E6_list: '50161402_55E6to25' //工序
};

const AREA = {
	head: 'head',
	body: 'body',
	queryArea: 'list_query', //列表查询区
	list_head: 'list_head', //列表表头区
	list_inner: 'list_inner', //列表行操作
	card_left: 'card_left', //卡片转单列表
	card_title: 'card_title', //卡片标题区
	card_head: 'card_head', //卡片表头区
	card_body: 'card_body', //卡片表体区
	card_body_inner: 'card_body_inner', //卡片表体行操作
	childform1: 'childform1',
	ref50_head: 'ref50_head', //消耗汇总发票拉单界面表格区
	ref50_query: 'ref50_query', //消耗汇总发票拉单界面查询区
	// 列表态页签，单据状态
	toCommit: 'toCommit', // 待提交
	approving: 'approving', //审批中
	all: 'all', //全部
	modelList: 'modelList', // 列表态模态框

	// 采购订单
	head21: 'head21',
	search21: 'search21',
	body21: 'body21',
	view21: 'view21',
	// 采购入库单
	head45: 'head45',
	body45: 'body45',
	search45: 'search45',
	view45: 'view45',
	// 期初暂估单
	head4T: 'head4T',
	body4T: 'body4T',
	search4T: 'search4T',
	view4T: 'view4T',
	// 委外订单
	head61: 'head61',
	body61: 'body61',
	search61: 'search61',
	search61refadd: 'search61refadd', // 参照增行
	view61: 'view61',
	// 委托加工入库单
	head47: 'head47',
	body47: 'body47',
	search47: 'search47',
	view47: 'view47',

	// 全部
	headAll: 'headAll',
	bodyAll: 'bodyAll',
	searchAll: 'searchAll',
	viewAll: 'viewAll',

	// 委外全部
	// searchScAll: 'searchScAll'
	searchScAll: 'searchAll',
	viewScAll: 'viewScAll',

	// 采购订单付款计划
	head25: 'head25',
	body25: 'body25',
	search25: 'search25',
	view25: 'view25',

	//GXWW
	head55E6: 'head55E6',
	body55E6: 'body55E6',
	search55E6: 'search55E6',
	view55E6: 'view55E6'
};

// 主组织字段
const MAIN_ORG_FIELD = {
	searchAllOrg: 'pk_psfinanceorg', //收票主组织
	search21Org: 'pk_order_b.pk_psfinanceorg', //采购订单
	search45Org: 'cfanaceorgoid', //采购入库单
	search4TOrg: 'pk_org', //期初暂估单
	search50Org: 'cfanaceorgoid', //消耗汇总
	search47Org: 'pk_org.pk_financeorg', //委外加工入库单
	search61Org: 'pk_financeorg', //委外订单
	searchScAllOrg: 'pk_financeorg', //委外全部
	search21POrg: 'pk_org' //采购订单付款计划
};

// 主组织编辑后拉单查询界面需要添加过滤的字段
const FILTER_FIELD = {
	// 收票全部页签
	searchAllFields: [
		'pk_supplier', //供应商
		'pk_srcmaterial', //物料
		'pk_marbasclass', //物料基本分类
		'billmaker', //制单人
		'approver' //审批人
	],
	// 采购订单
	search21Fields: [
		'pk_payterm', //付款协议
		'pk_dept', //采购部门
		'pk_bizpsn', //采购员
		'pk_supplier', //供应商
		'pk_invcsupllier', //开票供应商
		'pk_recvcustomer', //收货客户
		'pk_order_b.pk_srcmaterial', //物料
		'pk_order_b.pk_srcmaterial.pk_marbasclass', //物料基本分类
		'pk_order_b.casscustid', //客户
		'pk_order_b.cprojectid', //项目
		'billmaker', //制单人
		'approver', //审批人
		'corigcurrencyid' //币种
		// 'pk_order_b.cproductorid'//生产厂商
	],
	// 采购入库单
	search45Fields: [
		'ccustomerid', //收货客户
		'cgeneralbid.cvendorid', //供应商
		'cgeneralbid.cmaterialoid', //物料
		'cgeneralbid.cmaterialoid.pk_marbasclass', //物料基本分类
		'billmaker', //制单人
		'approver' //审批人
		//自有辅助属性1-10
		// 'cgeneralbid.vfree1',
		// 'cgeneralbid.vfree2',
		// 'cgeneralbid.vfree3',
		// 'cgeneralbid.vfree4',
		// 'cgeneralbid.vfree5',
		// 'cgeneralbid.vfree6',
		// 'cgeneralbid.vfree7',
		// 'cgeneralbid.vfree8',
		// 'cgeneralbid.vfree9',
		// 'cgeneralbid.vfree10'
	],
	// 期初暂估单
	search4TFields: [
		'po_initialest_b.casscustid', //客户
		'pk_supplier', //供应商
		'po_initialest_b.pk_srcmaterial', //物料
		'po_initialest_b.pk_srcmaterial.pk_marbasclass', //物料基本分类
		'billmaker', //制单人
		'approver' //审批人
	],
	// 消耗汇总单
	search50Fields: [
		'cvendorid', //供应商
		'cmaterialoid', //物料
		'cmaterialoid.pk_marbasclass', //物料基本分类
		'billmaker', //制单人
		'approver', //审批人
		'billmaker', //制单人
		'approver', //审批人
		//自由辅助属性1-10
		'vfree1',
		'vfree2',
		'vfree3',
		'vfree4',
		'vfree5',
		'vfree6',
		'vfree7',
		'vfree8',
		'vfree9',
		'vfree10'
	],
	// 委托加工入库单
	search47Fields: [
		'cgeneralbid.cmaterialoid', //物料
		'cgeneralbid.cmaterialoid.pk_marbasclass', //物料基本分类
		'cvendorid', //供应商
		'cbiztype', //业务流程
		'billmaker', //制单人
		'approver', //审批人
		'cbiztype' //业务流程
	],
	// 委外订单
	search61Fields: [
		'pk_supplier', //供应商
		'pk_invcsupllier', //开票供应商
		'pk_recvcustomer', //收货客户
		'pk_order_b.casscustid', //客户
		'pk_order_b.pk_srcmaterial', //物料
		'pk_order_b.pk_srcmaterial.pk_marbasclass', //物料基本分类
		'billmaker', //制单人
		'approver', //审批人
		'pk_transporttype', //运输方式
		'pk_payterm', //付款协议
		'pk_order_b.cprojectid' //项目
	],
	// 委外全部
	searchScAllFields: [
		'pk_material', //物料
		'pk_supplier', //供应商
		'pk_marbasclass', //物料基本分类
		'billmaker', //制单人
		'approver' //审批人
	]
};

const KEYMAP = {
	// 采购订单
	m21to25: {
		headAll: {
			pk_order: 'pk_order', //主表主键
			pk_psfinanceorg_v: 'pk_org_v', //结算财务组织
			ctrantypeid: 'ctrantypeid', //交易类型
			vbillcode: 'vbillcode', //单据编号
			dbilldate: 'dbilldate', //单据日期
			pk_supplier: 'pk_supplier', //供应商
			pk_supplier_v: 'pk_supplier_v', //供应商
			cemployeeid: 'cemployeeid', //采购员
			pk_dept_v: 'pk_dept_v', //采购部门
			ntotalastnum: 'ntotalastnum', //总数量
			ntotalorigmny: 'ntotalorigmny', //总价税合计
			vmemo: 'vmemo', //备注
			ts: 'ts'
		},
		bodyAll: {
			pk_order_b: 'pk_order_b', //子表主键
			crowno: 'crowno', //行号
			pk_material_v: 'pk_material', //物料编码
			'pk_material_v.name': 'pk_material.name', //物料名称
			'pk_material_v.materialspec': 'pk_material.materialspec', // 规格
			'pk_material_v.materialtype': 'pk_material.materialtype', // 型号
			vbatchcode: 'vbatchcode', //批次号
			pk_supplier: 'casscustid', //供应商
			pk_supplier_v: 'casscustvid', //供应商
			cprojectid: 'cprojectid', //项目
			cqualitylevelid: 'cqualitylevelid', //质量等级
			cproductorid: 'cproductorid', //生产厂商
			castunitid: 'castunitid', //单位
			nastnum: 'nastnum', //数量
			cunitid: 'cunitid', //主单位
			nnum: 'nnum', //主数量
			vchangerate: 'vchangerate', //换算率
			corigcurrencyid: 'corigcurrencyid', //币种
			nexchangerate: 'nexchangerate', //折本汇率
			ccurrencyid: 'ccurrencyid', //本位币
			nqtorigprice: 'nqtorigprice', //无税单价
			nqtorigtaxprice: 'nqtorigtaxprice', //含税单价
			nqtorignetprice: 'nqtorignetprice', //无税净价
			nqtorigtaxnetprc: 'nqtorigtaxnetprc', //含税净价
			norigprice: 'norigprice', //主无税单价
			norigtaxprice: 'norigtaxprice', //主含税单价
			norignetprice: 'norignetprice', //主无税净价
			norigtaxnetprice: 'norigtaxnetprice', //主含税净价
			norigmny: 'norigmny', //无税金额
			ntaxrate: 'ntaxrate', //税率
			ntax: 'ntax', //税额
			norigtaxmny: 'norigtaxmny', //价税合计
			ctaxcodeid: 'ctaxcodeid', //税码
			ncaltaxmny: 'ncaltaxmny', //计税金额
			ncaninvoicenum: 'ncaninvoicenum', //可收票主数量
			ncaninvoicemny: 'ncaninvoicemny', //可收票金额
			vbmemo: 'vbmemo', //备注
			/**自由辅助属性1-10 */
			vfree1: 'vfree1',
			vfree2: 'vfree2',
			vfree1: 'vfree3',
			vfree2: 'vfree4',
			vfree1: 'vfree5',
			vfree2: 'vfree6',
			vfree1: 'vfree7',
			vfree2: 'vfree8',
			vfree1: 'vfree9',
			vfree2: 'vfree10',
			ts: 'ts'
		}
	},
	// 采购入库单
	m45to25: {
		headAll: {
			cgeneralhid: 'cgeneralhid', //主键
			pk_psfinanceorg_v: 'cfanaceorgvid', //结算财务组织
			ctrantypeid: 'ctrantypeid', //交易类型
			vbillcode: 'vbillcode', //单据编号
			dbilldate: 'dbilldate', //单据日期
			pk_supplier: 'cvendorid', //供应商
			pk_supplier_v: 'cvendorvid', //供应商
			cemployeeid: 'cbizid', //采购员
			pk_dept_v: 'cdptvid', //采购部门
			ntotalastnum: 'ntotalnum', //总数量
			ntotalorigmny: 'norigtaxmny', //总价税合计
			vmemo: 'vnote', //备注
			ts: 'ts'
		},
		bodyAll: {
			cgeneralbid: 'cgeneralbid', //主键
			crowno: 'crowno', //行号
			pk_material_v: 'cmaterialvid', //物料编码
			'pk_material_v.name': 'cmaterialvid.name', //物料名称
			'pk_material_v.materialspec': 'cmaterialvid.materialspec', // 规格
			'pk_material_v.materialtype': 'cmaterialvid.materialtype', // 型号
			vbatchcode: 'vbatchcode', //批次号
			pk_supplier: 'cvendorid', //供应商
			pk_supplier_v: 'cvendorvid', //供应商
			cprojectid: 'cprojectid', //项目
			cqualitylevelid: 'cqualitylevelid', //质量等级
			cproductorid: 'cproductorid', //生产厂商
			castunitid: 'castunitid', //单位
			nastnum: 'nassistnum', //数量
			cunitid: 'cunitid', //主单位
			nnum: 'nnum', //主数量
			vchangerate: 'vchangerate', //换算率
			corigcurrencyid: 'corigcurrencyid', //币种
			nexchangerate: 'nchangestdrate', //折本汇率
			ccurrencyid: 'ccurrencyid', //本位币
			nqtorigprice: 'nqtorigprice', //无税单价
			nqtorigtaxprice: 'nqtorigtaxprice', //含税单价
			nqtorignetprice: 'nqtorignetprice', //无税净价
			nqtorigtaxnetprc: 'nqtorigtaxnetprice', //含税净价
			norigprice: 'norigprice', //主无税单价
			norigtaxprice: 'norigtaxprice', //主含税单价
			norignetprice: 'norignetprice', //主无税净价
			norigtaxnetprice: 'norigtaxnetprice', //主含税净价
			norigmny: 'norigmny', //无税金额
			ntaxrate: 'ntaxrate', //税率
			ntax: 'ntax', //税额
			norigtaxmny: 'norigtaxmny', //价税合计
			ctaxcodeid: 'ctaxcodeid', //税码
			ncaltaxmny: 'ncaltaxmny', //计税金额
			// ninvoicenum: 'ncaninvoicenum', //可收票主数量
			// ninvoicemny: 'ncaninvoicemny', //可收票金额
			ncaninvoicenum: 'ninvoicenum', //可收票主数量
			ncaninvoicemny: 'ninvoicemny', //可收票金额
			vbmemo: 'vnotebody', //备注
			/**自由辅助属性1-10 */
			vfree1: 'vfree1',
			vfree2: 'vfree2',
			vfree1: 'vfree3',
			vfree2: 'vfree4',
			vfree1: 'vfree5',
			vfree2: 'vfree6',
			vfree1: 'vfree7',
			vfree2: 'vfree8',
			vfree1: 'vfree9',
			vfree2: 'vfree10',
			ts: 'ts'
		}
	},
	// 期初暂估单
	m4Tto25: {
		headAll: {
			pk_initialest: 'pk_initialest', //主表主键
			pk_psfinanceorg_v: 'pk_org_v', //结算财务组织
			ctrantypeid: 'ctrantypeid', //交易类型
			vbillcode: 'vbillcode', //单据编号
			dbilldate: 'dbilldate', //单据日期
			pk_supplier: 'pk_supplier', //供应商
			pk_supplier_v: 'pk_supplier_v', //供应商
			cemployeeid: 'cbizid', //采购员
			pk_dept_v: 'cdptvid', //采购部门
			ntotalastnum: 'ntotalastnum', //总数量
			ntotalorigmny: 'ntotalorigmny', //总价税合计
			vmemo: 'vmemo', //备注
			ts: 'ts'
		},
		bodyAll: {
			pk_initialest_b: 'pk_initialest_b', //子表主键
			crowno: 'crowno', //行号
			pk_material_v: 'pk_material', //物料
			'pk_material_v.name': 'pk_material.name', //物料名称
			'pk_material_v.materialspec': 'pk_material.materialspec', // 规格
			'pk_material_v.materialtype': 'pk_material.materialtype', // 型号
			castunitid: 'castunitid', //单位
			nastnum: 'nastnum', //数量
			vbatchcode: 'vbatchcode', //批次号
			pk_supplier: 'pk_supplier', //供应商
			pk_supplier_v: 'pk_supplier_v', //供应商
			cprojectid: 'cprojectid', //项目
			// cqualitylevelid: 'cqualitylevelid', //质量等级
			cproductorid: 'cproductorid', //生产厂商
			cunitid: 'cunitid', //主单位
			nnum: 'nnum', //主数量
			vchangerate: 'vchangerate', //换算率
			corigcurrencyid: 'corigcurrencyid', //币种
			nexchangerate: 'nexchangerate', //折本汇率
			ccurrencyid: 'ccurrencyid', //本位币
			nqtorigprice: 'nastorigprice', //无税单价
			nqtorigtaxprice: 'nastorigtaxprice', //含税单价
			// nqtorignetprice: 'nqtorignetprice', //无税净价
			// nqtorigtaxnetprc: 'nqtorigtaxnetprice', //含税净价
			norigprice: 'norigprice', //主无税单价
			norigtaxprice: 'norigtaxprice', //主含税单价
			// norignetprice: 'norignetprice', //主无税净价
			// norigtaxnetprice: 'norigtaxnetprice', //主含税净价
			norigmny: 'norigmny', //无税金额
			ntaxrate: 'ntaxrate', //税率
			ntax: 'ntax', //税额
			norigtaxmny: 'norigtaxmny', //价税合计
			ctaxcodeid: 'ctaxcodeid', //税码
			ncaltaxmny: 'ncaltaxmny', //计税金额
			ncaninvoicenum: 'ncaninvoicenum', //可收票主数量
			ncaninvoicemny: 'ncaninvoicemny', //可收票金额
			vbmemo: 'vbmemo', //备注
			/**自由辅助属性1-10 */
			vfree1: 'vfree1',
			vfree2: 'vfree2',
			vfree1: 'vfree3',
			vfree2: 'vfree4',
			vfree1: 'vfree5',
			vfree2: 'vfree6',
			vfree1: 'vfree7',
			vfree2: 'vfree8',
			vfree1: 'vfree9',
			vfree2: 'vfree10',
			ts: 'ts'
		}
	},
	// 委外订单
	m61to25: {
		headAll: {
			pk_order: 'pk_order', //委外订单主键
			pk_financeorg_v: 'pk_financeorg_v', //结算财务组织
			ctrantypeid: 'ctrantypeid', //交易类型
			vbillcode: 'vbillcode', //单据编号
			dbilldate: 'dbilldate', //订单日期
			pk_supplier: 'pk_supplier', //供应商
			pk_supplier_v: 'pk_supplier_v', //供应商
			cemployeeid: 'cemployeeid', //采购员
			pk_dept_v: 'pk_dept_v', //采购部门
			ntotalastnum: 'ntotalastnum', //总数量
			vmemo: 'vmemo', //备注
			ts: 'ts'
		},
		bodyAll: {
			pk_order_b: 'pk_order_b',
			crowno: 'crowno',
			pk_material: 'pk_material',
			'pk_material.name': 'pk_material.name',
			'pk_material.materialspec': 'pk_material.materialspec',
			'pk_material.materialtype': 'pk_material.materialtype',
			pk_batchcode: 'pk_batchcode',
			vbatchcode: 'vbatchcode',
			// pk_supplier: 'pk_supplier_b',
			cprojectid: 'cprojectid',
			cproductorid: 'cproductorid',
			cqtunitid: 'cqtunitid',
			nqtunitnum: 'nqtunitnum',
			nqtunitrate: 'nqtunitrate',
			cunitid: 'cunitid',
			nnum: 'nnum',
			nqtorigprice: 'nnetprice',
			norigmny: 'norigmny',
			ncaninvoicenum: 'ncaninvoicenum', //可收票主数量
			vbmemo: 'vbmemo',
			ts: 'ts',
			/**自由辅助属性1-10 */
			vfree1: 'vfree1',
			vfree2: 'vfree2',
			vfree1: 'vfree3',
			vfree2: 'vfree4',
			vfree1: 'vfree5',
			vfree2: 'vfree6',
			vfree1: 'vfree7',
			vfree2: 'vfree8',
			vfree1: 'vfree9',
			vfree2: 'vfree10'
		}
	},
	// 委托加工入库单
	m47to25: {
		headAll: {
			cgeneralhid: 'cgeneralhid',
			pk_financeorg_v: 'pk_org.pk_financeorg', //结算财务组织
			ctrantypeid: 'ctrantypeid', //交易类型
			vbillcode: 'vbillcode', //单据编号
			dbilldate: 'dbilldate', //订单日期
			pk_supplier: 'cvendorid', //供应商
			pk_supplier_v: 'cvendorvid', //供应商
			cemployeeid: 'cbizid', //采购员
			pk_dept_v: 'cdptvid', //采购部门
			ntotalastnum: 'ntotalnum', //总数量
			vmemo: 'vnote', //备注
			ts: 'ts'
		},
		bodyAll: {
			cgeneralbid: 'cgeneralbid',
			crowno: 'crowno',
			pk_material: 'cmaterialvid',
			'pk_material.name': 'cmaterialvid.name',
			'pk_material.materialspec': 'cmaterialvid.materialspec',
			'pk_material.materialtype': 'cmaterialvid.materialtype',
			pk_batchcode: 'pk_batchcode',
			vbatchcode: 'vbatchcode',
			// pk_supplier: 'cvendorid',
			cprojectid: 'cprojectid',
			cproductorid: 'cproductorid',
			cqtunitid: 'castunitid',
			nqtunitnum: 'nassistnum',
			nqtunitrate: 'vchangerate',
			cunitid: 'cunitid',
			nnum: 'nnum',
			nqtorigprice: 'ncostprice',
			norigmny: 'ncostmny',
			ncaninvoicenum: 'ninvoicenum', //可收票主数量
			vbmemo: 'vnotebody',
			ts: 'ts',
			/**自由辅助属性1-10 */
			vfree1: 'vfree1',
			vfree2: 'vfree2',
			vfree1: 'vfree3',
			vfree2: 'vfree4',
			vfree1: 'vfree5',
			vfree2: 'vfree6',
			vfree1: 'vfree7',
			vfree2: 'vfree8',
			vfree1: 'vfree9',
			vfree2: 'vfree10'
		}
	}
};

const PK = {
	// 采购订单
	head21pk: 'pk_order',
	body21pk: 'pk_order_b',
	// 采购入库单
	head45pk: 'cgeneralhid',
	body45pk: 'cgeneralbid',
	// 期初暂估单
	head4Tpk: 'pk_initialest',
	body4Tpk: 'pk_initialest_b',
	// 委托加工入库单
	head47pk: 'cgeneralhid',
	body47pk: 'cgeneralbid',
	//  委外订单
	head61pk: 'pk_order',
	body61pk: 'pk_order_b',
	// 付款计划
	head25pk: 'pk_order_payplan',
	body25pk: 'pk_order_payplan_b',

	//GXWW
	head55E6pk: 'pk_settle',
	body55E6ok: 'pk_settle_b'
};

const UISTATE = {
	add: 'add',
	edit: 'edit',
	browse: 'browse'
};

/**
 * 发票界面类型枚举
 */
const INVC_UI_STATE = {
	fee_invc: 'fee_invc', //费用发票维护界面
	norm_invc: 'norm_invc' //正常发票维护界面
};

const BILLSTATUS = {
	approving: '2', //审批中
	commit: '1', //提交
	free: '0', //自由
	nopass: '4', //审批未通过
	approve: '3' //审批通过
};

// 转单类型
const TRANSFER_TYPE = {
	transfer21: 'transfer21', //拉采购订单
	transfer45: 'transfer45', //拉采购入库单
	transfer47: 'transfer47', //拉委托加工入库单
	transfer50: 'transfer50', //消耗汇总拉单
	transfer4T: 'transfer4T', //拉委期初暂估单
	transfer61: 'transfer61', //拉委外订单
	transferSc: 'transferSc', //委外收票
	invoice: 'multitransfer', //收票
	transfer2507: 'from2507', //对账单
	transfer21Pto25: 'transfer21Pto25', //拉采购订单
	transfer55E6to25: 'transfer55E6to25' //GXWW
};

const URL = {
	mergerequest: '/nccloud/platform/pub/mergerequest.do', //合并请求
	querypage: '/platform/templet/querypage.do', //查询模板
	queryTemplateIdOid: '/nccloud/pu/pub/templateIdOidQry.do', //查询模板id及查询模板id

	list: '/list', //列表界面
	card: '/card', //卡片界面
	transfer50: '/transfer50', //消耗汇总收票列表界面
	multitransfer: '/multitransfer', //收票拉单列表界面
	invoice: '/invoice', //收票
	transfer21Pto25: '/transfer21Pto25', //收票
	// sctransfer: '/sctransfer', //委外收票拉单列表界面
	scInvoice: '/scInvoice', //委外收票拉单列表界面
	transfer55E6to25: '/transfer55E6to25', //gxww

	from2507Qry: '/nccloud/pu/puinvoice/from2507Qry.do', //从对账单跳转过来查询
	pageQuery: '/nccloud/pu/puinvoice/pageQuery.do', //列表界面分页查询
	pageQueryByPKs: '/nccloud/pu/puinvoice/pageQueryByPKs.do', //列表翻页查询
	save: '/nccloud/pu/puinvoice/save.do', //保存
	savaCommit: '/nccloud/pu/puinvoice/saveCommit.do',
	edit: '/nccloud/pu/puinvoice/edit.do', //修改
	batchCommit: '/nccloud/pu/puinvoice/batchCommit.do', //批量提交
	batchUnCommit: '/nccloud/pu/puinvoice/batchUnCommit.do', //批量收回
	commit: '/nccloud/pu/puinvoice/commit.do', //提交
	uncommit: '/nccloud/pu/puinvoice/uncommit.do', //收回
	batchFreeze: '/nccloud/pu/puinvoice/batchFreeze.do', //批量冻结
	batchUnFreeze: '/nccloud/pu/puinvoice/batchUnFreeze.do', //批量解冻
	freeze: '/nccloud/pu/puinvoice/freeze.do', //冻结
	unFreeze: '/nccloud/pu/puinvoice/unFreeze.do', //解冻
	apprComment: '/nccloud/pu/puinvoice/apprComment.do', //查看审批意见
	queryCard: '/nccloud/pu/puinvoice/queryCard.do', //查询整单信息
	delete: '/nccloud/pu/puinvoice/delete.do', //删除
	batchDelete: '/nccloud/pu/puinvoice/batchDelete.do', //批删
	hphq: '/nccloud/pu/puinvoice/hphq.do', //优质优价取价
	sendAp: '/nccloud/pu/puinvoice/sendAp.do', //传应付
	cancelSendAp: '/nccloud/pu/puinvoice/cancelSendAp.do', //取消传应付
	batchSendAp: '/nccloud/pu/puinvoice/batchSendAp.do', //批量传应付
	batchCancelSendAp: '/nccloud/pu/puinvoice/batchCancelSendAp.do', //批量取消传应付
	commit: '/nccloud/pu/puinvoice/commit.do', //提价
	uncommit: '/nccloud/pu/puinvoice/uncommit.do', //收回
	saveCommit: '/nccloud/pu/puinvoice/saveCommit.do', //保存并提交
	print: '/nccloud/pu/puinvoice/print.do', //打印
	checkDataPermission: '/nccloud/pu/puinvoice/checkDataPermission.do', //数据权限校验
	feeInvoice: '/nccloud/pu/puinvoice/feeInvoice.do', //费用发票
	combine: '/nccloud/pu/puinvoice/combineshowaction.do', //合并显示
	combintPrint: '/nccloud/pu/puinvoice/combineprintaction.do', //合并打印
	linkFeeInvoice: '/nccloud/pu/puinvoice/linkFeeInvoice.do', //联查费用发票
	copyReq: '/nccloud/pu/puinvoice/copyReq.do', //复制

	//编辑前事件
	beforeEditHead: '/nccloud/pu/puinvoice/beforeEditHead.do', //表头编辑前
	beforeEditBody: '/nccloud/pu/puinvoice/beforeEditBody.do', //表体编辑前
	//编辑后事件
	afterEditHead: '/nccloud/pu/puinvoice/afterEditHead.do', //表头编辑后
	afterEditBody: '/nccloud/pu/puinvoice/afterEditBody.do', //表体编辑后

	// 拉单查询
	// qryBusiInfo: '/nccloud/pu/puinvoice/qryBusiInfo.do', //根据下游单据类型查询业务流程
	qryBusiInfo: '/nccloud/pu/pub/refbillqueryaction.do', //根据下游单据类型查询业务流程
	ref50Query: '/nccloud/pu/puinvoice/ref50Query.do', //消耗汇总收票查询
	ref61Query: '/nccloud/pu/puinvoice/ref61Query.do', //委外订单收票查询
	ref47Query: '/nccloud/pu/puinvoice/ref47Query.do', //委外加工入库收票查询
	ref21Query: '/nccloud/pu/puinvoice/ref21Query.do', //采购订单拉单查询
	ref4TQuery: '/nccloud/pu/puinvoice/ref4TQuery.do', //期初暂估单拉单查询
	ref45Query: '/nccloud/pu/puinvoice/ref45Query.do', //采购入库单拉单查询
	refAllQuery: '/nccloud/pu/puinvoice/refAllQuery.do', //全部拉单查询
	refScAllQuery: '/nccloud/pu/puinvoice/refScAllQuery.do', //委外收票全部查询
	ref21Pto25Query: '/nccloud/pu/puinvoice/ref21Pto25Query.do', //采购订单付款计划拉单查询
	ref55E6Query: '/nccloud/pu/puinvoice/ref55E6Query.do', //工序委外拉单查询

	// 转单
	transfer50to25: '/nccloud/pu/puinvoice/transfer50to25.do', //消耗汇总转采购发票
	multiInvoice: '/nccloud/pu/puinvoice/multiInvoice.do', //收票多来源转单
	scInvoiceT: '/nccloud/pu/puinvoice/scInvoiceT.do', //委外收票转单
	transfer2507to25: '/nccloud/pu/puinvoice/transfer2507to25.do', //对账单推采购发票
	scanTransfer: '/nccloud/pu/puinvoice/scanTransAll.do', //扫码拉单
	poInvoiceTo21P: '/nccloud/pu/puinvoice/poInvoiceTo21P.do', //委外收票转单
	poInvoiceTo55E6: '/nccloud/pu/puinvoice/poInvoiceTo55E6.do'
};

const BUTTONID = {
	PrintCountQuery: 'PrintCountQuery', //打印次数查询
	Add_G: 'Add_G', //新增按钮组
	More_G: 'More_G', //更多按钮组
	Refresh: 'Refresh', //刷新
	ScanTransfer: 'ScanTransfer', //扫码拉单
	Add: 'Add', //自制
	Invoice: 'Invoice', //收票
	MilestonInvoice: 'MilestonInvoice', //采购订单付款计划收票
	Ref55E6: 'Ref55E6', //gxww
	ScInvoice: 'ScInvoice', //委外收票
	Ref50: 'Ref50', //消耗汇总收票
	Ref51: 'Ref51', //委外收票
	FeeInvoice: 'FeeInvoice', //费用发票
	// BatchCommit: 'BatchCommit', //批提交
	BatchUnCommit: 'BatchUnCommit', //批收回
	Commit: 'Commit', //提交
	UnCommit: 'UnCommit', //收回
	SendAp: 'SendAp', //传应付
	CancelSendAp: 'CancelSendAp', //取消传应付
	// BatchDelete: 'BatchDelete', //批删
	Delete: 'Delete', //删除
	Freeze: 'Freeze', //冻结
	UnFreeze: 'UnFreeze', //解冻
	Print: 'Print', //打印
	Print_list: 'Print_list', //打印清单
	PrintOut: 'PrintOut', //输出
	CombinePrint: 'CombinePrint', //合并显示
	Save: 'Save', //保存
	Cancel: 'Cancel', //取消
	Approve: 'Approve', //审批
	ApproveInfo: 'ApproveInfo', //审批详情
	LinkQueryFeeInvoice: 'LinkQueryFeeInvoice', //联查费用发票
	SaveCommit: 'SaveCommit', //保存提交
	Edit: 'Edit', //修改
	Copy: 'Copy', //复制
	RefAddLine: 'RefAddLine', //参照增行
	DocMng: 'DocMng', //附件管理
	QueryAboutBusiness: 'QueryAboutBusiness', //单据追溯
	LinkInvoice: 'LinkInvoice', //联查收票
	InvoiceDzfp: 'InvoiceDzfp', //电子发票
	Quit: 'Quit', //退出转单
	Back: 'Back', //返回
	Assist: 'Assist', //辅助功能
	LinkQuery: 'LinkQuery', //联查
	ShoulderGroup1: 'ShoulderGroup1', //表肩按钮组一
	ShoulderGroup2: 'ShoulderGroup2', //表肩按钮组二
	AddLine: 'AddLine', //增行
	DeleteLine: 'DeleteLine', //删行
	CopyLine: 'CopyLine', //复制行
	PasteToTail: 'PasteToTail', //粘贴至末行
	Cancel_b: 'Cancel_b', //取消
	Hphq: 'Hphq', //优质优价取价
	ReRankRownum: 'ReRankRownum', //重排行号
	// BatchMdf: 'BatchMdf', //批改
	Unfold: 'Unfold', //展开
	// DeleteLine_i: 'DeleteLine_i', //表体行删行
	InsertLine: 'InsertLine', //插入行
	PasteHere: 'PasteHere', //粘贴至此
	ImageView: 'ImageView', //影像查看
	ImageScan: 'ImageScan', //影像扫描
	TemporaryStorage: 'TemporaryStorage', //暂存
	ShowDraft: 'ShowDraft', //草稿
	ShoulderInitBtn: [ 'ShoulderGroup1', 'AddLine', 'DeleteLine', 'CopyLine', 'Hphq', 'ReRankRownum' ], //表肩按钮
	CardPastBtn: [ 'ShoulderGroup2', 'PasteToTail', 'Cancel_b', 'PasteHere' ] //粘贴相关按钮
};

const MODAL_ID = {
	freezeModal: 'freezeModal', //冻结模态框
	delModal: 'delModal', //删除确认模态框的id
	orgChange: 'orgChange', //组织切换模态框
	MessageDlg: 'MessageDlg', //提示信息模态框
	RefAddRowModal: 'RefAddRowModal', //参照增行模态框
	linkFeeModal: 'linkFeeModal' //联查费用发票模态框
};

const FIELD = {
	sagaStatus: 'saga_status',
	status: 'status', //界面状态
	id: 'id', //界面常量id,记录卡片界面单据主键的属性
	/***采购发票列表查询字段*******************************************/
	pk_usedept: 'invoicebody.pk_usedept', //使用部门
	// invoicebody.casscustid:'invoicebody.casscustid',//客户
	/***采购发票表头字段***********************************************/
	pk_invoice: 'pk_invoice', //采购发票
	vbillcode: 'vbillcode', //发票号
	pk_group: 'pk_group', //所属集团
	pk_purchaseorg: 'pk_purchaseorg', //采购组织(OID)
	pk_apfinanceorg: 'pk_apfinanceorg', //应付财务组织(OID)
	pk_apfinanceorg_v: 'pk_apfinanceorg_v', //应付财务组织(VID)
	pk_org_v: 'pk_org_v', //财务组织(VID)
	pk_org: 'pk_org', //财务组织(OID)
	fbillstatus: 'fbillstatus', //单据状态
	pk_purchaseorg_v: 'pk_purchaseorg_v', //采购组织(VID)
	ctrantypeid: 'ctrantypeid', //交易类型
	vtrantypecode: 'vtrantypecode', //发票类型(交易类型)
	pk_busitype: 'pk_busitype', //业务流程
	csourceid: 'csourceid', //来源单据主键
	pk_bizpsn: 'pk_bizpsn', //业务员
	pk_dept: 'pk_dept', //采购部门(OID)
	pk_dept_v: 'pk_dept_v', //采购部门(VID)
	nexchangerate: 'nexchangerate', //折本汇率
	pk_bankaccbas: 'pk_bankaccbas', //银行账户
	pk_supplier: 'pk_supplier', //供应商
	pk_supplier_v: 'pk_supplier_v', //供应商
	casscustid: 'casscustid', //客户
	casscustid: 'casscustvid', //客户
	nexchangerate: 'nexchangerate', //折本汇率
	cratetype: 'cratetype',
	dratedate: 'dratedate',
	fratecategory: 'fratecategory',
	ccurrencyid: 'ccurrencyid', //本币币种(本位币)
	corigcurrencyid: 'corigcurrencyid', //币种(原币)
	nglobalexchgrate: 'nglobalexchgrate', //全局本位币汇率
	ngroupexchgrate: 'ngroupexchgrate', //集团本位币汇率
	pk_freecust: 'pk_freecust', //散户
	csendcountryid: 'csendcountryid', //发货国/地区
	crececountryid: 'crececountryid', //收货国家/地区
	ctaxcountryid: 'ctaxcountryid', //报税国/地区
	pk_stockorg_v: 'pk_stockorg_v', //库存组织
	ntaxrateh: 'ntaxrateh', //整单税率
	ftaxtypeflagh: 'ftaxtypeflagh', //整单扣税类别
	pk_paytosupplier: 'pk_paytosupplier', //付款单位
	pk_paytosupplier_v: 'pk_paytosupplier_v', //付款单位
	pk_payterm: 'pk_payterm', //付款协议
	ts: 'ts',
	taudittime: 'taudittime', //审批日期
	approver: 'approver', //审批人
	modifier: 'modifier', //最后修改人
	modifiedtime: 'modifiedtime', //最后修改时间
	iprintcount: 'iprintcount', //打印次数
	fbillstatus: 'fbillstatus', //单据状态
	darrivedate: 'darrivedate', //票到日期
	dbilldate: 'dbilldate', //发票日期
	dmakedate: 'dmakedate', //制单日期
	creator: 'creator', //创建人
	billmaker: 'billmaker', //制单人
	bapflag: 'bapflag', //已传应付标志
	bfee: 'bfee', //费用发票
	pk_stockorg: 'pk_stockorg', //库存组织
	fbuysellflag: 'fbuysellflag', //购销类型
	pk_parentinvoice: 'pk_parentinvoice', //费用发票对应货物发票
	bfrozen: 'bfrozen', //冻结
	vfrozenreason: 'vfrozenreason', //最后冻结原因
	tfrozentime: 'tfrozentime', //冻结日期
	pk_frozenuser: 'pk_frozenuser', //冻结人
	bvirtual: 'bvirtual', //虚拟发票标志
	binitial: 'binitial', //是否期初发票
	csaleinvoiceid: 'csaleinvoiceid', //协同销售发票id
	/***采购发票表体字段***********************************************/
	crowno: 'crowno', //行号
	pk_invoice_b: 'pk_invoice_b', //采购发票明细主键
	pk_material: 'pk_material', //物料
	pk_srcmaterial: 'pk_srcmaterial', //物料（OID）
	pk_stordoc: 'pk_stordoc', //仓库
	pk_usedept: 'pk_usedept', // 使用部门(OID)
	pk_usedept_v: 'pk_usedept_v', //使用部门(VID)
	cprojectid: 'cprojectid', //项目
	pk_costsubj: 'pk_costsubj', //收支项目
	castunitid: 'castunitid', //单位
	vchangerate: 'vchangerate', //换算率
	pk_order: 'pk_order', //采购订单主键
	pk_order_b: 'pk_order_b', //采购订单行主键
	vordercode: 'vordercode', //订单号
	cfirstbid: 'cfirstbid', //源头单据行主键
	cfirstid: 'cfirstid', //源头单据主键
	cfirsttypecode: 'cfirsttypecode', //源头单据类型
	vfirstcode: 'vfirstcode', //源头单据号
	vfirstrowno: 'vfirstrowno', //源头单据行号
	vfirsttrantype: 'vfirsttrantype', //源头交易类型
	firstbts: 'firstbts', //源头单据行TS
	firstts: 'firstts', //源头单据TS
	csourcebid: 'csourcebid', //来源单据行主键
	csourceid: 'csourceid', //来源单据主键
	csourcetypecode: 'csourcetypecode', //来源单据类型
	sourcebts: 'sourcebts', //来源单据行TS
	sourcets: 'sourcets', //来源单据TS
	vsourcecode: 'vsourcecode', //来源单据号
	vsourcerowno: 'vsourcerowno', //来源单据行号
	vsourcetrantype: 'vsourcetrantype', //来源交易类型
	ts: 'ts',
	naccumsettmny: 'naccumsettmny', //累计本币结算金额
	naccumsettnum: 'naccumsettnum', //累计结算主数量
	pk_order: 'pk_order', //采购订单主键
	pk_order_b: 'pk_order_b', //采购订单行主键
	vordercode: 'vordercode', //订单号
	vordertrantype: 'vordertrantype', //订单交易类型
	ntaxrate: 'ntaxrate', //税率
	cproductorid: 'invoicebody.cproductorid', //生产厂商
	nastnum: 'nastnum', //数量
	nnum: 'nnum', //主数量
	norigtaxmny: 'norigtaxmny', //价税合计
	ncalcostmny: 'ncalcostmny', //计成本金额
	ncaltaxmny: 'ncaltaxmny', //计税金额
	ctaxcodeid: 'ctaxcodeid', //税码
	pk_apliabcenter_v: 'pk_apliabcenter_v', //利润中心
	nnosubtax: 'nnosubtax', //不可抵扣税额
	ntax: 'ntax', //税额
	nmny: 'nmny', //本币无税金额
	ntaxmny: 'ntaxmny', //本币价税合计
	ngroupmny: 'ngroupmny', //集团本币无税金额
	ngrouptaxmny: 'ngrouptaxmny', //集团本币价税合计
	nglobalmny: 'nglobalmny', //全局本币无税金额
	nglobaltaxmny: 'nglobaltaxmny', //全局本币价税合计
	norigmny: 'norigmny', // 金额
	nastorigprice: 'nastorigprice', //无税单价
	nastorigtaxprice: 'nastorigtaxprice', //含税单价
	vbatchcode: 'vbatchcode', //批次号
	pk_batchcode: 'pk_batchcode', //批次号主键
	ftaxtypeflag: 'ftaxtypeflag', //扣税类别
	nqtorignetprice: 'nqtorignetprice', //无税净价
	nqtorigtaxnetprc: 'nqtorigtaxnetprc', //含税净价
	norigtaxnetprice: 'norigtaxnetprice', //主含税净价
	norignetprice: 'norignetprice', //主无税净价
	norigmny: 'norigmny', //无税金额
	/***消耗汇总表头字段 ***********************************************/
	cvmihid: 'cvmihid', //消耗汇总表头主键
	cvmibid: 'cvmibid', //消耗汇总表体主键
	// ctrantypeid: 'ctrantypeid', //消耗汇总类型
	cfanaceorgoid: 'cfanaceorgoid', //结算财务组织
	cmaterialoid: 'cmaterialoid', //物料(OID)
	cwarehouseid: 'cwarehouseid', //仓库
	remainsum: 'remainsum', //可开票主数量
	nnumsum: 'nnumsum', //汇总主数量
	ntotalinvoicenum: 'ntotalinvoicenum', //已开票数量
	/***收票全部字段****************************************************/
	/***采购订单****************************************************/
	pk_arrvstoorg: 'pk_order_b.pk_arrvstoorg', //收货库存组织最新版本
	pk: 'pk' //里程碑看板跳转
};

// 参照增行校验来源表头数据与当前表头数据是否一致所校验的属性
const ADD_ROW_FIELDS = [
	'pk_org',
	// 'ctrantypeid',
	'finvoiceclass',
	'pk_supplier',
	'corigcurrencyid',
	'nexchangerate',
	'ftaxtypeflagh'
];

// 支持批量粘贴的字段
const BATCHITEM = [
	'pk_material',
	'nastnum',
	'nnum',
	'nastorigtaxprice',
	'nastorigprice',
	'ftaxtypeflag',
	'ntaxrate',
	'pk_apfinanceorg_v',
	'pk_apliabcenter_v',
	'cprojectid',
	'vmemob',
	'norigtaxprice',
	'norigtaxmny',
	'norigmny',
	'ntax'
	// 自定义项
];

// 表头自定义项
const HEAD_VDEF = [
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

// 表体自定义项
const BODY_VBDEF = [
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

// 自由辅助属性
const VFREE = [ 'vfree1', 'vfree2', 'vfree3', 'vfree4', 'vfree5', 'vfree6', 'vfree7', 'vfree8', 'vfree9', 'vfree10' ];
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
	COMMON,
	APPCODE,
	AREA,
	UISTATE,
	INVC_UI_STATE,
	BILLSTATUS,
	URL,
	BUTTONID,
	FIELD,
	PK,
	TRANSFER_TYPE,
	PAGECODE,
	BILLTYPE,
	Q_TEMPLET_ID,
	KEYMAP,
	MAIN_ORG_FIELD,
	FILTER_FIELD,
	MODAL_ID,
	HEAD_VDEF,
	BODY_VBDEF,
	VFREE,
	ADD_ROW_FIELDS,
	SCENE,
	BATCHITEM,
	FREEFIELD
};
