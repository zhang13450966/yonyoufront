/*
 * @Author: 刘奇 
 * @PageInfo: 新增按钮点击事件
 * @Date: 2019-03-05 14:55:07 
 * @Last Modified by: liulux
 * @Last Modified time: 2021-09-08 15:17:04
 */

import { PREPAIDINVOICE_CONST, BUTTON } from '../../const';

export default function add_BtnClick(props) {
	props.pushTo(PREPAIDINVOICE_CONST.Card_URL, {
		status: PREPAIDINVOICE_CONST.edit,
		id: '',
		buttonType: BUTTON.add,
		pagecode: PREPAIDINVOICE_CONST.cardPageId
	});
}
