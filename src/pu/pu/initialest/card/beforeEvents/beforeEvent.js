/*
 * @Author: zhaochyu 
 * @PageInfo: 期初暂估单编辑前事件入口类
 * @Date: 2018-07-23 14:23:00 
 * @Last Modified by: zhaochyu
 * @Last Modified time: 2019-01-08 16:58:17
 */
import { PAGECODE } from '../../constance';
import headBeforeEvent from './headBeforeEvent';
import bodyBeforeEvent from './bodyBeforeEvent';
export default function beforeEvent(props, moduleId, key, value, index, record, status) {
	if (moduleId == PAGECODE.cardhead) {
		return headBeforeEvent.call(this, props, moduleId, key, value);
	} else if (moduleId == PAGECODE.cardbody) {
		return bodyBeforeEvent.call(this, props, moduleId, key, value, index, record, status).then((result) => result);
	}
}
