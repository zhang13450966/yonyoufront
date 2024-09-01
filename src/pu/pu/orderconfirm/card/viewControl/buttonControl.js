/*
 * @Author: xiahui 
 * @PageInfo: 卡片态按钮控制 
 * @Date: 2019-01-10 18:17:35 
 * @Last Modified by: zhr
 * @Last Modified time: 2020-03-23 10:13:18
 */
import { AREA, BUTTON_ID, FIELD, DATASOURCECACHE, UISTATE } from '../../constance';
import { getDefData } from '../../../../../scmpub/scmpub/pub/cache';
function buttonControl(props) {
	// 1、设置页面状态
	setUIState(props);

	onRowsSelected(props);
}

function setUIState(props) {
	props.form.setFormStatus(AREA.CARD_FORM, 'edit');
	props.cardTable.setStatus(AREA.CARD_TABLE, 'edit');
}

/**
 * 设置卡片肩部按钮可见性：确认、反确认
 */
function onRowsSelected(props) {
	let flag = UISTATE.edit;
	let confirm = getDefData(DATASOURCECACHE.dataSourceListCacheKey, FIELD.CONFIRM);
	let isconfirm = confirm == false ? true : false; // 是否确认
	let checkedRows = props.cardTable.getCheckedRows(AREA.CARD_TABLE);
	// 反确认
	props.button.setButtonVisible([ BUTTON_ID.UnConfirm ], flag && !isconfirm);
	//确认
	props.button.setButtonVisible([ BUTTON_ID.Confirm ], flag && isconfirm);
	let rowsflag = checkedRows.length > 0 ? false : true;
	let disableArr = { [BUTTON_ID.Confirm]: rowsflag, [BUTTON_ID.UnConfirm]: rowsflag };
	props.button.setDisabled(disableArr);
	// let buttonId = confirm ? BUTTON_ID.Confirm : BUTTON_ID.UnConfirm;
	// if (checkedRows && checkedRows.length > 0) {
	// 	props.button.setButtonDisabled(buttonId, false);
	// } else {
	// 	props.button.setButtonDisabled(buttonId, true);
	// }
}

/**
 * 无数据时，设置卡片空界面
 * @param {*} props 
 */
function setEmptyValueDisplay(props) {
	props.BillHeadInfo.setBillHeadInfoVisible({
		showBackBtn: true,
		showBillCode: false
	});
	props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
	props.button.setButtonVisible(
		[ BUTTON_ID.Refresh, BUTTON_ID.Confirm, BUTTON_ID.UnConfirm, BUTTON_ID.Print ],
		false
	);

	props.form.EmptyAllFormValue(AREA.CARD_FORM);
	props.cardTable.setTableData(AREA.CARD_TABLE, { rows: [] });
}

/**
 * 表体勾选事件改变按钮可用性
 * @param {*} props
 */
function onSelect(props) {
	let checkedRows = props.cardTable.getCheckedRows(AREA.CARD_TABLE);
	let rowsflag = checkedRows.length > 0 ? false : true;
	let disableArr = { [BUTTON_ID.Confirm]: rowsflag, [BUTTON_ID.UnConfirm]: rowsflag };
	props.button.setDisabled(disableArr);
}

export { buttonControl, onRowsSelected, setEmptyValueDisplay, onSelect };
