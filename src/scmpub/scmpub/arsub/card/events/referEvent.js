/*
 * @Author: wangceb 
 * @PageInfo:  参照过滤
 * @Date: 2018-04-25 09:43:24 
 * @Last Modified by: jilush
 * @Last Modified time: 2021-07-12 09:46:15
 */
import { ARSUB_CONST, ArsubHeadItem, ArsubBodyItem } from '../../const';
import { rateTypeBuyFilter } from '../../../../../scmpub/scmpub/pub/tool/currencyRateUtil';

// 参照只根据财务组织过滤的字段
const pk_org_filter_Fields = [ ArsubHeadItem.cordercustid, ArsubHeadItem.cinvoicecustid ];
// 参照只根据销售组织过滤的字段
const csaleorgid_filter_Fields = [ ArsubHeadItem.cemployeeid, ArsubHeadItem.cdeptvid ];

export default function referEvent(props, meta) {
	// 表头参照过滤
	headReferEvent(props, meta);
	// 表体参照过滤
	bodyReferEvent(props, meta);
}
// 表头参照过滤
function headReferEvent(props, meta) {
	meta[ARSUB_CONST.formId].items.map((item) => {
		if (item.attrcode == ArsubHeadItem.pk_org_v) {
			item.queryCondition = () => {
				return { TreeRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgVidRefFilter' };
			};
		} else if (item.attrcode.indexOf(ArsubHeadItem.cratetype) >= 0) {
			item.queryCondition = () => {
				return rateTypeBuyFilter();
			};
		} else if (pk_org_filter_Fields.includes(item.attrcode)) {
			// "显示停用"为否
			item.isShowDisabledData = false;
			item.queryCondition = () => {
				let pk_org = (props.form.getFormItemsValue(ARSUB_CONST.formId, 'pk_org') || {}).value;
				return { pk_org: pk_org };
			};
		} else if (csaleorgid_filter_Fields.includes(item.attrcode)) {
			item.isShowUnit = false;
			item.queryCondition = () => {
				let pk_org = (props.form.getFormItemsValue(ARSUB_CONST.formId, 'csaleorgid') || {}).value;
				return { pk_org: pk_org, busifuncode: 'sa' };
			};
		} else if (item.attrcode == ArsubHeadItem.ctrantypeid) {
			// 交易类型
			item.queryCondition = () => {
				return { parentbilltype: '35' };
			};
		} else if (item.attrcode == ArsubHeadItem.ccustbankaccid) {
			//客户银行账号
			item.queryCondition = () => {
				let pk_cust = (props.form.getFormItemsValue(ARSUB_CONST.formId, 'cinvoicecustid') || {}).value;
				let pk_currtype = (props.form.getFormItemsValue(ARSUB_CONST.formId, 'corigcurrencyid') || {}).value;
				return { accclass: 1, pk_cust: pk_cust, pk_currtype: pk_currtype };
			};
		} else if (item.attrcode.startsWith('vdef')) {
			item.queryCondition = () => {
				let pk_org = (props.form.getFormItemsValue(ARSUB_CONST.formId, 'pk_org') || {}).value;
				return { pk_org: pk_org };
			};
		} else {
			item.queryCondition = () => {
				let pk_org = (props.form.getFormItemsValue(ARSUB_CONST.formId, 'pk_org') || {}).value;
				return { pk_org: pk_org };
			};
		}
	});
}
// 表体参照过滤
function bodyReferEvent(props, meta) {
	meta[ARSUB_CONST.tableId].items.map((item) => {
		if (item.attrcode == ArsubBodyItem.cordertrantypeid) {
			// 交易类型
			item.queryCondition = () => {
				return { parentbilltype: '30' };
			};
		} else if (item.attrcode.startsWith('vbdef')) {
			item.queryCondition = () => {
				let pk_org = (props.form.getFormItemsValue(ARSUB_CONST.formId, 'pk_org') || {}).value;
				return { pk_org: pk_org };
			};
		} else {
			item.queryCondition = () => {
				let pk_org = (props.form.getFormItemsValue(ARSUB_CONST.formId, 'pk_org') || {}).value;
				return { pk_org: pk_org };
			};
		}
	});
}
