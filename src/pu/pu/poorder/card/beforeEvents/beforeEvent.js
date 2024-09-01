/*
 * @Author: CongKe 
 * @PageInfo: 采购订单卡片编辑前
 * @Date: 2018-07-25 09:58:00 
 * @Last Modified by: tianzhyw
 * @Last Modified time: 2022-04-24 16:27:21
 */

import { FIELD, PAGECODE } from '../../constance';
import headBeforeEvent from './headBeforeEvent';
import bodyBeforeEvent from './bodyBeforeEvent';
import paymentBeforEvents from './paymentBeforEvents';

export default function beforeEvent(props, moduleId, key, value, index, record) {
	if (moduleId == PAGECODE.cardhead) {
		return headBeforeEvent.call(this, props, moduleId, key, value);
	} else if (moduleId == PAGECODE.cardbody || moduleId == PAGECODE.childform2 || moduleId == PAGECODE.material1) {
		return bodyBeforeEvent.call(this, props, moduleId, key, value, index, record);
	} else if (moduleId == PAGECODE.head_payment) {
		return paymentBeforEvents.call(this, props, moduleId, key, value, index, record);
	}
}
