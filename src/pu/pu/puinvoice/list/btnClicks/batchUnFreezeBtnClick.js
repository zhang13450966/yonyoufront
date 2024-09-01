/*
 * @Author: jiangfw 
 * @PageInfo: 解冻
 * @Date: 2018-06-22 13:35:47 
 * @Last Modified by: jiangfw
 * @Last Modified time: 2019-02-28 17:19:12
 */
import { ajax } from 'nc-lightapp-front';
import { URL, FIELD, AREA, PAGECODE } from '../../constance';
import getSelectedDatas from './getSelectedDatas';
import { btnController } from '../viewControl';
import { updateCacheDataForList } from '../../../../../scmpub/scmpub/pub/cache';
import { showBatchOprMessage, showWarningInfo, showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function clickBatchUnCommitBtn(props) {
	let seldatas = getSelectedDatas(props);
	if (seldatas == null || seldatas.index == undefined) {
		showWarningInfo(null, getLangByResId(this, '4004PUINVOICE-000044') /* 国际化处理： 请注意,请选择要解冻的发票！*/);
		return;
	}

	unFreezeBills.call(this, props, seldatas.bills, seldatas.index);
}

// 批量提交采购发票
function unFreezeBills(props, bills, selIndex, index) {
	let unFreezeInfos = {
		dataInfo: bills,
		pagecode: PAGECODE.invoiceList
	};
	ajax({
		url: URL.batchUnFreeze,
		data: unFreezeInfos,
		success: (res) => {
			if (res.success) {
				showBatchOprMessage(null, res.data, {}, getLangByResId(this, '4004PUINVOICE-000074' /*解冻 */));
				updateCacheDataForList(props, AREA.list_head, FIELD.pk_invoice, res.data, index);
				btnController.call(this, props);
			}
		},
		error: (res) => {
			showErrorInfo(res.message);
		}
	});
}
