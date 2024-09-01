/*
 * @Author: wangceb
 * @PageInfo:  信用额度审批单卡片提交按钮事件
 * @Date: 2018-04-19 10:38:05
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-01-13 14:50:34
 */
import { ajax } from 'nc-lightapp-front';
import { updateCacheData } from '../../../pub/cache';
import { showSuccessInfo } from '../../../pub/tool/messageUtil';
import { getLangByResId } from '../../../pub/tool/multiLangUtil';
import { PREPAIDINVOICE_CONST, PrepaidinvoiceHeadItem, PrepaidinvoiceBodyItem } from '../../const';
import buttonController from '../viewController/buttonController';
import { updateDtaForCompareByPk } from '../../../pub/tool/cardTableTools/compareUtils';
import { showResumeModal } from 'scmpub/scmpub/components/ResumeModal';

export default function buttonClick(props, assign, skipCodes, savecallback) {
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
	// 适配提交指派
	if (assign) {
		info['assign'] = JSON.stringify(assign);
	}

	ajax({
		url: PREPAIDINVOICE_CONST.cardcommitUrl,
		data: info,
		success: (res) => {
			if (res.success && res.data) {
				if (
					res.data &&
					res.data.workflow &&
					(res.data.workflow == 'approveflow' || res.data.workflow == 'workflow')
				) {
					this.setState({
						compositedata: res.data,
						compositedisplay: true
					});
					return;
				}
				// 交互式异常处理
				if (res.data.isResume && res.data.isResume == true) {
					showResumeModal.bind(this)(
						props,
						'MessageDlg',
						skipCodes,
						res.data,
						buttonClick.bind(this, props, assign, skipCodes, saveCallback),
						props
					);
					return;
				}
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

					updateCacheData(
						props,
						PrepaidinvoiceHeadItem.hid,
						res.data.head[PREPAIDINVOICE_CONST.formId].rows[0].values[PrepaidinvoiceHeadItem.hid].value,
						res.data,
						PREPAIDINVOICE_CONST.formId,
						PREPAIDINVOICE_CONST.PrepaidinvoiceCacheKey
					);
					if (savecallback) {
						savecallback(res.data);
					}
					buttonController.call(this, props);
					props.updatePage(PREPAIDINVOICE_CONST.formId, PREPAIDINVOICE_CONST.tableId);
					showSuccessInfo(getLangByResId(this, '4006PREPAIDINVOICE-000007')); /* 国际化处理： 提交成功！*/
				}
			}
		}
	});
}
