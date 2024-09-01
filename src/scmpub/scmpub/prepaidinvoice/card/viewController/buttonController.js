/*
 * @Author: 刘奇 
 * @PageInfo: 卡片按钮控制
 * @Date: 2019-03-19 14:15:02 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-12-31 11:18:28
 */
/**
 * 代垫运费发票卡片按钮控制
 */
import {
	PREPAIDINVOICE_CONST,
	PrepaidinvoiceHeadItem,
	CARD_BODY_BUTTONS,
	CARD_HEAD_STATUS_ACTIONS,
	BILL_STATUS,
	BUTTON,
	BUTTON_AREA
} from '../../const';
import { head_afterEvent } from '../events';
export default function(props) {
	let status = props.getUrlParam('status');
	if (status == undefined) {
		status = props.form.getFormStatus(PREPAIDINVOICE_CONST.formId);
	}
	//add by huoyzh 云原生前端适配
	let saga_status = (props.form.getFormItemsValue(PREPAIDINVOICE_CONST.formId, PrepaidinvoiceHeadItem.saga_status) ||
		{}).value;
	let frozen = false;
	if (saga_status && saga_status == '1') {
		frozen = true;
	}
	if (status == PREPAIDINVOICE_CONST.browse && frozen) {
		props.button.toggleErrorStatus(BUTTON_AREA.Card_Head, {
			isError: true
		});
	} else {
		props.button.toggleErrorStatus(BUTTON_AREA.Card_Head, {
			isError: false
		});
	}
	// end

	// 1.设置界面状态
	setUIState.call(this, props, status);

	//得到界面状态
	let isBrowse = status === PREPAIDINVOICE_CONST.browse;
	//得到单据状态
	let billstatus = (props.form.getFormItemsValue(PREPAIDINVOICE_CONST.formId, PrepaidinvoiceHeadItem.fstatusflag) ||
		{}).value;

	// 2.设置卡片按钮的显示隐藏
	setCardButtonVisiable.call(this, props, isBrowse, billstatus);

	// 3.设置主按钮
	setMainButton.call(this, props);

	// 4.返回按钮的显示隐藏
	setBackButtonVisiable.call(this, props, isBrowse);

	// 5.设置卡片分页器的显示隐藏
	setCardPaginationVisible.call(this, props, isBrowse, billstatus);
}

/**
 * 设置卡片界面状态
 * @param {*} props
 * @param {*} status
 */
function setUIState(props, status) {
	let pk = props.getUrlParam('id');
	let formstatus = null;
	let tablestatus = null;
	if (status == PREPAIDINVOICE_CONST.browse) {
		formstatus = PREPAIDINVOICE_CONST.browse;
		tablestatus = PREPAIDINVOICE_CONST.browse;
	} else if (pk == undefined || pk == '' || pk == 'null' || pk == 'undefined' || status === BUTTON.add) {
		formstatus = PREPAIDINVOICE_CONST.add;
		tablestatus = PREPAIDINVOICE_CONST.edit;
	} else {
		formstatus = PREPAIDINVOICE_CONST.edit;
		tablestatus = PREPAIDINVOICE_CONST.edit;
	}
	props.form.setFormStatus(PREPAIDINVOICE_CONST.formId, formstatus);
	props.cardTable.setStatus(PREPAIDINVOICE_CONST.tableId, tablestatus);
}

/**
 * 设置卡片按钮显示隐藏
 * 
 * （1）优先根据界面状态判断显示按钮显示
 * （2）再根据单据状态控制按钮显示
 * @param {*} props 
 * @param {*} status 
 */
function setCardButtonVisiable(props, isBrowse, billstatus) {
	// 先设置表头按钮全不显示
	props.button.setButtonVisible(CARD_HEAD_STATUS_ACTIONS.ALL, false);
	// 1.设置表头按钮显示隐藏
	if (isBrowse) {
		if (!this.props.getUrlParam('id') || this.props.getUrlParam('id') == 'null') {
			this.props.form.EmptyAllFormValue(this.headId);
			this.props.form.setFormItemsValue(this.headId, { fstatusflag: { value: null, display: null } });
			this.props.cardTable.setTableData(this.tableId, { rows: [] });
			this.props.button.setButtonVisible([ BUTTON.add, BUTTON.add4804, BUTTON.add30 ], true);
		} else {
			// 再根据状态设置表头按钮显示
			props.button.setButtonVisible(getHeadShowBtnArray(billstatus), true);
		}
	} else {
		// 再根据界面状态设置表头按钮显示
		props.button.setButtonVisible(CARD_HEAD_STATUS_ACTIONS.EDIT, true);
	}
	// 2.设置表体按钮显示隐藏
	props.button.setButtonVisible(CARD_BODY_BUTTONS.ALL, false);
	if (isBrowse) {
		props.button.setButtonVisible(CARD_BODY_BUTTONS.BROWSE, true);
	} else {
		props.button.setButtonVisible(CARD_BODY_BUTTONS.EDIT, true);
	}

	// 3. 控制卡片表体按钮可用性及主组织控制
	setRowButtonVisiable.call(this);

	// 4.其他按钮控制显示隐藏
	setOtherButtonVisiable.call(this, props, isBrowse, billstatus);
}

/**
 * 设置主按钮
 * 
 * @param {*} props
 */
function setMainButton(props) {
	let billstatus = (props.form.getFormItemsValue(PREPAIDINVOICE_CONST.formId, PrepaidinvoiceHeadItem.fstatusflag) ||
		{}).value;
	if (billstatus === BILL_STATUS.I_FREE) {
		props.button.setMainButton({ [BUTTON.commit]: true, [BUTTON.edit]: false });
	} else if (billstatus === BILL_STATUS.I_NOPASS) {
		props.button.setMainButton({ [BUTTON.commit]: false, [BUTTON.edit]: true });
	} else {
		props.button.setMainButton({ [BUTTON.commit]: false, [BUTTON.edit]: false });
	}
}

/**
 * 设置返回按钮的显示隐藏
 * 
 * @param {*} props
 */
function setBackButtonVisiable(props, isBrowse) {
	// 审批中心的返回按钮不可见
	let isShowReturn = true;
	if (isFromApproveCenter.call(this, props)) {
		isShowReturn = false;
	}
	// 只有自制编辑态返回按钮才不可见
	let transfer = this.props.getUrlParam('buttonType');
	let isTransfer = transfer != undefined && transfer.indexOf('ref') != -1;

	if (!isTransfer) {
		if (!isBrowse) {
			isShowReturn = false;
		}
		props.button.setButtonVisible(BUTTON.quitTransfer, false);
	} else {
		props.button.setButtonVisible(BUTTON.quitTransfer, true);
	}
	// 转单界面
	if (isTransfer && isBrowse) {
		props.button.setButtonVisible(CARD_HEAD_STATUS_ACTIONS.REF, false);
	}
	this.props.BillHeadInfo.setBillHeadInfoVisible({
		showBackBtn: isShowReturn // 控制显示返回按钮: true为显示,false为隐藏
	});
}

/**
 * 设置卡片分页器显示隐藏
 * 
 * @param {*} props 
 * @param {*} isBrowse 
 */
function setCardPaginationVisible(props, isBrowse, billstatus) {
	let showPage = isBrowse;
	let pk = props.getUrlParam('id');
	// 卡片下空白界面不需要显示分页
	if (!isBrowse || !pk || isFromApproveCenter.call(this, props)) {
		showPage = false;
	}
	// 设置卡片分页的显示隐藏
	props.cardPagination.setCardPaginationVisible('cardPaginationBtn', showPage);
}

/**
 * 根据单据状态设置表头按钮显示隐藏
 * 
 * @param {*} billstatus
 */
function getHeadShowBtnArray(billstatus) {
	switch (billstatus) {
		case null:
			return CARD_HEAD_STATUS_ACTIONS.ALL;
			break;
		case undefined:
			return CARD_HEAD_STATUS_ACTIONS.ALL;
			break;
		// 自由态按钮
		case BILL_STATUS.I_FREE:
			return CARD_HEAD_STATUS_ACTIONS.I_FREE;
			break;
		// 审批不通过
		case BILL_STATUS.I_NOPASS:
			return CARD_HEAD_STATUS_ACTIONS.I_NOPASS;
			break;
		// 审批中
		case BILL_STATUS.I_AUDITING:
			return CARD_HEAD_STATUS_ACTIONS.I_AUDITING;
			break;
		// 审批通过
		case BILL_STATUS.I_AUDIT:
			return CARD_HEAD_STATUS_ACTIONS.I_AUDIT;
			break;
		// 关闭
		case BILL_STATUS.I_CLOSED:
			return CARD_HEAD_STATUS_ACTIONS.I_CLOSED;
			break;
		default:
			return '';
			break;
	}
}

/**
 * 其他按钮控制显示隐藏
 * 
 * @param {*} props 
 * @param {*} isBrowse 
 */
function setOtherButtonVisiable(props, isBrowse, billstatus) {
	// 支持审批中可修改
	if (isBrowse && isFromApproveCenter.call(this, props)) {
		if (billstatus == BILL_STATUS.I_AUDITING) {
			props.button.setButtonVisible(BUTTON.edit, true);
			props.button.setButtonDisabled([ BUTTON.edit ], false);
		}
	}
}

/**
 * 卡片行按钮控制
 *
 */
function setRowButtonVisiable() {
	//控制主组织是否可选
	let buttonType = this.props.getUrlParam('buttonType');
	this.props.button.setButtonDisabled(CARD_BODY_BUTTONS.EDIT, true);
	let oldpkorg = this.props.form.getFormItemsValue(PREPAIDINVOICE_CONST.formId, PrepaidinvoiceHeadItem.pk_org_v);
	if (buttonType == BUTTON.add && (oldpkorg == null || oldpkorg.value == '' || oldpkorg.value == null)) {
		if (this.org_v.value && this.org_v.display) {
			head_afterEvent.call(
				this,
				this.props,
				this.headId,
				PrepaidinvoiceHeadItem.pk_org_v,
				this.org_v,
				null,
				true
			);
		} else {
			this.props.initMetaByPkorg(PrepaidinvoiceHeadItem.pk_org_v);
		}
		this.props.form.setFormItemsDisabled(this.headId, { [PrepaidinvoiceHeadItem.pk_org_v]: false });
	} else if (
		buttonType == BUTTON.edit ||
		buttonType == BUTTON.copy ||
		(buttonType != null && buttonType.indexOf('ref') != -1)
	) {
		//修改复制不可修改主组织
		this.props.form.setFormItemsDisabled(this.headId, { [PrepaidinvoiceHeadItem.pk_org_v]: true });
	}

	let allrows = this.props.cardTable.getVisibleRows(PREPAIDINVOICE_CONST.tableId);
	if (allrows == undefined || allrows.length == 0) {
		this.props.button.setButtonDisabled(CARD_BODY_BUTTONS.NOROW, false);
		return;
	}
	let selrows = this.props.cardTable.getCheckedRows(PREPAIDINVOICE_CONST.tableId);

	if (selrows != undefined && selrows.length != 0) {
		this.props.button.setButtonDisabled(CARD_BODY_BUTTONS.EDIT, false);
	} else {
		this.props.button.setButtonDisabled(CARD_BODY_BUTTONS.NOSELECT, false);
	}
}

/**
 * 判断是否来源于审批中心
 * 
 * @param {*} props 
 */
function isFromApproveCenter(props) {
	let pageMsgType = this.props.getUrlParam('scene');
	return pageMsgType && pageMsgType == 'approvesce';
}
