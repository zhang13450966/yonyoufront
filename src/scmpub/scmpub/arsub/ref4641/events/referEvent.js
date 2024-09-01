/*
 * @Author: wangceb
 * @PageInfo: 查询区参照过滤
 * @Date: 2018-04-25 09:43:24
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-08-20 20:41:45
 */
import { REF4641_CONST, FIELD } from '../const';
import { getSearchValByField } from '../../../pub/tool/SearchTool';
import { setPsndocShowLeavePower, setRefShowDisabledData } from '../../../../../scmpub/scmpub/pub/tool';

//依赖财务组织
const csettleorgid_filter_Fields = [ FIELD.cfeecustomerid ];
//依赖销售组织
const pkorg_filter_Fields = [ FIELD.cdeptid, FIELD.cpsnid ];

export default function referEvent(props, meta) {
	meta[REF4641_CONST.searchId].items.map((item) => {
		// 财务组织
		if (item.attrcode === FIELD.cfinanceorgid) {
			item.queryCondition = () => {
				return { TreeRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter' };
			};
		} else if (csettleorgid_filter_Fields.includes(item.attrcode)) {
			item.queryCondition = () => {
				let pk_org = getSearchValByField(props, REF4641_CONST.searchId, FIELD.cfinanceorgid);
				return { pk_org: pk_org };
			};
		} else if (pkorg_filter_Fields.includes(item.attrcode)) {
			item.queryCondition = () => {
				let pk_org = getSearchValByField(props, REF4641_CONST.searchId, FIELD.pk_org);
				return { pk_org: pk_org, busifuncode: 'sa' };
			};
		} else if (item.attrcode === FIELD.ctrantypeid) {
			//过滤交易类型
			item.queryCondition = () => {
				return {
					parentbilltype: '4641'
				};
			};
		} else if (item.attrcode.indexOf('vdef') >= 0 || item.attrcode.indexOf('vbdef') >= 0) {
			item.queryCondition = () => {
				let pk_org = getSearchValByField(props, REF4641_CONST.searchId, FIELD.cfinanceorgid);
				return { pk_org: pk_org };
			};
		}
		item.isRunWithChildren = false;
		setPsndocShowLeavePower(item);
		setRefShowDisabledData(item);
	});
}
