/*
 * @Author: 刘奇 
 * @PageInfo: 新增按钮点击事件
 * @Date: 2019-03-05 14:55:07 
 * @Last Modified by: liulux
 * @Last Modified time: 2021-09-08 14:04:45
 */

import { ARSUB_CONST, BUTTON } from '../../const';

export default function add_BtnClick(props) {
	props.pushTo(ARSUB_CONST.Card_URL, {
		status: ARSUB_CONST.edit,
		id: null,
		buttonType: BUTTON.add,
		pagecode: ARSUB_CONST.cardPageId
	});
}
