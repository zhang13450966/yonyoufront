/*
* @Author: chaiwx 
* @PageInfo: 表头过滤
* @Date: 2018-05-29 14:39:58 
 * @Last Modified by: chaiwx
 * @Last Modified time: 2019-06-03 16:09:19
*/
import { FIELDS, AREA } from '../../constance';

export default function(props, meta) {
	meta[AREA.cardFormId].items.map((item) => {
		if (item.attrcode == FIELDS.pk_dept_v) {
			item.isShowUnit = false;
			// 采购部门
			item.queryCondition = () => {
				let pk_org = props.form.getFormItemsValue(AREA.cardFormId, FIELDS.cpurorgoid).value;
				return {
					pk_org: pk_org,
					busifuncode: 'pu'
				};
			};
		} else if (item.attrcode == FIELDS.cemployeeid) {
			item.isShowUnit = false;
			// 采购员(人员) -- 根据需求查看集团的所有人员
			item.queryCondition = () => {
				let pk_org = props.form.getFormItemsValue(AREA.cardFormId, FIELDS.cpurorgoid).value;
				let pk_dept = props.form.getFormItemsValue(AREA.cardFormId, FIELDS.pk_dept).value;
				return {
					pk_org: pk_org,
					pk_dept: pk_dept,
					busifuncode: 'pu'
				};
			};
		} else {
			item.queryCondition = () => {
				let pk_org = props.form.getFormItemsValue(AREA.cardFormId, FIELDS.pk_org).value;
				return { pk_org: pk_org };
			};
		}
	});
}
