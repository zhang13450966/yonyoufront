/*
 * @Author: zhaochyu 
 * @PageInfo: 司机定义修改
 * @Date: 2020-02-10 12:44:52 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-12-22 18:52:28
 */
import { AREA, FILED } from '../../constance';
import { setEditStatusButton, setDeleteStatus } from '../viewController/buttonController';
export function EditBtnClick(flag) {
	setEditStatusButton.call(this);
	let type = this.props.getUrlParam(FILED.type);
	this.props.editTable.setStatus(AREA.listTable, 'edit', () => {
		if (type == 0) {
			let rowdatas = this.props.editTable.getAllData(AREA.listTable);
			if (rowdatas && rowdatas.rows) {
				rowdatas.rows.map((row, index) => {
					if (row.values.pk_org.value === row.values.pk_group.value) {
						this.props.editTable.setEditableRowByIndex(AREA.listTable, index, false);
					}
				});
			}
		}
		setDeleteStatus.call(this);
	});
}
