/*
 * @Author: xiahui 
 * @PageInfo: 卡片态按钮控制 
 * @Date: 2019-01-10 18:17:35 
 * @Last Modified by: zhangmi
 * @Last Modified time: 2021-08-05 13:37:28
 */
import { BUTTONID, AREA, DATASOURCECACHE, FIELDS, UISTATE } from '../../constance';
import { getDefData } from '../../../../../scmpub/scmpub/pub/cache';
function buttonControl(props) {
	// 1、设置页面状态
	setUIState(props);

	onRowsSelected(props);

	onSelected(props);
}

function setUIState(props) {
	props.form.setFormStatus(AREA.cardFormId, 'edit');
	props.cardTable.setStatus(AREA.cardTableId, 'edit');
}

/**
 * 设置卡片肩部按钮可见性：发货、反发货
 */
function onSelected(props) {
	let flag = UISTATE.edit;
	let bissendout = getDefData(DATASOURCECACHE.dataSourceListCacheKey, FIELDS.bissendout);
	let isbissendout = bissendout == false ? true : false; // 是否发货
	let checkedRows = props.cardTable.getCheckedRows(AREA.cardTableId);
	// 反发货
	props.button.setButtonVisible([ BUTTONID.UnSendout ], flag && !isbissendout);
	//发货
	props.button.setButtonVisible([ BUTTONID.SendOut ], flag && isbissendout);
	let rowsflag = checkedRows.length > 0 ? false : true;
	let disableArr = { [BUTTONID.SendOut]: rowsflag, [BUTTONID.UnSendout]: rowsflag };
	props.button.setDisabled(disableArr);
}
/**
 * 设置卡片肩部按钮可用性：删行、复制行
 */
function onRowsSelected(props) {
	let buttonId = (props.getUrlParam('sendout') == 'false' ? false : true) ? BUTTONID.UnSendout : BUTTONID.SendOut;
	let checkedRows = props.cardTable.getCheckedRows(AREA.cardTableId);
	if (checkedRows && checkedRows.length > 0) {
		props.button.setButtonDisabled(buttonId, false);
	} else {
		props.button.setButtonDisabled(buttonId, true);
	}
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
	props.button.setButtonVisible([ BUTTONID.Print, BUTTONID.Refresh, BUTTONID.SendOut, BUTTONID.UnSendout ], false);

	props.form.EmptyAllFormValue(AREA.cardFormId);
	props.cardTable.setTableData(AREA.cardTableId, { rows: [] });
}

export { buttonControl, onRowsSelected, setEmptyValueDisplay, onSelected };
