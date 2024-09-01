/*
 * @Author: zhaochyu
 * @PageInfo: 期初暂估单公共编辑事件
 * @Date: 2018-04-25 19:27:00
 * @Last Modified by: liangzhyf
 * @Last Modified time: 2020-07-23 20:06:51
 */
import { AREA, HEADFILED } from '../../constance';
import orgChangeEvent from './orgChangeEvent';
import headAfterEvent from './headAfterEvent';

export default function afterEvent(props, moduleId, key, value, changeRow, index, record) {
	if (moduleId == AREA.card_head && key == HEADFILED.pk_org_v) {
		orgChangeEvent.call(this, props, moduleId, key, value, changeRow);
	} else if (moduleId == AREA.card_head) {
		headAfterEvent.call(this, props, moduleId, key, value, changeRow);
	}
}
