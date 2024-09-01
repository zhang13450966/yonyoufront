/*
 * @Author: zhaochyu 
 * @PageInfo: 采购成本要素编辑后事件 
 * @Date: 2018-06-06 21:21:01 
 * @Last Modified by: zhaochyu
 * @Last Modified time: 2019-01-08 17:10:16
 */
import { FIELD, PAGECODE } from '../constance';
import orgChangeEvent from './orgChangeEvent';
import bodyAfterEvent from './bodyAfterEvent';

export default function afterEvent(props, moduleId, key, value, changeRow, index) {
	if (moduleId == PAGECODE.headId && key == FIELD.pk_org_v) {
		orgChangeEvent.call(this, props, moduleId, key, value, changeRow, index);
	} else if (moduleId == PAGECODE.bodyId) {
		bodyAfterEvent.call(this, props, moduleId, key, value, changeRow, index);
	}
}
