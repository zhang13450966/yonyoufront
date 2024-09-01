/*
 * @Author: jiangfw 
 * @PageInfo: 收票拉委托加工入库单查询参照过滤
 * @Date: 2018-07-12 23:29:38 
 * @Last Modified by: zhr
 * @Last Modified time: 2020-03-27 13:17:46
 */
import { AREA, MAIN_ORG_FIELD, FIELD, BILLTYPE } from '../constance';
import { setPsndocShowLeavePower, setRefShowDisabledData } from '../../../../scmpub/scmpub/pub/tool';
import { transferSkipToSrcBillUtil } from '../../../../scmpub/scmpub/pub/tool/transferSkipToSrcBillUtil';
let SEARCHID = AREA.search47;

export default function ref47Filter(props, meta) {
	let filterByOrgItems = [
		'cgeneralbid.cmaterialoid', //物料
		'cgeneralbid.cmaterialoid.pk_marbasclass', //物料基本分类
		'cvendorid' //供应商
	];
	// 根据组织过滤不带业务单元字段
	let filterByOrgItems_o = [
		FIELD.billmaker, //制单人
		FIELD.approver, //审批人
		'cbiztype' //业务流程
	];

	meta[SEARCHID].items.map((item) => {
		/** begain人员参照显示离职人员和显示停用*/
		setPsndocShowLeavePower(item);
		setRefShowDisabledData(item);
		/** end人员参照显示离职人员和显示停用*/
		if (filterByOrgItems.includes(item.attrcode)) {
			item.isShowUnit = false;
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(SEARCHID, MAIN_ORG_FIELD.search47Org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data };
			};
		} else if (filterByOrgItems_o.includes(item.attrcode)) {
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(SEARCHID, MAIN_ORG_FIELD.search47Org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data };
			};
		} else if (item.attrcode == MAIN_ORG_FIELD.search47Org) {
			//主组织权限过滤
			item.queryCondition = () => {
				return { TreeRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter' };
			};
		} else if (item.attrcode == FIELD.ctrantypeid) {
			//交易类型
			item.queryCondition = () => {
				return { istransaction: 'Y', parentbilltype: BILLTYPE.subcontIn };
			};
		} else if (item.attrcode == FIELD.pk_org) {
			// 库存组织
		} else if (item.attrcode == 'cwarehouseid') {
			// 结算仓库
			item.isShowUnit = true;
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(SEARCHID, FIELD.pk_org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data };
			};
		} else {
			item.isShowUnit = true;
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(SEARCHID, MAIN_ORG_FIELD.search47Org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data };
			};
		}
	});
	meta[AREA.head47].items.map((item, key) => {
		transferSkipToSrcBillUtil.call(this, props, item, {
			billtype: '47', //委外加工入库
			pkfield: 'cgeneralhid'
		});
	});
	meta[AREA.view47].items.map((item, key) => {
		transferSkipToSrcBillUtil.call(this, props, item, {
			billtype: '47',
			pkfield: 'cgeneralhid'
		});
	});
}
