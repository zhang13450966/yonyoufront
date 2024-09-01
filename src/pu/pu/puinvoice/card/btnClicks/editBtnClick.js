/*
 * @Author: jiangfw 
 * @PageInfo: 卡片修改
 * @Date: 2018-06-02 09:49:26 
 * @Last Modified by: guoylei
 * @Last Modified time: 2021-08-26 10:12:49
 */
import { UISTATE, AREA, FIELD } from '../../constance';
import { changeUrlParam } from '../../../../../scmpub/scmpub/pub/cache';
import { getHeadValue } from '../utils/cardUtil';
import btnController from '../viewControl/btnController';
export default function clickEditBtn(props) {
	let type = this.props.getUrlParam('type');
	let id = props.getUrlParam('id');

	// if (!type) {
	// 	props.pushTo(URL.card, { status: UISTATE.edit, id: id });
	// } else {
	// 	changeUrlParam(props, { status: UISTATE.edit, id: id });
	// }
	if (type) {
		this.indexstatus[this.curindex] = UISTATE.edit;
	}
	changeUrlParam(props, { status: UISTATE.edit, id: id, copy: false, option: 'edit' });

	let vbillcode = getHeadValue(props, FIELD.vbillcode).value;
	props.cardTable.selectAllRows(AREA.card_body, false);
	this.setBillHeadInfo(vbillcode);
	btnController.call(this, UISTATE.edit);
}
