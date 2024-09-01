/*
 * @Author: yechd5 
 * @PageInfo: 计划员物料设置修改处理
 * @Date: 2018-05-10 09:39:02 
 * @Last Modified by: yechd5
 * @Last Modified time: 2018-08-31 12:24:46
 */
import { PLANPOSITION_CONST } from '../const';
import buttonController from '../../list/viewController/buttonController'

export default function clickEditBtn(props) {
	props.button.setPopContent('Delete', '');
	// 设置“岗位编码” 不可以修改
	let allDatas = props.editTable.getAllRows(PLANPOSITION_CONST.TABLEID);
	if (allDatas) {
		for (let i = 0; i < allDatas.length; i++) {
			let rowid = allDatas[i].rowid;
			props.editTable.setEditableByKey(PLANPOSITION_CONST.TABLEID, rowid, 'code', false);
		}
	}
	// 去除复选框的打钩
	props.editTable.selectAllRows(PLANPOSITION_CONST.TABLEID, false);
	buttonController.call(this, props, this.state.pk_org.value, PLANPOSITION_CONST.EDIT);
}
