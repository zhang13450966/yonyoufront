/*
 * @Author: yechd5
 * @PageInfo: 按钮的状态控制
 * @Date: 2018-12-25 10:38:05
 * @Last Modified by: yechd5
 * @Last Modified time: 2018-12-25 14:17:34
 */
import { COOPSETUP_CONST } from '../../const';

export default function (props, status) {
	let isBrowse = status === COOPSETUP_CONST.BROWSE;
	// 1.设置界面状态
	setUIState.call(this, props, status);
	// 2.设置按钮可用性
	setTableButtonEnable.call(this, props, isBrowse);
}

/**
 * 设置界面状态
 * @param {*} props
 * @param {*} status 
 */
function setUIState(props, status) {
	let pk = props.getUrlParam('id');
	let formstatus = null;
	let tablestatus = null;
	if (status == COOPSETUP_CONST.BROWSE) {
		formstatus = COOPSETUP_CONST.BROWSE;
		tablestatus = COOPSETUP_CONST.BROWSE;
	} else if (pk == undefined || pk == '' || pk == 'undefined' || status === COOPSETUP_CONST.ADD) {
		formstatus = COOPSETUP_CONST.ADD;
		tablestatus = COOPSETUP_CONST.EDIT;
	} else {
		formstatus = COOPSETUP_CONST.EDIT;
		tablestatus = COOPSETUP_CONST.EDIT;
	}
	props.form.setFormStatus(COOPSETUP_CONST.FORMID, formstatus);
	props.editTable.setStatus(COOPSETUP_CONST.CARD_TABLEID1, tablestatus);
	props.editTable.setStatus(COOPSETUP_CONST.CARD_TABLEID2, tablestatus);
	props.editTable.setStatus(COOPSETUP_CONST.CARD_TABLEID3, tablestatus);
}

/**
 * 控制按钮可用性
 * @param {*} props 
 * @param {*} isBrowse 
 */
function setTableButtonEnable(props, isBrowse) {
	let isShowReturn = true;
	let id = this.props.getUrlParam('id');
	let enableBtnAdd = id == undefined || id == '' ? true : false;
	// 1.浏览态显示：新增，修改，删除，复制
	if (isBrowse) {
		props.button.setButtonVisible([ 'Add', 'Edit', 'Delete', 'Copy'], true);
		props.button.setButtonVisible([ 'Save', 'Cancel' ], false);
		if(enableBtnAdd){
			// 卡片浏览态无数据时，只能新增或返回
			props.button.setButtonVisible([ 'Edit', 'Delete', 'Copy' ], false);
		}
	} else {
		// 编辑态显示：保存，取消
		isShowReturn = false;
		props.button.setButtonVisible([ 'Save', 'Cancel' ], true);
		props.button.setButtonVisible([ 'Add', 'Edit', 'Delete', 'Copy'], false);
	}
	this.setState({ showReturnBtn: isShowReturn });
}
