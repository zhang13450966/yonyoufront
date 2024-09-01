/*
 * @Author: 刘奇 
 * @PageInfo: 新增按钮点击事件
 * @Date: 2018-05-16 20:07:00 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-02-13 13:31:43
 */
import { STATUS, BUTTON } from '../constance';
import { buttonControl } from '../viewController/buttonController';
export default function add_BtnClick(props) {
	setTimeout(() => {
		let status = this.props.editTable.getStatus(this.tableId);
		let data = props.editTable.getAllRows(this.tableId);
		if (!data) {
			return;
		}
		if (status !== undefined && status !== STATUS.edit) {
			if (data.length === 0) {
				this.props.editTable.setTableData(this.tableId, { rows: [] });
			}
			this.props.editTable.selectAllRows(this.tableId, false);
		}
		this.props.editTable.addRow(this.tableId, undefined, true);
		this.buttonType = BUTTON.add;
		buttonControl.call(this, STATUS.edit);
	}, 0);
}
