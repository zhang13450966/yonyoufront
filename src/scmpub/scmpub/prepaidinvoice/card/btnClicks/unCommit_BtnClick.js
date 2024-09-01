/*
 * @Author: 刘奇
 * @PageInfo: 卡片收回按钮事件
 * @Date: 2019-03-13 14:31:15
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-01-13 14:50:25
 */
import { ajax } from 'nc-lightapp-front';
import { updateCacheData } from '../../../../../scmpub/scmpub/pub/cache';
import { showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { PREPAIDINVOICE_CONST, PrepaidinvoiceHeadItem, PrepaidinvoiceBodyItem } from '../../const';
import buttonController from '../viewController/buttonController';
import { updateDtaForCompareByPk } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools/compareUtils';
import { showResumeModal } from 'scmpub/scmpub/components/ResumeModal';

export default function buttonClick(props, skipCodes) {
	// let auditvo = props.createMasterChildData(PREPAIDINVOICE_CONST.cardPageId, PREPAIDINVOICE_CONST.formId, PREPAIDINVOICE_CONST.tableId);
	skipCodes = skipCodes ? skipCodes : new Array();
	let pks = [
		props.form.getFormItemsValue(PREPAIDINVOICE_CONST.formId, PrepaidinvoiceHeadItem.hid).value +
			',' +
			props.form.getFormItemsValue(PREPAIDINVOICE_CONST.formId, PrepaidinvoiceHeadItem.ts).value
	];
	let allRows = props.cardTable.getAllRows(PREPAIDINVOICE_CONST.tableId);
	let bpks = [];
	allRows.forEach((row) => {
		bpks.push(row.values[PrepaidinvoiceBodyItem.bid].value + ',' + row.values[PrepaidinvoiceBodyItem.ts].value);
	});
	let info = { pks: pks, bpks: bpks, pageid: PREPAIDINVOICE_CONST.cardPageId, skipCodes: skipCodes };

	ajax({
		url: PREPAIDINVOICE_CONST.carduncommitUrl,
		data: info,
		success: (res) => {
			// 交互式异常处理
			if (res.data.isResume && res.data.isResume == true) {
				showResumeModal.bind(this)(
					props,
					'MessageDlg',
					skipCodes,
					res.data,
					buttonClick.bind(this, props, skipCodes),
					props
				);
				return;
			}
			if (res.success && res.data) {
				if (res.data.head && res.data.body) {
					props.beforeUpdatePage();
					// start——差异更新
					let config = {
						headAreaId: PREPAIDINVOICE_CONST.formId,
						bodyAreaId: PREPAIDINVOICE_CONST.tableId,
						bodyPKfield: PrepaidinvoiceBodyItem.bid
					};
					updateDtaForCompareByPk(props, res.data, config);
					// end
					// 更新缓存
					updateCacheData(
						props,
						PrepaidinvoiceHeadItem.hid,
						res.data.head[PREPAIDINVOICE_CONST.formId].rows[0].values[PrepaidinvoiceHeadItem.hid].value,
						res.data,
						PREPAIDINVOICE_CONST.formId,
						PREPAIDINVOICE_CONST.PrepaidinvoiceCacheKey
					);

					buttonController.call(this, this.props);
					props.updatePage(PREPAIDINVOICE_CONST.formId, PREPAIDINVOICE_CONST.tableId);
					showSuccessInfo(getLangByResId(this, '4006PREPAIDINVOICE-000013')); /* 国际化处理： 收回成功！*/
				}
			}
		}
	});
}
