/*
 * @Author: 刘奇 
 * @PageInfo: 卡片新增按钮点击事件
 * @Date: 2019-03-05 15:16:47 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-12-31 11:10:37
 */

import { PREPAIDINVOICE_CONST, BUTTON } from '../../const';
import buttonController from '../viewController/buttonController';
import { changeUrlParam } from '../../../../../scmpub/scmpub/pub/cache';

export default function buttonClick(props) {
	changeUrlParam(props, {
		status: PREPAIDINVOICE_CONST.add,
		buttonType: BUTTON.add
	});
	// props.pushTo(URL.card_url, {
	// 	status: PREPAIDINVOICE_CONST.add,
	// 	buttonType: BUTTON.add
	// });
	this.cardLastId = props.getUrlParam('id') ? props.getUrlParam('id') : null;
	props.beforeUpdatePage();
	this.props.BillHeadInfo.setBillHeadInfoVisible({
		billCode: ''
	});
	props.form.EmptyAllFormValue(PREPAIDINVOICE_CONST.formId);
	props.cardTable.setTableData(PREPAIDINVOICE_CONST.tableId, { rows: [] });
	buttonController.call(this, props);
	props.updatePage(PREPAIDINVOICE_CONST.formId, PREPAIDINVOICE_CONST.tableId);
}
