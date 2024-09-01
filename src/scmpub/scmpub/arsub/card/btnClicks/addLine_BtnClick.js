/*
 * @Author: 刘奇 
 * @PageInfo: 卡片表体新增行
 * @Date: 2019-03-18 16:35:33 
 * @Last Modified by: zhangllb
 * @Last Modified time: 2022-07-12 15:01:44
 */

import { ARSUB_CONST, ArsubHeadItem, ArsubBodyItem } from '../../const';
import { ajax } from 'nc-lightapp-front';
import { RownoUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools';
import { showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { createBodyAfterEventData, processBillCardBodyEditResult } from '../../../pub/tool/afterEditUtil';
import buttonController from '../viewController/buttonController';

export default function buttonClick(props, autoFocus) {
	let isSrc = false;
	let tableData = props.cardTable.getVisibleRows(ARSUB_CONST.tableId);
	tableData.forEach((rowdata) => {
		if (rowdata.values[ArsubBodyItem.vsrctype].value) {
			isSrc = true;
		}
	});
	if (isSrc) {
		showErrorInfo(getLangByResId(this, '4006ARSUB-000033'));
		return;
	}
	if (autoFocus == false) {
		props.cardTable.addRow(ARSUB_CONST.tableId, undefined, undefined, autoFocus);
	} else {
		props.cardTable.addRow(ARSUB_CONST.tableId);
	}
	let data = createBodyAfterEventData(
		props,
		ARSUB_CONST.cardPageId,
		ARSUB_CONST.formId,
		ARSUB_CONST.tableId,
		ARSUB_CONST.formId,
		null,
		null,
		tableData.length
	);
	data['index'] = tableData.length - 1;
	ajax({
		url: ARSUB_CONST.bodyrowafter,
		pageid: ARSUB_CONST.cardPageId,
		data: data,
		async: false,
		success: (res) => {
			if (res.data) {
				props.cardTable.updateDataByRowId(ARSUB_CONST.tableId, res.data.body[ARSUB_CONST.tableId]);
				RownoUtils.setRowNo(props, ARSUB_CONST.tableId);
				buttonController.call(this, props);
			}
		}
	});
}
