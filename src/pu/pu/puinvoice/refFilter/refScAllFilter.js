/*
 * @Author: jiangfw 
 * @PageInfo: 收票拉期初暂估单查询参照过滤
 * @Date: 2018-07-12 23:29:38 
 * @Last Modified by: zhr
 * @Last Modified time: 2020-03-27 13:20:37
 */
import { AREA, MAIN_ORG_FIELD, FIELD } from '../constance';
import { setPsndocShowLeavePower, setRefShowDisabledData } from '../../../../scmpub/scmpub/pub/tool';
import { transferSkipToSrcBillUtil } from '../../../../scmpub/scmpub/pub/tool/transferSkipToSrcBillUtil';
let SEARCHID = AREA.searchAll;

export default function ref4TFilter(props, meta) {
	// 根据组织过滤带业务单元字段
	let filterByOrgItems = [
		'pk_material', //物料
		'pk_supplier', //供应商
		'pk_marbasclass' //物料基本分类
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
				let data = props.search.getSearchValByField(SEARCHID, MAIN_ORG_FIELD.searchScAllOrg);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data, DataPowerOperationCode: 'SCMDefault', isDataPowerEnable: true };
			};
		} else if (filterByOrgItems_o.includes(item.attrcode)) {
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(SEARCHID, MAIN_ORG_FIELD.searchScAllOrg);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data, DataPowerOperationCode: 'SCMDefault', isDataPowerEnable: true };
			};
		} else if (item.attrcode == MAIN_ORG_FIELD.searchScAllOrg) {
			//主组织权限过滤
			item.queryCondition = () => {
				return { TreeRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter' };
			};
		} else if (item.attrcode == FIELD.ctrantypeid) {
			// 交易类型
			item.queryCondition = () => {
				let parentbilltype = '47,61';
				return {
					parentbilltype,
					ExRefSqlBuilder: 'nccloud.web.pu.pub.ref.TransTypeRefSqlBuilder'
				}; // 根据交易类型过滤
			};
		} else {
			item.isShowUnit = true;
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(SEARCHID, MAIN_ORG_FIELD.searchScAllOrg);
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
	meta[AREA.viewScAll] &&
		meta[AREA.viewScAll].items.map((item, index) => {
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
