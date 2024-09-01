/*
 * @Author: qishy
 * @PageInfo: 编辑态表体展开
 * @Date: 2018-05-26 16:26:02 
 * @Last Modified by: qishy
 * @Last Modified time: 2019-04-30 16:08:35
 */

import { AREA } from '../../constance';

export default function(props, record, index) {
	props.cardTable.openModel(AREA.cardTableId, 'edit', record, index);
}
