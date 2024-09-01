/*
 * 参照过滤
 * @Author: guozhq 
 * @Date: 2018-06-07 12:43:33 
 * @Last Modified by: chaiwx
 * @Last Modified time: 2019-07-02 18:20:11
 */
import { AREA, FIELDS } from '../../constance';

export default function(props, moduleId, key, value, index, record) {
	let meta = props.meta.getMeta();
	let item = meta[moduleId].items.find((item) => item.attrcode == key);

	// 主组织
	let pk_org = props.form.getFormItemsValue(AREA.cardFormId, FIELDS.pk_org).value;

	props.cardTable.setQueryCondition(moduleId, {
		[item.attrcode]: () => {
			return {
				pk_org: pk_org
			};
		}
	});

	return meta;
}
