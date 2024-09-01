/*
 * @Author: 刘奇 
 * @PageInfo: 编辑按钮实现
 * @Date: 2018-05-16 14:17:28 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-02-13 13:32:51
 */
import { STATUS, BUTTON } from '../constance';
import { buttonControl } from '../viewController/buttonController';
export default function edit_BtnClick(props) {
	this.buttonType = BUTTON.edit;
	this.props.editTable.selectAllRows(this.tableId, false);
	buttonControl.call(this, STATUS.edit);
}
