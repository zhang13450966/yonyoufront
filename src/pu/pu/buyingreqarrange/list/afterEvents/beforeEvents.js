/*
 * @Author: zhangchangqing 
 * @PageInfo: 编辑事件  
 * @Date: 2018-04-15 15:16:39 
 * @Last Modified by: mikey.zhangchqf
 * @Last Modified time: 2018-08-23 09:30:36
 */
import { BUYINGREQ_CARD } from '../../siconst';
import bodyBeforeEvent from './bodyBeforeEvent';

export default function beforeEvent(props, moduleId, key, value, data) {
	if (moduleId == BUYINGREQ_CARD.formId) {
		return bodyBeforeEvent.call(this, props, moduleId, key, value, data);
	}
}
