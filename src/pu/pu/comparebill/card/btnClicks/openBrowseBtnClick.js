/*
 * @Author: qishy
 * @PageInfo: 编辑态表体展开
 * @Date: 2018-05-26 16:26:02 
 * @Last Modified by: qishy
 * @Last Modified time: 2019-04-11 15:06:34
 */

import { AREA } from '../../constance';

export default function(props, record) {
	props.cardTable.toggleRowView(AREA.cardTableId, record);
}
