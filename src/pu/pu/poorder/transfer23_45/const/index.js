const PAGECODE = {
	pagecode23: '400401200_23to21',
	pagecode45: '40080602_list_transfer',
	pagecodeall: 'multi_list_transfer',
	appcode23: '400401200',
	appcode45: '400800800',
	appcodeall: '400400800',
	tree: 'tree'
};
const PAGEAREA = {
	head23: 'po_arriveorder',
	search23: '40040800_list_query',
	body23: 'po_arriveorder_b',
	oid23: '1002Z810000000008DV9',
	head45: 'ic_purchasein_h',
	search45: '40080602_list_query',
	body45: 'ic_purchasein_b',
	oid45: '1003Z810000000000ZHW',
	headall: 'multi_arriveorder',
	searchall: 'multi_list_query',
	bodyall: 'multi_arriveorder_b',
	VIEWALL: 'viewall',
	VIEW45: 'view45',
	VIEW23: 'view23'
};
const PK = {
	head23: 'pk_arriveorder',
	body23: 'pk_arriveorder_b',
	head45: 'cgeneralhid',
	body45: 'cgeneralbid'
};
const URL = {
	search23: '/nccloud/pu/poorder/query23for21action.do', // 退货单
	search45: '/nccloud/pu/poorder/query45for21action.do', //退库单
	searchall: '/nccloud/pu/poorder/querymultifor21action.do' // 全部
};

const KEYMAP = {
	KEYMAP23TO21: {
		multi_arriveorder: {
			pk_arriveorder: 'pk_arriveorder',
			pk: 'pk_arriveorder', //主键
			ts: 'ts', //时间
			billtype: 'ctrantypeid', //单据类型
			pk_org_v: 'pk_org_v', //库存组织
			ctrantypeid: 'ctrantypeid', //交易类型
			vbillcode: 'vbillcode', //单据编号
			dbilldate: 'dbilldate', //单据日期
			pk_supplier: 'pk_supplier', //供应商
			receiveman: 'pk_receivepsndoc', // 收货人
			cemployeeid: 'pk_pupsndoc', // 采购员
			pk_dept_v: 'pk_dept_v', // 采购部门
			ntotalastnum: 'ntotalastnum', //总数量
			breturn: 'vsupbackreason', //退货/库理由
			vbmemo: 'vmemo' //备注
		},
		multi_arriveorder_b: {
			crowno: 'crowno', // 行号
			pk_arriveorder_b: 'pk_arriveorder_b',
			pk_b: 'pk_arriveorder_b', // 表体主键
			pk_material: 'pk_material', // 物料编码
			'pk_material.name': 'pk_material.name', // 物料名称
			'pk_material.materialspec': 'pk_material.materialspec', // 规格
			'pk_material.materialtype': 'pk_material.materialtype', // 型号
			customer: 'casscustid', //客户
			cprojectid: 'cprojectid', //项目
			cqualitylevelid: 'cqualitylevelid', //质量等级
			cproductorid: 'cproductorid', //生产厂商
			vfree1: 'vfree1', //自由辅助属性1
			vfree2: 'vfree2', //自由辅助属性2
			vfree3: 'vfree3', //自由辅助属性3
			vfree4: 'vfree4', //自由辅助属性4
			vfree5: 'vfree5', //自由辅助属性5
			vfree6: 'vfree6', //自由辅助属性6
			vfree7: 'vfree7', //自由辅助属性7
			vfree8: 'vfree8', //自由辅助属性8
			vfree9: 'vfree9', //自由辅助属性9
			vfree10: 'vfree10', //自由辅助属性10
			castunitid: 'castunitid', //单位
			cunitid: 'cunitid', //主单位
			vchangerate: 'vchangerate', //换算率
			nplanastnum: 'nplanastnum', //应到数量
			nplannum: 'nplannum', //应到主数量
			nastnum: 'nastnum', //数量
			nnum: 'nnum', //主数量
			currencyid: 'corigcurrencyid', //币种
			nexchangerate: 'nexchangerate', //折本汇率
			ccurrencyid: 'ccurrencyid', //本位币
			nqtorigprice: 'norigprice', //无税单价
			nqtorigtaxprice: 'norigtaxprice', //含税单价
			nqtorignetprice: '', //无税净价
			nqtorigtaxnetprc: '', //含税净价
			norigprice: 'norigprice', //主无税单价
			norigtaxprice: 'norigtaxprice', //主含税单价
			norignetprice: '', //主无税净价
			norigtaxnetprice: '', //主含税净价
			norigmny: 'norigmny', //无税金额
			ntaxrate: 'ntaxrate', //税率
			ntax: 'ntax', //税额
			norigtaxmny: 'norigtaxmny', //价税合计
			ctaxcodeid: '', //税码
			ncanreplnum: 'ncanreplnum', //可补货主数量
			vemo: 'vmemob', //备注
			pk_order_b: 'pk_order_b', //采购订单明细
			ts: 'ts'
		}
	},
	KEYMAP45TO21: {
		multi_arriveorder: {
			pk: 'cgeneralhid', //主键
			cgeneralhid: 'cgeneralhid',
			ts: 'ts', //时间
			billtype: 'ctrantypeid', //, //单据类型
			pk_org_v: 'pk_org_v', //库存组织
			ctrantypeid: 'ctrantypeid', //交易类型
			vbillcode: 'vbillcode', //单据编号
			dbilldate: 'dbilldate', //单据日期
			pk_supplier: 'cvendorid', //供应商
			receiveman: 'ccustomerid', // 收货人
			cemployeeid: 'cbizid', // 采购员
			pk_dept_v: 'cdptvid', // 采购部门
			ntotalastnum: 'ntotalnum', //总数量
			breturn: 'vreturnreason', //退货/库理由
			vbmemo: 'vnote' //备注
		},
		multi_arriveorder_b: {
			crowno: 'crowno', // 行号
			cgeneralbid: 'cgeneralbid',
			pk_b: 'cgeneralbid', // 表体主键
			pk_material: 'cmaterialvid', // 物料编码
			'pk_material.name': 'cmaterialvid.name', // 物料名称
			'pk_material.materialspec': 'cmaterialvid.materialspec', // 规格
			'pk_material.materialtype': 'cmaterialvid.materialtype', // 型号
			customer: 'casscustid', //客户
			cprojectid: 'cprojectid', //项目
			cqualitylevelid: 'cqualitylevelid', //质量等级
			cproductorid: 'cproductorid', //生产厂商
			vfree1: 'vfree1', //自由辅助属性1
			vfree2: 'vfree2', //自由辅助属性2
			vfree3: 'vfree3', //自由辅助属性3
			vfree4: 'vfree4', //自由辅助属性4
			vfree5: 'vfree5', //自由辅助属性5
			vfree6: 'vfree6', //自由辅助属性6
			vfree7: 'vfree7', //自由辅助属性7
			vfree8: 'vfree8', //自由辅助属性8
			vfree9: 'vfree9', //自由辅助属性9
			vfree10: 'vfree10', //自由辅助属性10
			castunitid: 'castunitid', //单位
			cunitid: 'cunitid', //主单位
			vchangerate: 'vchangerate', //换算率
			nplanastnum: 'nshouldassistnum', //应到数量
			nplannum: 'nshouldnum', //应到主数量
			nastnum: 'nassistnum', //数量
			nnum: 'nnum', //主数量
			currencyid: 'corigcurrencyid', //币种
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
			ntax: 'ntaxrate', //税额
			norigtaxmny: 'norigtaxmny', //价税合计
			ctaxcodeid: 'ctaxcodeid', //税码
			// num: 'ncanreplnum', //可补货主数量
			ncanreplnum: 'ncanreplnum', //可补货主数量
			vemo: 'vnotebody', //备注
			pk_order_b: '', //采购订单明细
			ts: 'ts'
		}
	}
};

export { PAGECODE, PAGEAREA, PK, URL, KEYMAP };
