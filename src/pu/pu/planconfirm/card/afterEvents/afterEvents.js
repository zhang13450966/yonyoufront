/*
 * @Author: fangmj7 
 * @PageInfo: 编辑后事件 
 * @Date: 2018-12-13 17:03:17 
 * @Last Modified by: fangmj7
 * @Last Modified time: 2022-02-11 16:29:38
 */

import { PAGECODE } from '../../constance';
import headAfterEvent from './headAfterEvent';
import bodyAfterEvent from './bodyAfterEvent';

export default function afterEvents(props, moduleId, key, value, changeRow, index, record) {
	if (moduleId === PAGECODE.head) {
		headAfterEvent.call(this, props, moduleId, key, value, changeRow, index, record);
	} else if (moduleId === PAGECODE.body) {
		// 物料表体
		bodyAfterEvent.call(this, props, moduleId, key, value, changeRow, index, record);
	}
}
