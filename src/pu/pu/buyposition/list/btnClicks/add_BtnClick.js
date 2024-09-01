/*
 * @Author: yechd5 
 * @PageInfo: 采购岗物料设置新增处理 
 * @Date: 2018-05-10 09:31:36 
 * @Last Modified by: yechd5
 * @Last Modified time: 2018-10-26 14:39:33
 */
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { BUYPOSITION_CONST } from '../const';
import buttonController from '../../list/viewController/buttonController'

export default function clickAddBtn(props) {
	props.button.setPopContent('Delete', '');
	let status = props.editTable.getStatus(BUYPOSITION_CONST.TABLEID);
	if (status !== undefined && status !== BUYPOSITION_CONST.EDIT) {
		let data = props.editTable.getAllRows(BUYPOSITION_CONST.TABLEID);
		if (data.length === 0) {
			props.editTable.setTableData(BUYPOSITION_CONST.TABLEID, { rows: [] });
		}
	}
	props.editTable.addRow(BUYPOSITION_CONST.TABLEID, undefined, true);
	props.editTable.selectAllRows(BUYPOSITION_CONST.TABLEID, false);
	// 给新增行设置默认值
	setDefaultValue.call(this, props);
	buttonController.call(this, props, this.state.pk_org.value, BUYPOSITION_CONST.EDIT);
}

/**
 * 给新增行设置默认值
 * @param {*} props 
 */
function setDefaultValue(props) {
	let index = props.editTable.getNumberOfRows(BUYPOSITION_CONST.TABLEID) - 1;
	// 设置采购组织
	props.editTable.setValByKeyAndIndex(BUYPOSITION_CONST.TABLEID, index, 'pk_org', {
		value: this.state.pk_org.value,
		display: this.state.pk_org.display
	});

	// 设置"应用/排除"
	props.editTable.setValByKeyAndIndex(BUYPOSITION_CONST.TABLEID, index, 'fflag', {
		value: '1',
		display: getLangByResId(this, '4004BUYPOSITION-000000')
	}); /* 国际化处理： 应用*/
	// 设置岗位类型为“1”，fpositiontype 代表岗位类型：1代表采购岗，0 代表计划岗
	props.editTable.setValByKeyAndIndex(BUYPOSITION_CONST.TABLEID, index, 'fpositiontype', { value: '1', display: '1' });
}
