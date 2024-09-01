/*
 * @Author: 刘奇 
 * @PageInfo: 进入转单界面  
 * @Date: 2019-03-21 16:33:03 
 * @Last Modified by: liulux
 * @Last Modified time: 2021-11-27 10:41:38
 */

import { ajax } from 'nc-lightapp-front';
import { ARSUB_CONST, ArsubHeadItem } from '../../const';
import buttonController from '../viewController/buttonController';
import { transtypeUtils } from '../../../../../scmpub/scmpub/pub/tool/index';
import { setDefData } from '../../../pub/cache';

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
		pageid: ARSUB_CONST.cardPageId,
		destBillType: '35',
		transferInfo: { cbilltype: '35', hidts: srchidts, bidts: srcbidts }
	};

	ajax({
		url: ARSUB_CONST.transferUrl,
		data: param,
		success: (res) => {
			if (res.success && res.data) {
				this.props.transferTable.setTransferListValue(ARSUB_CONST.left, res.data.billCards);
				setDefData(ARSUB_CONST.ArsubCacheKey, 'settleExeVOs', res.data.settleExeVOs);
				// 交易类型
				transtypeUtils.setValue.call(
					this,
					ARSUB_CONST.formId,
					ArsubHeadItem.ctrantypeid,
					ArsubHeadItem.vtrantypecode
				);
				buttonController.call(this, props);
			}
		}
	});
}

function getSrcBillType(buttonType) {
	switch (buttonType) {
		case 'ref4621':
			return '4621';
			break;
		case 'ref4641':
			return '4641';
			break;
		default:
			break;
	}
}
