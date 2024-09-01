/*
 * @Author: jiangfw 
 * @PageInfo: 采购发票编辑前事件
 * @Date: 2018-05-21 10:05:30 
 * @Last Modified by: jiangfw
 * @Last Modified time: 2018-08-31 09:51:49
 */
import headBeforeEvent from './headBeforeEvent';
import bodyBeforeEvent from './bodyBeforeEvent';
import freeCustBeforeEdit from './freeCustBeforeEdit';
import { AREA } from '../../constance';

export default function beforeEvent(props, moduleId, key, value, index, record) {
	let areaIds = {
		headArea: AREA.card_head,
		bodyArea: AREA.card_body
	};
	if (moduleId == AREA.card_head) {
		return headBeforeEvent.call(this, props, areaIds, key, value, record);
	} else if (moduleId == AREA.card_body) {
		return bodyBeforeEvent.call(this, props, areaIds, key, value, index, record);
	}
}

export { beforeEvent, headBeforeEvent, bodyBeforeEvent, freeCustBeforeEdit };
