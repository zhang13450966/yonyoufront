/*
 * @Author: CongKe 
 * @PageInfo: 编辑后事件 
 * @Date: 2018-12-13 17:03:17 
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-01-02 09:57:44
 */

import { PAGECODE, STATUS, TRANSFER } from '../../constance';
import headAfterEvent from './headAfterEvent';
import bodyAfterEvent from './bodyAfterEvent';

export default function afterEvents(props, moduleId, key, value, changeRow, index, record) {
	if (moduleId === PAGECODE.cardhead) {
		headAfterEvent.call(this, props, moduleId, key, value, changeRow, index, record);
	} else {
		// 物料表体
		bodyAfterEvent.call(this, props, moduleId, key, value, changeRow, index, record);
	}
}
