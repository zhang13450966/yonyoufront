/*
 * @Author: 刘奇 
 * @PageInfo: 卡片删除按钮事件
 * @Date: 2019-03-14 09:59:15 
 * @Last Modified by: liulux
 * @Last Modified time: 2021-09-08 15:16:35
 */

import { ajax } from 'nc-lightapp-front';
import { PREPAIDINVOICE_CONST, PrepaidinvoiceHeadItem, PrepaidinvoiceBodyItem, BUTTON } from '../../const';
import buttonController from '../viewController/buttonController';
import { changeUrlParam, deleteCacheData, getNextId } from '../../../../../scmpub/scmpub/pub/cache';
import commonSearch_BtnClick from './commonSearch_BtnClick';
import { showSuccessInfo, showSingleDeleteDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function buttonClick(props, skipCodes) {
	showSingleDeleteDialog({
		beSureBtnClick: beSureBtnClick.bind(this, props)
	});
}
async function beSureBtnClick(props, skipCodes) {
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
		url: PREPAIDINVOICE_CONST.deleteUrl,
		data: info,
		pageid: PREPAIDINVOICE_CONST.cardPageId,
		success: (res) => {
			let { success } = res;
			if (success) {
				let nextId = getNextId(
					props,
					this.props.getUrlParam('id'),
					PREPAIDINVOICE_CONST.PrepaidinvoiceCacheKey
				);
				deleteCacheData(
					props,
					PrepaidinvoiceHeadItem.hid,
					this.props.getUrlParam('id'),
					PREPAIDINVOICE_CONST.PrepaidinvoiceCacheKey
				);
				let transfer = props.getUrlParam('buttonType');
				if (transfer != undefined && transfer.indexOf('ref') != -1) {
					if (props.transferTable.getTransformFormAmount(PREPAIDINVOICE_CONST.left) == 1) {
						props.pushTo('/' + transfer, {
							buttonType: transfer,
							pagecode: PREPAIDINVOICE_CONST.listPageId
						});
					} else {
						props.transferTable.setTransformFormStatus(PREPAIDINVOICE_CONST.left, {
							status: false,
							onChange: (current, next) => {
								showSuccessInfo(getLangByResId(this, '4006PREPAIDINVOICE-000009')); /* 国际化处理： 删除成功！*/
							}
						});
					}
				} else {
					changeUrlParam(props, {
						status: PREPAIDINVOICE_CONST.browse,
						id: nextId,
						buttonType: BUTTON.delete
					});
					showSuccessInfo(getLangByResId(this, '4006PREPAIDINVOICE-000009')); /* 国际化处理： 删除成功！*/
					commonSearch_BtnClick.call(this, props, nextId);
				}
				buttonController.call(this, props);
			}
		}
	});
}
