/*
 * @Author: wangceb
 * @PageInfo: 参照过滤
 * @Date: 2018-04-25 09:43:24
 * @Last Modified by: liulux
 * @Last Modified time: 2021-08-27 01:10:56
 */

import { TARGETBILL_CONST, FIELD } from '../../const';

export default function referEvent(props, meta) {
	// 表头参照过滤
	headReferEvent.call(this, props, meta);
	// 表头参照过滤
	bodyReferEvent.call(this, props, meta);
}
// 表头参照过滤
function headReferEvent(props, meta) {
	meta[TARGETBILL_CONST.formId].items.map((item) => {
		// 设置参照面板不显示主组织
		item.isShowUnit = false;
		if (item.attrcode == FIELD.pk_org) {
			item.queryCondition = () => {
				return { TreeRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter' };
			};
		} else if (item.attrcode == FIELD.ctargetid) {
			//销售指标表
			item.queryCondition = () => {
				let pk_org = (props.form.getFormItemsValue(TARGETBILL_CONST.formId, FIELD.pk_org) || {}).value;
				return { pk_org: pk_org };
			};
		} else if (item.attrcode == 'vperiod') {
			//期间
			item.queryCondition = () => {
				let ctargetid = (props.form.getFormItemsValue(TARGETBILL_CONST.formId, 'ctargetid') || {}).value;
				return {
					TARGETID: ctargetid
				};
			};
		} else if (item.attrcode == 'cmardimenid') {
			//物料维度
			item.queryCondition = () => {
				let ctargetid = (props.form.getFormItemsValue(TARGETBILL_CONST.formId, 'ctargetid') || {}).value;
				return {
					TARGETID: ctargetid
				};
			};
		}
	});
} // 表体参照过滤
function bodyReferEvent(props, meta) {
	meta[TARGETBILL_CONST.tableId].items.map((item) => {
		if (item.attrcode == FIELD.ccustomerid) {
			// 客户参照过滤
			item.queryCondition = () => {
				let pk_org = (props.form.getFormItemsValue(TARGETBILL_CONST.formId, FIELD.pk_org) || {}).value;
				return {
					pk_org: pk_org
				};
			};
		}
	});
}
