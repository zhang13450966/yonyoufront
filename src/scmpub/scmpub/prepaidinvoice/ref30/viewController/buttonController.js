/*
 * @Author: 刘奇 
 * @PageInfo:界面状态-按钮控制
 * @Date: 2018-12-25 15:40:52 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-03-21 14:41:49
 */
import { REF30_CONST } from '../const';
import { getDefData } from '../../../pub/cache';
function buttonControl() {
	// 1、设置页面状态
	setUIState.call(this);
	// 2、按钮状态控制
	setButtonState.call(this);
	// 3、主按钮设置
	setMainButton.call(this);
	// 4、返回按钮控件状态控制
	setHeadInfoState.call(this);
	// 5、卡片分页器状态控制
	setCardPaginationState.call(this);
}

function setUIState() {}

function setButtonState() {
	let queryInfo = getDefData(REF30_CONST.dataSource, REF30_CONST.searchId);
	if (queryInfo == null) {
		this.props.button.setButtonDisabled([ REF30_CONST.refresh ], true);
	} else {
		this.props.button.setButtonDisabled([ REF30_CONST.refresh ], false);
	}
}
function setMainButton() {}

function setHeadInfoState() {}

function setCardPaginationState() {}

export { buttonControl };
