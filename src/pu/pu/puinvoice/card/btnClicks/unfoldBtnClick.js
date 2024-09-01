/*
 * @Author: jiangfw 
 * @PageInfo: 展开
 * @Date: 2018-04-25 20:47:18 
 * @Last Modified by: jiangfw
 * @Last Modified time: 2018-08-08 17:16:24
 */
import { UISTATE, AREA } from '../../constance';
let tableId = AREA.card_body;
export default function clickUnfoldBtn(props, record, index) {
	let status = props.getUrlParam('status');
	if (status == UISTATE.add || status == UISTATE.edit) {
		//编辑态
		props.cardTable.openModel(tableId, UISTATE.edit, record, index);
	} else {
		//浏览态
		props.cardTable.toggleRowView(tableId, record);
	}
}
