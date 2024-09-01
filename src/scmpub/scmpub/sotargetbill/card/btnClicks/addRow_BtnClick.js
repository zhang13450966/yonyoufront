/*
 * @Author: gaoxqf
 * @PageInfo: 新增行事件
 * @Date: 2018-04-19 10:37:53 
 * @Last Modified by: qishy
 * @Last Modified time: 2020-07-22 11:27:30
 */
import { TARGETBILL_CONST, FIELD } from '../../const';

export default function clickAddRowBtn(props) {
	//当销售组织和价目表无值时，不允许增行操作
	if (
		props.form.getFormItemsValue(TARGETBILL_CONST.formId, FIELD.pk_org).value &&
		props.form.getFormItemsValue(TARGETBILL_CONST.formId, FIELD.ctargetid).value
	) {
		props.cardTable.addRow(TARGETBILL_CONST.tableId, -1, {});
	}
}
