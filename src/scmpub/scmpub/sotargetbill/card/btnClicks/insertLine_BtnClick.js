/*
 * @Author: cuijun 
 * @PageInfo: 卡片插入行按钮事件
 * @Date: 2018-04-19 10:38:05 
 * @Last Modified by: qishy
 * @Last Modified time: 2020-07-22 11:28:14
 */
import { TARGETBILL_CONST } from '../../const';
export default function buttonClick(props, record, index) {
	props.cardTable.addRow(TARGETBILL_CONST.tableId, index);
}
