/*
 * @Author: jiangfw 
 * @PageInfo: 确认冻结
 * @Date: 2018-08-08 14:38:02 
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-11-11 17:01:27
 */
import { AREA, FIELD, PAGECODE, URL, COMMON, MODAL_ID } from '../../constance';
import { ajax } from 'nc-lightapp-front';
import { showResumeModal } from 'scmpub/scmpub/components/ResumeModal';
import { showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { updateCacheData } from '../../../../../scmpub/scmpub/pub/cache';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { cacheData } from '../utils/cacheData';
import { updateDtaForCompareByPk } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools/compareUtils';
import btnController from '../viewControl/btnController';

export default function beSureFreeze(skipCodes) {
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
	let freezeObj = {
		ts: ts,
		id: id,
		bodys: bodys
	};
	data.push(freezeObj);

	let freezeReason = this.state.freezeReason;
	// if (null == freezeReason || freezeReason.length == 0) {
	// 	showErrorInfo('错误', '请输入冻结原因！');
	// 	return;
	// }

	skipCodes = skipCodes ? skipCodes : new Array();
	// 拼装json
	let dataInfo = {
		dataInfo: data,
		pagecode: PAGECODE.invoiceCard,
		message: freezeReason,
		skipCodes: skipCodes
	};

	ajax({
		url: URL.freeze,
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
						beSureFreeze.bind(this),
						this.props
					);
					return;
				}
				if (res.data.head && res.data.body) {
					//冻结成功
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
					this.setState({ freezeReason: '' });
					// 缓存数据
					cacheData.call(this, AREA.card_body);
					btnController.call(this);
					showSuccessInfo(getLangByResId(this, '4004PUINVOICE-000005')); /* 国际化处理： 冻结成功！*/
				}
			}
		}
	});
}
