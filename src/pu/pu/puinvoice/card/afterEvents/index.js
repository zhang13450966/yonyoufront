/*
 * @Author: jiangfw
 * @PageInfo: 编辑事件输出  
 * @Date: 2018-04-11 17:51:16 
 * @Last Modified by: jiangfw
 * @Last Modified time: 2018-10-22 15:36:01
 */
import headAfterEvent from './headAfterEvent';
import bodyAfterEvent from './bodyAfterEvent';
import orgChangeEvent from './orgChangeEvent';
import { AREA, FIELD } from '../../constance';

function afterEvent(props, moduleId, key, value, changeRows, index, record) {
	let areaIds = {
		headArea: AREA.card_head,
		bodyArea: AREA.card_body
	};
	if (moduleId == AREA.card_head && key == FIELD.pk_org_v) {
		orgChangeEvent.call(this, moduleId, key, value, changeRows, index, areaIds);
	} else if (moduleId == AREA.card_head) {
		headAfterEvent.call(this, moduleId, key, value, changeRows, index, areaIds);
	} else {
		bodyAfterEvent.call(this, moduleId, key, value, changeRows, index, record, areaIds);
	}
	// else if (moduleId == SEARCHAREA) {
	//     searchAfterEvent.call(this, moduleId, key, value);
	// }
}

export { afterEvent, headAfterEvent, bodyAfterEvent, orgChangeEvent };
