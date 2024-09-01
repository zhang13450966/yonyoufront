/*
 * @Author: zhaochyu 
 * @PageInfo: 采购成本要素定义表头编辑性控制 
 * @Date: 2018-08-01 16:43:01 
 * @Last Modified by: zhaochyu
 * @Last Modified time: 2019-01-08 17:11:02
 */
import { FIELD, PAGECODE } from '../constance';
export default function headbeforeEvent(props, moduleId, item, index, value, record) {
	let field = [ FIELD.pk_org, FIELD.ts, FIELD.pk_costfactor, FIELD.pk_group, FIELD.ifactororder ];
	if (field.includes(item.attrcode)) {
		return false;
	}
	return true;
}
