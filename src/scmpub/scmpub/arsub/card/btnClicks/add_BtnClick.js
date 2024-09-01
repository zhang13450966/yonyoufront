/*
 * @Author: 刘奇 
 * @PageInfo: 卡片新增按钮点击事件
 * @Date: 2019-03-05 15:16:47 
 * @Last Modified by: sunxxf
 * @Last Modified time: 2021-03-23 11:36:22
 */

import { ARSUB_CONST, ArsubHeadItem, BUTTON } from '../../const';
import buttonController from '../viewController/buttonController';
import { changeUrlParam } from '../../../../../scmpub/scmpub/pub/cache';
import { getDefData } from '../../../../../scmpub/scmpub/pub/cache';
import { head_afterEvent } from '../events';
import initPkOrgAfter from '../init/initPkOrgAfter';
// import { defaultOrgHandle } from '../../pub';

export default function buttonClick(props) {
	this.cardLastId = props.getUrlParam('id') ? props.getUrlParam('id') : null;
	changeUrlParam(props, {
		status: ARSUB_CONST.add,
		buttonType: BUTTON.add,
		id: null
	});
	props.beforeUpdatePage();
	this.props.BillHeadInfo.setBillHeadInfoVisible({
		billCode: ''
	});
	props.form.EmptyAllFormValue(ARSUB_CONST.formId);
	props.cardTable.setTableData(ARSUB_CONST.tableId, { rows: [] });
	buttonController.call(this, props);
	props.updatePage(ARSUB_CONST.formId, ARSUB_CONST.tableId);
	initPkOrgAfter.call(this, props, this.contexts);
}
