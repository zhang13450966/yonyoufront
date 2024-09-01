/*
 * @Author: jiangfw
 * @PageInfo: 传应付
 * @Date: 2018-06-13 20:20:21
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-12-04 09:48:19
 */
import { ajax } from 'nc-lightapp-front';
import { URL, FIELD, MODAL_ID, COMMON, AREA } from '../../constance';
import { showResumeModal } from 'scmpub/scmpub/components/ResumeModal';
import { showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { updateCacheData } from '../../../../../scmpub/scmpub/pub/cache';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { cacheData } from '../utils/cacheData';
import { updateDtaForCompareByPk } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools/compareUtils';
import btnController from '../viewControl/btnController';
import construcateLightData from './construcateLightData';

export default function clickSendApBtn(skipCodes) {
	// 拼装json
	let dataInfo = construcateLightData(this.props, skipCodes);

	ajax({
		url: URL.sendAp,
		data: dataInfo,
		success: (res) => {
			if (res.success && res.data) {
				if (res.data.isResume && res.data.isResume == true) {
					if (res.data.url) {
						res.data.url = '../../../../' + res.data.url;
					}
					showResumeModal.call(
						this,
						this.props,
						MODAL_ID.MessageDlg,
						skipCodes,
						res.data,
						clickSendApBtn.bind(this),
						this.props
					);
					return;
				}
				if (res.data.head && res.data.body) {
					//成功,更新单据状态和ts
					let config = {
						headAreaId: AREA.card_head,
						bodyAreaId: AREA.card_body,
						bodyPKfield: FIELD.pk_invoice_b
					};
					updateDtaForCompareByPk(this.props, res.data, config);
					// 设置按钮可用性
					updateCacheData(
						this.props,
						FIELD.pk_invoice,
						res.data.head[this.formId].rows[0].values.pk_invoice.value,
						res.data,
						this.formId,
						COMMON.PuinvoiceCacheKey
					);
					btnController.call(this);
					// 缓存数据
					cacheData.call(this, AREA.card_body);
					showSuccessInfo(getLangByResId(this, '4004PUINVOICE-000022' /* 国际化处理：传应付成功！*/));
				}
			}
		}
	});
}
