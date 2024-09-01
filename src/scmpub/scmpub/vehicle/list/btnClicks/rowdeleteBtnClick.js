/*
 * @Author: zhaochyu 
 * @PageInfo: 行删除
 * @Date: 2020-06-18 13:37:56 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-10-20 16:23:46
 */
import { ajax } from 'nc-lightapp-front';
import { AREA, PAGEID, FILED, URL, STATUS } from '../../constance';
import { setBrowseStatusButton } from '../viewController/buttonController';
import { showErrorInfo, showSuccessInfo } from '../../../pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export function rowdeleteBtnClick(props, record, index) {
	let type = this.props.getUrlParam(FILED.type);
	if (type == 0) {
		if (record.values.pk_org.value == record.values.pk_group.value) {
			showErrorInfo(getLangByResId(this, '4001VEHICLE-000008')); /* 国际化处理： 组织节点不能删除集团级节点数据*/
			return;
		}
	}
	let status = this.props.editTable.getStatus(AREA.listTable);
	//	if (status == STATUS.edit && !record.values.cvehicleid.value) {
	if (status == STATUS.edit) {
		this.props.editTable.deleteTableRowsByIndex(AREA.listTable, index);
		return;
	}
	let pageid = type == 0 ? PAGEID.pagecodeorg : PAGEID.pagecodegroup;
	let pk = [];
	pk.push(record.values.cvehicleid.value);
	let data = { id: pk, pagecode: pageid };
	ajax({
		method: 'post',
		data: data,
		url: URL.delete,
		success: (res) => {
			if (res.success) {
				this.props.editTable.deleteTableRowsByIndex(AREA.listTable, index);
				setBrowseStatusButton.call(this);
				if (this.props.editTable.getNumberOfRows(AREA.listTable) == 0) {
					this.props.button.setButtonDisabled([ 'Edit' ], true);
				}
				showSuccessInfo(getLangByResId(this, '4001VEHICLE-000005')); /* 国际化处理： 删除成功!*/
			}
		}
	});
}
