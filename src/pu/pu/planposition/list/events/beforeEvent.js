/*
 * @Author: yechd5 
 * @PageInfo: 计划岗编辑前事件处理
 * @Date: 2018-10-19 10:05:22 
 * @Last Modified by: yechd5
 * @Last Modified time: 2018-10-20 16:40:38
 */
import { PLANPOSITION_CONST } from '../const';

export default async function(props, moduleId, key, index, value, record) {
	let meta = props.meta.getMeta();
	// 修改时控制岗位编码不允许编辑
	meta[moduleId].items.map((item) => {
		if (item.attrcode == 'code') {
			// 若子表主键有值，则不允许编辑code
			let bid = props.editTable.getValByKeyAndIndex(moduleId, index, 'pk_position_b');
			if (bid && bid.value != null && bid.value != '') {
				props.editTable.setEditableRowKeyByIndex(PLANPOSITION_CONST.TABLEID, index, 'code', false);
			}
		}
	});

	props.meta.setMeta(meta);
	return true;
}
