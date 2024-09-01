/*
 * @Author: jiangfw 
 * @PageInfo: 批量取消传应付
 * @Date: 2018-06-22 13:35:47 
 * @Last Modified by: jiangfw
 * @Last Modified time: 2019-01-04 14:57:04
 */
import { ajax } from 'nc-lightapp-front';
import { URL, FIELD, AREA } from '../../constance';
import getSelectedDatas from './getSelectedDatas';
import { updateCacheDataForList } from '../../../../../scmpub/scmpub/pub/cache';
import { showBatchOprMessage, showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { btnController } from '../viewControl';

export default function clickBatchCancelSendApBtn(props, record, index) {
	let seldatas = getSelectedDatas(props, record, index);
	if (seldatas == null || seldatas.index == undefined) {
		showWarningInfo(null, getLangByResId(this, '4004PUINVOICE-000040') /* 国际化处理： 请注意,请选择要取消传应付的发票！*/);
		return;
	}

	cancelSendAp.call(this, props, seldatas.bills, seldatas.index, index);
}

// 批量提交采购发票
function cancelSendAp(props, bills, selIndex, index) {
	let cancelSendApInfos = {
		dataInfo: bills
	};
	ajax({
		url: URL.batchCancelSendAp,
		data: cancelSendApInfos,
		success: (res) => {
			if (res.success) {
				showBatchOprMessage(null, res.data, {}, getLangByResId(this, '4004PUINVOICE-000070' /*取消传应付 */));
				updateCacheDataForList(props, AREA.list_head, FIELD.pk_invoice, res.data, index);
				btnController.call(this, this.props);
			}
		}
	});
}
