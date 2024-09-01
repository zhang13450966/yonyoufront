/*
 * @Author: zhangchangqing 
 * @PageInfo: 编辑事件  
 * @Date: 2018-04-15 15:16:39 
 * @Last Modified by: mikey.zhangchqf
 * @Last Modified time: 2018-10-10 15:48:40
 */
import { STOREREQ_CARD } from '../../siconst';
import headBeforeEvent from './headBeforeEvent';

export default function beforeEvent(props, moduleId, key, value, data) {
	if (moduleId == STOREREQ_CARD.formId && key == STOREREQ_CARD.pk_org_v) {
		return true;
		//orgChangeEvent.call(this, props, moduleId, key, value, data);
	} else if (moduleId == STOREREQ_CARD.formId) {
		return headBeforeEvent.call(this, props, moduleId, key, value, data);
	}
}
