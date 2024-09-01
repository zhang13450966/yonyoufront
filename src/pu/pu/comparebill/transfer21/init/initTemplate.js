/*
 * @Author: qishy 
 * @PageInfo:业务对账单转单初始模板
 * @Date: 2019-05-05 13:12:47 
 * @Last Modified by: qishy
 * @Last Modified time: 2019-07-18 13:13:34
 */
import { PAGECODE, AREA, FIELDS, MAIN_ORG_FIELD, BUTTONID } from '../../constance';
import { setPsndocShowLeavePower, setRefShowDisabledData } from '../../../../../scmpub/scmpub/pub/tool';

export default function(props) {
	props.createUIDom(
		{
			pagecode: PAGECODE.transferPagecode21,
			appcode: PAGECODE.appcode21
		},
		function(data) {
			if (data) {
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
				}
				if (data.template) {
					let meta = data.template;
					modifierMeta.call(this, props, meta);
					props.meta.setMeta(meta);
				}
			}
		}
	);
}

function modifierMeta(props, meta) {
	let filterByOrgItems = [
		'pk_supplier', //供应商
		'pk_invcsupllier', //开票供应商
		// 'pk_recvcustomer', //收货客户
		'pk_order_b.pk_srcmaterial', //物料
		'pk_order_b.pk_srcmaterial.pk_marbasclass', //物料基本分类
		'pk_order_b.casscustid', //客户
		'pk_order_b.cprojectid' //项目
	];
	// 根据组织过滤不带业务单元字段
	let filterByOrgItems_o = [
		FIELDS.billmaker, //制单人
		FIELDS.approver, //审批人
		'corigcurrencyid' //币种
	];

	meta[AREA.searchId].items.map((item) => {
		/** begain人员参照显示离职人员和显示停用*/
		setPsndocShowLeavePower(item);
		setRefShowDisabledData(item);
		/** end人员参照显示离职人员和显示停用*/
		if (filterByOrgItems.includes(item.attrcode)) {
			item.isShowUnit = true;
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(AREA.searchId, MAIN_ORG_FIELD.search21Org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data };
			};
		} else if (filterByOrgItems_o.includes(item.attrcode)) {
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(AREA.searchId, MAIN_ORG_FIELD.search21Org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data };
			};
		} else if (item.attrcode == MAIN_ORG_FIELD.search21Org) {
			//主组织权限过滤
			item.queryCondition = () => {
				return { TreeRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter' };
			};
		} else if (item.attrcode == FIELDS.ctrantypeid) {
			//交易类型
			item.queryCondition = () => {
				return { istransaction: 'Y', parentbilltype: '21' };
			};
		} else if (item.attrcode == FIELDS.pk_dept) {
			item.isShowUnit = true;
			// 采购部门
			item.queryCondition = () => {
				// 部门 -- 根据需求查看集团的所有部门
				let data = props.search.getSearchValByField(AREA.searchId, MAIN_ORG_FIELD.search21Org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return {
					pk_org: data,
					busifuncode: 'pu'
				};
			};
		} else if (item.attrcode == FIELDS.pk_reqdept) {
			item.isShowUnit = true;
			// 需求部门
			item.queryCondition = () => {
				// 部门 -- 根据需求查看集团的所有部门
				let data = props.search.getSearchValByField(AREA.searchId, MAIN_ORG_FIELD.search21Org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return {
					pk_org: data,
					busifuncode: 'pu'
				};
			};
		} else if (item.attrcode == FIELDS.cemployeeid) {
			item.isShowUnit = true;
			// 采购员(人员) -- 根据需求查看集团的所有人员
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(AREA.searchId, MAIN_ORG_FIELD.search21Org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				let pk_dept = props.search.getSearchValByField(AREA.searchId, FIELDS.pk_dept);
				pk_dept =
					pk_dept != null ? (pk_dept.value.firstvalue.includes(',') ? null : pk_dept.value.firstvalue) : null;
				return {
					pk_org: data,
					pk_dept: pk_dept,
					busifuncode: 'pu'
				};
			};
		} else if (item.attrcode == FIELDS.pk_org) {
			// 采购组织
		} else if (item.attrcode == FIELDS.pk_arrvstoorg) {
			// 收货库存组织
		} else if (item.attrcode == FIELDS.pk_payterm || item.attrcode == 'pk_recvcustomer') {
			item.isShowUnit = true;
			// 付款协议
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(AREA.searchId, FIELDS.pk_org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data };
			};
		} else {
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(AREA.searchId, MAIN_ORG_FIELD.search21Org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data };
			};
		}
	});
}
