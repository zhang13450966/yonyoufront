/*
 * @Author: 刘奇 
 * @PageInfo: 卡片插入行按钮事件
 * @Date: 2019-03-19 16:49:04 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-03-20 09:58:28
 */

import { ARSUB_CONST, CARD_BODY_BUTTONS, ArsubBodyItem } from '../../const';
import { rowCopyPasteUtils, RownoUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools';
import buttonController from '../viewController/buttonController';
const ClearFields = [ ArsubBodyItem.carsubbid, ArsubBodyItem.ts, ArsubBodyItem.crowno ];

export default function buttonClick(props, record, index) {
	// 操作列上的粘贴至此
	rowCopyPasteUtils.pasteRowsToIndex.call(
		this,
		props,
		ARSUB_CONST.tableId,
		index,
		CARD_BODY_BUTTONS.EDIT,
		CARD_BODY_BUTTONS.PASTE,
		ClearFields
	);
	buttonController.call(this, props);
	RownoUtils.setRowNo(props, ARSUB_CONST.tableId);
}
