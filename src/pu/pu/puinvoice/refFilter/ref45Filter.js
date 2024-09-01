/*
 * @Author: jiangfw 
 * @PageInfo: 收票拉采购入库单查询参照过滤
 * @Date: 2018-07-12 23:29:38 
 * @Last Modified by: zhr
 * @Last Modified time: 2020-03-27 13:19:58
 */
import { AREA, MAIN_ORG_FIELD, FIELD, BILLTYPE } from '../constance';
import { setPsndocShowLeavePower, setRefShowDisabledData } from '../../../../scmpub/scmpub/pub/tool';
import { transferSkipToSrcBillUtil } from '../../../../scmpub/scmpub/pub/tool/transferSkipToSrcBillUtil';
let SEARCHID = AREA.search45;

export default function ref45Filter(props, meta) {
	let filterByOrgItems = [
		'ccustomerid', //收货客户
		'cgeneralbid.cvendorid', //供应商
		'cgeneralbid.cmaterialoid', //物料
		'cgeneralbid.cmaterialoid.pk_marbasclass' //物料基本分类
		//自有辅助属性1-10
		// 'cgeneralbid.vfree1',
		// 'cgeneralbid.vfree2',
		// 'cgeneralbid.vfree3',
		// 'cgeneralbid.vfree4',
		// 'cgeneralbid.vfree5',
		// 'cgeneralbid.vfree6',
		// 'cgeneralbid.vfree7',
		// 'cgeneralbid.vfree8',
		// 'cgeneralbid.vfree9',
		// 'cgeneralbid.vfree10'
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
				let data = props.search.getSearchValByField(SEARCHID, MAIN_ORG_FIELD.search45Org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data, DataPowerOperationCode: 'SCMDefault' };
			};
		} else if (filterByOrgItems_o.includes(item.attrcode)) {
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(SEARCHID, MAIN_ORG_FIELD.search45Org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data };
			};
		} else if (item.attrcode == MAIN_ORG_FIELD.search45Org) {
			//主组织权限过滤
			item.queryCondition = () => {
				return { TreeRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter' };
			};
		} else if (item.attrcode == 'cpurorgoid') {
			// 采购组织
		} else if (item.attrcode == FIELD.pk_org) {
			// 库存组织
		} else if (item.attrcode == FIELD.ctrantypeid) {
			//交易类型
			item.queryCondition = () => {
				return { istransaction: 'Y', parentbilltype: BILLTYPE.purchaseIn };
			};
		} else {
			item.isShowUnit = true;
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(SEARCHID, MAIN_ORG_FIELD.search45Org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data };
			};
		}
	});
	meta[AREA.head45].items.map((item, key) => {
		transferSkipToSrcBillUtil.call(this, props, item, {
			billtype: '45', //采购入库
			pkfield: 'cgeneralhid'
		});
	});
	meta[AREA.view45].items.map((item, key) => {
		transferSkipToSrcBillUtil.call(this, props, item, {
			billtype: '45',
			pkfield: 'cgeneralhid'
		});
	});
}
