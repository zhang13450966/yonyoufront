/*
 * @Author: gaoxqf
 * @PageInfo: 编辑事件  
 * @Date: 2018-05-18 11:29:36 
 * @Last Modified by: qishy
 * @Last Modified time: 2021-02-05 15:42:02
 */

import { TARGETBILL_CONST } from '../../const';
import headEvents from './head_afterEvent';

export default function afterEvent(props, moduleId, key, value, rows, i, s, g) {
	if (moduleId === TARGETBILL_CONST.formId) {
		//表头区域改变
		headEvents.call(this, props, moduleId, key, value, rows, i);
	}
}
