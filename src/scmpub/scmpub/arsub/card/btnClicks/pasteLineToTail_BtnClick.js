/*
 * @Author: 刘奇 
 * @PageInfo: 粘贴至末行
 * @Date: 2019-03-19 09:57:45 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-07-16 09:37:12
 */

import { ARSUB_CONST, CARD_BODY_BUTTONS, ArsubBodyItem } from '../../const';
import { rowCopyPasteUtils, RownoUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools';
import buttonController from '../viewController/buttonController';
const ClearFields = [ ArsubBodyItem.carsubbid, ArsubBodyItem.ts, ArsubBodyItem.crowno ];

export default function buttonClick(props, record, index) {
	props.beforeUpdatePage();
	// 操作列上的粘贴至此
	rowCopyPasteUtils.pasteRowsToTail.call(
		this,
		props,
		ARSUB_CONST.tableId,
		CARD_BODY_BUTTONS.EDIT,
		CARD_BODY_BUTTONS.PASTE,
		ClearFields
	);
	buttonController.call(this, props);
	RownoUtils.setRowNo(props, ARSUB_CONST.tableId);
	props.updatePage(ARSUB_CONST.formId, ARSUB_CONST.tableId);
}
