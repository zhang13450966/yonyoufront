/*
 * @Author: 刘奇 
 * @PageInfo: 卡片表体行操作列插入行按钮
 * @Date: 2019-03-18 16:34:47 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-07-24 16:31:24
 */

import { ARSUB_CONST, ArsubQueryBodyItem } from '../../const';
import { ajax } from 'nc-lightapp-front';
import { RownoUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools';
import { showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { createBodyAfterEventData, processBillCardBodyEditResult } from '../../../pub/tool/afterEditUtil';

export default function buttonClick(props, record, index) {
	let isSrc = false;
	let tableData = props.cardTable.getVisibleRows(ARSUB_CONST.tableId);
	tableData.forEach((rowdata) => {
		if (rowdata.values[ArsubQueryBodyItem.vsrctype].value) {
			isSrc = true;
		}
	});
	if (isSrc) {
		showErrorInfo(getLangByResId(this, '4006ARSUB-000034'));
		return;
	}
	props.cardTable.addRow(ARSUB_CONST.tableId, index);
	let data = createBodyAfterEventData(
		props,
		ARSUB_CONST.cardPageId,
		ARSUB_CONST.formId,
		ARSUB_CONST.tableId,
		ARSUB_CONST.formId,
		null,
		null,
		index
	);
	// let data = props.createBodyAfterEventData(
	// 	ARSUB_CONST.cardPageId,
	// 	ARSUB_CONST.formId,
	// 	ARSUB_CONST.tableId,
	// 	ARSUB_CONST.formId,
	// 	null,
	// 	null
	// );
	data['index'] = index;
	ajax({
		url: ARSUB_CONST.bodyrowafter,
		pageid: ARSUB_CONST.cardPageId,
		data: data,
		success: (res) => {
			if (res.data) {
				props.cardTable.updateDataByRowId(ARSUB_CONST.tableId, res.data.body[ARSUB_CONST.tableId]);
				RownoUtils.setRowNo(props, ARSUB_CONST.tableId);
			}
		}
	});
}
