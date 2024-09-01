/*
 * @Author: 刘奇 
 * @PageInfo: 列表删除按钮  
 * @Date: 2019-03-13 15:57:17 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-01-13 14:32:39
 */

import { ajax } from 'nc-lightapp-front';
import { PREPAIDINVOICE_CONST, PrepaidinvoiceHeadItem } from '../../const';
import { deleteCacheDataForList } from '../../../pub/cache';
import { showSuccessInfo, showDeleteDialog, showErrorInfo, showBatchOprMessage } from '../../../pub/tool/messageUtil';
import { getLangByResId } from '../../../pub/tool/multiLangUtil';
import { showResumeModal } from 'scmpub/scmpub/components/ResumeModal';
import { buttonControl } from '../viewController/buttonController';

export default function delete_BtnClick(props, pks, indexs, skipCodes) {
	skipCodes = skipCodes ? skipCodes : new Array();
	if (pks && indexs) {
		beSureBtnClick.call(this, props, pks, indexs, skipCodes);
	} else {
		let pks = [];
		let selIndex = [];
		// 点击表头删除按钮
		let seldatas = props.table.getCheckedRows(PREPAIDINVOICE_CONST.formId);
		if (seldatas == null || seldatas.length == 0) {
			showErrorInfo(null, getLangByResId(this, '4006PREPAIDINVOICE-000018')); /* 国际化处理： 请选择要操作的单据！*/
			return;
		}
		seldatas.forEach((row) => {
			let id = row.data.values[PrepaidinvoiceHeadItem.hid].value + ',' + row.data.values.ts.value;
			pks.push(id);
			selIndex.push(row.index);
		});
		showDeleteDialog({
			beSureBtnClick: beSureBtnClick.bind(this, props, pks, selIndex, skipCodes)
		});
	}
}
async function beSureBtnClick(props, pks, indexs, skipCodes) {
	let data = {
		pks: pks,
		pageid: PREPAIDINVOICE_CONST.listPageId,
		skipCodes: skipCodes
	};
	ajax({
		url: PREPAIDINVOICE_CONST.deleteUrl,
		data: data,
		pageid: PREPAIDINVOICE_CONST.cardPageId,
		success: (res) => {
			let { success, data } = res;
			if (success) {
				if (data && data.isResume && data.isResume == true) {
					showResumeModal.bind(this)(
						props,
						'ResumeMessageDlg',
						skipCodes,
						data,
						delete_BtnClick,
						props,
						pks,
						indexs
					);
					return;
				}
				if (JSON.stringify(data.errorMessages || {}) != '{}') {
					// 成功的index
					let sucIndex = [];
					for (let i = 0; i < indexs.length; i++) {
						let element = indexs[i];
						if (!data.errorMessages[i]) {
							sucIndex.push(element);
							deleteCacheDataForList(props, PREPAIDINVOICE_CONST.formId, pks[i]);
						}
					}
					props.table.deleteTableRowsByIndex(PREPAIDINVOICE_CONST.formId, sucIndex);
				} else {
					for (let i = 0; i < pks.length; i++) {
						deleteCacheDataForList(props, PREPAIDINVOICE_CONST.formId, pks[i]);
					}
					props.table.deleteTableRowsByIndex(PREPAIDINVOICE_CONST.formId, indexs);
				}
				if (indexs != null && indexs.length > 1) {
					showBatchOprMessage(
						null,
						data,
						{},
						getLangByResId(this, '4006PREPAIDINVOICE-000016')
					); /* 国际化处理： 提示*/
				} else {
					if (JSON.stringify(data.errorMessageMap || {}) == '{}') {
						showSuccessInfo(getLangByResId(this, '4006PREPAIDINVOICE-000009')); /* 国际化处理： 删除成功！*/
					} else {
						showErrorInfo(null, getLangByResId(this, '4006PREPAIDINVOICE-000017')); /* 国际化处理： 删除失败*/
					}
				}
				buttonControl.call(this, this.props);
			}
		}
	});
}
