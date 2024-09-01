/*
 * @Author: zhangflr 
 * @Date: 2020-09-01 16:27:20 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-10-22 13:35:36
 */

import { ROUTEVOINFO } from '../../const';

export default async function bodyBeforeEvent(props, moduleId, key, value, index, record) {
	if (index == 0) {
		if (key == ROUTEVOINFO.space || key == ROUTEVOINFO.nmileage) {
			return false;
		}
	}
	return true;
}
