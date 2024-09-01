import { BUTTONID, BILLTYPE } from '../constance';

/*
 * @Author: jiangfw 
 * @PageInfo: 根据业务流信息获取新增按钮组按钮显隐性
 * @Date: 2018-11-05 13:12:35 
 * @Last Modified by: jiangfw
 * @Last Modified time: 2018-11-05 17:05:10
 */
export function getAddBtnVisable(refBillTypeInfo) {
	let btnMap = new Map(); // K:Y（显示）/N（不显示） V:btnArray（新增按钮组里的按钮）
	let visableBtnArry = []; //显示的按钮
	let disVisableBtnAry = []; //隐藏的按钮

	if (refBillTypeInfo && refBillTypeInfo.length > 0) {
		let invoiceBillType = []; //收票来源单据类型
		let ref50BillType = []; //消耗汇总收票
		let scBillType = []; //委外收票来源单据类型
		let invoiceBillType_C = [ BILLTYPE.po_order, BILLTYPE.purchaseIn, BILLTYPE.initEstimate ];
		let ref50BillType_C = [ BILLTYPE.vmiSum ];
		let scBillType_C = [ BILLTYPE.sc_order, BILLTYPE.subcontIn ];

		for (let item of refBillTypeInfo) {
			let tmpBillType = item.src_billtype;
			if (scBillType_C.indexOf(tmpBillType) != -1 && !(scBillType.indexOf(tmpBillType) != -1)) {
				scBillType.push(tmpBillType);
			} else if (invoiceBillType_C.indexOf(tmpBillType) != -1 && !(scBillType.indexOf(tmpBillType) != -1)) {
				invoiceBillType.push(tmpBillType);
			} else if (ref50BillType_C.indexOf(tmpBillType) != -1 && !(scBillType.indexOf(tmpBillType) != -1)) {
				ref50BillType.push(tmpBillType);
			}
			if (item.makeflag) {
				visableBtnArry.push(BUTTONID.Add); //自制
			}
		}

		if (visableBtnArry.length == 0) {
			disVisableBtnAry.push(BUTTONID.Add); //自制
		}
		if (invoiceBillType.length > 0) {
			visableBtnArry.push(BUTTONID.Invoice); //收票
		} else {
			disVisableBtnAry.push(BUTTONID.Invoice);
		}
		if (ref50BillType.length > 0) {
			visableBtnArry.push(BUTTONID.Ref50); //消耗汇总收票
		} else {
			disVisableBtnAry.push(BUTTONID.Ref50);
		}
		if (scBillType.length > 0) {
			visableBtnArry.push(BUTTONID.ScInvoice); //委外收票
		} else {
			disVisableBtnAry.push(BUTTONID.ScInvoice);
		}

		btnMap.set('Y', visableBtnArry);
		btnMap.set('N', disVisableBtnAry);
	} else {
		disVisableBtnAry.push(BUTTONID.Add);
		disVisableBtnAry.push(BUTTONID.Invoice);
		disVisableBtnAry.push(BUTTONID.Ref50);
		disVisableBtnAry.push(BUTTONID.ScInvoice);
		btnMap.set('N', disVisableBtnAry);
	}

	return btnMap;
}
