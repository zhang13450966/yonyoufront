/*
 * @Author: zhangchangqing 
 * @PageInfo: 编辑事件  
 * @Date: 2018-04-15 15:16:39 
 * @Last Modified by: zhangchqf
 * @Last Modified time: 2020-02-25 16:14:47
 */
import { TARGETADJ_CARD } from '../../siconst';
import orgChangeEvent from './orgChangeEvent';
import headAfterEvent from './headAfterEvent';
import bodyAfterEvent from './bodyAfterEvent';

export default function afterEvent(props, moduleId, key, value, changeRow, index, record) {
	if (key == TARGETADJ_CARD.pk_org) {
		orgChangeEvent.call(this, props, moduleId, key, value, changeRow, index, record);
	} else if (moduleId == TARGETADJ_CARD.formId || moduleId == TARGETADJ_CARD.headf) {
		headAfterEvent.call(this, props, moduleId, key, value, changeRow, index, record);
	} else {
		bodyAfterEvent.call(this, props, moduleId, key, value, changeRow, index, record);
	}
}
