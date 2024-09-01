/*
 * @Author: jiangfw 
 * @PageInfo: 查询区参照过滤
 * @Date: 2018-07-12 23:29:38 
 * @Last Modified by: jiangfw
 * @Last Modified time: 2018-09-25 14:38:46
 */
import { AREA, FIELD } from '../constance';

export default function addBodyRefFilter(props, meta) {
	let headArea = AREA.card_head;
	let bodyArea = AREA.card_body;
	meta[bodyArea].items.map((item) => {
		let filterByOrgItems = [
			FIELD.pk_material, //物料
			FIELD.pk_srcmaterial, //物料（OID）
			FIELD.pk_supplier, //供应商
			FIELD.casscustid, //客户
			FIELD.pk_stordoc, //仓库
			FIELD.pk_usedept, //使用部门(OID)
			FIELD.pk_usedept_v, //使用部门(VID)
			FIELD.cprojectid, //项目
			FIELD.pk_costsubj //收支项目
		];
		if (filterByOrgItems.includes(item.attrcode)) {
			item.isShowUnit = false;
			// 依据采购组织过滤的字段
			// item.queryCondition = () => {
			// 	let pk_org = props.form.getFormItemsValue(headArea, FIELD.pk_org).value;
			// 	return { pk_org: pk_org };
			// };
			setTimeout(() => {
				props.cardTable.setQueryCondition(bodyArea, {
					[item.attrcode]: () => {
						let pk_org = props.form.getFormItemsValue(headArea, FIELD.pk_org).value;
						return { pk_org };
					}
				});
			}, 0);
		} else {
			item.isShowUnit = false;
			item.queryCondition = () => {
				let pk_org = props.form.getFormItemsValue(headArea, FIELD.pk_org).value;
				return { pk_org };
			};
		}
	});
}
