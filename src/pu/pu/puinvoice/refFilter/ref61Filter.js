/*
 * @Author: jiangfw
 * @PageInfo: 收票拉委外订单查询参照过滤
 * @Date: 2018-07-12 23:29:38
 * @Last Modified by: zhangmi
 * @Last Modified time: 2022-06-22 20:30:07
 */
import { AREA, MAIN_ORG_FIELD, FIELD, COMMON, BILLTYPE } from '../constance';
import { setPsndocShowLeavePower, setRefShowDisabledData } from '../../../../scmpub/scmpub/pub/tool';
import { transferSkipToSrcBillUtil } from '../../../../scmpub/scmpub/pub/tool/transferSkipToSrcBillUtil';
import { deepClone } from '../../../../scmpub/scmpub/pub/tool';

export default function ref61Filter(props, meta, initData) {
	let SEARCHID = props.isRefAddLine ? AREA.search61refadd : AREA.search61;
	let filterByOrgItems = [
		'pk_supplier', //供应商
		'pk_invcsupllier', //开票供应商
		'pk_recvcustomer', //收货客户
		'pk_order_b.casscustid', //客户
		'pk_order_b.pk_srcmaterial', //物料
		'pk_order_b.pk_srcmaterial.pk_marbasclass', //物料基本分类
		'pk_order_b.cprojectid', //项目
		'cemployeeid', //业务员
		'pk_dept_v', //采购部门
		'pk_dept', //采购部门

		FIELD.billmaker, //制单人
		FIELD.approver, //审批人,
		'pk_payterm', //付款协议
		'pk_transporttype' //运输方式
	];
	// 根据组织过滤不带业务单元字段
	let filterByOrgItems_o = [
		// FIELD.billmaker, //制单人
		// FIELD.approver, //审批人,
		// 'pk_payterm', //付款协议
		// 'pk_order_b.cprojectid', //项目
		// 'pk_transporttype' //运输方式
	];
	if (this.isRefAddLine) {
		// 参照增行时复制一份查询模板，解决参照增行切换查询方案赋值问题以及避免影响上一个拉单界面的缓存问题
		meta[AREA.search61refadd] = deepClone(meta[AREA.search61]);
	}
	meta[SEARCHID].items.map((item) => {
		/** begain人员参照显示离职人员和显示停用*/
		setPsndocShowLeavePower(item);
		setRefShowDisabledData(item);
		/** end人员参照显示离职人员和显示停用*/
		if (filterByOrgItems.includes(item.attrcode)) {
			item.isShowUnit = false;
			if ('pk_supplier' == item.attrcode && initData && initData.pk_supplier && initData.pk_supplier.value) {
				item.initialvalue = initData.pk_supplier;
			}
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(SEARCHID, MAIN_ORG_FIELD.search61Org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data };
			};
		} else if (filterByOrgItems_o.includes(item.attrcode)) {
			// item.isShowUnit = true;
			// item.queryCondition = () => {
			// 	let data = props.search.getSearchValByField(SEARCHID, MAIN_ORG_FIELD.search61Org);
			// 	data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
			// 	return { pk_org: data };
			// };
		} else if (item.attrcode == MAIN_ORG_FIELD.search61Org) {
			//主组织权限过滤 结算财务组织
			if (initData && initData.cfanaceorgoid && initData.cfanaceorgoid.value) {
				item.initialvalue = initData.cfanaceorgoid;
			}
			item.queryCondition = () => {
				return { TreeRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter' };
			};
		} else if (item.attrcode == 'cemployeeid') {
			item.isShowUnit = true;
			// 业务员
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(SEARCHID, 'pk_org');
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
		} else if (item.attrcode == FIELD.pk_dept) {
			item.isShowUnit = true;
			// 采购部门
			item.queryCondition = () => {
				// 部门 -- 根据需求查看集团的所有部门
				let data = props.search.getSearchValByField(SEARCHID, 'pk_org');
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return {
					pk_org: data,
					busifuncode: COMMON.PURCHASEORG
				};
			};
		} else if (item.attrcode == FIELD.ctrantypeid) {
			//交易类型
			item.queryCondition = () => {
				return { istransaction: 'Y', parentbilltype: BILLTYPE.sc_order };
			};
		} else if (item.attrcode == 'pk_org') {
			// 采购组织
			if (initData && initData.pk_purchaseorg && initData.pk_purchaseorg.value) {
				item.initialvalue = initData.pk_purchaseorg;
			}
		} else if (item.attrcode == 'pk_stockorg') {
			// 库存组织
		} else {
			item.isShowUnit = true;
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(SEARCHID, MAIN_ORG_FIELD.search61Org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data };
			};
		}
	});

	meta[AREA.head61].items.map((item, key) => {
		transferSkipToSrcBillUtil.call(this, props, item, {
			billtype: '61', //委外订单
			pkfield: 'pk_order'
		});
	});
	meta[AREA.view61].items.map((item, key) => {
		transferSkipToSrcBillUtil.call(this, props, item, {
			billtype: '61',
			pkfield: 'pk_order'
		});
	});
}
