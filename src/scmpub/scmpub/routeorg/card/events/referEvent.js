/*
 * @Author: 王勇 
 * @PageInfo: 参照过滤  
 * @Date: 2020-02-09 17:16:19 
 * @Last Modified by: liangzhyf
 * @Last Modified time: 2020-07-23 20:09:24
 */
import {ROUTEVOINFO,CARDTEMPLATEINFO}  from '../../const/index';

// 参照只根据物流组织过滤的字段
const pk_org_filter_Fields = [ ROUTEVOINFO.cvehicleid, ROUTEVOINFO.ccarrierid,ROUTEVOINFO.ctrantypeid];

export default function referEvent(props, meta) {
	// 表头参照过滤
	headReferEvent(props, meta);
	// 表体参照过滤
}
// 表头参照过滤
function headReferEvent(props, meta) {
	meta[CARDTEMPLATEINFO.headAreaCode].items.map((item) => {
		if (item.attrcode == ROUTEVOINFO.pk_org) {
			item.queryCondition = () => {
				return { TreeRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgVidRefFilter' };
			};
		} else if (pk_org_filter_Fields.includes(item.attrcode)) {
			item.queryCondition = () => {
				let pk_org = (props.form.getFormItemsValue(CARDTEMPLATEINFO.headAreaCode, 'pk_org') || {}).value;
				return { pk_org: pk_org };
			};
		}
	});
}
