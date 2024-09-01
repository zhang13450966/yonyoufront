/*
 * @Author: fangmj7
 * @PageInfo: 进度确认单卡片编辑前
 * @Date: 2018-07-25 09:58:00 
 * @Last Modified by: fangmj7
 * @Last Modified time: 2022-02-11 16:29:06
 */

import { FIELD, PAGECODE } from '../../constance';
import headBeforeEvent from './headBeforeEvent';
import bodyBeforeEvents from './bodyBeforeEvents';

export default function beforeEvent(props, moduleId, key, value, index, record) {
	if (moduleId == PAGECODE.head) {
		return headBeforeEvent.call(this, props, moduleId, key, value);
	} else if (moduleId == PAGECODE.body) {
		return bodyBeforeEvents.call(this, props, moduleId, key, value, index, record);
	}
}
