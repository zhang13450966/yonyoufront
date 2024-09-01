/*
 * @Author: wangceb 
 * @PageInfo:  参照过滤
 * @Date: 2018-04-25 09:43:24 
 * @Last Modified by: liulux
 * @Last Modified time: 2021-08-25 17:45:16
 */
import { PREPAIDINVOICE_CONST, PrepaidinvoiceHeadItem, PrepaidinvoiceBodyItem } from '../../const';
import { rateTypeMindFilter } from '../../../../../scmpub/scmpub/pub/tool/currencyRateUtil';
// 参照只根据财务组织过滤的字段
const pk_org_filter_Fields = [
	PrepaidinvoiceHeadItem.cdmsupplierid,
	PrepaidinvoiceHeadItem.capcustvid,
	PrepaidinvoiceHeadItem.ctakefeevid
];

export default function referEvent(props, meta) {
	// 表头参照过滤
	headReferEvent(props, meta);
	// 表体参照过滤
	bodyReferEvent(props, meta);
}
// 表头参照过滤
function headReferEvent(props, meta) {
	meta[PREPAIDINVOICE_CONST.formId].items.map((item) => {
		if (pk_org_filter_Fields.includes(item.attrcode)) {
			// "显示停用"为否
			item.isShowDisabledData = false;
			item.queryCondition = () => {
				let pk_org = (props.form.getFormItemsValue(PREPAIDINVOICE_CONST.formId, 'pk_org') || {}).value;
				return { pk_org: pk_org };
			};
			if (item.attrcode == PrepaidinvoiceHeadItem.cdmsupplierid) {
				item.isShowUnit = true;
			}
		} else if (item.attrcode == PrepaidinvoiceHeadItem.ccustbankaccid) {
			item.queryCondition = () => {
				let pk_org = (props.form.getFormItemsValue(PREPAIDINVOICE_CONST.formId, 'cinvoicecustid') || {}).value;
				return { accclass: 1, pk_org: pk_org };
			};
		} else if (item.attrcode == PrepaidinvoiceHeadItem.pk_org_v) {
			item.queryCondition = () => {
				return {
					TreeRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgVidRefFilter'
				};
			};
		} else if (item.attrcode == PrepaidinvoiceHeadItem.cratetype) {
			item.queryCondition = () => {
				return rateFilter();
			};
		} else if (item.attrcode.startsWith('vdef')) {
			item.queryCondition = () => {
				let pk_org = (props.form.getFormItemsValue(PREPAIDINVOICE_CONST.formId, 'pk_org') || {}).value;
				return { pk_org: pk_org };
			};
		}
	});
}
// 表体参照过滤
function bodyReferEvent(props, meta) {
	meta[PREPAIDINVOICE_CONST.tableId].items.map((item) => {
		if (item.attrcode == PrepaidinvoiceBodyItem.cfeeinvid) {
			// 费用项参照过滤
			item.queryCondition = () => {
				let pk_org = (props.form.getFormItemsValue(PREPAIDINVOICE_CONST.formId, 'pk_org') || {}).value;
				return {
					pk_org: pk_org,
					fee: 'Y',
					// 过滤常用页签
					UsualGridRefActionExt: 'nccloud.web.scmpub.prepaidinvoice.reffilter.MaterialRefFilter',
					// 过滤全部页签
					GridRefActionExt: 'nccloud.web.scmpub.prepaidinvoice.reffilter.MaterialRefFilter'
				};
			};
		} else if (item.attrcode.startsWith('vbdef')) {
			item.queryCondition = () => {
				let pk_org = (props.form.getFormItemsValue(PREPAIDINVOICE_CONST.formId, 'pk_org') || {}).value;
				return { pk_org: pk_org };
			};
		}
	});
}

/**
 * 代垫运费汇率类型参照过滤 中间汇率、自定义汇率、固定汇率
 */
function rateFilter() {
	let categorys = '(' + '0' + ',' + '5' + ',' + '7' + ')';
	return {
		rate_category_in_value: categorys
	};
}
