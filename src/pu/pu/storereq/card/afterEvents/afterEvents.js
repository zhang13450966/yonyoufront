/*
 * @Author: zhangchangqing 
 * @PageInfo: 编辑事件  
 * @Date: 2018-04-15 15:16:39 
 * @Last Modified by: zhangchqf
 * @Last Modified time: 2018-12-10 16:52:15
 */
import { STOREREQ_CARD } from '../../siconst';
import orgChangeEvent from './orgChangeEvent';
import headAfterEvent from './headAfterEvent';
import bodyAfterEvent from './bodyAfterEvent';

export default function afterEvent(props, moduleId, key, value, changeRow, index, record) {
	if (moduleId == STOREREQ_CARD.formId && key == STOREREQ_CARD.pk_org_v) {
		orgChangeEvent.call(this, props, moduleId, key, value, changeRow, index, record);
	} else if (moduleId == STOREREQ_CARD.formId) {
		headAfterEvent.call(this, props, moduleId, key, value, changeRow, index, record);
	} else {
		bodyAfterEvent.call(this, props, moduleId, key, value, changeRow, index, record);
	}
}
