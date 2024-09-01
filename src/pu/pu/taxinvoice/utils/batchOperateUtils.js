/*
 * @Author: chaiwx 
 * @PageInfo: 批量处理 
 * @Date: 2018-08-10 17:05:43 
 * @Last Modified by: jiangphk
 * @Last Modified time: 2019-04-12 16:01:52
 */
import { showSuccessInfo, showBatchOperateInfo } from '../../../../scmpub/scmpub/pub/tool/messageUtil';
import { updateCacheData } from '../../../../scmpub/scmpub/pub/cache';
import { SUCCESSKEY, AREA, CACHDATASOURCE } from '../constance';
import { FIELDS } from '../constance';
import { getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { updateDtaForCompareByPk } from '../../../../scmpub/scmpub/pub/tool/cardTableTools/compareUtils';
// import { listSingleTolerateForCompare } from '../../pub/util/compareUtil';
import { buttonControl } from '../card/viewControl/buttonControl';

export function batchOp(props, res, checkArr, record, index, operateParam) {
	if (res.data.errMsg) {
		showBatchOperateInfo(null, res.data.message, res.data.errMsg);
	} else {
		showSuccessInfo(
			operateParam && operateParam.messageTitle
				? operateParam.messageTitle
				: getLangByResId(this, '4004Taxinvoice-000007'),
			res.data.message
		); /* 国际化处理： 处理成功*/
	}
	if (res.data.successResult && res.data.successResult[SUCCESSKEY]) {
		let successBill = res.data.successResult[SUCCESSKEY];
		let updateData = [];
		if (index >= 0 && record) {
			// 更新改变的字段
			// listSingleTolerateForCompare(successBill, record, { headAreaId: AREA.listTableId });
			updateData.push({
				index: index,
				data: { values: successBill.head.head.rows[0].values }
			});
		} else if (checkArr.length == 1) {
			// listSingleTolerateForCompare(successBill, checkArr[0].data.values, { headAreaId: AREA.listTableId });
			updateData.push({
				index: checkArr[0].index,
				data: { values: successBill.head.head.rows[0].values }
			});
		} else {
			for (let i = 0; i < successBill.head.rows.length; i++) {
				const element = successBill.head.rows[i];
				for (let j = 0; j < checkArr.length; j++) {
					const checkRow = checkArr[j];
					if (element.values.pk_taxinvoice.value == checkRow.data.values.pk_taxinvoice.value) {
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
	let successbill = res.data.successResult[SUCCESSKEY];

	props.beforeUpdatePage();

	let config = {
		headAreaId: AREA.cardFormId,
		bodyAreaId: AREA.cardTableId,
		bodyPKfield: FIELDS.cbill_bid
	};
	let cacheBill = updateDtaForCompareByPk(props, successbill, config);

	let billStatus = successbill.head.head.rows[0].values.fstatusflag.value;
	buttonControl.call(this, props, billStatus);
	props.updatePage(AREA.cardFormId, AREA.cardTableId);

	showSuccessInfo(
		operateParam && operateParam.messageTitle
			? operateParam.messageTitle
			: getLangByResId(this, '4004Taxinvoice-000007')
	); /* 国际化处理： 处理成功*/

	// 更新列表缓存
	updateCacheData(
		props,
		FIELDS.pk_taxinvoice,
		cacheBill.head.head.rows[0].values.pk_taxinvoice.value,
		cacheBill,
		AREA.cardFormId,
		CACHDATASOURCE.dataSourceList
	);
}

const batchOperateUtils = {
	batchOp,
	singleOp
};

export { batchOperateUtils };
