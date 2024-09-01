/*
 * @Author: yechd5 
 * @PageInfo: 新增按钮点击实现
 * @Date: 2018-04-12 09:39:43 
 * @Last Modified by: yechd5
 * @Last Modified time: 2018-10-26 14:35:35
 */
import { MARTRANTYPE_CONST } from '../const';
import buttonController from '../../list/viewController/buttonController'

export default function clickAddBtn(props) {
	props.button.setPopContent('Delete', '');
	let status = props.editTable.getStatus(MARTRANTYPE_CONST.TABLEID);
	// 区分是浏览态新增还是编辑态新增
	if (status !== undefined && status !== MARTRANTYPE_CONST.EDIT) {
		let data = props.editTable.getAllRows(MARTRANTYPE_CONST.TABLEID);
		if (data.length === 0) {
			props.editTable.setTableData(MARTRANTYPE_CONST.TABLEID, { rows: [] });
		}
	}

	props.editTable.addRow(MARTRANTYPE_CONST.TABLEID, undefined, true);
	props.editTable.selectAllRows(MARTRANTYPE_CONST.TABLEID, false);
	// 给新增行设置默认值
	setDefaultValue.call(this, props);
	buttonController.call(this, props, this.state.pk_org.value, MARTRANTYPE_CONST.EDIT)
}

/**
 * 给新增行设置默认值
 * @param {*} props 
 */
function setDefaultValue(props) {
	let index = props.editTable.getNumberOfRows(MARTRANTYPE_CONST.TABLEID) - 1;
	props.editTable.setValByKeyAndIndex(MARTRANTYPE_CONST.TABLEID, index, 'pk_org', {
		value: this.state.pk_org.value,
		display: this.state.pk_org.display
	});
}
