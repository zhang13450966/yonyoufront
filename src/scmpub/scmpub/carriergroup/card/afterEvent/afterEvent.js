/*
 * @Author: zhaochyu
 * @PageInfo: 期初暂估单公共编辑事件
 * @Date: 2018-04-25 19:27:00
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-11-03 16:08:29
 */
import headAfterEvent from './headAfterEvent';

export default function afterEvent(props, moduleId, key, value, changeRow, index, record) {
	headAfterEvent.call(this, props, moduleId, key, value, changeRow);
}
