/*
 * @Author: lichao 
 * @PageInfo:按钮控制   
 * @Date: 2019-03-12 16:06:57 
 * @Last Modified by: liangzhyf
 * @Last Modified time: 2020-07-23 20:08:33
 */
import { STATUS, BUTTONS, BROWSEBUTTONS, EDITBUTTONS, AREACODE } from '../../constance';
import { getCurrentLastId } from '../../../../../scmpub/scmpub/pub/cache';
export default function(props, status) {
	// 1.设置按钮的显示隐藏
	setButtonVisiable.call(this, props, status);
	setButtonDisable.call(this, props, status);
}
/**
 * 设置按钮的显示隐藏
 * @param {*} props 
 * @param {*} status 
 */
function setButtonVisiable(props, status) {
	if (status == STATUS.browse) {
		//浏览态
		props.button.setButtonVisible(EDITBUTTONS, false);
		props.button.setButtonVisible(BROWSEBUTTONS, true);
	} else {
		//编辑态
		props.button.setButtonVisible(BROWSEBUTTONS, false);
		props.button.setButtonVisible(EDITBUTTONS, true);
	}
}
/**
 * 按钮可用性
 * @param {*} props 
 * @param {*} status 
 */
function setButtonDisable(props, status) {
	if (status == STATUS.browse) {
		let checkedRows = props.cardTable.getCheckedRows(AREACODE.listHead);
		if (checkedRows && checkedRows.length > 0) {
			props.button.setButtonDisabled([ BUTTONS.Print, BUTTONS.Delete, BUTTONS.Output ], false);
		} else {
			props.button.setButtonDisabled([ BUTTONS.Print, BUTTONS.Delete, BUTTONS.Output ], true);
		}
	}
}

