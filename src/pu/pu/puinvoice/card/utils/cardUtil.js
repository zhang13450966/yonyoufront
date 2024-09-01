/*
 * @Author: jiangfw
 * @PageInfo: 采购发票卡片字段编辑性控制
 * @Date: 2018-04-19 10:34:51 
 * @Last Modified by: jiangfw
 * @Last Modified time: 2019-01-04 14:05:22
 */
import { UISTATE, AREA } from '../../constance';

// function setHeadEnable(props) {
// 	let blrgcashflag = (this.state.m30trantypevo.valueMap || {}).blrgcashflag;
// 	// 如果该订单类型勾选了赠品兑付，那么“赠品兑付类型”字段可维护
// 	if (blrgcashflag) {
// 		this.props.form.setFormItemsDisabled(SALEORDER_CONST.formId, { carsubtypeid: false });
// 	} else {
// 		this.props.form.setFormItemsDisabled(SALEORDER_CONST.formId, { carsubtypeid: true });
// 	}

// 	let bfreecustflag = getHeadValue(this.props, 'bfreecustflag');
// 	// 如果是散户，散户档案字段可编辑
// 	if (bfreecustflag && bfreecustflag.value) {
// 		this.props.form.setFormItemsDisabled(SALEORDER_CONST.formId, { cfreecustid: false });
// 	} else {
// 		this.props.form.setFormItemsDisabled(SALEORDER_CONST.formId, { cfreecustid: true });
// 	}
// }

function getHeadValue(props, field) {
	return props.form.getFormItemsValue(AREA.card_head, field);
}

function setOrgEdit(props) {
	let status = props.getUrlParam('status');
	let pk_invoice = props.getUrlParam('id');
	let isBrowse = status === UISTATE.browse;
	// 浏览态不需要考虑
	if (isBrowse) {
		return;
	}

	// 根据主组织判断其他字段是否可编辑
	// if (type != undefined && (type.indexOf('ref') != -1 || type == SALEORDER_CONST.copy)) {
	let type = props.getUrlParam('type');
	if (!type) {
		// 新增
		props.form.setFormItemsDisabled(AREA.card_head, { pk_org_v: true });
	} else if (pk_invoice == undefined || pk_invoice == '' || pk_invoice == 'undefined') {
		props.form.setFormItemsDisabled(AREA.card_head, { pk_org_v: false });
		props.initMetaByPkorg('pk_org_v');
	} else {
		// 修改时主组织不能编辑
		props.form.setFormItemsDisabled(AREA.card_head, { pk_org_v: true });
	}
}

// function IsEditableCheckRule(props, areaid, key) {
// 	let billstatus = getHeadValue(props, SaleOrderHeadItem.FSTATUSFLAG);
// 	if (BILL_STATUS.I_AUDITING != billstatus) {
// 		return true;
// 	}
// 	let csaleorderid = getHeadValue(props, SaleOrderHeadItem.CSALEORDERID);
// 	if (BILL_STATUS.I_AUDITING != billstatus) {
// 		return true;
// 	}
// 	props.meta.getMeta()[areaid].items.find((item) => item.attrcode == key).queryCondition = () => {};
// }

// export { setHeadEnable, setOrgEdit, getHeadValue };
export { setOrgEdit, getHeadValue };
