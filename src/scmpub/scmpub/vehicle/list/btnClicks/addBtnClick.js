/*
 * @Author: zhaochyu 
 * @PageInfo:车辆定义新增
 * @Date: 2020-02-10 12:36:38 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-09-22 15:40:52
 */
import { AREA, FILED } from '../../constance';
import { setEditStatusButton, setDeleteStatus } from '../viewController/buttonController';
import { showErrorInfo } from '../../../pub/tool/messageUtil';
import { getBusinessInfo } from 'nc-lightapp-front';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export function addBtnClick() {
	let type = this.props.getUrlParam(FILED.type);
	let pk_org = this.state.pk_org;
	if (type == 0 && pk_org == '') {
		showErrorInfo(getLangByResId(this, '4001VEHICLE--000001')); /* 国际化处理： 请先选择组织*/
		return;
	}
	let rowid = null;
	let rowindex = this.props.editTable.getNumberOfRows(AREA.listTable);
	let rowdatas = this.props.editTable.getAllData(AREA.listTable);
	this.props.editTable.addRow(AREA.listTable);
	//为所属组织赋默认值
	if (type == 0) {
		this.props.editTable.setValByKeyAndIndex(AREA.listTable, rowindex, 'org_id', {
			value: this.state.refname,
			scale: '-1'
		});
		this.props.editTable.setValByKeyAndIndex(AREA.listTable, rowindex, 'pk_org', {
			value: this.state.pk_org,
			display: this.state.refname
		});
	} else {
		let businessInfo = getBusinessInfo();
		this.props.editTable.setValByKeyAndIndex(AREA.listTable, rowindex, 'org_id', {
			value: businessInfo.groupName,
			scale: '-1'
		});
		this.props.editTable.setValByKeyAndIndex(AREA.listTable, rowindex, 'pk_org', {
			value: businessInfo.groupId,
			display: businessInfo.groupName
		});
	}

	setEditStatusButton.call(this);
	this.props.editTable.setStatus(AREA.listTable, 'edit', () => {
		setDeleteStatus.call(this);
		if (type == 0) {
			rowdatas &&
				rowdatas.rows &&
				rowdatas.rows.map((row) => {
					if (row.values.cvehicleid.value && pk_org != row.values.pk_org.value) {
						rowid = row.rowid;
						this.props.editTable.setEditableRowByRowId(AREA.listTable, rowid, false);
					}
				});
		}
	});
}
