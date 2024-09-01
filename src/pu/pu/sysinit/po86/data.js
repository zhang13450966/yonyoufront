// 自动结算之红蓝入库单 (po_rule_rbstock)
let rbstock = {
	selectable: [
		{ code: 'bsuppliersame', name: '4004sysinit-000000' } /* 国际化处理： 供应商相同*/,
		{ code: 'bdeptsame', name: '4004sysinit-000001' } /* 国际化处理： 部门相同*/,
		{ code: 'bbatchcodesame', name: '4004sysinit-000002' } /* 国际化处理： 批次相同*/,
		{ code: 'btrantypesame', name: '4004sysinit-000003' } /* 国际化处理： 入库类型相同*/,
		{ code: 'bproductorsame', name: '4004sysinit-000004' } /* 国际化处理： 生产厂商相同*/,
		{ code: 'bfreeitemsame', name: '4004sysinit-000005' } /* 国际化处理： 自由辅助属性相同*/,
		{ code: 'bbuyersame', name: '4004sysinit-000006' } /* 国际化处理： 采购员相同*/,
		{ code: 'bordersame', name: '4004sysinit-000007' } /* 国际化处理： 来源同一订单*/,
		{ code: 'borigpricesame', name: '4004sysinit-000008' } /* 国际化处理： 主无税净价相同*/,
		{ code: 'bprojectsame', name: '4004sysinit-000009' } /* 国际化处理： 项目相同*/,
		{ code: 'bnumabssame', name: '4004sysinit-000010' } /* 国际化处理： 红蓝入库单数量绝对值相同*/
	],
	unselectable: [
		{ code: 'bfinanceorgsame', name: '4004sysinit-000011' },
		{ code: 'bmaterialsame', name: '4004sysinit-000012' }
	] /* 国际化处理： 财务组织相同,物料相同*/
};

// 自动结算之红蓝发票 (po_rule_rbinvoice)
let rbinvoice = {
	selectable: [
		{ code: 'bdeptsame', name: '4004sysinit-000001' } /* 国际化处理： 部门相同*/,
		{ code: 'bbatchcodesame', name: '4004sysinit-000002' } /* 国际化处理： 批次相同*/,
		{ code: 'bproductorsame', name: '4004sysinit-000004' } /* 国际化处理： 生产厂商相同*/,
		{ code: 'bfreeitemsame', name: '4004sysinit-000005' } /* 国际化处理： 自由辅助属性相同*/,
		{ code: 'bbuyersame', name: '4004sysinit-000006' } /* 国际化处理： 采购员相同*/,
		{ code: 'bordersame', name: '4004sysinit-000007' } /* 国际化处理： 来源同一订单*/,
		{ code: 'bprojectsame', name: '4004sysinit-000009' } /* 国际化处理： 项目相同*/,
		{ code: 'bnumabssame', name: '4004sysinit-000013' } /* 国际化处理： 红蓝发票数量绝对值相同*/
	],
	unselectable: [
		{ code: 'bfinanceorgsame', name: '4004sysinit-000011' } /* 国际化处理： 财务组织相同*/,
		{ code: 'bmaterialsame', name: '4004sysinit-000012' } /* 国际化处理： 物料相同*/,
		{ code: 'bnorigpricesame', name: '4004sysinit-000014' } /* 国际化处理： 主无税单价相同*/,
		{ code: 'bsuppliersame', name: '4004sysinit-000000' } /* 国际化处理： 供应商相同*/,
		{ code: 'binvoicetypesame', name: '4004sysinit-000015' } /* 国际化处理： 发票类型相同*/
	]
};

// 自动结算之发票入库单 (po_rule_invoicestock)
let invoicestock = {
	selectable: [
		{ code: 'bdeptsame', name: '4004sysinit-000001' } /* 国际化处理： 部门相同*/,
		{ code: 'bbatchcodesame', name: '4004sysinit-000002' } /* 国际化处理： 批次相同*/,
		{ code: 'bnumsame', name: '4004sysinit-000016' } /* 国际化处理： 发票和入库单数量相同*/,
		{ code: 'bprojectsame', name: '4004sysinit-000009' } /* 国际化处理： 项目相同*/,
		{ code: 'bproductorsame', name: '4004sysinit-000004' } /* 国际化处理： 生产厂商相同*/,
		{ code: 'bbuyersame', name: '4004sysinit-000006' } /* 国际化处理： 采购员相同*/,
		{ code: 'bfreeitemsame', name: '4004sysinit-000005' } /* 国际化处理： 自由辅助属性相同*/,
		{ code: 'borigpricesame', name: '4004sysinit-000014' } /* 国际化处理： 主无税单价相同*/
	],
	unselectable: [
		{ code: 'bfinanceorgsame', name: '4004sysinit-000011' } /* 国际化处理： 财务组织相同*/,
		{ code: 'bsuppliersame', name: '4004sysinit-000000' } /* 国际化处理： 供应商相同*/,
		{ code: 'bmaterialsame', name: '4004sysinit-000012' } /* 国际化处理： 物料相同*/
	]
};

export { rbstock, rbinvoice, invoicestock };
