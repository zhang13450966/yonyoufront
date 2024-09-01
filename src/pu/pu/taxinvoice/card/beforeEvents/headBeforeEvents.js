/*
 * @Author: chaiwx 
 * @PageInfo: 编辑前 
 * @Date: 2018-04-10 12:23:33 
 * @Last Modified by: chaiwx
 * @Last Modified time: 2019-03-12 15:08:19
 */

import { AREA, FIELDS } from '../../constance';
import transtypeUtils from '../../../../../scmpub/scmpub/pub/tool/transtypeUtils';
const { beforeEdit } = transtypeUtils;

export default async function(props, moduleId, key, value, oldvalue, refinfo) {
	// 编辑性控制
	let editFlag = true;

	if (key == FIELDS.ctrantypeid) {
		// 审批中心，交易类型字段统一不可编辑
		if (props.getUrlParam('scene') == 'approvesce') {
			return false;
		}
		//交易类型编辑前控制-发布交易类型后控制不可编辑
		editFlag = beforeEdit.call(this, key, FIELDS.ctrantypeid, FIELDS.vtrantypecode);
	} else if (key === FIELDS.nexchangerate) {
		// 币种与本位币不一样时，才可以编辑
		let corigcurr = props.form.getFormItemsValue(AREA.cardFormId, FIELDS.corigcurrencyid).value;
		let ccurr = props.form.getFormItemsValue(AREA.cardFormId, FIELDS.ccurrencyid).value;

		if (!corigcurr || !ccurr || corigcurr != ccurr) {
			editFlag = false;
		}
	}
	return editFlag;
}
