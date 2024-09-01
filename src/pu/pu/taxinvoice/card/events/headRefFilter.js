/*
* @Author: chaiwx 
* @PageInfo: 表头过滤
* @Date: 2018-05-29 14:39:58 
 * @Last Modified by: jiangphk
 * @Last Modified time: 2019-04-12 16:01:32
*/
import { FIELDS } from '../../constance';
// import { setRefMainOrgVIDPermissonByItem } from '../../../pub/util/referUtil';

export default function(props, meta, moduleId) {
	meta[moduleId].items.map((item) => {
		if (item.attrcode == FIELDS.pk_org_v) {
			// 主组织
			// setRefMainOrgVIDPermissonByItem(item);
		} else if (item.attrcode == FIELDS.ctrantypeid) {
			// 交易类型
			item.queryCondition = () => {
				return { parentbilltype: '4642' };
			};
		} else if (item.attrcode == FIELDS.cdeptvid || item.attrcode == FIELDS.cdeptid) {
			// 销售部门
			item.queryCondition = () => {
				let data = props.form.getFormItemsValue(moduleId, FIELDS.pk_org).value;
				if (data) {
					item.isShowUnit = false;
					return { pk_org: data, busifuncode: 'sa' };
				} else {
					item.isShowUnit = true;
					return { busifuncode: 'sa' };
				}
			};
		} else if (item.attrcode == FIELDS.cpsnid) {
			// 销售业务员
			item.queryCondition = () => {
				let data = props.form.getFormItemsValue(moduleId, FIELDS.pk_org).value;
				return { pk_org: data, busifuncode: 'sa' };
			};
		} else {
			// 自定义
			item.queryCondition = () => {
				let data = props.form.getFormItemsValue(moduleId, FIELDS.pk_org).value;
				return { pk_org: data };
			};
		}
	});
}
