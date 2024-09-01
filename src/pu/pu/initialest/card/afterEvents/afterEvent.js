/*
 * @Author: zhaochyu
 * @PageInfo: 期初暂估单公共编辑事件
 * @Date: 2018-04-25 19:27:00
 * @Last Modified by: CongKe
 * @Last Modified time: 2020-01-13 10:41:11
 */
import { FIELD, PAGECODE } from '../../constance';
import orgChangeEvent from './orgChangeEvent';
import headAfterEvent from './headAfterEvent';
import bodyAfterEvent from './bodyAfterEvent';

export default function afterEvent(props, moduleId, key, value, changeRow, index, record) {
	if (moduleId == PAGECODE.cardhead && key == FIELD.pk_org_v) {
		orgChangeEvent.call(this, props, moduleId, key, value, changeRow);
	} else if (moduleId == PAGECODE.cardhead) {
		headAfterEvent.call(this, props, moduleId, key, value, changeRow);
	} else {
		bodyAfterEvent.call(this, props, moduleId, key, value, changeRow, index, record);
	}
}
