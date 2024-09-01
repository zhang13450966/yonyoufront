/*
 * @Author: jiangfw 
 * @PageInfo: 查询区参照过滤
 * @Date: 2018-07-12 23:29:38 
 * @Last Modified by: jiangfw
 * @Last Modified time: 2018-12-13 15:05:52
 */
import { AREA, FIELD, BILLTYPE, COMMON } from '../constance/index';
import { setPsndocShowLeavePower, setRefShowDisabledData } from '../../../../scmpub/scmpub/pub/tool';
let SEARCHID = AREA.queryArea;

export default function addSearchRefFilter(props, meta) {
	// 根据组织过滤带业务单元字段
	let filterByOrgItems = [
		FIELD.pk_supplier, //供应商
		FIELD.pk_paytosupplier, //付款单位
		'invoicebody.casscustid', //客户
		'invoicebody.cprojectid', //项目
		'invoicebody.pk_srcmaterial', //物料
		'invoicebody.pk_srcmaterial.pk_marbasclass', //物料基本分类
		//自由辅助属性 1-10
		'invoicebody.vfree1',
		'invoicebody.vfree2',
		'invoicebody.vfree3',
		'invoicebody.vfree4',
		'invoicebody.vfree5',
		'invoicebody.vfree6',
		'invoicebody.vfree7',
		'invoicebody.vfree8',
		'invoicebody.vfree9',
		'invoicebody.vfree10'
	];
	// 根据组织过滤不带业务单元字段
	let filterByOrgItems_o = [
		FIELD.billmaker, //制单人
		FIELD.approver, //审批人
		FIELD.cproductorid, //生产厂商
		FIELD.csendcountryid, //发货国/地区
		FIELD.crececountryid, //收货国家/地区
		FIELD.ctaxcountryid //报税国/地区
	];

	meta[SEARCHID].items.map((item) => {
		/** begain人员参照显示离职人员和显示停用*/
		setPsndocShowLeavePower(item);
		setRefShowDisabledData(item);
		/** end人员参照显示离职人员和显示停用*/
		if (filterByOrgItems.includes(item.attrcode)) {
			//根据pk_org过滤字段
			item.isShowUnit = true;
			// 根据pk_org过滤
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(SEARCHID, FIELD.pk_org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data };
			};
		} else if (filterByOrgItems_o.includes(item.attrcode)) {
			// 根据pk_org过滤
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(SEARCHID, FIELD.pk_org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data };
			};
		} else if (item.attrcode == 'invoicebody.pk_apfinanceorg' || item.attrcode == 'invoicebody.pk_stordoc.pk_org') {
			//应付财务组织、库存组织
		} else if (item.attrcode == FIELD.pk_org) {
			//主组织权限过滤
			item.queryCondition = () => {
				return { TreeRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter' };
			};
		} else if (item.attrcode == FIELD.ctrantypeid) {
			//交易类型
			item.queryCondition = () => {
				return { istransaction: 'Y', parentbilltype: BILLTYPE.invoice };
			};
		} else if (item.attrcode == FIELD.pk_payterm) {
			//付款协议
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(SEARCHID, FIELD.pk_org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data };
			};
		} else if (item.attrcode == FIELD.pk_dept) {
			item.isShowUnit = true;
			// 采购部门
			item.queryCondition = () => {
				// 部门 -- 根据需求查看集团的所有部门
				// let data = props.search.getSearchValByField(SEARCHID, FIELD.pk_org);
				// data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return {
					// pk_org: data,
					busifuncode: COMMON.PURCHASEORG
				};
			};
		} else if (item.attrcode == FIELD.pk_bizpsn) {
			item.isShowUnit = true;
			// 采购员(人员) -- 根据需求查看集团的所有人员
			item.queryCondition = () => {
				// let data = props.search.getSearchValByField(SEARCHID, FIELD.pk_org);
				// data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				let pk_dept = props.search.getSearchValByField(SEARCHID, FIELD.pk_dept);
				pk_dept =
					pk_dept != null ? (pk_dept.value.firstvalue.includes(',') ? null : pk_dept.value.firstvalue) : null;
				return {
					// pk_org: data,
					pk_dept: pk_dept,
					busifuncode: COMMON.PURCHASEORG
				};
			};
		} else if (item.attrcode == FIELD.pk_usedept) {
			item.isShowUnit = true;
			// 使用部门
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(SEARCHID, FIELD.pk_org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return {
					pk_org: data,
					busifuncode: COMMON.PURCHASEORG
				};
			};
		} else if (item.attrcode == 'invoicebody.pk_stordoc') {
			//仓库
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(SEARCHID, 'invoicebody.pk_stordoc.pk_org');
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return {
					pk_org: data
				};
			};
		} else {
			item.isShowUnit = true;
			// 根据pk_org过滤
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(SEARCHID, FIELD.pk_org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data };
			};
		}
	});
}
