import { getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export default function() {
	return {
		PO06: {
			dataSource: [
				{ key: 'SupplierPrice', title: getLangByResId(this, '4004sysinit-000028') } /* 国际化处理： 供应商价目表*/,
				{ key: 'OrderNewestPrice', title: getLangByResId(this, '4004sysinit-000029') } /* 国际化处理： 订单最新价*/,
				{ key: 'PrayPrice', title: getLangByResId(this, '4004sysinit-000030') } /* 国际化处理： 请购单单价*/,
				{ key: 'RefCostPrice', title: getLangByResId(this, '4004sysinit-000031') } /* 国际化处理： 参考成本*/,
				{ key: 'PlanPrice', title: getLangByResId(this, '4004sysinit-000032') } /* 国际化处理： 计划价*/,
				{ key: 'OrderMinPrice', title: getLangByResId(this, '4004sysinit-000033') } /* 国际化处理： 订单最低价*/
			],
			defaultSelected: [ 'SupplierPrice', 'OrderNewestPrice', 'PrayPrice' ]
		},
		PO16: {
			dataSource: [
				{ key: 'Supplier', title: getLangByResId(this, '4004sysinit-000034') } /* 国际化处理： 供应商*/,
				{ key: 'Material', title: getLangByResId(this, '4004sysinit-000035') } /* 国际化处理： 物料*/,
				{ key: 'Currency', title: getLangByResId(this, '4004sysinit-000036') } /* 国际化处理： 币种*/,
				{ key: 'BillDate', title: getLangByResId(this, '4004sysinit-000037') } /* 国际化处理： 单据日期*/,
				{ key: 'Qtunit', title: getLangByResId(this, '4004sysinit-000038') } /* 国际化处理： 报价单位*/,
				{ key: 'Psfinanceorg', title: getLangByResId(this, '4004sysinit-000039') } /* 国际化处理： 结算财务组织*/,
				{ key: 'Productor', title: getLangByResId(this, '4004sysinit-000040') } /* 国际化处理： 生产厂商*/,
				{ key: 'Qualitylevel', title: getLangByResId(this, '4004sysinit-000041') } /* 国际化处理： 质量等级*/,
				{ key: 'ReceiveArea', title: getLangByResId(this, '4004sysinit-000042') } /* 国际化处理： 收货地区*/,
				{ key: 'Vehicletype', title: getLangByResId(this, '4004sysinit-000043') } /* 国际化处理： 运输方式*/
			],
			defaultSelected: [ 'Supplier', 'Material' ]
		},
		PO27: {
			dataSource: [
				{ key: 'OrderPice', title: getLangByResId(this, '4004sysinit-000044') } /* 国际化处理： 订单价*/,
				{ key: 'PurchaseInPrice', title: getLangByResId(this, '4004sysinit-000045') } /* 国际化处理： 入库单价*/,
				{ key: 'PlanPrice', title: getLangByResId(this, '4004sysinit-000032') } /* 国际化处理： 计划价*/,
				{ key: 'OrderNewestPrice', title: getLangByResId(this, '4004sysinit-000029') } /* 国际化处理： 订单最新价*/,
				{ key: 'SettleNewestPrice', title: getLangByResId(this, '4004sysinit-000046') } /* 国际化处理： 最新结算价*/,
				{ key: 'SupplierPrice', title: getLangByResId(this, '4004sysinit-000028') } /* 国际化处理： 供应商价目表*/
			],
			defaultSelected: [ 'OrderPice' ]
		},
		PO83: {
			dataSource: [
				{ key: 'OrderPice', title: getLangByResId(this, '4004sysinit-000044') } /* 国际化处理： 订单价*/,
				{ key: 'OrderNewestPrice', title: getLangByResId(this, '4004sysinit-000029') } /* 国际化处理： 订单最新价*/,
				{ key: 'RefCostPrice', title: getLangByResId(this, '4004sysinit-000031') } /* 国际化处理： 参考成本*/,
				{ key: 'SupplierPrice', title: getLangByResId(this, '4004sysinit-000028') } /* 国际化处理： 供应商价目表*/,
				{ key: 'PurchaseInPrice', title: getLangByResId(this, '4004sysinit-000045') } /* 国际化处理： 入库单价*/
			],
			defaultSelected: [ 'OrderPice' ]
		}
	};
}
