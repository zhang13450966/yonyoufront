/*
 * @Author: cuijun 
 * @PageInfo: 取消按钮事件
 * @Date: 2018-05-14 21:56:25 
 * @Last Modified by: qishy
 * @Last Modified time: 2021-01-20 14:34:29
 */
import buttonController from '../viewController/buttonController';
import { TARGETBILL_CONST, FIELD } from '../../const';
import { showCancelDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
// import getCardData from './getCardData';

export default function clickCancelBtn(props) {
	showCancelDialog({
		beSureBtnClick: () => cancel.call(this, props)
	});
}
function cancel(props) {
	props.beforeUpdatePage();
	props.form.setAllFormValue({ [TARGETBILL_CONST.formId]: this.oldformdata });
	props.cardTable.resetTableData(TARGETBILL_CONST.tableId);
	// props.cardTable.setTableData(TARGETBILL_CONST.tableId, this.oldtabledata, null, false);
	//根据表体的客户过滤空行
	props.cardTable.filterEmptyRows(TARGETBILL_CONST.tableId, [ FIELD.ccustomerid ], 'include');
	props.setUrlParam({
		status: TARGETBILL_CONST.browse
	});
	// this.props.form.EmptyAllFormValue(TARGETBILL_CONST.formId);
	
	buttonController.call(this);
	props.updatePage(TARGETBILL_CONST.formId, TARGETBILL_CONST.tableId);
}
