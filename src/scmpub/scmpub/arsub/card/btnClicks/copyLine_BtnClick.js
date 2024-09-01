/*
 * @Author: 刘奇 
 * @PageInfo: 卡片复制行按钮事件
 * @Date: 2019-03-18 16:34:06 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-05-14 13:50:20
 */

import { ARSUB_CONST, CARD_BODY_BUTTONS, ArsubQueryBodyItem } from '../../const';
import { rowCopyPasteUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools';
import { showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import buttonController from '../viewController/buttonController';

export default function buttonClick(props, record, index) {
	let isSrc = false;
	let tableData = props.cardTable.getVisibleRows(ARSUB_CONST.tableId);
	tableData.forEach((rowdata) => {
		if (rowdata.values[ArsubQueryBodyItem.vsrctype].value) {
			isSrc = true;
		}
	});
	if (isSrc) {
		showErrorInfo(getLangByResId(this, '4006ARSUB-000035'));
		return;
	}
	if (index >= 0 && record) {
		// 操作列上的粘贴至此
		rowCopyPasteUtils.copyRow.call(
			this,
			props,
			ARSUB_CONST.tableId,
			record,
			CARD_BODY_BUTTONS.EDIT,
			CARD_BODY_BUTTONS.PASTE
		);
	} else {
		//	肩部的粘贴至末行
		rowCopyPasteUtils.copyRows.call(
			this,
			props,
			ARSUB_CONST.tableId,
			CARD_BODY_BUTTONS.EDIT,
			CARD_BODY_BUTTONS.PASTE
		);
	}
	// buttonController.call(this, props);
}
