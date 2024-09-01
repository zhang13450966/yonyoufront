/*
 * @Author: liulux
 * @PageInfo: 卡片整单关闭按钮  
 * @Date: 2021-9-04 23:23:17 
 * @Last Modified by: liulux
 * @Last Modified time: 2021-09-06 10:41:52
 */

import { showSuccessInfo, showBatchOperateInfo } from '../../../../scmpub/scmpub/pub/tool/messageUtil';
import { updateCacheData } from '../../../../scmpub/scmpub/pub/cache';
import { ARSUB_CONST, ArsubHeadItem, SUCCESSKEY, ArsubBodyItem } from '../const';
import { getLangByResId } from '../../pub/tool/multiLangUtil';
import { updateDtaForCompareByPk } from '../../pub/tool/cardTableTools/compareUtils';
import { listSingleTolerateForCompare } from '../../pub/tool/compareUtil';
import buttonControl from '../card/viewController/buttonController';

export function batchOp(props, res, checkArr, record, index, operateParam) {
	if (res.data.errMsg) {
		showBatchOperateInfo(null, res.data.message, res.data.errMsg);
	} else {
		if (operateParam) {
			if (operateParam.messageTitle) {
				if (operateParam.rowOp) {
					showSuccessInfo(operateParam.messageTitle);
				} else {
					showSuccessInfo(operateParam.messageTitle, res.data.message); /* 国际化处理： 处理成功*/
				}
			}
		}
	}

	if (res.success && res.data) {
		let successBill = res.data;
		let updateData = [];
		if (index >= 0 && record) {
			// 更新改变的字段
			listSingleTolerateForCompare(successBill, record, { headAreaId: ARSUB_CONST.formId });
			updateData.push({
				index: index,
				data: { values: successBill.head.head.rows[0].values }
			});
		} else if (checkArr.length == 1) {
			listSingleTolerateForCompare(successBill, checkArr[0].data.values, { headAreaId: ARSUB_CONST.formId });
			updateData.push({
				index: checkArr[0].index,
				data: { values: successBill.head.head.rows[0].values }
			});
		} else {
			for (let i = 0; i < successBill.head.rows.length; i++) {
				const element = successBill.head.rows[i];
				for (let j = 0; j < checkArr.length; j++) {
					const checkRow = checkArr[j];
					if (element.values.cbillid.value == checkRow.data.values.cbillid.value) {
						updateData.push({
							index: checkRow.index,
							data: { values: element.values }
						});
					}
				}
			}
		}
		props.table.updateDataByIndexs(AREA.listTableId, updateData);
	}
}

export function singleOp(props, res, operateParam) {
	let successbill = res.data;

	props.beforeUpdatePage();

	let config = {
		headAreaId: ARSUB_CONST.formId,
		bodyAreaId: ARSUB_CONST.tableId,
		bodyPKfield: ArsubBodyItem.carsubbid
	};
	let cacheBill = updateDtaForCompareByPk(props, successbill, config);

	let billStatus = successbill.head.head.rows[0].values.fstatusflag.value;
	let pageStatus;
	if (props.getUrlParam('option') == ARSUB_CONST.transfer || props.getUrlParam('channelType')) {
		pageStatus = 'browse';
	}
	buttonControl.call(this, props, billStatus, pageStatus);
	props.updatePage(ARSUB_CONST.formId, ARSUB_CONST.tableId);

	showSuccessInfo(
		operateParam && operateParam.messageTitle ? operateParam.messageTitle : getLangByResId(this, '4006ARSUB-000013')
	); /* 国际化处理： 处理成功*/

	let scm_transfer_app = this.contexts.paramMap ? this.contexts.paramMap.scm_transfer_app : null;
	if ('Y' != scm_transfer_app) {
		// 非拉单小应用，更新列表缓存
		updateCacheData(
			props,
			ArsubHeadItem.carsubid,
			cacheBill.head.head.rows[0].values.carsubid.value,
			cacheBill,
			ARSUB_CONST.formId,
			ARSUB_CONST.ArsubCacheKey
		);
	}
}

const batchOperateUtils = {
	batchOp,
	singleOp
};
export { batchOperateUtils };
