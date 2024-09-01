/*
 * @Author: wangceb
 * @PageInfo: 销售订单查询编辑后事件 
 * @Date: 2018-04-24 10:38:43 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-03-14 16:25:52
 */

import { ARSUB_CONST, ArsubHeadItem, ArsubQueryBodyItem } from '../../const';
import multiCorpRefHandler from '../../../../../scmpub/scmpub/pub/tool/MultiCorpRefHandler';
import { getDefFieldArray } from '../../../pub/tool/getDefFieldArrayTool';

export default function afterEvent(field, value) {
	// 参照只根据财务组织过滤的字段
	const pk_org_filter_Fields = [ ArsubHeadItem.cordercustid, ArsubHeadItem.cinvoicecustid ]
		.concat(getDefFieldArray('vdef', 20))
		.concat(getDefFieldArray('carsubbid.vbdef', 20));
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
	if (field === ArsubHeadItem.pk_org) {
		multiCorpRefHandler.call(this, this.props, value, ARSUB_CONST.searchId, pk_org_filter_Fields);
	} else if (field === ArsubHeadItem.csaleorgid) {
		multiCorpRefHandler.call(this, this.props, value, ARSUB_CONST.searchId, csaleorgid_filter_Fields);
	} else if (field === ArsubQueryBodyItem.cpayorgid) {
		multiCorpRefHandler.call(this, this.props, value, ARSUB_CONST.searchId, cpayorgid_filter_Fields);
	} else if (field === ArsubQueryBodyItem.cprofitcenterid) {
		multiCorpRefHandler.call(this, this.props, value, ARSUB_CONST.searchId, cprofitcenterid_filter_Fields);
	}
}
