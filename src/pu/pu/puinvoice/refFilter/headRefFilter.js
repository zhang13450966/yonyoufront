/*
 * @Author: jiangfw 
 * @PageInfo: 表头区参照过滤
 * @Date: 2018-07-12 23:29:38 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-07-09 14:02:29
 */
import { FIELD, AREA, BILLTYPE, COMMON } from '../constance';
import isSelfAdd from '../card/utils/isSelfAdd';
import { rateTypeSellFilter } from '../../../../scmpub/scmpub/pub/tool/currencyRateUtil';
export default function addHeadRefFilter(props, meta) {
	let headArea = AREA.card_head;
	meta[headArea].items.map((item) => {
		let filterByOrgItems = [
			FIELD.pk_supplier, //供应商
			// FIELD.pk_bizpsn, //采购员
			// FIELD.pk_dept, //采购部门
			// FIELD.pk_dept_v, //采购部门
			FIELD.pk_paytosupplier, //付款单位
			FIELD.pk_payterm //付款协议
		];
		let vatItems = [
			FIELD.csendcountryid, //发货国/地区
			FIELD.crececountryid, //收货国家 / 地区
			FIELD.ctaxcountryid //报税国/地区
		];
		if (filterByOrgItems.includes(item.attrcode)) {
			item.isShowUnit = false;
			//依据采购组织过滤的字段
			item.queryCondition = () => {
				let pk_org = props.form.getFormItemsValue(headArea, FIELD.pk_org).value;
				return { pk_org: pk_org };
			};
		} else if (item.attrcode == FIELD.pk_bankaccbas) {
			// 银行账户 根据开票供应商和币种参照过滤
			item.queryCondition = () => {
				let pk_bankaccbas = props.form.getFormItemsValue(headArea, FIELD.pk_bankaccbas).value;
				let pk_supplier = props.form.getFormItemsValue(headArea, FIELD.pk_supplier).value;
				let corigcurrencyid = props.form.getFormItemsValue(headArea, FIELD.corigcurrencyid).value;
				if (pk_bankaccbas != null || pk_supplier != null) {
					return {
						accclass: '3',
						pk_cust: pk_supplier,
						pk_supplier: pk_supplier,
						pk_currtype: corigcurrencyid
						//GridRefActionExt: 'nccloud.web.pu.puinvoice.ref.AccountBankRefFilter'
					};
				}
			};
		} else if (item.attrcode == FIELD.pk_org_v) {
			item.queryCondition = () => {
				//主组织权限过滤
				return { TreeRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgVidRefFilter' };
			};
		} else if (item.attrcode == FIELD.pk_dept || item.attrcode == FIELD.pk_dept_v) {
			item.isShowUnit = false;
			// 采购部门
			item.queryCondition = () => {
				let pk_org = props.form.getFormItemsValue(headArea, FIELD.pk_purchaseorg).value;
				return {
					pk_org: pk_org,
					busifuncode: COMMON.PURCHASEORG
				};
			};
		} else if (item.attrcode == FIELD.pk_bizpsn) {
			item.isShowUnit = false;
			// 采购员(人员) -- 根据需求查看集团的所有人员
			item.queryCondition = () => {
				let pk_org = props.form.getFormItemsValue(headArea, FIELD.pk_purchaseorg).value;
				let pk_dept = props.form.getFormItemsValue(headArea, FIELD.pk_dept).value;
				// let pk_dept = props.search.getSearchValByField(SEARCHID, FIELD.pk_dept);
				// pk_dept =
				// 	pk_dept != null ? (pk_dept.value.firstvalue.includes(',') ? null : pk_dept.value.firstvalue) : null;
				return {
					pk_org: pk_org,
					pk_dept: pk_dept,
					busifuncode: COMMON.PURCHASEORG
				};
			};
		} else if (vatItems.includes(item.attrcode)) {
			// //收、发、报税国编辑性设置
			// // let flag = isSelfMade(props, areaIds); //判断是否自制
			// let flag = isSelfMade(props, areaIds); //判断是否自制
			// if (flag) {
			// 	props.form.setFormItemsDisabled(headArea, { [item.attrcode]: true });
			// } else {
			// 	props.form.setFormItemsDisabled(headArea, { [item.attrcode]: false });
			// }
		} else if (item.attrcode == FIELD.ctrantypeid) {
			// 交易类型
			// item.queryCondition = () => {
			// 	// let parentbilltype = BILLTYPE.invoice;
			// 	// return { parentbilltype: parentbilltype };
			// 	if (props.form.getFormItemsValue(headArea, FIELD.pk_org)) {
			// 		let pk_org = props.form.getFormItemsValue(headArea, FIELD.pk_org).value;
			// 		return {
			// 			parentbilltype: BILLTYPE.invoice,
			// 			SCM_CONSIDERBUSITYPE: 'Y',
			// 			SCM_BUSIORG: pk_org,
			// 			ExtRefSqlBuilder: 'nccloud.web.scmpub.ref.TransTypeRefFilterUtils'
			// 		};
			// 	}
			// };
			//************************* */
			// let filter = () => {
			// 	let rows = props.editTable.getAllRows(AREA.card_body, true);
			// 	let pk_org = props.form.getFormItemsValue(headArea, FIELD.pk_org).value;
			// 	let isSelf = isSelfAdd(rows);
			// 	if (isSelf) {
			// 		// 自制
			// 		return {
			// 			parentbilltype: BILLTYPE.invoice,
			// 			SCM_CONSIDERBUSITYPE: 'Y',
			// 			SCM_BUSIORG: pk_org,
			// 			ExtRefSqlBuilder: 'nccloud.web.scmpub.ref.TransTypeRefFilterUtils'
			// 		};
			// 	} else {
			// 		let pk_busitype = props.form.getFormItemsValue(headArea, FIELD.pk_busitype).value;
			// 		return {
			// 			pk_org: pk_org,
			// 			SCM_CONSIDERBUSITYPE: 'Y',
			// 			parentbilltype: BILLTYPE.invoice,
			// 			SCM_BUSITYPE: pk_busitype,
			// 			ExtRefSqlBuilder: 'nccloud.web.scmpub.ref.TransTypeRefFilterUtils'
			// 		};
			// 	}
			// };
			// item.queryCondition = filter;
		} else if (item.attrcode == FIELD.pk_freecust) {
			//散户
			// freeCustBeforeEdit.call(props, areaIds, item);
			item.queryCondition = () => {
				let pk_supplier = props.form.getFormItemsValue(headArea, FIELD.pk_supplier).value;
				return { customSupplier: pk_supplier };
			};
		} else if (item.attrcode == FIELD.nexchangerate) {
			// 折本汇率
			// 1.原币为空不让编辑
			// 2.原币、本币相同不允许编辑
			if (
				!props.form.getFormItemsValue(headArea, FIELD.corigcurrencyid) ||
				props.form.getFormItemsValue(headArea, FIELD.corigcurrencyid).value ==
					props.form.getFormItemsValue(headArea, FIELD.ccurrencyid).value
			) {
				props.form.setFormItemsDisabled(headArea, { [FIELD.nexchangerate]: false });
			} else {
				props.form.setFormItemsDisabled(headArea, { [FIELD.nexchangerate]: true });
			}
		} else if (item.attrcode == FIELD.ngroupexchgrate) {
			//集团本位币汇率
		} else if (item.attrcode == FIELD.nglobalexchgrate) {
			//全局本位币汇率
		} else if (item.attrcode == FIELD.pk_org || item.attrcode == FIELD.pk_org_v) {
		} else if (item.attrcode == FIELD.pk_stordoc) {
			item.isShowUnit = false;
			//仓库
		} else if (item.attrcode == FIELD.cratetype) {
			//汇率类型
			item.queryCondition = () => {
				return rateTypeSellFilter();
			};
		} else {
			item.isShowUnit = false;
			item.queryCondition = () => {
				let pk_org = props.form.getFormItemsValue(headArea, FIELD.pk_org).value;
				return { pk_org: pk_org };
			};
		}
	});
}
