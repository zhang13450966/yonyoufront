/*
 * @Author: liujia9 
 * @PageInfo: 卡片态按钮控制 
 * @Date: 2019-01-10 18:17:35 
 * @Last Modified by: zhangmi
 * @Last Modified time: 2021-08-05 14:13:15
 */
import { BUTTONID, AREA } from '../../constance';

function buttonControl(props) {
	// 1、设置页面状态
	setUIState(props);
	// 2、按钮状态控制
	setButtonState.call(this);
	//3.按钮可用性控制
	onRowsSelected.call(this, this.props);
}

function setUIState(props) {
	props.form.setFormStatus(AREA.cardFormId, 'edit');
	props.cardTable.setStatus(AREA.cardTableId, 'edit');
}

function setButtonState() {
	//按照界面状态控制按钮可用性
	let custom = this.props.getUrlParam('custom') == 'false' ? false : true;
	this.props.button.setButtonVisible([ BUTTONID.Custom ], !custom);
	this.props.button.setButtonVisible([ BUTTONID.UnCustom ], custom);
	this.props.button.setButtonVisible({ [BUTTONID.Print]: true, [BUTTONID.Refresh]: true });
}

/**
 * 设置卡片肩部按钮可用性：删行、复制行
 */
function onRowsSelected(props) {
	let checkedRows = props.cardTable.getCheckedRows(AREA.cardTableId);
	if (checkedRows && checkedRows.length > 0) {
		this.props.button.setDisabled({
			[BUTTONID.Custom]: false,
			[BUTTONID.UnCustom]: false
		});
	} else {
		this.props.button.setDisabled({
			[BUTTONID.Custom]: true,
			[BUTTONID.UnCustom]: true
		});
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
	props.button.setButtonVisible([ BUTTONID.Print, BUTTONID.Refresh, BUTTONID.Custom, BUTTONID.UnCustom ], false);

	props.form.EmptyAllFormValue(AREA.cardFormId);
	props.cardTable.setTableData(AREA.cardTableId, { rows: [] });
}

export { buttonControl, onRowsSelected, setEmptyValueDisplay };
