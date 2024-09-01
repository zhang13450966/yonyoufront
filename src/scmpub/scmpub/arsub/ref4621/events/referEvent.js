/*
 * @Author: wangceb
 * @PageInfo: 查询区参照过滤
 * @Date: 2018-04-25 09:43:24
 * @Last Modified by: qishy
 * @Last Modified time: 2021-01-14 15:10:55
 */
import { REF4621_CONST, FIELD } from '../const';
import { getSearchValByField } from '../../../pub/tool/SearchTool';
import { setPsndocShowLeavePower, setRefShowDisabledData } from '../../../../../scmpub/scmpub/pub/tool';

//依赖财务组织
const csettleorgid_filter_Fields = [
	FIELD.cinvoicecustid,
	FIELD.cinvoicecustid_pk_custclass,
	FIELD.cordercustid,
	FIELD.cordercustid_pk_custclass
];

export default function referEvent(props, meta) {
	meta[REF4621_CONST.searchId].items.map((item) => {
		// 财务组织、返利计算组织
		if (item.attrcode === FIELD.csettleorgid || item.attrcode === FIELD.pk_org) {
			item.queryCondition = () => {
				return { TreeRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter' };
			};
		} else if (csettleorgid_filter_Fields.includes(item.attrcode)) {
			item.queryCondition = () => {
				let pk_org = getSearchValByField(props, REF4621_CONST.searchId, FIELD.csettleorgid);
				return { pk_org: pk_org };
			};
		} else if (item.attrcode.indexOf('vdef') >= 0 || item.attrcode.indexOf('vbdef') >= 0) {
			item.queryCondition = () => {
				let pk_org = getSearchValByField(props, REF4621_CONST.searchId, FIELD.csettleorgid);
				return { pk_org: pk_org };
			};
		}
		item.isRunWithChildren = false;
		if (item.attrcode !='cpolicyid'){
			setRefShowDisabledData(item);
		}
		setPsndocShowLeavePower(item);
	});
}
