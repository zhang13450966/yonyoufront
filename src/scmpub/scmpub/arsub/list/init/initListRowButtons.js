/*
 * @Author: 刘奇 
 * @PageInfo: 初始化列表状态下行按钮
 * @Date: 2019-03-01 14:11:17 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-03-30 10:44:00
 */

import { BILL_STATUS, BUTTON_AREA, LIST_INNER_BUTTONS, ArsubHeadItem } from '../../const';
import { operate_buttonClick } from '../btnClicks';
import { getListDisableHotKeyBtn } from '../../../pub/tool/hotKeysUtil';
export default function(props, text, record, index) {
	let billstatus = record == undefined ? '' : record[ArsubHeadItem.fstatusflag].value;
	let buttons = getButtons(billstatus);
	return props.button.createOprationButton(buttons, {
		area: BUTTON_AREA.List_Inner,
		buttonLimit: 3,
		onButtonClick: (props, key) => operate_buttonClick.call(this, props, key, text, record, index),
		ignoreHotkeyCode: getListDisableHotKeyBtn()
	});
}

function getButtons(billstatus) {
	switch (billstatus) {
		// 自由态行按钮
		case BILL_STATUS.I_FREE:
			return LIST_INNER_BUTTONS.I_FREE;
			break;
		// 审批不通过
		case BILL_STATUS.I_NOPASS:
			return LIST_INNER_BUTTONS.I_NOPASS;
			break;
		// 审批中
		case BILL_STATUS.I_AUDITING:
			return LIST_INNER_BUTTONS.I_AUDITING;
			break;
		// 审批通过
		case BILL_STATUS.I_AUDIT:
			return LIST_INNER_BUTTONS.I_AUDIT;
			break;
		// 审批通过
		case BILL_STATUS.I_CLOSED:
			return LIST_INNER_BUTTONS.I_AUDIT;
			break;
		default:
			return '';
			break;
	}
}
