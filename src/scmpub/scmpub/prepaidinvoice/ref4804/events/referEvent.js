/*
 * @Author: wangceb
 * @PageInfo: 查询区参照过滤
 * @Date: 2018-04-25 09:43:24
 * @Last Modified by: liangzhyf
 * @Last Modified time: 2020-06-19 10:36:12
 */
import { REF4804_CONST, FIELD } from '../const';
import { getSearchValByField } from '../../../pub/tool/SearchTool';
import { setPsndocShowLeavePower, setRefShowDisabledData } from '../../../../../scmpub/scmpub/pub/tool';

export default function referEvent(props, meta) {
	meta[REF4804_CONST.searchId].items.map((item) => {
		// 财务组织、返利计算组织
		if (item.attrcode === 'csettlefinorgvid' || item.attrcode === FIELD.pk_org) {
			item.queryCondition = () => {
				return { TreeRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter' };
			};
		} else if (item.attrcode == 'ctrantypeid') {
			item.queryCondition = () => {
				return {
					parentbilltype: '4804'
				};
			};
		} else {
			item.queryCondition = () => {
				let pk_org = getSearchValByField(props, REF4804_CONST.searchId, 'pk_org');
				return { pk_org: pk_org };
			};
		}
		item.isRunWithChildren = false;
		setPsndocShowLeavePower(item);
		setRefShowDisabledData(item);
	});
}
