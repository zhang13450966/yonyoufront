/*
 * @Author: 刘奇 
 * @PageInfo: 查询区参照过滤
 * @Date: 2019-04-10 10:44:18 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-08-20 20:43:00
 */

import { REF30_CONST, FIELD } from '../const';
import { getSearchValByField } from '../../../pub/tool/SearchTool';
import { setPsndocShowLeavePower, setRefShowDisabledData } from '../../../../../scmpub/scmpub/pub/tool';

//依赖财务组织
const csettleorgid_filter_Fields = [ FIELD.ccustomerid, FIELD.cmaterialid, FIELD.cmaterialid_code ];

export default function referEvent(props, meta) {
	meta[REF30_CONST.searchId].items.map((item) => {
		// 财务组织
		if (item.attrcode === FIELD.csettleorgid) {
			item.queryCondition = () => {
				return { TreeRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter' };
			};
		} else if (csettleorgid_filter_Fields.includes(item.attrcode)) {
			item.queryCondition = () => {
				let pk_org = getSearchValByField(props, REF30_CONST.searchId, 'so_saleorder_b.csettleorgid');
				return { pk_org: pk_org };
			};
			// 业务员、部门
		} else if (item.attrcode === FIELD.cemployeeid || item.attrcode === FIELD.cdeptid) {
			item.queryCondition = () => {
				let pk_org = getSearchValByField(props, REF30_CONST.searchId, FIELD.pk_org);
				return { pk_org: pk_org, busifuncode: 'sa' };
			};
		} else if (item.attrcode === FIELD.ctrantypeid) {
			//过滤交易类型
			item.queryCondition = () => {
				return {
					parentbilltype: '30'
				};
			};
		} else if (item.attrcode.indexOf('vdef') >= 0 || item.attrcode.indexOf('vbdef') >= 0) {
			item.queryCondition = () => {
				let pk_org = getSearchValByField(props, REF30_CONST.searchId, FIELD.csettleorgid);
				return { pk_org: pk_org };
			};
		}
		item.isRunWithChildren = false;
		setPsndocShowLeavePower(item);
		setRefShowDisabledData(item);
	});
}
