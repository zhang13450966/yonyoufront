/*
 * @Author: jiangfw 
 * @PageInfo: 确认冻结
 * @Date: 2018-08-08 14:38:02 
 * @Last Modified by: zhangchqf
 * @Last Modified time: 2019-07-27 11:30:20
 */
import { AREA, FIELD, URL, PAGECODE } from '../../constance';
import { ajax } from 'nc-lightapp-front';
import getSelectedDatas from './getSelectedDatas';
import { showBatchOprMessage, showWarningInfo, showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { updateCacheDataForList } from '../../../../../scmpub/scmpub/pub/cache';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { btnController } from '../viewControl';

export default function beSureFreeze() {
	let seldatas = getSelectedDatas(this.props);

	if (seldatas == null || seldatas.index == undefined) {
		showWarningInfo(null, getLangByResId(this, '4004PUINVOICE-000045') /* 国际化处理： 请注意,请选择要冻结的发票！*/);
		return;
	}
	let freezeReason = this.state.freezeReason;
	// if (null == freezeReason || freezeReason.length == 0) {
	// 	showWarningInfo(null, getLangByResId(this, '4004PUINVOICE-000046') /* 国际化处理： 请注意,请输入冻结原因！*/);
	// 	return;
	// }

	freezeBills.call(this, this.props, seldatas.bills, seldatas.index);
}

// 批量冻结采购发票
function freezeBills(props, bills, selIndex, index) {
	let freezeInfos = {
		dataInfo: bills,
		pagecode: PAGECODE.invoiceList,
		message: this.state.freezeReason
	};
	ajax({
		url: URL.batchFreeze,
		data: freezeInfos,
		success: (res) => {
			if (res.success) {
				showBatchOprMessage(null, res.data, {}, getLangByResId(this, '4004PUINVOICE-000075' /*冻结 */));
				updateCacheDataForList(props, AREA.list_head, FIELD.pk_invoice, res.data, index);
				this.setState({ freezeReason: '' });
				btnController.call(this, props);
			}
		},
		error: (res) => {
			showErrorInfo(res.message);
		}
	});
}
