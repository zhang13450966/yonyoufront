/*
 * @Author: yechd5 
 * @PageInfo: 卡片展开按钮事件
 * @Date: 2018-04-19 10:38:05 
 * @Last Modified by: yechd5
 * @Last Modified time: 2018-08-25 10:10:49
 */
import { ARSUB_CONST } from '../../const';

export default function buttonClick(props, record, index) {
	let status = props.cardTable.getStatus(ARSUB_CONST.tableId);
	if (status === ARSUB_CONST.browse) {
		props.cardTable.toggleRowView(ARSUB_CONST.tableId, record);
	} else {
		props.cardTable.openModel(ARSUB_CONST.tableId, ARSUB_CONST.edit, record, index);
	}
}
