/*
* @Author: chaiwx 
* @PageInfo: 查询区参照过滤 
* @Date: 2018-05-29 14:39:58 
 * @Last Modified by: chaiwx
 * @Last Modified time: 2019-06-01 15:47:38
*/
import { FIELDS } from '../../constance';
import { setRefMainOrgPermissonByItem } from '../../utils/referUtil';

export default function(props, meta, moduleId) {
	meta[moduleId].items.map((item) => {
		if (item.attrcode == FIELDS.pk_org) {
			// 主组织权限
			setRefMainOrgPermissonByItem(item, 'tree');
		} else if (item.attrcode === FIELDS.cemployeeid || item.attrcode === FIELDS.pk_dept) {
			// 采购字段通过采购组织过滤
			item.queryCondition = () => {
				let pk_org = props.search.getSearchValByField(moduleId, FIELDS.cpurorgoid);
				if (pk_org && pk_org.value && pk_org.value.firstvalue.indexOf(',') < 0) {
					return {
						pk_org: pk_org.value.firstvalue,
						busifuncode: 'pu'
					};
				} else {
					return { busifuncode: 'pu' };
				}
			};
		} else {
			// 其他统一按主组织过滤
			item.queryCondition = () => {
				let pk_org = props.search.getSearchValByField(moduleId, FIELDS.pk_org);
				if (pk_org && pk_org.value && pk_org.value.firstvalue.indexOf(',') < 0) {
					return { pk_org: pk_org.value.firstvalue };
				} else {
					return {};
				}
			};
		}
	});
}
