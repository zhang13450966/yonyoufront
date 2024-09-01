/*
 * @Author: 刘奇 
 * @PageInfo: 卡片复制行按钮事件
 * @Date: 2019-03-18 16:34:06 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-12-31 11:11:06
 */

import { PREPAIDINVOICE_CONST, CARD_BODY_BUTTONS } from '../../const';
import { rowCopyPasteUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools';

export default function buttonClick(props, record, index) {
	if (index >= 0 && record) {
		// 操作列上的粘贴至此
		rowCopyPasteUtils.copyRow.call(
			this,
			props,
			PREPAIDINVOICE_CONST.tableId,
			record,
			CARD_BODY_BUTTONS.EDIT,
			CARD_BODY_BUTTONS.PASTE
		);
	} else {
		//	肩部的粘贴至末行
		rowCopyPasteUtils.copyRows.call(
			this,
			props,
			PREPAIDINVOICE_CONST.tableId,
			CARD_BODY_BUTTONS.EDIT,
			CARD_BODY_BUTTONS.PASTE
		);
	}
	// buttonController.call(this, props);
}
