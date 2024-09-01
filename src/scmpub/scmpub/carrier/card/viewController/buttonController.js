/*
 * @Author: zhaochyu 
 * @PageInfo: 按钮控制
 * @Date: 2020-02-10 14:13:17 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-12-29 10:48:08
 */
import { AREA, STATUS, FILED, HEADFILED } from '../../constance';
/**
 * 设置编辑态按钮显示
 */
function setEditStatusButton() {
	this.setState({
		status: 'edit'
	});
	this.props.button.setButtonVisible(
		[ 'Add', 'Delete', 'Edit', 'Refresh', 'StartUse', 'StopUse', 'PrintPop', 'Output' ],
		false
	);
	this.props.button.setButtonVisible([ , 'Save', 'Cancel' ], true);
	this.props.BillHeadInfo.setBillHeadInfoVisible({
		showBackBtn: false //控制显示返回按钮: true为显示,false为隐藏 ---非必传
	});
}
/**
 * 设置浏览态按钮显示
 */
function setBrowseStatusButton() {
	this.setState({
		status: 'browse'
	});
	cardButtonDisabled(this.props);
	this.props.button.setButtonVisible([ 'Add', 'Delete', 'Edit', 'Refresh', 'PrintPop', 'Output' ], true);
	this.props.button.setButtonVisible([ 'Save', 'Cancel' ], false);
	this.props.BillHeadInfo.setBillHeadInfoVisible({
		showBackBtn: true //控制显示返回按钮: true为显示,false为隐藏 ---非必传
	});
}
/**
 * 设置界面状态
 * @param {*} props
 */
function setUIState(status) {
	if (status === STATUS.browse) {
		this.props.form.setFormStatus(AREA.card_head, STATUS.browse);
		this.props.cardTable.setStatus(AREA.driver, STATUS.browse);
		this.props.cardPagination.setCardPaginationVisible(FILED.cardPaginationBtn, true); //设置翻页显示
	} else {
		this.props.form.setFormStatus(AREA.card_head, STATUS.edit);
		this.props.cardTable.setStatus(AREA.driver, STATUS.browse);
		this.props.cardPagination.setCardPaginationVisible(FILED.cardPaginationBtn, false); //设置翻页不显示
	}
}

/**
 * 卡片按钮可用性
 */
function cardButtonDisabled(props) {
	let flag = props.form.getFormItemsValue(AREA.card_head, HEADFILED.bsealflag);
	if (flag) {
		if (flag.value == false) {
			props.button.setButtonVisible([ FILED.StartUse ], false);
			props.button.setButtonVisible([ FILED.StopUse ], true);
		} else {
			props.button.setButtonVisible([ FILED.StartUse ], true);
			props.button.setButtonVisible([ FILED.StopUse ], false);
		}
	}
}
/**
 * 只显示新增按钮
 */
function showOnlyAddButton() {
	this.props.button.setButtonVisible(
		[ 'Add', 'Delete', 'Edit', 'Refresh', 'StartUse', 'StopUse', 'PrintPop', 'Output', 'Save', 'Cancel' ],
		false
	);
	this.props.button.setButtonVisible([ 'Add' ], true);
}
export { setEditStatusButton, setBrowseStatusButton, setUIState, cardButtonDisabled, showOnlyAddButton };
