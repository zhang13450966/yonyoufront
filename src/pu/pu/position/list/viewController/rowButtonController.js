/*
 * @Author: wangceb
 * @PageInfo: 行选中的按钮可用性控制
 * @Date: 2019-03-14 15:58:23
 * @Last Modified by: wangceb
 * @Last Modified time: 2019-03-14 16:12:26
 */

import { POSITION_CONST } from '../../const';

export function headButtonController(props) {
	// 3.对于“删除”和“打印”按钮：界面有数据且选中后才可见
	let selectedData = props.cardTable.getCheckedRows(POSITION_CONST.UPTABLEID);
	if (selectedData.length > 0) {
		props.button.setDisabled({
			Delete: false
		});
	} else {
		props.button.setDisabled({
			Delete: true
		});
	}
}

export function bodyButtonController(props) {
	// 3.对于“删除”和“打印”按钮：界面有数据且选中后才可见
	let selectedData = props.cardTable.getCheckedRows(POSITION_CONST.DOWNTABLEID);
	if (selectedData.length > 0) {
		props.button.setDisabled({
			DeleteLine: false
		});
	} else {
		props.button.setDisabled({
			DeleteLine: true
		});
	}
}
