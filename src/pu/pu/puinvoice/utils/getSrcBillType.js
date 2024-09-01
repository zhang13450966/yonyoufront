import { BILLTYPE } from '../constance';

/*
 * @Author: jiangfw 
 * @PageInfo: 根据业务流信息筛选来源单据类型
 * @Date: 2018-07-23 08:46:10 
 * @Last Modified by: jiangfw
 * @Last Modified time: 2018-11-05 18:23:31
 */
export function getSrcBillType(busiInfo, invoiceType) {
	let scBillType = []; //委外收票来源单据类型
	let invoiceBillType = []; //收票来源单据类型
	let scBillType_C = [ BILLTYPE.sc_order, BILLTYPE.subcontIn ];
	let invoiceBillType_C = [ BILLTYPE.po_order, BILLTYPE.purchaseIn, BILLTYPE.initEstimate ];

	// 过滤来源单据类型
	if (busiInfo && busiInfo.length > 0) {
		for (let item of busiInfo) {
			let tmpBillType = item.src_billtype;
			if (scBillType_C.indexOf(tmpBillType) != -1 && !(scBillType.indexOf(tmpBillType) != -1)) {
				scBillType.push(tmpBillType);
			} else if (invoiceBillType_C.indexOf(tmpBillType) != -1 && !(invoiceBillType.indexOf(tmpBillType) != -1)) {
				invoiceBillType.push(tmpBillType);
			}
		}
	}

	if (invoiceType == 'scInvoice') {
		//委外收票来源单据类型
		return scBillType;
	} else if ((invoiceType = 'invoice')) {
		// 收票单据类型
		return invoiceBillType;
	}
}
