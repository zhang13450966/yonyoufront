/*
 * @Author: 刘奇 
 * @PageInfo: 表体编辑前  
 * @Date: 2020-03-04 14:09:12 
 * @Last Modified by: liulux
 * @Last Modified time: 2021-08-27 01:11:38
 */

import { TARGETBILL_CONST, FIELD } from '../../const';
//props, moduleId(区域id), key(操作的键), value（当前值）,  index（当前index）, record（行数据）
export default function bodyBeforeEvent(props, moduleId, key, value, index, rowdata) {
	let meta = props.meta.getMeta();
	//客户为多选
	if (key == FIELD.ccustomerid) {
		let item = meta[moduleId].items.find((item) => item.attrcode == FIELD.ccustomerid);
		item.isMultiSelectedEnabled = true;
		// 客户参照过滤
		item.queryCondition = () => {
			let pk_org = (props.form.getFormItemsValue(TARGETBILL_CONST.formId, FIELD.pk_org) || {}).value;
			return {
				pk_org: pk_org
			};
		};
		props.meta.setMeta(meta);
	}
	return true;
}
