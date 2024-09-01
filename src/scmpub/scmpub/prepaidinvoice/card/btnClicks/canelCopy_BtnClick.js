/*
 * @Author: 刘奇 
 * @PageInfo: 卡片取消粘贴按钮事件
 * @Date: 2019-03-19 14:16:22 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-03-20 10:06:37
 */

import { PREPAIDINVOICE_CONST, CARD_BODY_BUTTONS } from '../../const';
import { rowCopyPasteUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools';
import buttonController from '../viewController/buttonController';

export default function buttonClick(props, record, index) {
	rowCopyPasteUtils.cancel.call(this, props, PREPAIDINVOICE_CONST.tableId, CARD_BODY_BUTTONS.EDIT, CARD_BODY_BUTTONS.PASTE);
	buttonController.call(this, props);
}
