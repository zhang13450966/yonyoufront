/*
 * @Author: 刘奇 
 * @PageInfo: 初始化卡片状态下操作列按钮
 * @Date: 2019-05-13 13:32:41 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-01-29 09:34:18
 */
import { PREPAIDINVOICE_CONST, BUTTON_AREA, CARD_BODY_INNER_BUTTONS } from '../../const';
import { operate_buttonClick } from '../btnClicks';
import { getCardDisableHotKeyBtn } from '../../../../../scmpub/scmpub/pub/tool/hotKeysUtil.js';

export default function(props, text, record, index) {
	let status = props.cardTable.getStatus(PREPAIDINVOICE_CONST.tableId);
	let showBtns = null;
	if (status === PREPAIDINVOICE_CONST.browse) {
		showBtns = CARD_BODY_INNER_BUTTONS.BROWSE;
	} else {
		// 编辑态
		if (this.copyRowDatas) {
			showBtns = CARD_BODY_INNER_BUTTONS.COPY;
		} else {
			showBtns = CARD_BODY_INNER_BUTTONS.EDIT;
		}
	}
	return props.button.createOprationButton(showBtns, {
		area: BUTTON_AREA.Card_Body_Inner,
		buttonLimit: 3,
		ignoreHotkeyCode: getCardDisableHotKeyBtn(),
		onButtonClick: (props, key) => operate_buttonClick.bind(this)(props, key, text, record, index)
	});
}
