/*
 * @Author: zhaochyu 
 * @PageInfo: 司机定义行删除
 * @Date: 2020-06-18 13:37:56 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-10-20 16:33:20
 */
import { ajax } from 'nc-lightapp-front';
import { AREA, PAGEID, FILED, URL, STATUS } from '../../constance';
import { setBrowseStatusButton } from '../viewController/buttonController';
import { showErrorInfo, showSuccessInfo } from '../../../pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export function rowdeleteBtnClick(props, record, index) {
	let status = this.props.editTable.getStatus(AREA.listTable);
	let type = this.props.getUrlParam(FILED.type);
	if (type == 0) {
		if (record.values.pk_group.value == record.values.pk_org.value) {
			showErrorInfo(getLangByResId(this, '4001DRIVER-000002')); /* 国际化处理： 组织节点不能删除集团级节点数据*/
			return;
		}
	}
	if (status == STATUS.edit && !record.values.cvehicletypeid.value) {
		this.props.editTable.deleteTableRowsByIndex(AREA.listTable, index);
		return;
	}
	let pageid = type == 0 ? PAGEID.pagecodeorg : PAGEID.pagecodegroup;
	let pk = [];
	pk.push(record.values.cdriverid.value);
	let data = { id: pk, pagecode: pageid };
	ajax({
		method: 'post',
		data: data,
		url: URL.delete,
		success: (res) => {
			if (res.success) {
				this.props.editTable.deleteTableRowsByIndex(AREA.listTable, index, true);
				setBrowseStatusButton.call(this);
				showSuccessInfo(getLangByResId(this, '4001DRIVER-000008')); /* 国际化处理： 删除成功!*/
				let count = this.props.editTable.getNumberOfRows(AREA.listTable);
				if (count > 0) {
					this.props.button.setButtonDisabled([ 'Edit' ], false);
				} else {
					this.props.button.setButtonDisabled([ 'Edit' ], true);
				}
			}
		}
	});
}
