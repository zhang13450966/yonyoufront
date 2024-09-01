import { getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export default function() {
	return {
		PO91: {
			dataSource: [
				{ key: 'CONTRACT', title: getLangByResId(this, '4004sysinit-000051') } /* 国际化处理： 采购合同*/,
				{ key: 'SUPPLIERPRICE', title: getLangByResId(this, '4004sysinit-000052') } /* 国际化处理： 供应商价目表*/,
				{ key: 'SUPPLIER', title: getLangByResId(this, '4004sysinit-000053') } /* 国际化处理： 物料主供应商*/
			],
			defaultSelected: [ 'CONTRACT', 'SUPPLIERPRICE', 'SUPPLIER' ]
		}
	};
}
