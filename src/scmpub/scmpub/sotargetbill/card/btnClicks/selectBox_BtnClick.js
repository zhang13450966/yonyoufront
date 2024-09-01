/*
 * @Author: zhangchqf 
 * @PageInfo: 勾选checkbox 控制肩部按钮操作 
 * @Date: 2020-03-19 17:50:20 
 * @Last Modified by: zhangchqf
 * @Last Modified time: 2020-03-19 17:50:45
 */

import { TARGETBILL_CONST, BUTTONS } from '../../const';
export default function selectBox_BtnClick() {
	let rowsdata = this.props.cardTable.getCheckedRows(TARGETBILL_CONST.tableId);
	let rowsflag = true; //根据勾选行数控制肩部可用按钮
	if (rowsdata.length > 0) {
		rowsflag = false;
	}
	let disableArr = {
		[BUTTONS.DELETELINE]: rowsflag
	};
	this.props.button.setDisabled(disableArr);
}
