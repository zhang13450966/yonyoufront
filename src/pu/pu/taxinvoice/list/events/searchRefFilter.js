/*
* @Author: chaiwx 
* @PageInfo: 查询区参照过滤 
* @Date: 2018-05-29 14:39:58 
 * @Last Modified by: jiangphk
 * @Last Modified time: 2019-04-12 16:01:44
*/
import { FIELDS } from '../../constance';
// import { setRefMainOrgPermissonByItem } from '../../../pub/util/referUtil';

export default function(props, meta, moduleId) {
	meta[moduleId].items.map((item) => {
		if (item.attrcode == FIELDS.pk_org) {
			// 主组织
			// setRefMainOrgPermissonByItem(item);
		} else if (item.attrcode === FIELDS.ctrantypeid) {
			//过滤交易类型
			item.queryCondition = () => {
				return {
					parentbilltype: '4642'
				};
			};
		} else if (item.attrcode === FIELDS.cbillbid_ccostsubjid) {
			item.queryCondition = () => {
				let pk_org = props.search.getSearchValByField(moduleId, FIELDS.cfinanceorgid);
				if (pk_org && pk_org.value && pk_org.value.firstvalue.indexOf(',') < 0) {
					return {
						pk_org: pk_org.value.firstvalue
					};
				}
			};
		} else if (item.attrcode === FIELDS.cdeptid || item.attrcode === FIELDS.cpsnid) {
			item.queryCondition = () => {
				let pk_org = props.search.getSearchValByField(moduleId, FIELDS.pk_org);
				if (pk_org && pk_org.value && pk_org.value.firstvalue.indexOf(',') < 0) {
					return {
						pk_org: pk_org.value.firstvalue,
						busifuncode: 'sa'
					};
				} else {
					return { busifuncode: 'sa' };
				}
			};
		} else {
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
