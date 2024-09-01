/*
 * @Author: zhaochyu 
 * @PageInfo: 行删除
 * @Date: 2020-06-18 13:37:56 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-10-20 16:23:24
 */
import { ajax } from 'nc-lightapp-front';
import { AREA, PAGEID, FILED, URL, STATUS } from '../../constance';
import { setBrowseStatusButton } from '../viewController/buttonController';
import { showErrorDialog, showSuccessInfo } from '../../../pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export function rowdeleteBtnClick(props, record, index) {
	let status = this.props.editTable.getStatus(AREA.listTable);
	let tip = '';
	let type = this.props.getUrlParam(FILED.type);
	if (type == 0) {
		if (record.values.pk_org.value == record.values.pk_group.value) {
			tip +=
				getLangByResId(this, '4001VEHICLETYPE-000001') /* 国际化处理： 编码：*/ +
				record.values.vvhcltypecode.value +
				getLangByResId(this, '4001VEHICLETYPE-000002') /* 国际化处理：  名称 */ +
				record.values.vvhcltypename.value +
				getLangByResId(this, '4001VEHICLETYPE-000003'); /* 国际化处理： ：原因组织节点不能删除集团数据; \r*/
		}
	}
	if (tip) {
		showErrorDialog(getLangByResId(this, '4001VEHICLETYPE-000004'), tip); /* 国际化处理： 以下档案不能删除：*/
		return;
	}
	if (status == STATUS.edit) {
		this.props.editTable.deleteTableRowsByIndex(AREA.listTable, index);
		return;
	}

	let pageid = type == 0 ? PAGEID.pagecodeorg : PAGEID.pagecodegroup;
	let pk = [];
	pk.push(record.values.cvehicletypeid.value);
	let data = { id: pk, pagecode: pageid };
	ajax({
		method: 'post',
		data: data,
		url: URL.delete,
		success: (res) => {
			if (res.success) {
				this.props.editTable.deleteTableRowsByIndex(AREA.listTable, index, true);
				setBrowseStatusButton.call(this);
				if (this.props.editTable.getNumberOfRows(AREA.listTable) == 0) {
					this.props.button.setButtonDisabled([ 'Edit' ], true);
				}
				showSuccessInfo(getLangByResId(this, '4001VEHICLETYPE-000007')); /* 国际化处理： 删除成功!*/
			}
		}
	});
}
