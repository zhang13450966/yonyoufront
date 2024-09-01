/*
 * @Author: zhangchangqing 
 * @PageInfo: 编辑事件  
 * @Date: 2018-04-15 15:16:39 
 * @Last Modified by: zhangchqf
 * @Last Modified time: 2020-02-21 14:54:47
 */
import { TARGETADJ_CARD } from '../../siconst';
import headBeforeEvent from './headBeforeEvent';
import bodyBeforeEvents from './bodyBeforeEvents';

export default function beforeEvent(props, moduleId, key, value, data) {
	if (moduleId == TARGETADJ_CARD.formId || moduleId == TARGETADJ_CARD.headf) {
		return headBeforeEvent.call(this, props, moduleId, key, value, data);
	} else {
		return bodyBeforeEvents.call(this, props, moduleId, key, value, data);
	}
}
