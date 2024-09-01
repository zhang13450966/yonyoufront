/*
 * @Author: yechd5 
 * @PageInfo: 计划员物料设置新增处理 
 * @Date: 2018-05-10 09:31:36 
 * @Last Modified by: yechd5
 * @Last Modified time: 2018-10-26 16:04:28
 */
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { PLANPOSITION_CONST } from '../const';
import buttonController from '../../list/viewController/buttonController'

export default function clickAddBtn(props) {
	props.button.setPopContent('Delete', '');
	let status = this.props.editTable.getStatus(PLANPOSITION_CONST.TABLEID);
	if (status !== undefined && status !== PLANPOSITION_CONST.EDIT) {
		let data = props.editTable.getAllRows(PLANPOSITION_CONST.TABLEID);
		if (data.length === 0) {
			this.props.editTable.setTableData(PLANPOSITION_CONST.TABLEID, { rows: [] });
		}
	}
	this.props.editTable.addRow(PLANPOSITION_CONST.TABLEID, undefined, true);
	props.editTable.selectAllRows(PLANPOSITION_CONST.TABLEID, false);
	// 给新增行设置默认值
	setDefaultValue.call(this);
	buttonController.call(this, props, this.state.pk_org.value, PLANPOSITION_CONST.EDIT);
}

/**
 * 给新增行设置默认值
 */
function setDefaultValue() {
	let index = this.props.editTable.getNumberOfRows(PLANPOSITION_CONST.TABLEID) - 1;
	// 设置库存组织
	this.props.editTable.setValByKeyAndIndex(PLANPOSITION_CONST.TABLEID, index, 'pk_org', {
		value: this.state.pk_org.value,
		display: this.state.pk_org.display
	});
	// 设置"应用/排除"
	this.props.editTable.setValByKeyAndIndex(PLANPOSITION_CONST.TABLEID, index, 'fflag', {
		value: '1',
		display: getLangByResId(this, '4004PLANPOSITION-000000')
	}); /* 国际化处理： 应用*/
	// 设置岗位类型为“0”，fpositiontype 代表岗位类型：1代表采购岗，0 代表计划岗
	this.props.editTable.setValByKeyAndIndex(PLANPOSITION_CONST.TABLEID, index, 'fpositiontype', { value: '0', display: '0' });
}
