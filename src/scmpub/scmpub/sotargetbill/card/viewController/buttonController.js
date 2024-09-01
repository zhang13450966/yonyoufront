/*
 * @PageInfo: 页面状态切换，按钮控制
 * @Author: gaoxq
 * @Last Modified by:
 * @Last Modified time:
 * @Date: 2019-04-04 10:10:07
 */

import { TARGETBILL_CONST, CARD_BODY_BUTTONS, CARD_HEAD_BUTTONS, BUTTONS, FIELD } from '../../const';
export default function() {
	let status = this.props.getUrlParam(TARGETBILL_CONST.status)
		? this.props.getUrlParam(TARGETBILL_CONST.status)
		: TARGETBILL_CONST.browse;
	let flag = status === TARGETBILL_CONST.edit ? false : true;
	// 1.设置界面状态
	setUIState.call(this, flag);
	// 2.设置按钮的显示隐藏
	setCardButtonVisiable.call(this, flag);
	// 3.设置主按钮
	setMainButton.call(this);
	// 4.返回按钮的显示隐藏
	setBackButtonVisiable.call(this, flag);
	// 5.设置卡片分页器的显示隐藏
	setCardPaginationVisible.call(this, flag);
	// 6.设置其他按钮的显示隐藏
	setOtherButtonVisible.call(this, status);
	//肩部按钮设置
	lineSelected.call(this);
}

function setUIState(flag) {
	if (!flag) {
		this.props.cardTable.setStatus(TARGETBILL_CONST.tableId, TARGETBILL_CONST.edit);
		this.props.form.setFormStatus(TARGETBILL_CONST.formId, TARGETBILL_CONST.edit);
	} else {
		this.props.cardTable.setStatus(TARGETBILL_CONST.tableId, TARGETBILL_CONST.browse);
		this.props.form.setFormStatus(TARGETBILL_CONST.formId, TARGETBILL_CONST.edit);
	}
}
function setCardButtonVisiable(flag) {
	this.props.form.setFormItemsDisabled(TARGETBILL_CONST.formId, { ctargetid: false });
	//当表头的三个参照都有值的时候，修改按钮才可用
	if (
		this.props.form.getFormItemsValue(TARGETBILL_CONST.formId, FIELD.pk_org).value &&
		this.props.form.getFormItemsValue(TARGETBILL_CONST.formId, FIELD.ctargetid).value &&
		((this.props.form.getFormItemsValue(TARGETBILL_CONST.formId, FIELD.cmardimenid) &&
			this.props.form.getFormItemsValue(TARGETBILL_CONST.formId, FIELD.cmardimenid).value) ||
			(this.props.form.getFormItemsValue(TARGETBILL_CONST.formId, FIELD.vperiod) &&
				this.props.form.getFormItemsValue(TARGETBILL_CONST.formId, FIELD.vperiod).value))
	) {
		this.props.button.setButtonDisabled(BUTTONS.EDIT, false);
		this.props.button.setButtonDisabled(BUTTONS.IMPORTEXCEL, false);
		this.props.button.setButtonDisabled(BUTTONS.EXPORTEXCEL, false);
		this.props.button.setButtonDisabled(BUTTONS.File, false);
	} else {
		this.props.button.setButtonDisabled(BUTTONS.EDIT, true);
		this.props.button.setButtonDisabled(BUTTONS.IMPORTEXCEL, true);
		this.props.button.setButtonDisabled(BUTTONS.EXPORTEXCEL, true);
		this.props.button.setButtonDisabled(BUTTONS.File, true);
	}
	//先设置所有按钮不可见，然后根据状态设置显隐性
	this.props.button.setButtonVisible(CARD_HEAD_BUTTONS.ALL, false);
	this.props.button.setButtonVisible(CARD_BODY_BUTTONS.ALL, false);
	this.props.button.setButtonDisabled(CARD_BODY_BUTTONS.EDIT, true);
	if (!flag) {
		//编辑态
		this.props.button.setButtonVisible(CARD_HEAD_BUTTONS.EDIT, true);
		this.props.button.setButtonVisible(CARD_BODY_BUTTONS.EDIT, true);
		this.props.form.setFormItemsDisabled(TARGETBILL_CONST.formId, { ctargetid: true }); //编辑态，销售指标表不可编辑置灰
	} else {
		this.props.button.setButtonVisible(CARD_HEAD_BUTTONS.BROWSE, true);
		this.props.button.setButtonVisible(CARD_BODY_BUTTONS.BROWSE, true);
	}

	let selrows = this.props.cardTable.getCheckedRows(TARGETBILL_CONST.tableId);
	if (selrows != false) {
		if (selrows != undefined && selrows.length != 0) {
			this.props.button.setButtonDisabled(CARD_BODY_BUTTONS.EDIT, false);
		} else {
			this.props.button.setButtonDisabled(CARD_BODY_BUTTONS.NOSELECT, false);
		}
	}
}

function setOtherButtonVisible(status) {
	//设置肩部按钮是否可用
}
function lineSelected() {
	let rowsdata = this.props.cardTable.getCheckedRows(TARGETBILL_CONST.tableId);
	let rowsflag = true; //根据勾选行数控制肩部可用按钮
	if (rowsdata && rowsdata.length > 0) {
		rowsflag = false;
	}
	let disableArr = {
		[BUTTONS.ADDLINE]: false,
		[BUTTONS.DELETELINE]: rowsflag
	};
	this.props.button.setDisabled(disableArr);
}
function setMainButton() {}
function setBackButtonVisiable() {}
function setCardPaginationVisible() {}
