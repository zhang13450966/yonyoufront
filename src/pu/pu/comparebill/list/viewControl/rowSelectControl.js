/*
 * @Author: qishy 
 * @PageInfo:选中事件
 * @Date: 2019-05-08 10:21:46 
 * @Last Modified by:   qishy 
 * @Last Modified time: 2019-05-08 10:21:46 
 */

import { AREA } from '../../constance';
import buttonControl from './buttonControl';

function onSelected(props, moduleId, record, index, status) {
	let checkArr = props.table.getCheckedRows(AREA.listTableId);
	buttonControl(props, record, checkArr);
}

export { onSelected };
