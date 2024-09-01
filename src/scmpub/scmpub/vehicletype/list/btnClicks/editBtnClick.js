/*
 * @Author: zhaochyu 
 * @PageInfo: 车型定义修改
 * @Date: 2020-02-10 12:44:52 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-12-31 14:12:33
 */
import { AREA, FILED } from '../../constance';
import { setEditStatusButton, setDeleteStatus } from '../viewController/buttonController';
export function EditBtnClick(flag) {
	let type = this.props.getUrlParam(FILED.type);
	setEditStatusButton.call(this);
	this.props.editTable.setStatus(AREA.listTable, 'edit', () => {
		if (type == 0) {
			this.setState({
				status: 'edit'
			});
			let rowdatas = this.props.editTable.getAllData(AREA.listTable);
			if (rowdatas && rowdatas.rows) {
				rowdatas.rows.map((row, index) => {
					if (!row.values.pk_org_v.value) {
						this.props.editTable.setEditableRowByIndex(AREA.listTable, index, false);
					}
				});
			}
		}
		setDeleteStatus.call(this);
	});
}
