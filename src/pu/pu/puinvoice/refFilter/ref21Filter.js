/*
 * @Author: jiangfw 
 * @PageInfo: 收票拉采购订单查询参照过滤
 * @Date: 2018-07-12 23:29:38 
 * @Last Modified by: zhr
 * @Last Modified time: 2020-03-30 12:12:58
 */
import { AREA, MAIN_ORG_FIELD, FIELD, BILLTYPE, COMMON } from '../constance';
import { setPsndocShowLeavePower, setRefShowDisabledData } from '../../../../scmpub/scmpub/pub/tool';
import { transferSkipToSrcBillUtil } from '../../../../scmpub/scmpub/pub/tool/transferSkipToSrcBillUtil';
let SEARCHID = AREA.search21;

export default function ref21Filter(props, meta) {
	let filterByOrgItems = [
		'pk_supplier', //供应商
		'pk_invcsupllier', //开票供应商
		'pk_recvcustomer', //收货客户
		'pk_order_b.pk_srcmaterial', //物料
		'pk_order_b.pk_srcmaterial.pk_marbasclass', //物料基本分类
		'pk_order_b.casscustid', //客户
		'pk_order_b.cprojectid', //项目
		'cemployeeid', //业务员
		'pk_dept_v', //采购部门
		'pk_dept' //采购部门
	];
	// 根据组织过滤不带业务单元字段
	let filterByOrgItems_o = [
		FIELD.billmaker, //制单人
		FIELD.approver, //审批人
		'corigcurrencyid' //币种
		// 'pk_order_b.cproductorid'//生产厂商
	];

	meta[SEARCHID].items.map((item) => {
		/** begain人员参照显示离职人员和显示停用*/
		setPsndocShowLeavePower(item);
		setRefShowDisabledData(item);
		/** end人员参照显示离职人员和显示停用*/
		if (filterByOrgItems.includes(item.attrcode)) {
			item.isShowUnit = false;
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(SEARCHID, MAIN_ORG_FIELD.search21Org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data };
			};
		} else if (filterByOrgItems_o.includes(item.attrcode)) {
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(SEARCHID, MAIN_ORG_FIELD.search21Org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data };
			};
		} else if (item.attrcode == MAIN_ORG_FIELD.search21Org) {
			//主组织权限过滤
			item.queryCondition = () => {
				return { TreeRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter' };
			};
		} else if (item.attrcode == FIELD.ctrantypeid) {
			//交易类型
			item.queryCondition = () => {
				return { istransaction: 'Y', parentbilltype: BILLTYPE.po_order };
			};
		} else if (item.attrcode == FIELD.pk_dept) {
			item.isShowUnit = true;
			// 采购部门
			item.queryCondition = () => {
				// 部门 -- 根据需求查看集团的所有部门
				let data = props.search.getSearchValByField(SEARCHID, MAIN_ORG_FIELD.search21Org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return {
					pk_org: data,
					busifuncode: COMMON.PURCHASEORG
				};
			};
		} else if (item.attrcode == FIELD.pk_bizpsn) {
			item.isShowUnit = true;
			// 采购员(人员) -- 根据需求查看集团的所有人员
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(SEARCHID, MAIN_ORG_FIELD.search21Org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				let pk_dept = props.search.getSearchValByField(SEARCHID, FIELD.pk_dept);
				pk_dept =
					pk_dept != null ? (pk_dept.value.firstvalue.includes(',') ? null : pk_dept.value.firstvalue) : null;
				return {
					pk_org: data,
					pk_dept: pk_dept,
					busifuncode: COMMON.PURCHASEORG
				};
			};
		} else if (item.attrcode == FIELD.pk_org) {
			// 采购组织
		} else if (item.attrcode == FIELD.pk_arrvstoorg) {
			// 收货库存组织
		} else if (item.attrcode == FIELD.pk_payterm) {
			// 付款协议
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(SEARCHID, MAIN_ORG_FIELD.search21Org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data };
			};
		} else {
			item.isShowUnit = true;
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(SEARCHID, MAIN_ORG_FIELD.search21Org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data };
			};
		}
	});
	meta[AREA.head21].items.map((item, key) => {
		transferSkipToSrcBillUtil.call(this, props, item, {
			billtype: '21', //采购订单
			pkfield: 'pk_order'
		});
	});
	meta[AREA.view21].items.map((item, key) => {
		transferSkipToSrcBillUtil.call(this, props, item, {
			billtype: '21',
			pkfield: 'pk_order'
		});
	});
}
