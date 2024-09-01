/*
 * @Author: jiangfw 
 * @PageInfo: 收票拉期初暂估单查询参照过滤
 * @Date: 2018-07-12 23:29:38 
 * @Last Modified by: zhr
 * @Last Modified time: 2020-03-27 13:19:40
 */
import { AREA, MAIN_ORG_FIELD, FIELD } from '../constance';
import { setPsndocShowLeavePower, setRefShowDisabledData } from '../../../../scmpub/scmpub/pub/tool';
import { transferSkipToSrcBillUtil } from '../../../../scmpub/scmpub/pub/tool/transferSkipToSrcBillUtil';
let SEARCHID = AREA.search4T;

export default function ref4TFilter(props, meta) {
	let filterByOrgItems = [
		'po_initialest_b.casscustid', //客户
		'pk_supplier', //供应商
		'po_initialest_b.pk_srcmaterial', //物料
		'po_initialest_b.pk_srcmaterial.pk_marbasclass' //物料基本分类
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
				let data = props.search.getSearchValByField(SEARCHID, MAIN_ORG_FIELD.search4TOrg);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data, DataPowerOperationCode: 'SCMDefault', isDataPowerEnable: true };
				// return { pk_org: data };
			};
		} else if (filterByOrgItems_o.includes(item.attrcode)) {
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(SEARCHID, MAIN_ORG_FIELD.search4TOrg);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data };
			};
		} else if (item.attrcode == MAIN_ORG_FIELD.search4TOrg) {
			//主组织权限过滤
			item.queryCondition = () => {
				return { TreeRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter' };
			};
		} else if (item.attrcode == 'pk_purchaseorg') {
			// 采购组织
		} else if (item.attrcode == 'pk_stockorg') {
			// 库存组织
		} else {
			item.isShowUnit = true;
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(SEARCHID, MAIN_ORG_FIELD.search4TOrg);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data };
			};
		}
	});
	meta[AREA.head4T].items.map((item, key) => {
		transferSkipToSrcBillUtil.call(this, props, item, {
			billtype: '4T', //期初暂估单
			pkfield: 'pk_initialest'
		});
	});
	meta[AREA.view4T].items.map((item, key) => {
		transferSkipToSrcBillUtil.call(this, props, item, {
			billtype: '4T',
			pkfield: 'pk_initialest'
		});
	});
}
