/*
 * @Author: zhangchangqing 
 * @PageInfo: 编辑事件  
 * @Date: 2018-04-15 15:16:39 
 * @Last Modified by: mikey.zhangchqf
 * @Last Modified time: 2018-08-14 18:47:04
 */
import { BUYINGREQ_CARD } from '../../siconst';
import headBeforeEvent from './headBeforeEvent';

export default function beforeEvent(props, moduleId, key, value, data) {
	if (moduleId == BUYINGREQ_CARD.formId && key == BUYINGREQ_CARD.pk_org_v) {
		return true; //orgChangeEvent.call(this, props, moduleId, key, value, data);
	} else if (moduleId == BUYINGREQ_CARD.formId) {
		return headBeforeEvent.call(this, props, moduleId, key, value, data);
	} else {
		//return bodyBeforeEvent.call(this, props, moduleId, key, value, data);
	}
}
