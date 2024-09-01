/*
 * @Author: jiangfw 
 * @PageInfo: 收票拉消耗汇总单查询参照过滤
 * @Date: 2018-07-12 23:29:38 
 * @Last Modified by: zhr
 * @Last Modified time: 2020-03-30 12:18:59
 */
import { AREA, MAIN_ORG_FIELD, FIELD, BILLTYPE } from '../constance';
import { setPsndocShowLeavePower, setRefShowDisabledData } from '../../../../scmpub/scmpub/pub/tool';
import { transferSkipToSrcBillUtil } from '../../../../scmpub/scmpub/pub/tool/transferSkipToSrcBillUtil';
let SEARCHID = AREA.ref50_query;

export default function ref50Filter(props, meta) {
	let filterByOrgItems = [
		'cvendorid', //供应商
		'cmaterialoid', //物料
		'cmaterialoid.pk_marbasclass', //物料基本分类
		//'cwarehouseid', //结算仓库
		// 'billmaker', //制单人
		// 'approver', //审批人

		//自由辅助属性1-10
		'vfree1',
		'vfree2',
		'vfree3',
		'vfree4',
		'vfree5',
		'vfree6',
		'vfree7',
		'vfree8',
		'vfree9',
		'vfree10'
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
				let data = props.search.getSearchValByField(SEARCHID, MAIN_ORG_FIELD.search50Org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data, DataPowerOperationCode: 'SCMDefault', isDataPowerEnable: true };
			};
		} else if (filterByOrgItems_o.includes(item.attrcode)) {
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(SEARCHID, MAIN_ORG_FIELD.search50Org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data, DataPowerOperationCode: 'SCMDefault', isDataPowerEnable: true };
			};
		} else if (item.attrcode == MAIN_ORG_FIELD.search50Org) {
			//主组织权限过滤
			item.queryCondition = () => {
				return { TreeRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter' };
			};
		} else if (item.attrcode == FIELD.ctrantypeid) {
			//交易类型
			item.queryCondition = () => {
				return { istransaction: 'Y', parentbilltype: BILLTYPE.vmiSum };
			};
		} else if (item.attrcode == 'ccalbodyid') {
			// 结算库存组织
		} else if (item.attrcode == 'cwarehouseid') {
			// 结算仓库
			item.isShowUnit = true;
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(SEARCHID, 'ccalbodyid');
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data };
			};
		} else {
			item.isShowUnit = true;
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(SEARCHID, MAIN_ORG_FIELD.search50Org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data };
			};
		}
	});
	meta[AREA.ref50_head].items.map((item, key) => {
		transferSkipToSrcBillUtil.call(this, props, item, {
			billtype: '50', //消耗汇总收票
			pkfield: 'cvmihid'
		});
	});
}
