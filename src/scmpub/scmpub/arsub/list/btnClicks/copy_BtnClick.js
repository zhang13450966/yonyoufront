/*
 * @Author: 刘奇 
 * @PageInfo: 列表下复制按钮事件
 * @Date: 2019-03-18 09:55:25 
 * @Last Modified by: liulux
 * @Last Modified time: 2021-09-08 14:07:22
 */

import { ARSUB_CONST, BUTTON, ArsubHeadItem } from '../../const';

export default function buttonClick(props, record, index) {
	props.pushTo(ARSUB_CONST.Card_URL, {
		status: ARSUB_CONST.edit,
		id: null,
		srcid: record[ArsubHeadItem.carsubid].value,
		buttonType: BUTTON.copy,
		pagecode: ARSUB_CONST.cardPageId
	});
}
