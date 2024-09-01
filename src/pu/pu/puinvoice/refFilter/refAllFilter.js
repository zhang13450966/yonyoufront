/*
 * @Author: jiangfw 
 * @PageInfo: 收票全部页签查询区参照过滤
 * @Date: 2018-07-12 23:29:38 
 * @Last Modified by: zhr
 * @Last Modified time: 2020-03-27 13:20:28
 */
import { AREA, FIELD, MAIN_ORG_FIELD } from '../constance';
import { setPsndocShowLeavePower, setRefShowDisabledData } from '../../../../scmpub/scmpub/pub/tool';
import { transferSkipToSrcBillUtil } from '../../../../scmpub/scmpub/pub/tool/transferSkipToSrcBillUtil';
let SEARCHID = AREA.searchAll;

export default function refAllFilter(props, meta) {
	let filterByOrgItems = [
		FIELD.pk_supplier, //供应商
		FIELD.pk_srcmaterial, //物料
		'pk_marbasclass' //物料基本分类
		// 'billmaker', //制单人
		// 'approver' //审批人
	];
	// 根据组织过滤不带业务单元字段
	let filterByOrgItems_o = [
		FIELD.billmaker, //制单人
		FIELD.approver //审批人
	];

	meta[SEARCHID].items.map((item) => {
		/** begain人员参照显示离职人员和显示停用*/
		setPsndocShowLeavePower(item);
		setRefShowDisabledData(item);
		/** end人员参照显示离职人员和显示停用*/
		if (filterByOrgItems.includes(item.attrcode)) {
			item.isShowUnit = false;
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(SEARCHID, MAIN_ORG_FIELD.searchAllOrg);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data, DataPowerOperationCode: 'SCMDefault', isDataPowerEnable: true };
			};
		} else if (filterByOrgItems_o.includes(item.attrcode)) {
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(SEARCHID, MAIN_ORG_FIELD.searchAllOrg);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data, DataPowerOperationCode: 'SCMDefault', isDataPowerEnable: true };
			};
		} else if (item.attrcode == MAIN_ORG_FIELD.searchAllOrg) {
			//主组织权限过滤
			item.queryCondition = () => {
				return { TreeRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter' };
			};
		} else if (item.attrcode == 'pk_purchaseorg') {
			// item.queryCondition = () => {
			// 	return { TreeRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter' };
			// };
		} else if (item.attrcode == 'pk_stockorg') {
		} else {
			item.isShowUnit = true;
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(SEARCHID, MAIN_ORG_FIELD.searchAllOrg);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data };
			};
		}
	});
	// 多来源拉单超链接
	meta[AREA.headAll] &&
		meta[AREA.headAll].items.map((item, index) => {
			transferSkipToSrcBillUtil.call(
				this,
				this.props,
				item,
				{
					billtypefield: 'cbilltypeid',
					billcodefield: 'vbillcode'
				},
				true
			);
		});
	meta[AREA.viewAll] &&
		meta[AREA.viewAll].items.map((item, index) => {
			transferSkipToSrcBillUtil.call(
				this,
				this.props,
				item,
				{
					billtypefield: 'cbilltypeid',
					billcodefield: 'vbillcode'
				},
				true
			);
		});
}
