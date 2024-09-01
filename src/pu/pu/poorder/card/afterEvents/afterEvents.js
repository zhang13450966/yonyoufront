/*
 * @Author: CongKe 
 * @PageInfo: 编辑后事件 
 * @Date: 2018-12-13 17:03:17 
 * @Last Modified by: fangmj7
 * @Last Modified time: 2022-02-10 16:40:39
 */

import { PAGECODE, STATUS, TRANSFER } from '../../constance';
import headAfterEvent from './headAfterEvent';
import bodyAfterEvent from './bodyAfterEvent';
import paymentAfterEvent from './paymentAfterEvent';
import { buttonController } from '../viewController/index';

export default function afterEvents(props, moduleId, key, value, changeRow, index, record) {
	if (moduleId === PAGECODE.cardhead) {
		headAfterEvent.call(this, props, moduleId, key, value, changeRow, index, record);
	} else if (moduleId === PAGECODE.head_payment) {
		// 付款协议  19/01/15平台已支持拉单推单缓存页面数据
		paymentAfterEvent.call(this, props, moduleId, key, value, changeRow, index, record);
		// buttonController.cachedata.call(this);
	} else {
		// 物料表体
		bodyAfterEvent.call(this, props, moduleId, key, value, changeRow, index, record);
	}
}
