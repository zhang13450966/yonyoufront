/*
 * @Author: jiangfw 
 * @PageInfo: 收回
 * @Date: 2018-06-13 21:16:59 
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-11-11 17:02:12
 */
import { ajax } from 'nc-lightapp-front';
import { AREA, FIELD, URL, PAGECODE, MODAL_ID, COMMON } from '../../constance';
import { showResumeModal } from 'scmpub/scmpub/components/ResumeModal';
import { showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { updateCacheData } from '../../../../../scmpub/scmpub/pub/cache';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { cacheData } from '../utils/cacheData';
import { updateDtaForCompareByPk } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools/compareUtils';
import btnController from '../viewControl/btnController';

export default function clickUncommitBtn(skipCodes) {
	let ts = this.props.form.getFormItemsValue(AREA.card_head, FIELD.ts).value;
	let id = this.props.form.getFormItemsValue(AREA.card_head, FIELD.pk_invoice).value;
	let rows = this.props.cardTable.getAllRows(AREA.card_body);
	let bodys = [];
	rows.forEach((row) => {
		bodys.push({
			id: row.values[FIELD.pk_invoice_b].value,
			ts: row.values[FIELD.ts].value
		});
	});
	let data = [];
	//组装主键ts
	let commitObj = {
		ts: ts,
		id: id,
		bodys: bodys
	};
	data.push(commitObj);

	skipCodes = skipCodes ? skipCodes : new Array();
	// 拼装json
	let dataInfo = {
		dataInfo: data,
		pagecode: PAGECODE.invoiceCard,
		skipCodes: skipCodes
	};

	ajax({
		url: URL.uncommit,
		data: dataInfo,
		pageid: this.pageId,

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
						clickCommitBtn.bind(this),
						this.props
					);
					return;
				}
				if (res.data.head && res.data.body) {
					//提交成功,更新单据状态和ts
					let config = {
						headAreaId: AREA.card_head,
						bodyAreaId: AREA.card_body,
						bodyPKfield: FIELD.pk_invoice_b
					};
					updateDtaForCompareByPk(this.props, res.data, config);
					// this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
					// this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
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
					showSuccessInfo(getLangByResId(this, '4004PUINVOICE-000023' /* 国际化处理：收回成功！*/));
				}
			}
		}
	});
}
