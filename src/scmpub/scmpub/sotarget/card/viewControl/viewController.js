/* 
* @Author: lichaoah  
* @PageInfo:返利指标设置页面状态控制   
* @Date: 2020-02-18 16:06:33  
 * @Last Modified by: qishy
 * @Last Modified time: 2021-03-19 14:46:50
*/
import { TARGET_CARD } from '../../siconst';
import { changeUrlParam } from '../../../../../scmpub/scmpub/pub/cache';
import buttonController from './buttonController';
export default function viewController(props, status) {
	if (status) {
		changeUrlParam(props, { status: status });
	} else {
		status = props.getUrlParam(TARGET_CARD.status);
	}
	//更新按钮状态
	buttonController.call(this, props, status);
	//更新表格状态
	setUIState.call(this, props, status);
}

/**
 * 设置界面状态
 * @param {*} props
 * @param {*} status
 */
function setUIState(props, status) {
	setHeadStatus(props, status);
	setBodyStatus(props, status);
}

function setBodyStatus(props, status) {
	status = status == TARGET_CARD.browse ? TARGET_CARD.browse : TARGET_CARD.edit;
	props.cardTable.setStatus(TARGET_CARD.target_org, status);
	props.cardTable.setStatus(TARGET_CARD.target_period, status);
	props.cardTable.setStatus(TARGET_CARD.target_mar, status);
	props.cardTable.setStatus(TARGET_CARD.target_item, status);
	props.cardTable.setStatus(TARGET_CARD.target_ratio, status);
}
function setHeadStatus(props, status) {
	props.form.setFormStatus(TARGET_CARD.formId, status);
}
export function setMainOrgEdit(props) {
	if (status != TARGET_CARD.browse) {
		props.form.getFormItemsValue(TARGET_CARD.formId, TARGET_CARD.pk_org).value
			? props.resMetaAfterPkorgEdit()
			: props.initMetaByPkorg();
	}
}
