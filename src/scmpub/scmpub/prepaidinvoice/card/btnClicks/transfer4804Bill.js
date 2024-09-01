/*
 * @Author: 刘奇 
 * @PageInfo: 进入转单界面  
 * @Date: 2019-03-21 16:33:03 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-05-08 14:04:30
 */

import { ajax } from 'nc-lightapp-front';
import { PREPAIDINVOICE_CONST, BILLTYPE } from '../../const';

export default function(props) {
	//let transferIds = this.props.transferTable.getTransferTableSelectedId();
	// 	for (let transferId of transferIds) {
	// 	if (transferId.head) {
	// 		if (transferId.head.pk) {
	// 			srchidts.push(transferId.head.pk);
	// 		}
	// 	}
	// }
	let srchidts = [];
	let rows = this.props.transferTable.getTransferTableSelectedValue().view;
	rows.forEach((item) => {
		srchidts.push(item.cdelivbill_hid.value + '_' + item.cdelivbill_bid.value);
	});
	let param = {
		pageid: PREPAIDINVOICE_CONST.cardPageId,
		destBillType: BILLTYPE.prepaidinvoice,
		transferInfo: { cbilltype: BILLTYPE.prepaidinvoice, hidts: srchidts }
	};

	ajax({
		url: PREPAIDINVOICE_CONST.transfer4804Url,
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
