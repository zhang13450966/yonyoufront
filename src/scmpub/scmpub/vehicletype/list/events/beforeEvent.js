/*
 * @Author: zhangflr 
 * @Date: 2020-09-07 16:41:35 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-09-07 16:43:19
 */

export default function beforeEvent(props, moduleId, item, index, value, record) {
	let flag = true;
	if (item.attrcode == 'bsealflag') {
		flag = false;
	}
	return flag;
}
