/*
 * @Author: 刘奇 
 * @PageInfo: 查询区参照过滤
 * @Date: 2019-03-09 13:52:21 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-06-03 17:23:38
 */

import { ARSUB_CONST, ArsubHeadItem, ArsubQueryBodyItem } from '../../const';
import { getSearchValByField } from '../../../pub/tool/SearchTool';
import { setPsndocShowLeavePower, setRefShowDisabledData } from '../../../../../scmpub/scmpub/pub/tool';

// 参照只根据财务组织过滤的字段
const pk_org_filter_Fields = [ ArsubHeadItem.cordercustid, ArsubHeadItem.cinvoicecustid ];
// 参照只根据销售组织过滤的字段
const csaleorgid_filter_Fields = [ ArsubHeadItem.cemployeeid, ArsubHeadItem.cdeptid ];
// 参照只根据费用承担组织过滤的字段
const cpayorgid_filter_Fields = [
	ArsubQueryBodyItem.cpaydeptid,
	ArsubQueryBodyItem.cincomeprejectid,
	ArsubQueryBodyItem.cprojectid
];
// 参照只根据利润中心过滤的字段
const cprofitcenterid_filter_Fields = [ ArsubQueryBodyItem.ccostcenterid, ArsubQueryBodyItem.cfactorid ];

export default function referEvent(props, meta) {
	meta[ARSUB_CONST.searchId].items.map((item) => {
		if (item.attrcode === ArsubHeadItem.pk_org) {
			item.queryCondition = () => {
				return { TreeRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter' };
			};
		} else if (item.attrcode === ArsubHeadItem.ctrantypeid) {
			//客户费用单类型
			item.queryCondition = () => {
				return {
					parentbilltype: '35',
					GridRefActionExt: 'nccloud.web.scmpub.ref.TransTypeRefFilterUtils'
				};
			};
		} else if (pk_org_filter_Fields.includes(item.attrcode)) {
			item.queryCondition = () => {
				let pk_org = getSearchValByField(props, ARSUB_CONST.searchId, ArsubHeadItem.pk_org);
				return { pk_org: pk_org };
			};
		} else if (csaleorgid_filter_Fields.includes(item.attrcode)) {
			item.queryCondition = () => {
				let pk_org = getSearchValByField(props, ARSUB_CONST.searchId, ArsubHeadItem.csaleorgid);
				return { pk_org: pk_org, busifuncode: 'sa' };
			};
		} else if (cpayorgid_filter_Fields.includes(item.attrcode)) {
			item.queryCondition = () => {
				let pk_org = getSearchValByField(props, ARSUB_CONST.searchId, ArsubQueryBodyItem.cpayorgid);
				return { pk_org: pk_org };
			};
		} else if (cprofitcenterid_filter_Fields.includes(item.attrcode)) {
			item.queryCondition = () => {
				let pk_org = getSearchValByField(props, ARSUB_CONST.searchId, ArsubQueryBodyItem.cprofitcenterid);
				return { pk_org: pk_org };
			};
		} else if (item.attrcode === ArsubQueryBodyItem.cordertrantypeid) {
			//订单类型
			item.queryCondition = () => {
				return {
					parentbilltype: '30',
					GridRefActionExt: 'nccloud.web.scmpub.ref.TransTypeRefFilterUtils'
				};
			};
		} else if (item.attrcode === ArsubHeadItem.ccustbankaccid) {
			//客户银行账号
			item.queryCondition = () => {
				let pk_cust = getSearchValByField(props, ARSUB_CONST.searchId, ArsubHeadItem.cinvoicecustid);
				let pk_currtype = getSearchValByField(props, ARSUB_CONST.searchId, ArsubHeadItem.corigcurrencyid);
				return { accclass: 1, pk_cust: pk_cust, pk_currtype: pk_currtype };
			};
		} else if (item.attrcode.indexOf('vdef') >= 0 || item.attrcode.indexOf('vbdef') >= 0) {
			item.queryCondition = () => {
				let pk_org = getSearchValByField(props, ARSUB_CONST.searchId, ArsubHeadItem.pk_org);
				return { pk_org: pk_org };
			};
		}
		item.isRunWithChildren = false;
		setPsndocShowLeavePower(item);
		setRefShowDisabledData(item);
	});
}
