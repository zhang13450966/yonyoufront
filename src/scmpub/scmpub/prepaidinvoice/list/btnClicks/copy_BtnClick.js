/*
 * @Author: 刘奇 
 * @PageInfo: 列表下复制按钮事件
 * @Date: 2019-03-18 09:55:25 
 * @Last Modified by: liulux
 * @Last Modified time: 2021-09-08 15:18:37
 */

import { PREPAIDINVOICE_CONST, BUTTON, PrepaidinvoiceHeadItem } from '../../const';

export default function buttonClick(props, record, index) {
	props.pushTo(PREPAIDINVOICE_CONST.Card_URL, {
		status: PREPAIDINVOICE_CONST.edit,
		id: record[PrepaidinvoiceHeadItem.hid].value,
		srcid: record[PrepaidinvoiceHeadItem.hid].value,
		buttonType: BUTTON.copy,
		pagecode: PREPAIDINVOICE_CONST.cardPageId
	});
}
