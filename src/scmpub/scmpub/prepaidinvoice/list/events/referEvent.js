/*
 * @Author: 刘奇 
 * @PageInfo: 查询区参照过滤
 * @Date: 2019-03-09 13:52:21 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-08-05 17:39:00
 */

import { PREPAIDINVOICE_CONST, PrepaidinvoiceHeadItem } from '../../const';
import { getSearchValByField } from '../../../pub/tool/SearchTool';
import { setPsndocShowLeavePower, setRefShowDisabledData } from '../../../../../scmpub/scmpub/pub/tool';

// 参照只根据财务组织过滤的字段
const pk_org_filter_Fields = [
	PrepaidinvoiceHeadItem.cdmsupplierid,
	PrepaidinvoiceHeadItem.capcustid,
	PrepaidinvoiceHeadItem.ctakefeeid
];

export default function referEvent(props, meta) {
	meta[PREPAIDINVOICE_CONST.searchId].items.map((item) => {
		if (item.attrcode === PrepaidinvoiceHeadItem.pk_org) {
			item.queryCondition = () => {
				return { TreeRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter' };
			};
		} else if (pk_org_filter_Fields.includes(item.attrcode)) {
			if (item.attrcode === PrepaidinvoiceHeadItem.cdmsupplierid) {
				item.isShowUnit = true;
			}
			item.queryCondition = () => {
				let pk_org = getSearchValByField(props, PREPAIDINVOICE_CONST.searchId, PrepaidinvoiceHeadItem.pk_org);
				return { pk_org: pk_org };
			};
		} else if (item.attrcode.indexOf('vdef') >= 0 || item.attrcode.indexOf('vbdef') >= 0) {
			item.queryCondition = () => {
				let pk_org = getSearchValByField(props, PREPAIDINVOICE_CONST.searchId, PrepaidinvoiceHeadItem.pk_org);
				return { pk_org: pk_org };
			};
		}
		item.isRunWithChildren = false;
		setPsndocShowLeavePower(item);
		setRefShowDisabledData(item);
	});
}
