/*
 * @Author: 刘奇 
 * @PageInfo: 卡片删除按钮事件
 * @Date: 2019-03-14 09:59:15 
 * @Last Modified by: liulux
 * @Last Modified time: 2021-09-08 14:03:41
 */

import { ajax } from 'nc-lightapp-front';
import { ARSUB_CONST, ArsubHeadItem, BUTTON } from '../../const';
import buttonController from '../viewController/buttonController';
import { changeUrlParam, deleteCacheData, getNextId } from '../../../../../scmpub/scmpub/pub/cache';
import commonSearch_BtnClick from './commonSearch_BtnClick';
import { showSuccessInfo, showSingleDeleteDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function buttonClick(props, skipCodes) {
	showSingleDeleteDialog({
		beSureBtnClick: beSureBtnClick.bind(this, props, skipCodes)
	});
}
async function beSureBtnClick(props, skipCodes) {
	skipCodes = skipCodes ? skipCodes : new Array();
	let pks = [
		props.form.getFormItemsValue(ARSUB_CONST.formId, ArsubHeadItem.carsubid).value +
			',' +
			props.form.getFormItemsValue(ARSUB_CONST.formId, ArsubHeadItem.ts).value
	];
	let info = { pks: pks, pageid: ARSUB_CONST.cardPageId, skipCodes: skipCodes };
	ajax({
		url: ARSUB_CONST.deleteUrl,
		data: info,
		pageid: ARSUB_CONST.cardPageId,
		success: (res) => {
			let { success, data } = res;
			if (success) {
				let nextId = getNextId(props, this.props.getUrlParam('id'), ARSUB_CONST.ArsubCacheKey);
				deleteCacheData(props, ArsubHeadItem.carsubid, this.props.getUrlParam('id'), ARSUB_CONST.ArsubCacheKey);
				let transfer = props.getUrlParam('buttonType');
				if (transfer != undefined && transfer.indexOf('ref') != -1) {
					if (props.transferTable.getTransformFormAmount(ARSUB_CONST.left) == 1) {
						props.pushTo('/' + transfer, {
							buttonType: transfer,
							pagecode: ARSUB_CONST.listPageId
						});
					} else {
						props.transferTable.setTransformFormStatus(ARSUB_CONST.left, {
							status: false,
							onChange: (current, next) => {
								showSuccessInfo(getLangByResId(this, '4006ARSUB-000009')); /* 国际化处理： 删除成功！*/
							}
						});
					}
				} else {
					changeUrlParam(props, {
						status: ARSUB_CONST.browse,
						id: nextId,
						buttonType: BUTTON.delete
					});
					showSuccessInfo(getLangByResId(this, '4006ARSUB-000009')); /* 国际化处理： 删除成功！*/
					commonSearch_BtnClick.call(this, props, nextId);
				}
				buttonController.call(this, props);
			}
		}
	});
}
