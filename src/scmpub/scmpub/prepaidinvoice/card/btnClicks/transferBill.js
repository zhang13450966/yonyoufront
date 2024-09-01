/*
 * @Author: 刘奇 
 * @PageInfo: 进入转单界面  
 * @Date: 2019-03-21 16:33:03 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-04-10 17:46:25
 */

import { ajax } from 'nc-lightapp-front';
import { PREPAIDINVOICE_CONST, BILLTYPE } from '../../const';

export default function transferBills(props, buttonType) {
	let transferIds = this.props.transferTable.getTransferTableSelectedId();
	let srcbidts = [];
	let srchidts = [];
	for (let transferId of transferIds) {
		if (transferId.head) {
			if (transferId.head.pk) {
				srchidts.push(transferId.head.pk + ',' + transferId.head.ts);
			}
		}
		if (transferId.bodys) {
			if (transferId.bodys[0].pk) {
				for (let body of transferId.bodys) {
					srcbidts.push(body.pk + ',' + body.ts);
				}
			}
		}
	}

	let srcbilltype = getSrcBillType(buttonType);
	let param = {
		srcBillType: srcbilltype,
		pageid: PREPAIDINVOICE_CONST.cardPageId,
		destBillType: BILLTYPE.prepaidinvoice,
		transferInfo: { cbilltype: BILLTYPE.prepaidinvoice, hidts: srchidts, bidts: srcbidts }
	};

	ajax({
		url: PREPAIDINVOICE_CONST.transferUrl,
		data: param,
		success: (res) => {
			if (res.success && res.data) {
				this.props.transferTable.setTransferListValue(PREPAIDINVOICE_CONST.left, res.data);
			}
		}
	});
}

function getSrcBillType(buttonType) {
	switch (buttonType) {
		case 'ref30':
			return '30';
			break;
		case 'ref4804':
			return '4804';
			break;
		default:
			break;
	}
}
