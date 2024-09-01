/*
 * @Author: CongKe 
 * @PageInfo: 采购订单卡片编辑前
 * @Date: 2018-07-25 09:58:00 
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-02-27 15:55:25
 */

import { FIELD, PAGECODE } from '../../constance';
import headBeforeEvent from './headBeforeEvent';
import bodyBeforeEvent from './bodyBeforeEvent';

export default function beforeEvent(props, moduleId, key, value, index, record) {
	if (moduleId == PAGECODE.cardhead) {
		return headBeforeEvent.call(this, props, moduleId, key, value);
	} else if (moduleId == PAGECODE.cardbody || moduleId == PAGECODE.childform2) {
		return bodyBeforeEvent.call(this, props, moduleId, key, value, index, record);
	}
}
