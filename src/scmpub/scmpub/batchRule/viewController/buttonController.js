/*
 * @Author: yechd5
 * @PageInfo: 按钮的状态控制
 * @Date: 2018-12-25 10:38:05
 * @Last Modified by: yechd5
 * @Last Modified time: 2018-12-25 14:17:34
 */
import { BATCHCODERULE_CONST } from '../const';

export default function (props, status) {
	let isBrowse = status === BATCHCODERULE_CONST.BROWSE;
	setTableButtonVisiable.call(this, props, isBrowse);
}

/**
 * 控制按钮可见性
 * @param {*} props 
 * @param {*} status 
 */
function setTableButtonVisiable(props, isBrowse) {
	if (isBrowse) {
		props.button.setButtonVisible([ 'Refresh' ], true);
		props.button.setButtonVisible([ 'Save', 'Cancel' ], false);
	} else {
		props.button.setButtonVisible([ 'Refresh' ], false);
		props.button.setButtonVisible([ 'Save', 'Cancel' ], true);
	}
}
