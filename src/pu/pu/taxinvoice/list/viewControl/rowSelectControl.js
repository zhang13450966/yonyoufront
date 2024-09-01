/*
 * @Author: chaiwx 
 * @PageInfo: 选中事件
 * @Date: 2019-02-14 10:06:57 
 * @Last Modified by: chaiwx
 * @Last Modified time: 2019-03-05 10:30:22
 */

import { AREA } from '../../constance';
import buttonControl from './buttonControl';

function onSelected(props, moduleId, record, index, status) {
	let checkArr = this.props.table.getCheckedRows(AREA.listTableId);
	buttonControl(props, record, checkArr);
}

export { onSelected };
