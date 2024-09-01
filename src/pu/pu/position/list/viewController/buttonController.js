/*
 * @Author: yechd5
 * @PageInfo: 按钮的状态控制
 * @Date: 2018-12-25 10:38:05
 * @Last Modified by: raoczh
 * @Last Modified time: 2021-01-13 15:34:42
 */
import {
	POSITION_CONST,
	ALL_BUTTONS,
	BUTTONS,
	HEAD_EDIT_BUTTONS,
	HEAD_BROWSE_BUTTONS,
	BODY_EDIT_BUTTONS,
	BODY_BROWSE_BUTTONS
} from '../../const';
import { setTableStatus } from 'scmpub/scmpub/components/VerticalEditTable';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { headButtonController, bodyButtonController } from './rowButtonController';

export default function(props, status) {
	let editFlag = status === POSITION_CONST.EDIT_STATUS;
	// 1.设置界面状态
	setUIState.call(this, props, status);
	// 2.设置按钮的显示隐藏
	setTableButtonVisiable.call(this, props, editFlag);
	// 3.设置按钮可用性
	setTableButtonEnable.call(this, props);
}

/**
 * 控制按钮可见性
 * @param {*} props
 * @param {*} status
 */
function setTableButtonVisiable(props, editFlag) {
	props.button.setButtonVisible(ALL_BUTTONS, false);
	if (editFlag) {
		props.button.setButtonVisible(HEAD_EDIT_BUTTONS, true);
		props.button.setButtonVisible(BODY_EDIT_BUTTONS, true);
	} else {
		props.button.setButtonVisible(HEAD_BROWSE_BUTTONS, true);
		props.button.setButtonVisible(BODY_BROWSE_BUTTONS, true);
	}

	//控制行删除的气泡提示
	if (editFlag) {
		props.button.setPopContent(BUTTONS.Delete, '');
	} else {
		props.button.setPopContent(BUTTONS.Delete, getLangByResId(this, '4004POSITION-000006')); /* 国际化处理： 确定要删除吗？*/
	}
	this.setState({ mainOrgDisabled: editFlag });
}

/**
 * 控制按钮可用性
 * @param {*} props
 * @param {*} status
 */
function setTableButtonEnable(props) {
	// 1.根据主组织是否有值判断
	if (this.mainorgvalue.refpk) {
		props.button.setDisabled({
			Add: false,
			Delete: false,
			Refresh: false
		});
	} else {
		props.button.setDisabled({
			Add: true,
			Delete: true,
			Refresh: true
		});
	}
	headButtonController.call(this, props);
	bodyButtonController.call(this, props);
}

/**
 * 设置界面状态
 * @param {*} props
 * @param {*} status
 */
function setUIState(props, status) {
	let oldstatus = props.cardTable.getStatus(POSITION_CONST.UPTABLEID);
	if (oldstatus != status) {
		props.cardTable.selectAllRows(POSITION_CONST.DOWNTABLEID, false);
	}

	setTableStatus.call(this, POSITION_CONST.UPTABLEID, POSITION_CONST.DOWNTABLEID, status);
}
