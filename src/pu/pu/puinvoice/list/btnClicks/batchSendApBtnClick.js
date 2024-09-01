/*
 * @Author: jiangfw 
 * @PageInfo: 批量传应付
 * @Date: 2018-06-22 13:35:47 
 * @Last Modified by: jiangfw
 * @Last Modified time: 2019-01-04 15:01:16
 */
import { ajax } from 'nc-lightapp-front';
import { URL, FIELD, AREA } from '../../constance';
import getSelectedDatas from './getSelectedDatas';
import { updateCacheDataForList } from '../../../../../scmpub/scmpub/pub/cache';
import { showBatchOprMessage, showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { btnController } from '../viewControl';

export default function clickBatchSendApBtn(props, record, index) {
	let seldatas = getSelectedDatas(props, record, index);
	if (seldatas == null || seldatas.index == undefined) {
		showWarningInfo(null, getLangByResId(this, '4004PUINVOICE-000043') /* 国际化处理： 请注意,请选择要传应付的发票！*/);
		return;
	}

	sendAp.call(this, props, seldatas.bills, seldatas.index, index);
}

// 批量传应付采购发票
function sendAp(props, bills, selIndex, index) {
	let sendApInfos = {
		dataInfo: bills
	};
	ajax({
		url: URL.batchSendAp,
		data: sendApInfos,
		success: (res) => {
			if (res.success) {
				showBatchOprMessage(null, res.data, {}, getLangByResId(this, '4004PUINVOICE-000071' /*提交 */));
				updateCacheDataForList(props, AREA.list_head, FIELD.pk_invoice, res.data, index);
				btnController.call(this, this.props);
			}
		}
	});
}
