/*
 * @Author: yechd5
 * @PageInfo: 按钮的状态控制
 * @Date: 2018-12-25 10:38:05
 * @Last Modified by: yechd5
 * @Last Modified time: 2018-12-25 14:17:34
 */
import { BUYPOSITION_CONST } from '../const';

export default function (props, pk_org, status) {
	let isBrowse = status === BUYPOSITION_CONST.BROWSE;
	// 1.设置界面状态
	setUIState.call(this, props, status);
	// 2.设置按钮的显示隐藏
	setTableButtonVisiable.call(this, props, isBrowse);
	// 3.设置按钮可用性
	setTableButtonEnable.call(this, props, pk_org);
}

/**
 * 控制按钮可见性
 * @param {*} props 
 * @param {*} status 
 */
function setTableButtonVisiable(props, isBrowse) {
	if (isBrowse) {
		props.button.setButtonVisible([ 'Save', 'Cancel' ], false);
		props.button.setButtonVisible([ 'Add', 'Edit', 'Delete', 'Print', 'Refresh'], true);
	} else {
		props.button.setButtonVisible([ 'Add', 'Delete', 'Save', 'Cancel' ], true);
		props.button.setButtonVisible([ 'Edit', 'Refresh', 'Print' ], false);
	}
	// 浏览态主组织可编辑，编辑态不可编辑
	this.setState({
		disabled: !isBrowse
	});
}

/**
 * 控制按钮可用性
 * @param {*} props 
 * @param {*} status 
 */
function setTableButtonEnable(props, pk_org) {
	// 1.根据主组织是否有值判断
	if (pk_org) {
		props.button.setDisabled({
			Add: false,
			Refresh: false
		});
	} else {
		props.button.setDisabled({
			Add: true,
			Edit: true,
			Delete: true,
			Print: true,
			Refresh: true
		});
	}

	// 2.界面上有数据，修改和删除按钮才可用
	let len = 0;
	if (props.editTable.getAllRows(BUYPOSITION_CONST.TABLEID, true)) {
		len = props.editTable.getAllRows(BUYPOSITION_CONST.TABLEID, true).length;
	}

	let flag = len > 0 ? true : false;
	props.button.setDisabled({
		Edit: !flag
	});

	// 3.对于“删除”和“打印”按钮：界面有数据且选中后才可见
	let selectedData = props.editTable.getCheckedRows(BUYPOSITION_CONST.TABLEID);
	if (selectedData.length == 0) {
		props.button.setDisabled({
			Delete: true,
			Print: true
		});
	} else if(selectedData.length > 0){
		props.button.setDisabled({
			Delete: false,
			Print: false
		});
	}
}

/**
 * 设置界面状态
 * @param {*} props
 * @param {*} status 
 */
function setUIState(props,status) {
	props.editTable.setStatus(BUYPOSITION_CONST.TABLEID, status);
}