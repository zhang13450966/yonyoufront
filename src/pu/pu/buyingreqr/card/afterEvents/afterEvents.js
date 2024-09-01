/*
 * @Author: zhangchangqing 
 * @PageInfo: 编辑事件  
 * @Date: 2018-04-15 15:16:39 
 * @Last Modified by: zhangchqf
 * @Last Modified time: 2018-12-10 16:58:25
 */
import { BUYINGREQ_CARD } from '../../siconst';
import headAfterEvent from './headAfterEvent';
import bodyAfterEvent from './bodyAfterEvent';

export default function afterEvent(props, moduleId, key, value, changeRow, index, record) {
	if (moduleId == BUYINGREQ_CARD.formId && key == BUYINGREQ_CARD.pk_org_v) {
		//修订不允许修改主组织
	} else if (moduleId == BUYINGREQ_CARD.formId) {
		headAfterEvent.call(this, props, moduleId, key, value, changeRow, index, record);
	} else {
		bodyAfterEvent.call(this, props, moduleId, key, value, changeRow, index, record);
	}
}
